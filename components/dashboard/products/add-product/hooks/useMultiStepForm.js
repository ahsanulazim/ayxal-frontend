import { useState } from "react";
import { PRODUCT_FORM_STEPS } from "../constants/product-form.constants";
import { basicInfoSchema } from "../schema/basicSchema";
import {
  descriptionSchema,
  imagesSchema,
  pricingSchema,
  shippingSchema,
  vitalInfoSchema,
} from "../schema/otherSchemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/api/productApi";
import { toast } from "react-toastify";

const stepSchemas = [
  basicInfoSchema,
  vitalInfoSchema,
  pricingSchema,
  imagesSchema,
  descriptionSchema,
  shippingSchema,
];

const defaultData = {
  title: "",
  category: "",
  brand: "",
  noBrand: false,
  hasVariations: false,
  attributes: [],
  vitalInformations: null,
  baseStock: 0,
  basePrice: 0,
  baseDiscount: 0,
  variations: [],
  thumbnail: null,
  images: [],
  tags: [],
  description: "",
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  freeShipping: false,
};

const useMultiStepForm = (initialData = {}) => {
  const [activeStep, setActiveStep] = useState("basic");
  const [formData, setFormData] = useState(() => ({
    ...defaultData,
    ...initialData,
    dimensions: {
      ...defaultData.dimensions,
      ...(initialData.dimensions || {}),
    },
  }));

  //navigation
  const currentStepIndex = PRODUCT_FORM_STEPS.findIndex(
    (step) => step.id === activeStep,
  );

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === PRODUCT_FORM_STEPS.length - 1;

  //returns the schema for the current step
  const currentSchema = stepSchemas[currentStepIndex];

  const goToStep = (stepId) => {
    setActiveStep(stepId);
  };

  const goNext = () => {
    const nextStep = PRODUCT_FORM_STEPS[currentStepIndex + 1];

    if (!nextStep) {
      return;
    }

    setActiveStep(nextStep.id);
  };

  const goBack = () => {
    const previousStep = PRODUCT_FORM_STEPS[currentStepIndex - 1];

    if (!previousStep) {
      return;
    }

    setActiveStep(previousStep.id);
  };

  //   Merge and update form data

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  //handle final submission

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product Created");
    },
    onError: () => {
      toast.error("Product Cannot be Created");
    },
  });

  const submitForm = (data) => {
    console.log("final data:", data);
    mutation.mutate(data);
  };

  return {
    activeStep,
    setActiveStep,
    isFirstStep,
    isLastStep,
    goToStep,
    goNext,
    goBack,
    submitForm,
    updateFormData,
    formData,
    currentSchema,
  };
};

export default useMultiStepForm;
