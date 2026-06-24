"use client";

import { MyContext } from "@/context/MyProvider";
import { generateCombinations } from "@/utils/generateCombinations";
import { useContext } from "react";
import Select from "react-select";
import DateRangePicker from "./DateRangePicker";

const PricingInfo = ({ form, step, setStep }) => {
  const {
    attributes,
    attributesLoading,
    attributesError,
    allVariantsLoading,
    allVariants,
    allVariantsError,
  } = useContext(MyContext);

  return (
    <form.FormGroup
      name="step2"
      onGroupSubmit={() => setStep(step + 1)}
      children={(group) => {
        const hasVariations = form.getFieldValue("step1.hasVariations");
        const pickedAttributeSlugs =
          form.getFieldValue("step1.attributes") || [];

        const displayAttributes = attributesLoading
          ? []
          : attributesError
            ? []
            : attributes?.filter((attr) =>
                pickedAttributeSlugs.includes(attr.slug),
              ) || [];

        const currentFormValues = group.state.value || {};

        const activeArraysForCombination = pickedAttributeSlugs
          .map((slug) => ({
            slug: slug,
            array: currentFormValues[slug] || [],
          }))
          .filter((item) => item.array.length > 0);

        const tableRows =
          activeArraysForCombination.length > 0
            ? generateCombinations(activeArraysForCombination)
            : [];

        return (
          <div className="tab-content border-base-300 bg-base-100 p-5">
            <form
              className="fieldset p-5 border-base-300 border rounded-box max-w-150 mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                group.handleSubmit();
              }}
            >
              <h2 className="text-xl font-bold">
                List all of your variants for the variation types below
              </h2>
              <div>
                {hasVariations ? (
                  /* ===================== ১. ভেরিয়েশন ট্রু হলে: ড্রপডাউনসমূহ ===================== */
                  <div className="fieldset gap-4">
                    <h3 className="text-lg font-semibold">Variants</h3>
                    {displayAttributes.map((attribute) => {
                      const filteredOptions =
                        allVariants
                          ?.filter((v) => v.attributeSlug === attribute.slug)
                          ?.map((v) => ({
                            value: v.slug,
                            label: v.name,
                          })) || [];

                      return (
                        <form.Field
                          key={attribute.slug}
                          name={`step2.${attribute.slug}`}
                          children={(field) => {
                            const { errors, isTouched } = field.state.meta;
                            return (
                              <div className="w-full">
                                <label className="label capitalize">
                                  {attribute.name}
                                </label>
                                <Select
                                  isMulti
                                  className="w-full text-base-content"
                                  classNamePrefix="select"
                                  isLoading={allVariantsLoading}
                                  onBlur={field.handleBlur}
                                  value={field.state.value || []}
                                  onChange={(e) => field.handleChange(e)}
                                  options={filteredOptions}
                                />
                                {isTouched && errors?.length > 0 && (
                                  <p className="text-error text-sm mt-1">
                                    {errors[0].message}
                                  </p>
                                )}
                              </div>
                            );
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  /* ===================== ২. ভেরিয়েশন ফলস হলে: গ্লোবাল স্টক ও প্রাইস ===================== */
                  <div className="fieldset p-5 bg-base-300 rounded-box mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Stock & Pricing
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        {/* 🌟 Stock (Optional - validators রিমুভ করা হয়েছে) */}
                        <form.Field
                          name="step2.stock"
                          children={(field) => (
                            <>
                              <label htmlFor={field.name} className="label">
                                Stock
                              </label>
                              <input
                                type="number"
                                placeholder="100 (Optional)"
                                name={field.name}
                                value={field.state.value ?? ""}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(
                                    e.target.value === ""
                                      ? ""
                                      : Number(e.target.value),
                                  )
                                }
                                className="input w-full"
                              />
                            </>
                          )}
                        />
                      </div>
                      <div>
                        {/* 🌟 SKU (Optional - validators রিমুভ করা হয়েছে) */}
                        <form.Field
                          name="step2.sku"
                          children={(field) => (
                            <>
                              <label htmlFor={field.name} className="label">
                                SKU
                              </label>
                              <input
                                type="text"
                                placeholder="AYX-0000 (Optional)"
                                name={field.name}
                                value={field.state.value ?? ""}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                className="input w-full"
                              />
                            </>
                          )}
                        />
                      </div>
                    </div>
                    {/* Price (Required) */}
                    <form.Field
                      name="step2.price"
                      validators={{
                        onChange: ({ value }) =>
                          !value || value <= 0
                            ? "Price must be greater than 0"
                            : undefined,
                      }}
                      children={(field) => {
                        const { errors, isTouched } = field.state.meta;
                        return (
                          <>
                            <label htmlFor={field.name} className="label">
                              Price
                            </label>
                            <input
                              type="number"
                              placeholder="1000"
                              name={field.name}
                              value={field.state.value ?? ""}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                              className={`input w-full ${isTouched && errors?.length > 0 ? "border-error" : ""}`}
                            />
                            {isTouched && errors?.length > 0 && (
                              <p className="text-error text-sm mt-1">
                                {errors[0].message}
                              </p>
                            )}
                          </>
                        );
                      }}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        {/* Discount (Optional) */}
                        <form.Field
                          name="step2.discount"
                          children={(field) => (
                            <>
                              <label htmlFor={field.name} className="label">
                                Discount
                              </label>
                              <input
                                type="number"
                                placeholder="0 (Optional)"
                                name={field.name}
                                value={field.state.value ?? ""}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(
                                    e.target.value === ""
                                      ? ""
                                      : Number(e.target.value),
                                  )
                                }
                                className="input w-full"
                              />
                            </>
                          )}
                        />
                      </div>
                      <div>
                        <DateRangePicker />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ===================== ৩. ডাইনামিক টেবিল ম্যাট্রিক্স (SKU, Stock অপশনাল) ===================== */}
              {hasVariations && tableRows.length > 0 && (
                <div className="mt-5">
                  <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table w-full">
                      <thead>
                        <tr className="bg-base-200">
                          {displayAttributes.map((attr) => (
                            <th key={attr.slug} className="capitalize">
                              {attr.name}
                            </th>
                          ))}
                          <th>SKU</th>
                          <th>Stock</th>
                          <th>Price</th>
                          <th>Discount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row, index) => (
                          <tr key={index} className="hover">
                            {displayAttributes.map((attr) => (
                              <td key={attr.slug} className="font-medium">
                                {row.combinations[attr.slug] || "-"}
                              </td>
                            ))}

                            {/* 🌟 SKU (Optional - validators রিমুভড) */}
                            <td>
                              <form.Field
                                name={`step2.variantMatrix.${index}.sku`}
                                children={(field) => (
                                  <>
                                    <input
                                      type="text"
                                      placeholder="sku"
                                      name={field.name}
                                      value={field.state.value ?? ""}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      className="input"
                                    />
                                  </>
                                )}
                              />
                            </td>

                            {/* 🌟 Stock (Optional - validators রিমুভড, নেগেটিভ সেফটি ইনপুট লেভেলে রাখা হয়েছে) */}
                            <td>
                              <form.Field
                                name={`step2.variantMatrix.${index}.stock`}
                                children={(field) => (
                                  <input
                                    type="number"
                                    placeholder="0"
                                    name={field.name}
                                    value={field.state.value ?? ""}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      field.handleChange(
                                        val === ""
                                          ? ""
                                          : Math.max(0, Number(val)),
                                      );
                                    }}
                                    className="input"
                                  />
                                )}
                              />
                            </td>

                            {/* Price (Required) */}
                            <td>
                              <form.Field
                                name={`step2.variantMatrix.${index}.price`}
                                validators={{
                                  onChange: ({ value }) =>
                                    !value || value <= 0 ? "Min 1" : undefined,
                                }}
                                children={(field) => {
                                  const { errors, isTouched } =
                                    field.state.meta;
                                  return (
                                    <>
                                      <input
                                        type="number"
                                        placeholder="1000.00"
                                        name={field.name}
                                        value={field.state.value ?? ""}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                          field.handleChange(
                                            Number(e.target.value),
                                          )
                                        }
                                        className={`input ${isTouched && errors?.length > 0 ? "border border-error" : ""}`}
                                      />
                                      {isTouched && errors?.length > 0 && (
                                        <span className="text-error">
                                          {errors[0].message}
                                        </span>
                                      )}
                                    </>
                                  );
                                }}
                              />
                            </td>

                            {/* Discount (Optional) */}
                            <td>
                              <form.Field
                                name={`step2.variantMatrix.${index}.discount`}
                                children={(field) => (
                                  <>
                                    <input
                                      type="number"
                                      placeholder="0"
                                      name={field.name}
                                      value={field.state.value ?? ""}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(
                                          e.target.value === ""
                                            ? ""
                                            : Number(e.target.value),
                                        )
                                      }
                                      className="input"
                                    />
                                  </>
                                )}
                              />
                              <form.Field
                                name={`step2.variantMatrix.${index}.combinations`}
                                children={(field) => {
                                  if (!field.state.value) {
                                    setTimeout(
                                      () =>
                                        field.handleChange(row.combinations),
                                      0,
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ----- নেভিগেশন বাটনসমূহ ----- */}
              <div className="mt-5 flex items-center gap-5">
                <button
                  className="btn flex-1"
                  type="button"
                  onClick={() => setStep(0)}
                >
                  Previous
                </button>
                <form.Subscribe
                  selector={(state) => {
                    const { isSubmitting, isValid, values } = state;
                    const { hasVariations } = values.step1 || {};
                    const { price, variantMatrix } = values.step2 || {};

                    // 🌟 বাটন এনাবল কন্ডিশন পরিবর্তন করা হয়েছে: শুধু প্রাইস চেক হচ্ছে
                    let isStep2Filled = false;
                    if (!hasVariations) {
                      isStep2Filled =
                        price !== undefined && price !== null && price > 0;
                    } else {
                      isStep2Filled =
                        variantMatrix &&
                        variantMatrix.length > 0 &&
                        variantMatrix.every(
                          (v) =>
                            v.price !== undefined &&
                            v.price !== null &&
                            v.price > 0,
                        );
                    }

                    return [isSubmitting, isValid, isStep2Filled];
                  }}
                  children={([isSubmitting, isValid, isStep2Filled]) => (
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid || !isStep2Filled}
                      className="btn btn-success flex-1"
                    >
                      Next
                    </button>
                  )}
                />
              </div>
            </form>
          </div>
        );
      }}
    />
  );
};

export default PricingInfo;
