"use client";

import React, { useContext, useState, useEffect } from "react";
import { withForm, useFormStore } from "../form/productFormHook";
import { MyContext } from "@/context/MyProvider";
import Select from "react-select";
import { LuCopy, LuSparkles, LuLayers, LuImage } from "react-icons/lu";
import { toast } from "react-toastify";
import VariantImageUploader from "../fields/VariantImageUploader";

export const Step3PricingStock = withForm({
  render: function Step3PricingStock({ form }) {
    const { attributes = [] } = useContext(MyContext) || {};

    const [batchPrice, setBatchPrice] = useState("");
    const [batchStock, setBatchStock] = useState("");
    const [batchDiscount, setBatchDiscount] = useState("");

    // Dynamic state subscription
    const hasVariations = useFormStore(form, (state) => state.values.hasVariations);
    const rawSelectedAttributes = useFormStore(
      form,
      (state) => state.values.attributes
    );
    const selectedAttributes = React.useMemo(
      () => rawSelectedAttributes || [],
      [rawSelectedAttributes]
    );
    const currentVariations =
      useFormStore(form, (state) => state.values.variations) || [];

    // Filter active attributes from context
    const activeAttributes = React.useMemo(() => {
      return (attributes || []).filter((attr) =>
        selectedAttributes.includes(attr.value)
      );
    }, [attributes, selectedAttributes]);

    // State for attribute values selected for variations: { [attrKey]: ['Red', 'Blue'] }
    const [attributeValues, setAttributeValues] = useState({});

    // When active attributes change, clean up values
    useEffect(() => {
      setAttributeValues((prev) => {
        const next = {};
        activeAttributes.forEach((attr) => {
          if (prev[attr.value]) next[attr.value] = prev[attr.value];
        });
        return next;
      });
    }, [activeAttributes]);

    // Generate Cartesian product
    const combinations = React.useMemo(() => {
      const validEntries = activeAttributes
        .map((attr) => ({
          key: attr.value,
          label: attr.name || attr.label,
          values: attributeValues[attr.value] || [],
        }))
        .filter((entry) => entry.values.length > 0);

      if (validEntries.length === 0) return [];

      return validEntries.reduce(
        (acc, curr) => {
          const res = [];
          acc.forEach((a) => {
            curr.values.forEach((val) => {
              res.push({ ...a, [curr.key]: val });
            });
          });
          return res;
        },
        [{}]
      );
    }, [activeAttributes, attributeValues]);

    // Keep variations in sync with generated combinations
    useEffect(() => {
      if (!hasVariations) {
        if (currentVariations.length > 0) {
          form.setFieldValue("variations", []);
        }
        return;
      }

      if (combinations.length === 0) return;

      const newVariations = combinations.map((combo) => {
        const existing = currentVariations.find((v) =>
          Object.keys(combo).every((k) => v[k] === combo[k])
        );

        return {
          ...combo,
          stock: existing?.stock ?? 0,
          price: existing?.price ?? form.getFieldValue("basePrice") ?? 0,
          discount: existing?.discount ?? 0,
          thumbnail: existing?.thumbnail ?? null,
          images: existing?.images ?? [],
        };
      });

      form.setFieldValue("variations", newVariations);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [combinations, hasVariations]);

    // Batch apply helper for price, stock, discount
    const handleApplyBatch = () => {
      const priceNum = batchPrice !== "" ? Number(batchPrice) : null;
      const stockNum = batchStock !== "" ? Number(batchStock) : null;
      const discountNum = batchDiscount !== "" ? Number(batchDiscount) : null;

      const updated = currentVariations.map((v) => ({
        ...v,
        ...(priceNum !== null ? { price: priceNum } : {}),
        ...(stockNum !== null ? { stock: stockNum } : {}),
        ...(discountNum !== null ? { discount: discountNum } : {}),
      }));

      form.setFieldValue("variations", updated);
    };

    // Copy main product thumbnail to all variations
    const handleCopyMainThumbnail = () => {
      const mainThumb = form.getFieldValue("thumbnail");
      if (!mainThumb) {
        toast.info("No main thumbnail found. You can upload one in Step 2 or individually for each variant.");
        return;
      }
      const updated = currentVariations.map((v) => ({
        ...v,
        thumbnail: mainThumb,
      }));
      form.setFieldValue("variations", updated);
      toast.success("Applied main thumbnail to all variations!");
    };

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
              3
            </span>
            Pricing & Inventory
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Configure regular selling pricing, inventory levels, or granular per-variation matrix.
          </p>
        </div>

        {/* Base Pricing Card */}
        <div className="p-5 rounded-2xl border border-base-300 bg-base-100/70">
          <h3 className="font-semibold text-base text-base-content mb-3 flex items-center gap-2">
            <LuLayers className="text-primary w-4 h-4" />
            {hasVariations ? "Base / Fallback Pricing" : "Standard Product Pricing"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <form.AppField name="basePrice">
              {(field) => (
                <field.Input
                  field={field}
                  type="number"
                  label="Selling Price"
                  placeholder="0.00"
                  prefix="$"
                  step="0.01"
                  min="0"
                  required={!hasVariations}
                />
              )}
            </form.AppField>

            <form.AppField name="baseStock">
              {(field) => (
                <field.Input
                  field={field}
                  type="number"
                  label="Available Stock"
                  placeholder="0"
                  min="0"
                  required={!hasVariations}
                />
              )}
            </form.AppField>

            <form.AppField name="baseDiscount">
              {(field) => (
                <field.Input
                  field={field}
                  type="number"
                  label="Discount"
                  placeholder="0.00"
                  prefix="$"
                  step="0.01"
                  min="0"
                />
              )}
            </form.AppField>
          </div>
        </div>

        {/* Variations Matrix Builder */}
        {hasVariations && (
          <div className="space-y-5 animate-fadeIn">
            {/* Attribute Options Selector */}
            <div className="p-5 rounded-2xl border border-base-300 bg-base-200/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-base-content">
                    Choose Options for Selected Attributes
                  </h4>
                  <p className="text-xs text-base-content/60">
                    Select all applicable options to automatically build the variation table.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAttributes.map((attr) => {
                  const options = (attr.options || []).map((opt) => ({
                    value: opt.value || opt,
                    label: opt.label || opt,
                  }));

                  return (
                    <div key={attr.value} className="form-control">
                      <label className="label py-1 text-xs font-bold text-base-content/80 uppercase">
                        {attr.name || attr.label}
                      </label>
                      <Select
                        isMulti
                        placeholder={`Select ${attr.name}...`}
                        options={options}
                        value={(attributeValues[attr.value] || []).map((v) => ({
                          value: v,
                          label: v,
                        }))}
                        onChange={(selected) => {
                          const vals = selected ? selected.map((s) => s.value) : [];
                          setAttributeValues((prev) => ({
                            ...prev,
                            [attr.value]: vals,
                          }));
                        }}
                        classNames={{
                          control: () =>
                            "!min-h-[2.5rem] !bg-base-100 !rounded-lg !border-base-300 text-sm",
                          menu: () => "!bg-base-100 !border-base-300 text-sm !z-30",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Batch Action Toolbar */}
            {currentVariations.length > 0 && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wide">
                  <LuSparkles className="w-3.5 h-3.5" />
                  Quick Batch Fill ({currentVariations.length} items):
                </span>

                <input
                  type="number"
                  placeholder="Price"
                  value={batchPrice}
                  onChange={(e) => setBatchPrice(e.target.value)}
                  className="input input-bordered input-xs w-20 bg-base-100"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={batchStock}
                  onChange={(e) => setBatchStock(e.target.value)}
                  className="input input-bordered input-xs w-20 bg-base-100"
                />
                <input
                  type="number"
                  placeholder="Discount"
                  value={batchDiscount}
                  onChange={(e) => setBatchDiscount(e.target.value)}
                  className="input input-bordered input-xs w-20 bg-base-100"
                />

                <button
                  type="button"
                  onClick={handleApplyBatch}
                  className="btn btn-primary btn-xs flex items-center gap-1"
                >
                  <LuCopy className="w-3 h-3" /> Apply to All
                </button>

                <div className="h-4 w-[1px] bg-primary/20 hidden sm:block" />

                <button
                  type="button"
                  onClick={handleCopyMainThumbnail}
                  className="btn btn-outline btn-xs flex items-center gap-1 border-primary/40 text-primary hover:bg-primary hover:text-white"
                  title="Use main product thumbnail from Step 2 for all variants"
                >
                  <LuImage className="w-3 h-3" /> Use Main Image for All
                </button>
              </div>
            )}

            {/* Generated Variations Table */}
            {currentVariations.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-xs">
                <table className="table table-zebra table-sm w-full">
                  <thead>
                    <tr className="bg-base-200/80 text-xs font-bold text-base-content/80">
                      <th className="w-10">#</th>
                      <th className="w-28">Image</th>
                      {activeAttributes.map((attr) => (
                        <th key={attr.value}>{attr.name || attr.label}</th>
                      ))}
                      <th className="min-w-[120px]">Stock</th>
                      <th className="min-w-[140px]">Price ($)</th>
                      <th className="min-w-[120px]">Discount ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVariations.map((variant, idx) => (
                      <tr key={idx} className="hover">
                        <td className="font-mono text-xs text-base-content/50">
                          {idx + 1}
                        </td>
                        <td className="py-2">
                          <VariantImageUploader
                            thumbnail={variant.thumbnail}
                            onChangeThumbnail={(thumb) => {
                              form.setFieldValue(
                                `variations[${idx}].thumbnail`,
                                thumb
                              );
                            }}
                            images={variant.images || []}
                            onChangeImages={(imgs) => {
                              form.setFieldValue(
                                `variations[${idx}].images`,
                                imgs
                              );
                            }}
                            variantTitle={activeAttributes
                              .map((attr) => variant[attr.value])
                              .filter(Boolean)
                              .join(" - ")}
                          />
                        </td>
                        {activeAttributes.map((attr) => (
                          <td key={attr.value} className="font-semibold text-sm">
                            <span className="badge badge-neutral badge-sm">
                              {variant[attr.value] || "-"}
                            </span>
                          </td>
                        ))}
                        <td>
                          <form.AppField name={`variations[${idx}].stock`}>
                            {(field) => (
                              <input
                                type="number"
                                min="0"
                                value={field.state.value ?? 0}
                                onChange={(e) =>
                                  field.handleChange(Number(e.target.value))
                                }
                                className="input input-bordered input-xs w-24 bg-base-100"
                              />
                            )}
                          </form.AppField>
                        </td>
                        <td>
                          <form.AppField name={`variations[${idx}].price`}>
                            {(field) => (
                              <div>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={field.state.value ?? 0}
                                  onChange={(e) =>
                                    field.handleChange(Number(e.target.value))
                                  }
                                  className={`input input-bordered input-xs w-28 bg-base-100 ${
                                    field.state.meta.errors.length > 0
                                      ? "input-error"
                                      : ""
                                  }`}
                                />
                                {field.state.meta.errors.length > 0 && (
                                  <p className="text-[10px] text-error mt-0.5">
                                    Required
                                  </p>
                                )}
                              </div>
                            )}
                          </form.AppField>
                        </td>
                        <td>
                          <form.AppField name={`variations[${idx}].discount`}>
                            {(field) => (
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={field.state.value ?? 0}
                                onChange={(e) =>
                                  field.handleChange(Number(e.target.value))
                                }
                                className="input input-bordered input-xs w-24 bg-base-100"
                              />
                            )}
                          </form.AppField>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-base-300 bg-base-100/50">
                <p className="text-sm font-medium text-base-content/70">
                  Select at least one option above to generate product variations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
});
