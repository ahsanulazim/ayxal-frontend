"use client";

import { useAppForm } from "@/components/form/CustomFormHook";
import { MyContext } from "@/context/MyProvider";
import { productSchema } from "@/validator/productValidator";
import { useContext } from "react";
import { LuTriangleAlert } from "react-icons/lu";

const ProductAddForm = () => {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    attributes,
    attributesError,
    attributesLoading,
  } = useContext(MyContext);

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
        attributes: [],
        variants: [],
      },
      onSubmit: ({ value }) => console.log(value),
      validators: {
        onSubmit: productSchema,
      },
    });

  return (
    <AppForm>
      <form
        className="grid grid-cols-2 gap-5 bg-base-100 p-5 rounded-box items-start"
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

                    <Subscribe
                      selector={(state) => state.values.attributes}
                      children={(currentAttributes) => {
                        const activeValues = Object.values(
                          currentAttributes || {},
                        ).filter((arr) => Array.isArray(arr) && arr.length > 0);

                        if (activeValues.length === 0) {
                          return (
                            <div className="text-center py-5 rounded-box bg-base-100">
                              <LuTriangleAlert className="size-5 mx-auto mb-1.5" />
                              <p>No variant combinations added yet</p>
                            </div>
                          );
                        }
                        const generateCombinations = (arrays) => {
                          return arrays.reduce(
                            (acc, curr) =>
                              acc.flatMap((d) => curr.map((e) => [...d, e])),
                            [[]],
                          );
                        };

                        const combinations = generateCombinations(activeValues);

                        return (
                          <>
                            <h2>
                              Step 2: Define Variation Values{" "}
                              <span className="badge bg-main text-white badge-sm">
                                {combinations.length}
                              </span>
                            </h2>

                            <div className="flex flex-col gap-2">
                              {combinations.map((combination, index) => {
                                const variantName = combination.join(" - ");

                                return (
                                  <div
                                    key={index}
                                    className="bg-base-100 rounded-box p-4"
                                  >
                                    <span className="font-semibold text-sm text-gray-800 capitalize">
                                      {variantName}
                                    </span>
                                    <div className="">
                                      <div className="flex items-center gap-4">
                                        <div className="fieldset flex-1">
                                          <AppField
                                            name={`variants[${index}].price`}
                                            children={(field) => (
                                              <field.NumberField
                                                label="Price"
                                                placeholder="100"
                                              />
                                            )}
                                          />
                                        </div>
                                        <div className="fieldset flex-1">
                                          <AppField
                                            name={`variants[${index}].discount`}
                                            children={(field) => (
                                              <field.NumberField
                                                label="Discount"
                                                placeholder="100"
                                              />
                                            )}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="fieldset flex-1">
                                          <AppField
                                            name={`variants[${index}].stock`}
                                            children={(field) => (
                                              <field.NumberField
                                                label="Stock"
                                                placeholder="10"
                                              />
                                            )}
                                          />
                                        </div>
                                        <div className="fieldset flex-1">
                                          <AppField
                                            name={`variants[${index}].sku`}
                                            children={(field) => (
                                              <field.TextField
                                                label="SKU"
                                                placeholder="SKU"
                                              />
                                            )}
                                          />
                                        </div>
                                      </div>
                                      <AppField
                                        name={`variants[${index}].image`}
                                        children={(field) => (
                                          <field.ImageUploader
                                            label="Image"
                                            placeholder="Image"
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        );
                      }}
                    />
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
