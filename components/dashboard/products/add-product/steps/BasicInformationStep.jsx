"use client";

import { useContext, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import SelectField from "../fields/SelectField";
import { PRODUCT_ATTRIBUTES } from "../constants/product-form.constants";
import { MyContext } from "@/context/MyProvider";

const BasicInformationStep = ({
  register,
  errors,
  setValue,
  control,
  watch,
  trigger,
}) => {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    brands,
    brandsLoading,
    brandsError,
    attributes,
    attributesLoading,
    attributesError,
  } = useContext(MyContext);
  const hasVariations = !!useWatch({ control, name: "hasVariations" });
  const noBrand = !!useWatch({ control, name: "noBrand" });

  // Clear brand value and trigger validation when noBrand is checked
  useEffect(() => {
    if (noBrand) {
      setValue("brand", "");
      trigger("brand");
    }
  }, [noBrand, setValue, trigger]);

  const categoriesOptions = categoriesLoading
    ? [{ value: "loading", label: "Loading categories..." }]
    : categoriesError
      ? [{ value: "error", label: "Error loading categories" }]
      : categories?.map((category) => ({
          value: category.slug,
          label: category.name,
        }));

  const brandsOptions = brandsLoading
    ? [{ value: "loading", label: "Loading brands..." }]
    : brandsError
      ? [{ value: "error", label: "Error loading brands" }]
      : brands?.map((brand) => ({
          value: brand.value,
          label: brand.label,
        }));

  return (
    <form className="fieldset">
      <h1 className="text-xl font-bold">Add New Product</h1>
      <label htmlFor="title" className="label">
        Product Title
      </label>
      <input
        type="text"
        name="title"
        id="title"
        className="input w-full"
        placeholder="T-Shirt"
        {...register("title")}
      />
      {errors.title && (
        <span className="text-error text-xs">{errors.title.message}</span>
      )}
      <label htmlFor="category" className="label">
        Category
      </label>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <SelectField
            field={field}
            placeholder="Select or Search Category..."
            options={categoriesOptions}
            isClearable
            trigger={trigger}
            errors={errors.category}
          />
        )}
      />

      <label htmlFor="brand" className="label">
        Brand
      </label>
      <Controller
        name="brand"
        control={control}
        render={({ field }) => (
          <SelectField
            field={field}
            placeholder="Select or Search Brand..."
            options={brandsOptions}
            isClearable
            trigger={trigger}
            errors={errors.brand}
            disabled={noBrand}
          />
        )}
      />
      <label className="label">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          {...register("noBrand")}
        />
        This product doesn't have a brand name
      </label>
      <div className="fieldset flex justify-between items-center">
        <label htmlFor="hasVariations" className="label">
          Does this product has variaitons?
        </label>
        <Controller
          name="hasVariations"
          control={control}
          render={({ field }) => (
            <div>
              <label className="label">
                <input
                  type="radio"
                  className="radio radio-sm"
                  checked={field.value === true}
                  onChange={(e) => field.onChange(true)}
                  value={true}
                />
                Yes
              </label>
              <label className="label ml-5">
                <input
                  type="radio"
                  className="radio radio-sm"
                  checked={field.value === false}
                  onChange={(e) => field.onChange(false)}
                  value={false}
                />
                No
              </label>
            </div>
          )}
        />
      </div>
      {hasVariations && (
        <div className="flex gap-5">
          {attributes.map((attr) => (
            <label className="label" key={attr.value}>
              <input
                type="checkbox"
                {...register("attributes")}
                value={attr.value}
                className="checkbox checkbox-sm"
              />
              {attr.name || attr.label}
            </label>
          ))}
        </div>
      )}
      {errors.attributes && (
        <span className="text-error text-xs">{errors.attributes.message}</span>
      )}
    </form>
  );
};

export default BasicInformationStep;
