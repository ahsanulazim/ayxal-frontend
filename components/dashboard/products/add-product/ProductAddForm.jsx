"use client";

import { useAppForm } from "@/components/form/CustomFormHook";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";
import z from "zod";

const ProductAddForm = () => {
  const { handleSubmit, SubmitButton, reset, AppField, AppForm } = useAppForm({
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      productImages: [],
      productDescription: "",
      productType: "single",
      simpleProduct: {
        sku: "",
        stock: "",
        price: "",
        salePrice: "",
      },
    },
    onSubmit: ({ value }) => console.log(value),
    validators: {
      onSubmit: z.object({
        name: z.string().min(1, "Name is required"),
        category: z.string().min(1, "Category is required"),
        brand: z.string().min(1, "Brand is required"),
        productImages: z
          .array(z.any())
          .min(1, "Product Images is required")
          .transform((value) => value.map((item) => item.file)),
        productDescription: z.string().min(1, "Description is required"),
      }),
    },
  });

  const {
    categories,
    categoriesLoading,
    categoriesError,
    attributes,
    attributesError,
    attributesLoading,
  } = useContext(MyContext);

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
                name="simpleProduct.price"
                children={(field) => (
                  <field.NumberField label="Price" placeholder="100" />
                )}
              />
            </div>
            <div className="fieldset">
              <AppField
                name="simpleProduct.discount"
                children={(field) => (
                  <field.NumberField label="Discount" placeholder="100" />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </AppForm>
  );
};

export default ProductAddForm;
