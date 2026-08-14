import z from "zod";

export const vitalInfoSchema = z.object({
  vitalInformations: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .nullable()
    .optional(),
}).passthrough();

export const pricingSchema = z
  .object({
    hasVariations: z.boolean().optional(),
    basePrice: z.coerce.number().min(1, "Price cannot be 0").optional(),
    baseDiscount: z.coerce.number().min(0).optional(),
    baseStock: z.coerce.number().min(0, "Stock must be at least 0").optional(),
    variations: z
      .array(
        z.object({
          stock: z.coerce.number().min(0, "Stock must be at least 0"),
          price: z.coerce.number().min(1, "Price cannot be 0"),
          discount: z.coerce.number().min(0).optional(),
        }).passthrough(),
      )
      .optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    if (!data.hasVariations) {
      if (!data.basePrice || data.basePrice < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["basePrice"],
          message: "Price is required and must be at least 1",
        });
      }
    }
  });
export const imagesSchema = z
  .object({
    hasVariations: z.boolean().optional(),
    thumbnail: z.any().optional().nullable(),
    variations: z
      .array(
        z
          .object({
            thumbnail: z.any().optional().nullable(),
            images: z.array(z.any()).optional(),
          })
          .passthrough(),
      )
      .optional(),
  })
  .passthrough()
  .superRefine((data, ctx) => {
    const mainThumbnailValid =
      data.thumbnail &&
      ((typeof data.thumbnail === "string" &&
        data.thumbnail.trim().length > 0) ||
        (typeof data.thumbnail === "object" && data.thumbnail.url));
    if (!mainThumbnailValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["thumbnail"],
        message: "Please upload Image",
      });
    }

    if (data.hasVariations && Array.isArray(data.variations)) {
      data.variations.forEach((val, idx) => {
        const varThumbnailValid =
          val.thumbnail &&
          ((typeof val.thumbnail === "string" &&
            val.thumbnail.trim().length > 0) ||
            (typeof val.thumbnail === "object" && val.thumbnail.url));
        if (!varThumbnailValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["variations", idx, "thumbnail"],
            message: "Please upload Image",
          });
        }
      });
    }
  });
export const descriptionSchema = z.object({}).passthrough();
export const shippingSchema = z.object({
  weight: z.coerce.number().gt(0, "Weight must be greater than 0"),
  dimensions: z
    .object({
      length: z.coerce.number().optional(),
      width: z.coerce.number().optional(),
      height: z.coerce.number().optional(),
    })
    .optional(),
  freeShipping: z.boolean().optional(),
}).passthrough();
