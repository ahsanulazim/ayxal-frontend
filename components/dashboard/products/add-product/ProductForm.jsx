"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { useState } from "react";
import BasicInfo from "./forms/BasicInfo";
import { productValidator } from "@/validator/productValidator";

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
      {step === 0 && <BasicInfo form={form} step={step} setStep={setStep} />}

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
