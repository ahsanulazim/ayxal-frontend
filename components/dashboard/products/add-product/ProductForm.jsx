"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { useContext, useState } from "react";
import Select from "react-select";
import BasicInfo from "./forms/BasicInfo";
import { productValidator } from "@/validator/productValidator";
import DateRangePicker from "./forms/DateRangePicker";
import { MyContext } from "@/context/MyProvider";
import { generateCombinations } from "@/utils/generateCombinations";

const ProductForm = () => {
  const [step, setStep] = useState(0);

  const form = useForm({
    defaultValues: {
      step1: {
        productName: "",
        category: "",
        brand: null,
        hasVariations: false,
        attributes: [],
      },
      step2: {
        price: 0,
        discount: 0,
        stock: 0,
        SKU: "",
        color: [],
        size: [],
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

  const { attributes, attributesLoading, attributesError } =
    useContext(MyContext);

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
      {step === 0 && <BasicInfo form={form} step={step} setStep={setStep} />}

      <input
        type="radio"
        name="my_tabs_2"
        className="tab"
        aria-label="Variations and Price"
        checked={step === 1}
        onChange={() => setStep(1)}
      />
      {step === 1 && (
        <form.FormGroup
          name="step2"
          onGroupSubmit={() => setStep(step + 1)}
          children={(group) => {
            const hasVariations = form.getFieldValue("step1.hasVariations");
            const pickedAttributeSlugs =
              form.getFieldValue("step1.attributes") || [];

            const displayAttributes =
              attributes?.filter((attr) =>
                pickedAttributeSlugs.includes(attr.slug),
              ) || [];

            const currentFormValues = group.state.value || {};

            const activeArraysForCombination = pickedAttributeSlugs
              .map((slug) => ({
                slug: slug,
                array: currentFormValues[slug] || [],
              }))
              .filter((item) => item.array.length > 0);

            const tableRows =
              activeArraysForCombination.length > 0
                ? generateCombinations(activeArraysForCombination)
                : [];

            console.log(displayAttributes);

            return (
              <div className="tab-content border-base-300 bg-base-100 p-5">
                <form
                  className="fieldset p-5 border-base-300 border rounded-box"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    group.handleSubmit();
                  }}
                >
                  <h2 className="text-xl font-bold">
                    List all of your variants for the variation types below
                  </h2>
                  <div>
                    {hasVariations ? (
                      <div className="fieldset">
                        <h3 className="text-lg font-semibold">Variants</h3>
                        <form.Field
                          name="step2.size"
                          children={(field) => {
                            const { errors, isTouched } = field.state.meta;
                            return (
                              <>
                                <label htmlFor={field.name} className="label">
                                  Size
                                </label>
                                <Select
                                  isMulti
                                  className="w-full"
                                  classNamePrefix="select"
                                  onBlur={field.handleBlur}
                                  onChange={(e) => field.handleChange(e)}
                                  value={field.state.value ?? ""}
                                  options={[
                                    { value: "", label: "Select Size" },
                                    { value: "small", label: "Small" },
                                    { value: "medium", label: "Medium" },
                                    { value: "large", label: "Large" },
                                    { value: "xl", label: "XL" },
                                  ]}
                                />
                              </>
                            );
                          }}
                        />
                        <form.Field
                          name="step2.color"
                          children={(field) => {
                            const { errors, isTouched } = field.state.meta;
                            return (
                              <>
                                <label htmlFor={field.name} className="label">
                                  Color
                                </label>
                                <Select
                                  isMulti
                                  className="w-full"
                                  classNamePrefix="select"
                                  onBlur={field.handleBlur}
                                  onChange={(e) => field.handleChange(e)}
                                  value={field.state.value ?? ""}
                                  options={[
                                    { value: "", label: "Select Color" },
                                    { value: "red", label: "Red" },
                                    { value: "green", label: "Green" },
                                    { value: "blue", label: "Blue" },
                                    { value: "black", label: "Black" },
                                    { value: "white", label: "White" },
                                  ]}
                                />
                              </>
                            );
                          }}
                        />
                      </div>
                    ) : (
                      <div className="fieldset p-5 bg-base-300 rounded-box">
                        <h3 className="text-lg font-semibold">
                          Stock & Pricing
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <form.Field
                              name="step2.stock"
                              children={(field) => {
                                const { errors, isTouched } = field.state.meta;
                                return (
                                  <>
                                    <label
                                      htmlFor={field.name}
                                      className="label"
                                    >
                                      Stock
                                    </label>
                                    <input
                                      type="number"
                                      placeholder="100"
                                      name={field.name}
                                      value={field.state.value ?? ""}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      className="input w-full"
                                    />
                                    {isTouched && errors?.length > 0 && (
                                      <p className="text-error">
                                        {errors[0].message}
                                      </p>
                                    )}
                                  </>
                                );
                              }}
                            />
                          </div>
                          <div>
                            <form.Field
                              name="step2.sku"
                              children={(field) => {
                                const { errors, isTouched } = field.state.meta;
                                return (
                                  <>
                                    <label
                                      htmlFor={field.name}
                                      className="label"
                                    >
                                      SKU
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="AYX-0000"
                                      name={field.name}
                                      value={field.state.value ?? ""}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      className="input w-full"
                                    />
                                    {isTouched && errors?.length > 0 && (
                                      <p className="text-error">
                                        {errors[0].message}
                                      </p>
                                    )}
                                  </>
                                );
                              }}
                            />
                          </div>
                        </div>
                        <form.Field
                          name="step2.price"
                          children={(field) => {
                            const { errors, isTouched } = field.state.meta;
                            return (
                              <>
                                <label htmlFor={field.name} className="label">
                                  Price
                                </label>
                                <input
                                  type="number"
                                  placeholder="1000"
                                  name={field.name}
                                  value={field.state.value ?? ""}
                                  onBlur={field.handleBlur}
                                  onChange={(e) =>
                                    field.handleChange(e.target.value)
                                  }
                                  className="input w-full"
                                />
                                {isTouched && errors?.length > 0 && (
                                  <p className="text-error">
                                    {errors[0].message}
                                  </p>
                                )}
                              </>
                            );
                          }}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <form.Field
                              name="step2.discount"
                              children={(field) => {
                                const { errors, isTouched } = field.state.meta;
                                return (
                                  <>
                                    <label
                                      htmlFor={field.name}
                                      className="label"
                                    >
                                      Discount
                                    </label>
                                    <input
                                      type="number"
                                      placeholder="1000"
                                      name={field.name}
                                      value={field.state.value ?? ""}
                                      onBlur={field.handleBlur}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      className="input w-full"
                                    />
                                    {isTouched && errors?.length > 0 && (
                                      <p className="text-error">
                                        {errors[0].message}
                                      </p>
                                    )}
                                  </>
                                );
                              }}
                            />
                          </div>
                          <div>
                            <DateRangePicker />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr className="bg-base-200">
                            <th>Color</th>
                            <th>Size</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Discount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </form>
              </div>
            );
          }}
        />
      )}
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
