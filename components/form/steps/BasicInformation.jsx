"use client";

import { basicInformationSchema } from "@/validator/product/basic-schema";
import FormFieldError from "../FormFieldError";

const recommendedCategories = [
  {
    id: "men-tshirt",
    label: "Men / Clothing / T-Shirt",
  },
  {
    id: "men-polo",
    label: "Men / Clothing / Polo Shirt",
  },
  {
    id: "women-hoodie",
    label: "Women / Clothing / Hoodie",
  },
];

const brands = [
  {
    id: "nike",
    label: "Nike",
  },
  {
    id: "adidas",
    label: "Adidas",
  },
  {
    id: "puma",
    label: "Puma",
  },
];

export default function BasicInformation({
  form,
  onCancel,
  onBack,
  onSaveDraft,
  onNext,
  isFirstStep,
  isLastStep,
}) {
  return (
    <form.FormGroup
      name="basic"
      validators={{
        onChange: basicInformationSchema,
      }}
      onGroupSubmit={() => {
        onNext();
      }}
      onGroupSubmitInvalid={() => {
        console.log("Basic information is invalid");
      }}
    >
      {(group) => (
        <div>
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold">Basic information</h2>

            <p className="mt-1 text-sm text-base-content/60">
              Add the basic information about your product.
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-6">
            {/* Product title */}
            <form.AppField name="basic.title">
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium"
                  >
                    Product title
                    <span className="ml-1 text-error">*</span>
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter product title"
                    className="input input-bordered w-full"
                  />

                  <FormFieldError field={field} />
                </div>
              )}
            </form.AppField>

            {/* Category */}
            <form.AppField name="basic.categoryId">
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium"
                  >
                    Category
                    <span className="ml-1 text-error">*</span>
                  </label>

                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select category</option>

                    {recommendedCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>

                  <FormFieldError field={field} />
                </div>
              )}
            </form.AppField>

            {/* Recommended categories */}
            <div>
              <p className="mb-2 text-sm font-medium">Recommended categories</p>

              <div className="overflow-hidden rounded-lg border border-base-300">
                {recommendedCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      form.setFieldValue("basic.categoryId", category.id);
                    }}
                    className="block w-full border-b border-base-300 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-base-200"
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            <form.AppField name="basic.brandId">
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium"
                  >
                    Brand
                  </label>

                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    disabled={form.state.values.basic.noBrand}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    className="select select-bordered w-full disabled:cursor-not-allowed disabled:bg-base-200"
                  >
                    <option value="">Select brand</option>

                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.label}
                      </option>
                    ))}
                  </select>

                  <FormFieldError field={field} />
                </div>
              )}
            </form.AppField>

            {/* No brand */}
            <form.AppField name="basic.noBrand">
              {(field) => (
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      field.handleChange(checked);

                      if (checked) {
                        form.setFieldValue("basic.brandId", "");
                      }
                    }}
                    className="checkbox"
                  />

                  <span className="text-sm">
                    This product doesn't have a brand name
                  </span>
                </label>
              )}
            </form.AppField>

            {/* Product type */}
            <form.AppField name="basic.type">
              {(field) => (
                <div>
                  <p className="mb-3 text-sm font-medium">
                    Does this product have variations?
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="product-type"
                        checked={field.state.value === "simple"}
                        onChange={() => field.handleChange("simple")}
                        className="radio"
                      />

                      <span className="text-sm">No, simple product</span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="product-type"
                        checked={field.state.value === "variable"}
                        onChange={() => field.handleChange("variable")}
                        className="radio"
                      />

                      <span className="text-sm">Yes, variable product</span>
                    </label>
                  </div>
                </div>
              )}
            </form.AppField>
          </div>

          {/* Footer */}
          <div className="mt-10 flex items-center justify-between border-t border-base-300 pt-6">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>

            <div className="flex gap-3">
              {!isFirstStep && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onBack}
                >
                  Back
                </button>
              )}

              <button
                type="button"
                className="btn btn-outline"
                onClick={onSaveDraft}
              >
                Save draft
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={group.state.meta.isSubmitting}
                onClick={() => {
                  void group.handleSubmit();
                }}
              >
                {group.state.meta.isSubmitting
                  ? "Validating..."
                  : isLastStep
                    ? "Submit"
                    : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form.FormGroup>
  );
}
