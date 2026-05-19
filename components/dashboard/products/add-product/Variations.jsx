"use client";

import { useEffect, useMemo } from "react";
import { getAllAttribute } from "@/api/attributeApi";
import { getAllVariations } from "@/api/typeApi";
import { useQuery } from "@tanstack/react-query";
import { Controller, useWatch } from "react-hook-form";
import Select from "react-select";

const toOptions = (items) =>
  items?.map((item) => ({ value: item._id, label: item.name })) ?? [];

const SelectField = ({ label, name, control, options, isLoading }) => (
  <>
    <label htmlFor={name} className="label">
      {label}
    </label>
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <Select {...field} options={options} isMulti isLoading={isLoading} />
      )}
    />
  </>
);

const Variations = ({ register, control, setValue, getValues, errors }) => {
  const { data: attributes, isLoading: attributesLoading } = useQuery({
    queryKey: ["attributes"],
    queryFn: getAllAttribute,
  });

  const { data: variations, isLoading: variationsLoading } = useQuery({
    queryKey: ["variations"],
    queryFn: getAllVariations,
  });

  const variationOptions = useMemo(() => toOptions(attributes), [attributes]);

  const sizeOptions = useMemo(
    () =>
      toOptions(
        variations?.filter((variation) => variation.attributeSlug === "size"),
      ),
    [variations],
  );

  const colorOptions = useMemo(
    () =>
      toOptions(
        variations?.filter((variation) => variation.attributeSlug === "color"),
      ),
    [variations],
  );

  const [variantsValue, sizeValue, colorValue] = useWatch({
    control,
    name: ["variants", "size", "color"],
    defaultValue: [[], [], []],
  });

  const selectedVariantLabels = useMemo(
    () =>
      Array.isArray(variantsValue)
        ? variantsValue.map((option) => option.label.toLowerCase())
        : [],
    [variantsValue],
  );

  const selectedSizes = useMemo(
    () =>
      Array.isArray(sizeValue) ? sizeValue.map((option) => option.label) : [],
    [sizeValue],
  );

  const selectedColors = useMemo(
    () =>
      Array.isArray(colorValue) ? colorValue.map((option) => option.label) : [],
    [colorValue],
  );

  const variantRows = useMemo(() => {
    if (selectedSizes.length && selectedColors.length) {
      return selectedSizes.flatMap((size) =>
        selectedColors.map((color) => ({ size, color })),
      );
    }

    if (selectedSizes.length) {
      return selectedSizes.map((size) => ({ size, color: "" }));
    }

    if (selectedColors.length) {
      return selectedColors.map((color) => ({ size: "", color }));
    }

    return [];
  }, [selectedSizes, selectedColors]);

  useEffect(() => {
    const previousVariantDetails = getValues("variantDetails") || [];

    const nextVariantDetails = variantRows.map((variant) => {
      const matched = Array.isArray(previousVariantDetails)
        ? previousVariantDetails.find(
            (item) =>
              item?.size === variant.size && item?.color === variant.color,
          )
        : undefined;

      return {
        size: variant.size,
        color: variant.color,
        price: matched?.price ?? "",
        stock: matched?.stock ?? "",
        sku: matched?.sku ?? "",
        image: matched?.image ?? null,
      };
    });

    setValue("variantDetails", nextVariantDetails, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [setValue, getValues, variantRows]);

  const showSize = selectedVariantLabels.includes("size");
  const showColor = selectedVariantLabels.includes("color");
  const showVariantDetails = variantRows.length > 0;

  useEffect(() => {
    if (!showSize) {
      setValue("size", []);
    }

    if (!showColor) {
      setValue("color", []);
    }

    if (!showSize || !showColor) {
      setValue("variantDetails", []);
    }
  }, [setValue, showSize, showColor]);

  return (
    <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
      <h2 className="font-bold text-xl">Product Variants</h2>

      <label htmlFor="variants" className="label">
        Variants (Size, Color etc.)
      </label>
      <Controller
        name="variants"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Select
            {...field}
            options={variationOptions}
            isMulti
            isLoading={attributesLoading}
          />
        )}
      />

      {showSize && (
        <SelectField
          label="Size"
          name="size"
          control={control}
          options={sizeOptions}
          isLoading={variationsLoading}
        />
      )}

      {showColor && (
        <SelectField
          label="Color"
          name="color"
          control={control}
          options={colorOptions}
          isLoading={variationsLoading}
        />
      )}

      {showVariantDetails && (
        <div className="mt-6 bg-base-200 rounded-box p-4">
          <h3 className="font-semibold text-lg">Variant Details</h3>
          <p className="text-sm text-muted mb-4">
            Add details for each selected size and/or color.
          </p>

          <div className="space-y-4">
            {variantRows.map((variant, index) => (
              <div
                key={`${variant.size || "none"}-${variant.color || "none"}-${index}`}
                className="border border-base-300 rounded-box p-4"
              >
                <div className="mb-3 font-medium">
                  Variant: {variant.size || "-"}
                  {variant.color ? ` / ${variant.color}` : ""}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="label">Price</label>
                    <input
                      type="number"
                      className="input w-full"
                      placeholder="1000"
                      {...register(`variantDetails.${index}.price`, {
                        required: "Price is required",
                      })}
                    />
                    {errors.variantDetails?.[index]?.price && (
                      <p className="text-red-600 text-sm">
                        {errors.variantDetails[index].price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Stock</label>
                    <input
                      type="number"
                      className="input w-full"
                      placeholder="10"
                      {...register(`variantDetails.${index}.stock`, {
                        setValueAs: (value) =>
                          value === "" || value === undefined ? "" : Number(value),
                      })}
                    />
                  </div>

                  <div>
                    <label className="label">SKU</label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="OPTIONAL SKU"
                      {...register(`variantDetails.${index}.sku`)}
                    />
                  </div>

                  <div>
                    <label className="label">Variant Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setValue(
                              `variantDetails.${index}.image`,
                              event.target.result,
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

                <input
                  type="hidden"
                  value={variant.size}
                  {...register(`variantDetails.${index}.size`)}
                />
                <input
                  type="hidden"
                  value={variant.color}
                  {...register(`variantDetails.${index}.color`)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Variations;
