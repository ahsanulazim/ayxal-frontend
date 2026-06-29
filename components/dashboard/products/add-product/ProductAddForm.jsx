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
        className="fieldset bg-base-100 p-5 rounded-box"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
      >
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
      </form>
    </AppForm>
  );
};

export default ProductAddForm;
