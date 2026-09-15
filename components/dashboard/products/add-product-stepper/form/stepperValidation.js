import { z } from "zod";

// Step 1: Basic Info
export const step1BasicSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    category: z
      .union([
        z.string().trim().min(1, "Category is required"),
        z.array(z.string()).min(1, "Category is required"),
      ]),
    brand: z.string().nullable().optional(),
    noBrand: z.boolean().optional(),
    hasVariations: z.boolean().optional(),
    attributes: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.noBrand && (!data.brand || data.brand.trim() === "")) {
      ctx.addIssue({
        code: "custom",
        path: ["brand"],
        message: "Brand is required unless 'No Brand' is checked",
      });
    }

    if (data.hasVariations && (!data.attributes || data.attributes.length === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["attributes"],
        message: "Please select at least one variation attribute",
      });
    }
  });

// Step 2: Media
export const step2MediaSchema = z
  .object({
    thumbnail: z.any().refine(
      (val) => {
        if (!val) return false;
        if (typeof val === "string" && val.trim().length > 0) return true;
        if (typeof val === "object" && val.url) return true;
        return false;
      },
      { message: "Product primary thumbnail is required" }
    ),
    images: z.array(z.any()).optional(),
  });

// Step 3: Pricing & Stock
export const step3PricingSchema = z
  .object({
    hasVariations: z.boolean().optional(),
    basePrice: z.coerce.number().optional(),
    baseStock: z.coerce.number().optional(),
    baseDiscount: z.coerce.number().optional(),
    variations: z
      .array(
        z.object({
          stock: z.coerce.number().min(0, "Stock cannot be negative"),
          price: z.coerce.number().min(0.01, "Price must be greater than 0"),
          discount: z.coerce.number().min(0).optional(),
        }).passthrough()
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasVariations) {
      if (!data.basePrice || Number(data.basePrice) <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["basePrice"],
          message: "Base price is required and must be greater than 0",
        });
      }
      if (data.baseStock === undefined || Number(data.baseStock) < 0) {
        ctx.addIssue({
          code: "custom",
          path: ["baseStock"],
          message: "Base stock must be 0 or higher",
        });
      }
    } else {
      if (!data.variations || data.variations.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["variations"],
          message: "Please generate at least one product variation",
        });
      } else {
        data.variations.forEach((variant, index) => {
          if (!variant.price || Number(variant.price) <= 0) {
            ctx.addIssue({
              code: "custom",
              path: ["variations", index, "price"],
              message: "Variation price must be greater than 0",
            });
          }
        });
      }
    }
  });

// Step 4: Specifications (Vital Info)
export const step4VitalInfoSchema = z.object({
  vitalInformations: z
    .array(
      z.object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
    )
    .optional(),
});

// Step 5: Description
export const step5DescriptionSchema = z.object({
  tags: z.array(z.string()).optional(),
  description: z.any().optional(),
});

// Step 6: Shipping
export const step6ShippingSchema = z.object({
  weight: z.coerce.number().min(0.01, "Package weight must be greater than 0 kg"),
  dimensions: z
    .object({
      length: z.coerce.number().min(0).optional(),
      width: z.coerce.number().min(0).optional(),
      height: z.coerce.number().min(0).optional(),
    })
    .optional(),
  freeShipping: z.boolean().optional(),
});

export const stepSchemas = {
  basic: step1BasicSchema,
  media: step2MediaSchema,
  pricing: step3PricingSchema,
  vital: step4VitalInfoSchema,
  description: step5DescriptionSchema,
  shipping: step6ShippingSchema,
};

// Validate an individual step given the form data
export const validateStep = (stepId, formData) => {
  const schema = stepSchemas[stepId];
  if (!schema) return { isValid: true, errors: {} };

  const result = schema.safeParse(formData);
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const fieldErrors = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    fieldErrors[path] = issue.message;
  });

  return { isValid: false, errors: fieldErrors };
};
