import { Controller } from "react-hook-form";
import SelectField from "../fields/SelectField";
import { useContext, useEffect } from "react";
import { MyContext } from "@/context/MyProvider";

const PricingInformationStep = ({
  register,
  errors,
  watch,
  control,
  trigger,
  setValue,
  getValues,
  cjVariants = [],
}) => {
  const { attributes, attributesError, attributesLoading } =
    useContext(MyContext);
  const hasVariations = watch("hasVariations") === true;
  const selectedAttributes = watch("attributes");

  const activeAttributes = attributes.filter((attr) =>
    selectedAttributes?.includes(attr.value),
  );

  const activeAttributesWithOptions = activeAttributes
    .map((attr) => {
      const val = watch(attr.value) || [];
      const values = val.map((v) => (typeof v === "object" ? v?.value : v));
      return {
        key: attr.value,
        label: attr.name || attr.label,
        values: values,
      };
    })
    .filter((attr) => attr.values.length > 0);

  // Generate Cartesian product of any number of active attributes
  const generateCombinations = () => {
    if (activeAttributesWithOptions.length === 0) return [];

    return activeAttributesWithOptions.reduce(
      (acc, curr) => {
        const res = [];
        acc.forEach((a) => {
          curr.values.forEach((v) => {
            res.push({ ...a, [curr.key]: v });
          });
        });
        return res;
      },
      [{}],
    );
  };

  const combinations = generateCombinations();

  const serializedCombinations = JSON.stringify(combinations);

  useEffect(() => {
    if (!hasVariations) {
      setValue("variations", []);
      return;
    }

    const currentVariations =
      (getValues ? getValues("variations") : watch("variations")) || [];

    const newVariations = combinations.map((combo) => {
      const existing =
        currentVariations.find((v) =>
          activeAttributesWithOptions.every(
            (attr) => v[attr.key] === combo[attr.key],
          ),
        ) || {};

      return {
        ...combo,
        vid: existing.vid || "",
        weight: existing.weight !== undefined ? existing.weight : 0,
        stock: existing.stock !== undefined ? existing.stock : 0,
        price: existing.price !== undefined ? existing.price : 0,
        discount: existing.discount !== undefined ? existing.discount : 0,
        thumbnail: existing.thumbnail || null,
        images: existing.images || [],
      };
    });

    setValue("variations", newVariations);
  }, [serializedCombinations, hasVariations, setValue, getValues]);

  return (
    <div>
      <div className={`${hasVariations ? "flex justify-between gap-5" : ""}`}>
        {hasVariations && (
          <div className="w-1/2">
            <h1 className="text-lg font-bold">
              List all of your variations for the variations types below
            </h1>
            {activeAttributes.map((attr) => (
              <div key={attr.name} className="fieldset">
                <label htmlFor={attr.value} className="label">
                  {attr.name}
                </label>
                <Controller
                  name={attr.value}
                  control={control}
                  render={({ field }) => {
                    const dbOptions = attr.options || [];
                    const val = field.value || [];
                    const formValues = Array.isArray(val) ? val : [val];
                    const formattedFormValues = formValues
                      .map((v) => (typeof v === "object" ? v?.value : v))
                      .filter(Boolean);

                    const extraOptions = formattedFormValues
                      .filter(
                        (val) => !dbOptions.some((opt) => opt.value === val),
                      )
                      .map((val) => {
                        const originalObj = formValues.find(
                          (v) => (typeof v === "object" ? v?.value : v) === val,
                        );
                        return {
                          value: val,
                          label:
                            typeof originalObj === "object" &&
                            originalObj?.label
                              ? originalObj.label
                              : val.charAt(0).toUpperCase() + val.slice(1),
                        };
                      });

                    const combinedOptions = [...dbOptions, ...extraOptions];

                    return (
                      <SelectField
                        field={field}
                        options={combinedOptions}
                        isMulti={true}
                        isClearable
                        placeholder={`Select ${attr.name}`}
                        trigger={trigger}
                        errors={errors[attr.value]}
                      />
                    );
                  }}
                />
              </div>
            ))}
          </div>
        )}
        <div
          className={`fieldset bg-base-100 p-5 rounded-box ${hasVariations && "w-1/2"}`}
        >
          <h2 className="text-xl font-bold">Pricing & Offers</h2>
          <div className="flex gap-5">
            <div className="flex-1/3 fieldset">
              <label htmlFor="baseStock" className="label">
                Stock
              </label>
              <input
                type="number"
                min="0"
                {...register("baseStock")}
                className="input w-full"
              />
              {errors.baseStock && (
                <span className="text-error text-xs">
                  {errors.baseStock.message}
                </span>
              )}
            </div>
            <div className="flex-1/3 fieldset">
              <label htmlFor="basePrice" className="label">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                {...register("basePrice")}
                className="input w-full"
              />
              {errors.basePrice && (
                <span className="text-error text-xs">
                  {errors.basePrice.message}
                </span>
              )}
            </div>
            <div className="flex-1/3 fieldset">
              <label htmlFor="baseDiscount" className="label">
                Discount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("baseDiscount")}
                className="input w-full"
              />
              {errors.baseDiscount && (
                <span className="text-error text-xs">
                  {errors.baseDiscount.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {hasVariations && combinations.length > 0 && (
        <div className="mt-5">
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="bg-base-200">
                  {activeAttributesWithOptions.map((attr) => (
                    <th key={attr.key}>{attr.label}</th>
                  ))}
                  <th>Cj Variants</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Discount</th>
                </tr>
              </thead>
              <tbody>
                {combinations.map((combo, index) => (
                  <tr key={index}>
                    {activeAttributesWithOptions.map((attr) => (
                      <td key={attr.key} className="uppercase">
                        {combo[attr.key]}
                      </td>
                    ))}
                    <td>
                      <Controller
                        name={`variations.${index}.vid`}
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            value={field.value || ""}
                            className="select w-full min-w-[250px]"
                          >
                            <option value="">Select CJ variant</option>

                            {cjVariants.map((variant) => (
                              <option key={variant.vid} value={variant.vid}>
                                {variant.variantKey} — $
                                {variant.variantSellPrice} —{" "}
                                {variant.variantWeight}g
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    </td>
                    <td>
                      <div className="fieldset">
                        <input
                          type="number"
                          min={0}
                          {...register(`variations.${index}.stock`)}
                          className="input"
                        />
                        {errors?.variations?.[index]?.stock && (
                          <span className="text-error text-xs">
                            {errors.variations[index].stock.message}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fieldset">
                        <input
                          type="number"
                          min={1}
                          step={0.01}
                          {...register(`variations.${index}.price`)}
                          className="input"
                        />
                        {errors?.variations?.[index]?.price && (
                          <span className="text-error text-xs">
                            {errors.variations[index].price.message}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fieldset">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          {...register(`variations.${index}.discount`)}
                          className="input"
                        />
                        {errors?.variations?.[index]?.discount && (
                          <span className="text-error text-xs">
                            {errors.variations[index].discount.message}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingInformationStep;
