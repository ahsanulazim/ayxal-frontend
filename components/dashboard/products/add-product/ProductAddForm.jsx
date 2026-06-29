"use client";

import { useAppForm } from "@/components/form/CustomFormHook";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import z from "zod";

const ProductAddForm = () => {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    attributes,
    attributesError,
    attributesLoading,
  } = useContext(MyContext);

  const dynamicAttributesDefault =
    attributesLoading || attributesError || !attributes
      ? {}
      : attributes.reduce((acc, attr) => {
          acc[attr.name] = [];
          return acc;
        }, {});

  const { handleSubmit, SubmitButton, reset, AppField, AppForm, Subscribe } =
    useAppForm({
      defaultValues: {
        name: "",
        category: "",
        brand: "",
        productImages: [],
        productDescription: "",
        productType: "single",
        singleProduct: {
          sku: "",
          stock: 0,
          price: 0,
          discount: 0,
        },
        attributes: dynamicAttributesDefault,
      },
      onSubmit: ({ value }) => console.log(value),
      validators: {
        onSubmit: z.object({
          name: z.string().min(1, "Name is required"),
          category: z.string().min(1, "Category is required"),
          brand: z.string().optional().nullable(),
          productImages: z
            .array(z.any())
            .min(1, "Product Images is required")
            .transform((value) => value.map((item) => item.file)),
          productDescription: z.string().min(1, "Description is required"),
          productType: z.string(),
          singleProduct: z.object({
            sku: z.string().optional().nullable(),
            stock: z.number().optional().nullable(),
            price: z.number().min(1, "Price is required"),
            discount: z.number().optional().nullable(),
          }),
          attributes: z.record(z.array(z.string())),
        }),
      },
    });

  return (
    <AppForm>
      <form
        className="grid grid-cols-2 gap-5 bg-base-100 p-5 rounded-box"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
      >
        <div className="fieldset">
          <AppField
            name="name"
            children={(field) => (
              <field.TextField label="Product Name" placeholder="Dog Coller" />
            )}
          />
          <div className="flex gap-5">
            <div className="fieldset w-full">
              <AppField
                name="category"
                children={(field) => (
                  <field.SelectField
                    label="Category"
                    data={categories}
                    isLoading={categoriesLoading}
                    isError={categoriesError}
                  />
                )}
              />
            </div>
            <div className="fieldset w-full">
              <AppField
                name="brand"
                children={(field) => (
                  <field.TextField label="Brand" placeholder="Samsung" />
                )}
              />
            </div>
          </div>
          <AppField
            name="productImages"
            children={(field) => (
              <field.ImageUploader label="Upload Product Images" />
            )}
          />

          <AppField
            name="productDescription"
            children={(field) => (
              <field.DescriptionField label="Product Description" />
            )}
          />
          <SubmitButton label="Product" />
        </div>
        <div className="fieldset">
          <AppField
            name="productType"
            children={(field) => <field.SelectType label="Product Options" />}
          />
          <div className="grid grid-cols-2 gap-5">
            <div className="fieldset">
              <AppField
                name="singleProduct.price"
                children={(field) => (
                  <field.NumberField label="Price" placeholder="100" />
                )}
              />
            </div>
            <div className="fieldset">
              <AppField
                name="singleProduct.discount"
                children={(field) => (
                  <field.NumberField label="Discount" placeholder="100" />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="fieldset">
              <AppField
                name="singleProduct.stock"
                children={(field) => (
                  <field.NumberField label="Stock" placeholder="10" />
                )}
              />
            </div>
            <div className="fieldset">
              <AppField
                name="singleProduct.sku"
                children={(field) => (
                  <field.TextField label="SKU" placeholder="SKU" />
                )}
              />
            </div>
          </div>

          <Subscribe
            selector={(state) => state.values.productType}
            children={(productType) => (
              <>
                {productType === "variable" && (
                  <div className="fieldset p-4 rounded-box bg-base-300">
                    <h2>Step 1: Choose Option Attributes & Values</h2>
                    {attributesLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : attributesError ? (
                      <span className="text-error">Something went wrong</span>
                    ) : (
                      attributes.map((attribute) => (
                        <div key={attribute.slug}>
                          <AppField
                            name={`attributes.${attribute.name}`}
                            children={(field) => (
                              <field.CheckBoxField
                                label={attribute.name}
                                data={attribute}
                              />
                            )}
                          />
                        </div>
                      ))
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <h2>Step 2: Define Variation Values</h2>
                      <button type="button" className="btn btn-main btn-sm">
                        Generate Variations
                      </button>
                    </div>
                    <div className="text-center py-5 rounded-box bg-base-100">
                      <LuTriangleAlert className="size-5 mx-auto mb-1.5" />
                      <p>No variant combinations added yet</p>
                      <button type="button" className="btn btn-sm btn-ghost">
                        Generate automatically using attributes above
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          />
        </div>
      </form>
    </AppForm>
  );
};

export default ProductAddForm;
