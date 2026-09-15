"use client";

import React from "react";
import { withForm, useFormStore } from "../form/productFormHook";
import Image from "next/image";
import { LuTruck, LuTag, LuLayers, LuCircleCheck } from "react-icons/lu";

export const Step6Shipping = withForm({
  render: function Step6Shipping({ form }) {
    const values = useFormStore(form, (state) => state.values);

    const thumbnailSrc =
      typeof values.thumbnail === "string"
        ? values.thumbnail
        : values.thumbnail?.url;

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
              6
            </span>
            Shipping & Final Review
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Specify shipping dimensions and weight for logistics calculations,
            then review your product before publishing.
          </p>
        </div>

        {/* Shipping Form Controls */}
        <div className="p-5 rounded-2xl border border-base-300 bg-base-100/60 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Weight */}
            <div>
              <form.AppField name="weight">
                {(field) => (
                  <field.Input
                    field={field}
                    type="number"
                    label="Package Weight"
                    placeholder="0.5"
                    suffix="KG"
                    min="0.01"
                    step="0.01"
                    required
                  />
                )}
              </form.AppField>
            </div>

            {/* Dimensions */}
            <div>
              <form.AppField name="dimensions.length">
                {(field) => (
                  <field.Input
                    field={field}
                    type="number"
                    label="Length"
                    placeholder="0"
                    suffix="IN"
                    min="0"
                    step="0.1"
                  />
                )}
              </form.AppField>
            </div>

            <div>
              <form.AppField name="dimensions.width">
                {(field) => (
                  <field.Input
                    field={field}
                    type="number"
                    label="Width"
                    placeholder="0"
                    suffix="IN"
                    min="0"
                    step="0.1"
                  />
                )}
              </form.AppField>
            </div>

            <div>
              <form.AppField name="dimensions.height">
                {(field) => (
                  <field.Input
                    field={field}
                    type="number"
                    label="Height"
                    placeholder="0"
                    suffix="IN"
                    min="0"
                    step="0.1"
                  />
                )}
              </form.AppField>
            </div>
          </div>

          <div className="pt-2 border-t border-base-300">
            <form.AppField name="freeShipping">
              {(field) => (
                <field.Switch
                  field={field}
                  variant="checkbox"
                  label="Offer Free Shipping for this product"
                  description="Boost conversions by absorbing shipping costs on this item"
                />
              )}
            </form.AppField>
          </div>
        </div>

        {/* Final Summary Card */}
        <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-4">
          <h3 className="font-bold text-sm text-primary flex items-center gap-2 uppercase tracking-wider">
            <LuCircleCheck className="w-4 h-4" /> Ready to Publish Summary
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {thumbnailSrc ? (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-base-300 bg-base-200 shrink-0">
                <Image
                  src={thumbnailSrc}
                  alt="Product thumbnail"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl bg-base-200 border border-base-300 flex items-center justify-center text-xs text-base-content/40 shrink-0">
                No Image
              </div>
            )}

            <div className="flex-1 space-y-1">
              <h4 className="font-bold text-base text-base-content">
                {values.title || "Untitled Product"}
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/70">
                <span className="flex items-center gap-1">
                  <LuTag className="w-3.5 h-3.5 text-primary" />
                  Categories:{" "}
                  <strong className="text-base-content">
                    {Array.isArray(values.category)
                      ? values.category.length > 0
                        ? values.category.join(", ")
                        : "None"
                      : values.category || "Not selected"}
                  </strong>
                </span>

                <span className="flex items-center gap-1">
                  <LuLayers className="w-3.5 h-3.5 text-primary" />
                  {values.hasVariations
                    ? `${values.variations?.length || 0} Variations`
                    : `Price: $${values.basePrice || 0}`}
                </span>

                <span className="flex items-center gap-1">
                  <LuTruck className="w-3.5 h-3.5 text-primary" />
                  {values.freeShipping
                    ? "Free Shipping"
                    : `Weight: ${values.weight || 0} KG`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
