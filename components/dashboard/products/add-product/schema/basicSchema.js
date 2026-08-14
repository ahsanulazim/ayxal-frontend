import z from "zod";

export const basicInfoSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    brand: z.string().nullable().optional(),
    noBrand: z.boolean().optional(),
    hasVariations: z.boolean(),
    attributes: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const { noBrand, brand, hasVariations, attributes } = data;

    // Brand validation
    if (!noBrand && !brand) {
      ctx.addIssue({
        code: "custom",
        path: ["brand"],
        message: "Brand is required",
      });
    }

    // Variation validation
    if (hasVariations && (!attributes || attributes.length === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["attributes"],
        message: "Please select at least one attribute",
      });
    }
  });
