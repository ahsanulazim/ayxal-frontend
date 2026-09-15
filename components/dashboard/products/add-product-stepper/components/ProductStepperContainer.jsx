"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createProductStepper, updateProductStepper } from "@/api/productApi";

import { useAppForm } from "../form/productFormHook";
import { initialProductValues, STEPPER_STEPS } from "../form/defaultValues";
import { validateStep } from "../form/stepperValidation";
import {
  StepperValidationProvider,
  useStepperValidation,
} from "../form/stepperContext";

import StepperHeader from "./StepperHeader";
import StepperFooter from "./StepperFooter";
import FormDebugDrawer from "./FormDebugDrawer";

import { Step1BasicInfo } from "../steps/Step1BasicInfo";
import { Step2Media } from "../steps/Step2Media";
import { Step3PricingStock } from "../steps/Step3PricingStock";
import { Step4VitalInfo } from "../steps/Step4VitalInfo";
import { Step5Description } from "../steps/Step5Description";
import { Step6Shipping } from "../steps/Step6Shipping";

const STORAGE_KEY = "ayxal_stepper_product_draft_v1";

const sanitizeProductPayload = (values) => {
  let categoryStr = values.category;
  if (Array.isArray(categoryStr) && categoryStr.length > 0) {
    categoryStr = categoryStr[0];
  } else if (typeof categoryStr === "object" && categoryStr !== null) {
    categoryStr = categoryStr.value || categoryStr.slug || "";
  }
  categoryStr = typeof categoryStr === "string" ? categoryStr.trim() : "";

  const cleanVital = Array.isArray(values.vitalInformations)
    ? values.vitalInformations.filter(
        (v) => v && (v.label?.trim() || v.value?.trim())
      )
    : [];

  const cleanVariations =
    values.hasVariations && Array.isArray(values.variations)
      ? values.variations.map((v) => ({
          ...v,
          price: Number(v.price) || 0,
          stock: Number(v.stock) || 0,
          discount: Number(v.discount) || 0,
          thumbnail: v.thumbnail || null,
          images: Array.isArray(v.images) ? v.images : [],
        }))
      : [];

  return {
    ...values,
    category: categoryStr,
    vitalInformations: cleanVital,
    variations: cleanVariations,
    basePrice: Number(values.basePrice) || 0,
    baseStock: Number(values.baseStock) || 0,
    baseDiscount: Number(values.baseDiscount) || 0,
    weight: Number(values.weight) || 0,
  };
};

