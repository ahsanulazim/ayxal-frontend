"use client";

import ProductFormFooter from "./ProductFormFooter";
import BasicInformationStep from "../steps/BasicInformationStep";
import VitalInformationStep from "../steps/VitalInformationStep";
import PricingInformationStep from "../steps/PricingInformationStep";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import ImagesStep from "../steps/ImagesStep";
import ProductSteps from "./ProductSteps";
import DescriptionStep from "../steps/DescriptionStep";
import ShippingStep from "../steps/ShippingStep";
import useMultiStepForm from "../hooks/useMultiStepForm";

const ProductForm = ({ intitialData = {} }) => {
  const {
    activeStep,
    isFirstStep,
    isLastStep,
    goBack,
    goNext,
    submitForm,
    currentSchema,
    formData,
    updateFormData,
    submttingForm,
  } = useMultiStepForm(intitialData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
    setValue,
    watch,
    reset,
    getValues,
  } = useForm({
    resolver: async (values, context, options) => {
      console.log("RESOLVER INPUT:", values);
      const result = await zodResolver(currentSchema)(values, context, options);
      console.log("RESOLVER OUTPUT:", result);
      return result;
    },
    mode: "onChange",
    defaultValues: formData,
  });

  const watchedValues = watch();
  console.log("RENDER - form values:", watchedValues);
  console.log("RENDER - form errors:", errors);

  const prevStepRef = useRef(activeStep);

  useEffect(() => {
    if (prevStepRef.current !== activeStep) {
      reset(formData);
      prevStepRef.current = activeStep;
    }
  }, [activeStep, formData, reset]);

  const onNext = async (data) => {
    const isValid = await trigger();
    if (!isValid) return;

    const currentValues = getValues();
    const updatedData = { ...formData, ...currentValues, ...data };
    updateFormData(updatedData);

    if (isLastStep) {
      try {
        submitForm(updatedData);
      } catch (error) {
        toast.error("Submission Failed", error);
      }
    } else {
      goNext();
    }
  };

  const onPrevious = () => {
    const currentValues = getValues();
    updateFormData(currentValues);
    goBack();
  };

  return (
    <>
      <div className="flex justify-center">
        <ProductSteps activeStep={activeStep} />
      </div>
      <div className="mt-5 bg-base-300 rounded-box p-5 w-full mx-auto">
        {activeStep === "basic" && (
          <BasicInformationStep
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            trigger={trigger}
          />
        )}
        {activeStep === "vital" && (
          <VitalInformationStep
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            trigger={trigger}
          />
        )}
        {activeStep === "pricing" && (
          <PricingInformationStep
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            trigger={trigger}
          />
        )}
        {activeStep === "images" && <ImagesStep control={control} />}
        {activeStep === "description" && (
          <DescriptionStep
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            trigger={trigger}
          />
        )}
        {activeStep === "shipping" && (
          <ShippingStep
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            trigger={trigger}
          />
        )}
        <ProductFormFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          goBack={onPrevious}
          goNext={handleSubmit(onNext)}
          submitting={submttingForm}
        />
      </div>
    </>
  );
};

export default ProductForm;
