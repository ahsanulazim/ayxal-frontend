"use client";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";

const BasicInfo = ({ formGroup, Field, Subscribe }) => {
  const { categories, categoriesLoading, categoriesError } =
    useContext(MyContext);

  return (
    <div className="tab-content border-base-300 bg-base-100 p-5">
      <form
        className="fieldset p-5 border-base-300 border rounded-box max-w-150 mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formGroup.handleSubmit();
        }}
      >
        <h2 className="text-xl font-bold">Basic Information</h2>
        <Field
          name="productName"
          children={(field) => {
            const { errors } = field.state.meta;
            return (
              <>
                <label htmlFor={field.name} className="label">
                  Product Name
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Dog Coller"
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {errors?.length > 0 && (
                  <p className="text-error">{errors[0].message}</p>
                )}
              </>
            );
          }}
        />
        <Field
          name="category"
          children={(field) => {
            const { errors } = field.state.meta;
            return (
              <>
                <label htmlFor={field.name} className="label">
                  Category
                </label>
                <select
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="select w-full"
                >
                  <option value="" disabled={true}>
                    Select Category
                  </option>
                  {categoriesLoading ? (
                    <option disabled={true}>Loading...</option>
                  ) : categoriesError ? (
                    <option disabled={true}>Error loading categories</option>
                  ) : categories?.length === 0 ? (
                    <option disabled={true}>No categories found</option>
                  ) : (
                    categories?.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
                {errors?.length > 0 && (
                  <p className="text-error">{errors[0].message}</p>
                )}
              </>
            );
          }}
        />
        <Field
          name="brand"
          children={(field) => {
            const { errors } = field.state.meta;
            return (
              <>
                <label htmlFor={field.name} className="label">
                  Brand
                </label>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Samsung"
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {errors?.length > 0 && (
                  <p className="text-error">{errors[0].message}</p>
                )}
              </>
            );
          }}
        />

        <Subscribe
          children={({ canSubmit }) => (
            <button type="submit" className="btn btn-success mt-4">
              Next
            </button>
          )}
        />
      </form>
    </div>
  );
};

export default BasicInfo;