function ProductStepperInner({ initialData = null, productId = null, isEditMode = false }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setStepErrors, clearAllErrors } = useStepperValidation();

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [maxVisitedStepIndex, setMaxVisitedStepIndex] = useState(
    isEditMode ? STEPPER_STEPS.length - 1 : 0
  );
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const isLoadedFromStorage = useRef(false);

  // Map initialData when editing
  const mappedDefaults = React.useMemo(() => {
    if (!isEditMode || !initialData) return initialProductValues;
    return {
      title: initialData.title || "",
      category:
        typeof initialData.category === "string"
          ? initialData.category
          : Array.isArray(initialData.category)
          ? initialData.category[0] || ""
          : "",
      brand: initialData.brand || "",
      noBrand: !!initialData.noBrand,
      hasVariations: !!initialData.hasVariations,
      attributes: Array.isArray(initialData.attributes)
        ? initialData.attributes
        : [],
      thumbnail: initialData.thumbnail || null,
      images: Array.isArray(initialData.images) ? initialData.images : [],
      baseStock: initialData.baseStock ?? 0,
      basePrice: initialData.basePrice ?? 0,
      baseDiscount: initialData.baseDiscount ?? 0,
      variations: Array.isArray(initialData.variations)
        ? initialData.variations.map((v) => ({
            ...v,
            price: v.price ?? 0,
            stock: v.stock ?? 0,
            discount: v.discount ?? 0,
            thumbnail: v.thumbnail || null,
            images: Array.isArray(v.images) ? v.images : [],
          }))
        : [],
      vitalInformations:
        Array.isArray(initialData.vitalInformations) &&
        initialData.vitalInformations.length > 0
          ? initialData.vitalInformations
          : [{ label: "", value: "" }],
      tags: Array.isArray(initialData.tags) ? initialData.tags : [],
      description: initialData.description || "",
      weight: initialData.weight ?? 0,
      dimensions: {
        length: initialData.dimensions?.length ?? 0,
        width: initialData.dimensions?.width ?? 0,
        height: initialData.dimensions?.height ?? 0,
      },
      freeShipping: !!initialData.freeShipping,
    };
  }, [isEditMode, initialData]);

  // Initialize TanStack Form
  const form = useAppForm({
    defaultValues: mappedDefaults,
    onSubmit: async ({ value }) => {
      const payload = sanitizeProductPayload(value);
      mutation.mutate(payload);
    },
  });

  // Populate form if initialData arrives
  useEffect(() => {
    if (isEditMode && initialData) {
      Object.keys(mappedDefaults).forEach((key) => {
        form.setFieldValue(key, mappedDefaults[key]);
      });
      isLoadedFromStorage.current = true;
    }
  }, [isEditMode, initialData, mappedDefaults, form]);

  // Load draft from localStorage on mount (only for new product)
  useEffect(() => {
    if (isEditMode) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          Object.keys(parsed).forEach((key) => {
            form.setFieldValue(key, parsed[key]);
          });
          toast.info("Restored product form draft");
        }
      }
    } catch (e) {
      console.warn("Failed to load draft from localStorage", e);
    } finally {
      isLoadedFromStorage.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  // Debounced auto-save draft to localStorage (only for new product)
  useEffect(() => {
    if (isEditMode || !isLoadedFromStorage.current) return;

    const timeout = setTimeout(() => {
      try {
        const values = form.state.values;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        const now = new Date();
        setLastSavedTime(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } catch (e) {
        console.warn("Failed to save draft to localStorage", e);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [form.state.values, isEditMode]);

  // Handle Clear Draft
  const handleClearDraft = useCallback(() => {
    if (confirm("Are you sure you want to discard changes and reset the form?")) {
      if (!isEditMode) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
      }
      form.reset();
      clearAllErrors();
      setActiveStepIndex(0);
      setMaxVisitedStepIndex(isEditMode ? STEPPER_STEPS.length - 1 : 0);
      setLastSavedTime(null);
      toast.info(isEditMode ? "Form reset to original product data" : "Form draft cleared");
    }
  }, [form, clearAllErrors, isEditMode]);

  // TanStack Query Mutation
  const mutation = useMutation({
    mutationFn: (payload) => {
      if (isEditMode && productId) {
        return updateProductStepper({ id: productId, data: payload });
      }
      return createProductStepper(payload);
    },
    onSuccess: () => {
      if (!isEditMode) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (productId) {
        queryClient.invalidateQueries({ queryKey: ["product", productId] });
      }
      toast.success(
        isEditMode
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      router.push("/dashboard/products");
    },
    onError: (error) => {
      console.error(isEditMode ? "Update product failed:" : "Create product failed:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          (isEditMode
            ? "Failed to update product. Please review details."
            : "Failed to create product. Please review details.")
      );
    },
  });

  const currentStep = STEPPER_STEPS[activeStepIndex];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === STEPPER_STEPS.length - 1;

  // Step Validation & Navigation (No toast on validation failure - shows under fields directly)
  const handleNext = async () => {
    const currentValues = form.state.values;
    const { isValid, errors } = validateStep(currentStep.id, currentValues);

    if (!isValid) {
      setStepErrors(errors);
      return;
    }

    clearAllErrors();
    const nextIdx = activeStepIndex + 1;
    if (nextIdx < STEPPER_STEPS.length) {
      setActiveStepIndex(nextIdx);
      setMaxVisitedStepIndex((prev) => Math.max(prev, nextIdx));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      clearAllErrors();
      setActiveStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (index) => {
    clearAllErrors();
    setActiveStepIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    const currentValues = form.state.values;

    // Validate all steps to ensure no required field was left empty
    for (let i = 0; i < STEPPER_STEPS.length; i++) {
      const step = STEPPER_STEPS[i];
      const { isValid, errors } = validateStep(step.id, currentValues);
      if (!isValid) {
        setStepErrors(errors);
        setActiveStepIndex(i);
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.error(`Please complete the required fields in: ${step.label}`);
        return;
      }
    }

    clearAllErrors();
    form.handleSubmit();
  };

  // Quick Sample Data for debugging
  const handleFillDummyData = () => {
    const sample = {
      title: "Antigravity Ultra Lightweight Running Hoodie",
      category:
        typeof form.getFieldValue("category") === "string" &&
        form.getFieldValue("category").trim() !== ""
          ? form.getFieldValue("category")
          : "clothing",
      brand: "AeroSport",
      noBrand: false,
      hasVariations: true,
      attributes: ["size", "color"],
      thumbnail: {
        url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop",
        public_id: null,
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop",
          public_id: null,
        },
      ],
      basePrice: 49.99,
      baseStock: 100,
      baseDiscount: 5.0,
      variations: [
        {
          size: "M",
          color: "Black",
          stock: 50,
          price: 49.99,
          discount: 5,
          thumbnail: {
            url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop",
            public_id: null,
          },
          images: [],
        },
        {
          size: "L",
          color: "Black",
          stock: 50,
          price: 49.99,
          discount: 5,
          thumbnail: {
            url: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop",
            public_id: null,
          },
          images: [],
        },
      ],
      vitalInformations: [
        { label: "Material", value: "88% Polyester, 12% Spandex" },
        { label: "Fit", value: "Athletic Slim Fit" },
      ],
      tags: ["athleisure", "running", "hoodie", "breathable"],
      description: {
        time: Date.now(),
        blocks: [
          {
            type: "header",
            data: { text: "Peak Athletic Performance", level: 3 },
          },
          {
            type: "paragraph",
            data: {
              text: "Designed with moisture-wicking synthetic fibers to keep you warm and dry during morning workouts.",
            },
          },
        ],
      },
      weight: 0.45,
      dimensions: { length: 12, width: 9, height: 2 },
      freeShipping: true,
    };

    clearAllErrors();
    Object.keys(sample).forEach((key) => {
      form.setFieldValue(key, sample[key]);
    });
    toast.success("Sample product data populated!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Stepper Navigation */}
      <StepperHeader
        steps={STEPPER_STEPS}
        activeStepIndex={activeStepIndex}
        maxVisitedStepIndex={maxVisitedStepIndex}
        onStepClick={handleStepClick}
      />

      {/* Active Step Content Card */}
      <div className="bg-base-100 border border-base-300 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[480px]">
        {activeStepIndex === 0 && <Step1BasicInfo form={form} />}
        {activeStepIndex === 1 && <Step2Media form={form} />}
        {activeStepIndex === 2 && <Step3PricingStock form={form} />}
        {activeStepIndex === 3 && <Step4VitalInfo form={form} />}
        {activeStepIndex === 4 && <Step5Description form={form} />}
        {activeStepIndex === 5 && <Step6Shipping form={form} />}

        {/* Stepper Footer Controls */}
        <StepperFooter
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrev={handlePrev}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={mutation.isPending}
          lastSavedTime={lastSavedTime}
          onClearDraft={handleClearDraft}
          submitText={isEditMode ? "Update Product" : "Publish Product"}
          submittingText={isEditMode ? "Updating Product..." : "Publishing..."}
          isEditMode={isEditMode}
        />
      </div>

      {/* Live Form State Inspector Drawer */}
      <FormDebugDrawer
        form={form}
        activeStep={currentStep.id}
        onFillDummyData={handleFillDummyData}
      />
    </div>
  );
}

export default function ProductStepperContainer({
  initialData = null,
  productId = null,
  isEditMode = false,
}) {
  return (
    <StepperValidationProvider>
      <ProductStepperInner
        initialData={initialData}
        productId={productId}
        isEditMode={isEditMode}
      />
    </StepperValidationProvider>
  );
}
