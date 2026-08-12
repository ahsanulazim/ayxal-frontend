"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { productDefaultValues } from "./default-values";
import BasicInformation from "./steps/BasicInformation";

const steps = [
  {
    id: "basic",
    label: "Basic information",
  },
  {
    id: "vital",
    label: "Vital information",
  },
  {
    id: "variations",
    label: "Variations & price",
  },
  {
    id: "images",
    label: "Images",
  },
  {
    id: "description",
    label: "Descriptions",
  },
  {
    id: "shipping",
    label: "Shipping & returns",
  },
];

export default function ProductForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    defaultValues: productDefaultValues,

    onSubmit: async ({ value }) => {
      console.log("FINAL PRODUCT:", value);
    },
  });

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleCancel = () => {
    window.history.back();
  };

  const handleBack = () => {
    setCurrentStep((current) => current - 1);
  };

  const handleSaveDraft = () => {
    console.log("DRAFT:", form.state.values);
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Add new product</h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-base-content/60">
            <span>Products</span>
            <span>/</span>
            <span>Add new product</span>
          </div>
        </div>

        {/* Product form card */}
        <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100">
          {/* Step navigation */}
          <div className="overflow-x-auto border-b border-base-300">
            <div className="flex min-w-max">
              {steps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;

                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={!isCompleted && !isActive}
                    onClick={() => {
                      if (isCompleted) {
                        setCurrentStep(index);
                      }
                    }}
                    className={[
                      "relative px-6 py-4 text-sm transition",
                      isActive
                        ? "font-semibold text-base-content"
                        : "text-base-content/60",
                      isCompleted
                        ? "cursor-pointer hover:text-base-content"
                        : "cursor-default",
                    ].join(" ")}
                  >
                    {step.label}

                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current step */}
          <div className="p-6">
            <div className="mx-auto max-w-3xl">
              {currentStep === 0 && (
                <BasicInformation
                  form={form}
                  onCancel={handleCancel}
                  onBack={handleBack}
                  onSaveDraft={handleSaveDraft}
                  isFirstStep={isFirstStep}
                  isLastStep={isLastStep}
                  onNext={() => setCurrentStep((current) => current + 1)}
                />
              )}

              {currentStep > 0 && (
                <div className="rounded-xl border border-dashed border-base-300 p-12 text-center">
                  <h2 className="text-lg font-semibold">
                    {steps[currentStep].label}
                  </h2>

                  <p className="mt-2 text-sm text-base-content/60">
                    This step will be implemented next.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
