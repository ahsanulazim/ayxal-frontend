"use client";
import { MyContext } from "@/context/MyProvider";
import { productValidator } from "@/validator/productValidator";
import { useContext } from "react";

const BasicInfo = ({ form, step, setStep }) => {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    attributes,
    attributesError,
    attributesLoading,
  } = useContext(MyContext);

  return (
    <form.FormGroup
      name="step1"
      validators={{ onChange: productValidator.shape.step1 }}
      onGroupSubmit={() => setStep(step + 1)}
      children={(group) => (
        <div className="tab-content border-base-300 bg-base-100 p-5">
          <form
            className="fieldset p-5 border-base-300 border rounded-box max-w-150 mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              group.handleSubmit();
            }}
          >
            <h2 className="text-xl font-bold">Add New Product</h2>
            <form.Field
              name="step1.productName"
              children={(field) => {
                const { errors, isTouched } = field.state.meta;
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
                    {isTouched && errors?.length > 0 && (
                      <p className="text-error">{errors[0].message}</p>
                    )}
                  </>
                );
              }}
            />
            <form.Field
              name="step1.category"
              children={(field) => {
                const { errors, isTouched } = field.state.meta;
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
                        <option disabled={true}>
                          Error loading categories
                        </option>
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
                    {isTouched && errors?.length > 0 && (
                      <p className="text-error">{errors[0].message}</p>
                    )}
                  </>
                );
              }}
            />
            <form.Field
              name="step1.brand"
              children={(field) => {
                const { errors, isTouched } = field.state.meta;
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
                    {isTouched && errors?.length > 0 && (
                      <p className="text-error">{errors[0].message}</p>
                    )}
                  </>
                );
              }}
            />

            <form.Field
              name="step1.hasVariations"
              children={(field) => {
                const { errors, isTouched } = field.state.meta;
                return (
                  <>
                    <label htmlFor={field.name} className="label">
                      Does the product have variations?
                    </label>
                    <div className="flex gap-5 items-center">
                      <div className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={field.name}
                          className="radio radio-xs"
                          onBlur={field.handleBlur}
                          onChange={() => field.handleChange(true)}
                          checked={field.state.value === true}
                        />
                        <p>Yes</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={field.name}
                          className="radio radio-xs"
                          onBlur={field.handleBlur}
                          onChange={() => {
                            field.handleChange(false);
                            field.form.setFieldValue("step1.attributes", []);
                          }}
                          checked={field.state.value === false}
                        />
                        <p>No</p>
                      </div>
                    </div>
                    {isTouched && errors?.length > 0 && (
                      <p className="text-error">{errors[0].message}</p>
                    )}
                  </>
                );
              }}
            />
            <form.Field
              name="step1.attributes"
              validators={{
                onChangeListenTo: ["step1.hasVariations"],
                onChange: ({ value, fieldApi }) => {
                  const hasVariations = fieldApi.form.getFieldValue(
                    "step1.hasVariations",
                  );
                  if (
                    hasVariations === true &&
                    (!value || value?.length === 0)
                  ) {
                    return "Please select at least one attribute";
                  }
                  return undefined;
                },
              }}
              children={(field) => {
                const { errors, isTouched } = field.state.meta;
                const hasVariations = field.form.getFieldValue(
                  "step1.hasVariations",
                );
                const currentValue = field.state.value || [];

                if (hasVariations !== true) return null;

                const handleCheckboxChange = (attrName, checked) => {
                  if (checked) {
                    field.handleChange([...currentValue, attrName]);
                  } else {
                    field.handleChange(
                      currentValue.filter((v) => v !== attrName),
                    );
                  }
                };

                return (
                  <>
                    <label htmlFor={field.name} className="label">
                      Attributes
                    </label>
                    <div className="flex items-center gap-5">
                      {attributesLoading ? (
                        <div>Loading...</div>
                      ) : attributesError ? (
                        <div>Error loading attributes</div>
                      ) : attributes?.length === 0 ? (
                        <div>No attributes found</div>
                      ) : (
                        attributes?.map((attribute) => (
                          <div key={attribute.slug}>
                            <input
                              type="checkbox"
                              name={field.name}
                              className="checkbox checkbox-sm"
                              checked={currentValue.includes(attribute.slug)}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  attribute.slug,
                                  e.target.checked,
                                )
                              }
                            />{" "}
                            {attribute.name}
                          </div>
                        ))
                      )}
                    </div>
                    {isTouched && errors?.length > 0 && (
                      <p className="text-error">{errors[0].message}</p>
                    )}
                  </>
                );
              }}
            />

            <form.Subscribe
              children={({ isValid, canSubmit, isPristine }) => (
                <button
                  type="submit"
                  disabled={!isValid || !canSubmit || isPristine}
                  className="btn btn-success mt-4"
                >
                  Next
                </button>
              )}
            />
          </form>
        </div>
      )}
    />
  );
};

export default BasicInfo;
