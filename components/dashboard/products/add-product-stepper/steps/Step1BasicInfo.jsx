"use client";

import React, { useContext } from "react";
import { withForm } from "../form/productFormHook";
import { MyContext } from "@/context/MyProvider";

export const Step1BasicInfo = withForm({
  render: function Step1BasicInfo({ form }) {
    const {
      categories = [],
      categoriesLoading,
      brands = [],
      brandsLoading,
      attributes = [],
      attributesLoading,
    } = useContext(MyContext) || {};

    const categoriesOptions = React.useMemo(() => {
      return (categories || []).map((cat) => ({
        value: cat.slug || cat._id,
        label: cat.name,
      }));
    }, [categories]);

    const brandsOptions = React.useMemo(() => {
      return (brands || []).map((brand) => ({
        value: brand.value || brand.name,
        label: brand.label || brand.name,
      }));
    }, [brands]);

    const attributesOptions = React.useMemo(() => {
      return (attributes || []).map((attr) => ({
        value: attr.value,
        label: attr.name || attr.label,
      }));
    }, [attributes]);

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
              1
            </span>
            Basic Product Information
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Provide the essential identity, categorization, and variation settings for your product.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="md:col-span-2">
            <form.AppField name="title">
              {(field) => (
                <field.Input
                  field={field}
                  label="Product Title"
                  placeholder="e.g. Premium Cotton Oversized Graphic T-Shirt"
                  required
                  helperText="Clear and descriptive titles rank better"
                />
              )}
            </form.AppField>
          </div>

          {/* Category */}
          <div>
            <form.AppField name="category">
              {(field) => (
                <field.Select
                  field={field}
                  label="Category"
                  placeholder="Select category..."
                  options={categoriesOptions}
                  isLoading={categoriesLoading}
                  required
                  helperText="Select the category this product belongs to"
                />
              )}
            </form.AppField>
          </div>

          {/* Brand with No-Brand toggle */}
          <div>
            <form.Subscribe selector={(state) => state.values.noBrand}>
              {(noBrand) => (
                <div>
                  <form.AppField name="brand">
                    {(field) => (
                      <field.Select
                        field={field}
                        label="Brand"
                        placeholder="Select brand..."
                        options={brandsOptions}
                        isLoading={brandsLoading}
                        disabled={noBrand}
                        required={!noBrand}
                      />
                    )}
                  </form.AppField>

                  <div className="mt-2">
                    <form.AppField name="noBrand">
                      {(field) => (
                        <field.Switch
                          field={field}
                          variant="checkbox"
                          label="Generic / Unbranded Product"
                          description="Check if this product does not belong to any recognized brand"
                        />
                      )}
                    </form.AppField>
                  </div>
                </div>
              )}
            </form.Subscribe>
          </div>
        </div>

        {/* Variations Flag & Attributes */}
        <div className="pt-2 border-t border-base-300">
          <form.AppField name="hasVariations">
            {(field) => (
              <field.Switch
                field={field}
                variant="toggle"
                label="This product has multiple options (e.g. Size, Color)"
                description="Enable to configure variations matrix with distinct prices, stock, and photos"
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.hasVariations}>
            {(hasVariations) =>
              hasVariations ? (
                <div className="mt-4 p-4 rounded-2xl bg-base-200/60 border border-base-300 animate-fadeIn">
                  <form.AppField name="attributes">
                    {(field) => (
                      <field.Select
                        field={field}
                        label="Select Variation Attributes"
                        placeholder="Choose attributes (e.g., Color, Size)..."
                        options={attributesOptions}
                        isLoading={attributesLoading}
                        isMulti
                        required
                        helperText="Values for each selected attribute will be configured in Step 3"
                      />
                    )}
                  </form.AppField>
                </div>
              ) : null
            }
          </form.Subscribe>
        </div>
      </div>
    );
  },
});
