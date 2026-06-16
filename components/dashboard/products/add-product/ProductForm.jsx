"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { useContext, useState } from "react";
import BasicInfo from "./forms/BasicInfo";
import { productValidator } from "@/validator/productValidator";
import z from "zod";
import { MyContext } from "@/context/MyProvider";

const ProductForm = () => {
  const [step, setStep] = useState(0);

  const { categories, categoriesLoading, categoriesError } =
    useContext(MyContext);

  const { Field, Subscribe, FormGroup, handleSubmit, reset } = useForm({
    defaultValues: {
      step1: {
        productName: "",
        category: "",
        brand: "",
      },
      step2: {
        color: [],
        size: [],
        price: 0,
      },
      step3: {
        productImages: [],
        description: "",
      },
      step4: {
        shippingAndReturns: "",
      },
    },
    validators: {
      onSubmit: productValidator,
    },
    onSubmit: ({ value }) => console.log(value),
  });

  return (
    <div className="tabs tabs-border">
      <input
        type="radio"
        name="my_tabs_2"
        className="tab"
        aria-label="Basic Information"
        checked={step === 0}
        onChange={() => setStep(0)}
      />
      {step === 0 ? (
        <FormGroup
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
                <h2 className="text-xl font-bold">Basic Information</h2>
                <Field
                  name="step1.productName"
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
                  name="step1.category"
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
                        {errors?.length > 0 && (
                          <p className="text-error">{errors[0].message}</p>
                        )}
                      </>
                    );
                  }}
                />
                <Field
                  name="step1.brand"
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
      ) : null}

      <input
        type="radio"
        name="my_tabs_2"
        className="tab"
        aria-label="Variations and Price"
        checked={step === 1}
        onChange={() => setStep(1)}
      />
      <div className="tab-content border-base-300 bg-base-100 p-5">
        Tab content 2
      </div>
      <input
        type="radio"
        name="my_tabs_2"
        className="tab"
        aria-label="Images"
        checked={step === 2}
        onChange={() => setStep(2)}
      />
      <div className="tab-content border-base-300 bg-base-100 p-5">
        Tab content 3
      </div>
      <input
        type="radio"
        name="my_tabs_2"
        className="tab"
        aria-label="Descriptions"
        checked={step === 3}
        onChange={() => setStep(3)}
      />
      <div className="tab-content border-base-300 bg-base-100 p-5">
        Tab content 4
      </div>
      <input
        type="radio"
        name="my_tabs_2"
        className="tab"
        aria-label="Shipping and Returns"
        checked={step === 4}
        onChange={() => setStep(4)}
      />
      <div className="tab-content border-base-300 bg-base-100 p-5">
        Tab content 5
      </div>
    </div>
  );
};

export default ProductForm;
