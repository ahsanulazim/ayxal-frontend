import z from "zod";

export const basicInformationSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Product title is required")
      .max(150, "Product title cannot exceed 150 characters"),

    categoryId: z.string().min(1, "Please select a category"),

    brandId: z.string(),

    noBrand: z.boolean(),

    type: z.enum(["simple", "variable"]),
  })
  .superRefine((data, ctx) => {
    if (!data.noBrand && !data.brandId) {
      ctx.addIssue({
        code: "custom",
        path: ["brandId"],
        message: "Please select a brand or choose 'No brand'",
      });
    }
  });
