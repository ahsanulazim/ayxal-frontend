"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { useState } from "react";
import BasicInfo from "./forms/BasicInfo";
import { productValidator } from "@/validator/productValidator";
import PricingInfo from "./forms/PricingInfo";
import { fileToBase64 } from "@/utils/base24Converter";

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
        sku: "",
        variantMatrix: [],
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
      {step === 1 && <PricingInfo form={form} step={step} setStep={setStep} />}
      <input
        type="radio"
        name="my_tabs_2"
        className="tab"
        aria-label="Images"
        checked={step === 2}
        onChange={() => setStep(2)}
      />
      <form.FormGroup
        name="step3"
        onGroupSubmit={() => setStep(step + 1)}
        children={(group) => {
          return (
            <div className="tab-content border-base-300 bg-base-100 p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  group.handleSubmit();
                }}
                className="fieldset p-5 border-base-300 border rounded-box max-w-xl mx-auto gap-4"
              >
                <h3 className="text-lg font-bold">Upload Product Images</h3>

                <form.Field
                  name="step3.productImages"
                  children={(field) => {
                    const currentImages = field.state.value || [];

                    const handleFileChange = async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const filesArray = Array.from(e.target.files);

                        try {
                          // 🌟 Reusable ফাংশনটি লুপের ভেতর ম্যাপ করে সব ফাইল প্রমিস একসাথে হ্যান্ডেল করা হচ্ছে
                          const base64Promises = filesArray.map((file) =>
                            fileToBase64(file),
                          );
                          const newBase64Images =
                            await Promise.all(base64Promises);

                          // স্টেট আপডেট
                          field.handleChange([
                            ...currentImages,
                            ...newBase64Images,
                          ]);
                        } catch (error) {
                          console.error(
                            "Error converting images to Base64:",
                            error,
                          );
                        }

                        e.target.value = ""; // ইনপুট রিসেট
                      }
                    };

                    const handleRemoveImage = (indexToRemove) => {
                      field.handleChange(
                        currentImages.filter((_, i) => i !== indexToRemove),
                      );
                    };

                    return (
                      <>
                        <label className="label">Product Images</label>
                        <div className="flex items-center gap-5">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input"
                          />

                          {/* ইমেজ প্রিভিউ গ্রিড */}
                          {currentImages.length > 0 && (
                            <div className="grid grid-rows-2 grid-cols-3 grid-flow-col! gap-3">
                              {currentImages.map((base64String, index) => (
                                <div
                                  key={index}
                                  className="relative aspect-square rounded-box overflow-hidden border border-base-300"
                                >
                                  <img
                                    src={base64String}
                                    alt={`preview-${index}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-error/90 hover:bg-error text-white btn btn-xs btn-circle border-none"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  }}
                />

                {/* নেভিগেশন বাটনসমূহ */}
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn flex-1"
                  >
                    Previous
                  </button>
                  <button type="submit" className="btn btn-success flex-1">
                    Next
                  </button>
                </div>
              </form>
            </div>
          );
        }}
      />
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
