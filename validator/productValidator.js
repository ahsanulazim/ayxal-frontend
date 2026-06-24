import z from "zod";

export const productValidator = z.object({
  step1: z.object({
    productName: z
      .string()
      .min(1, "Product is required")
      .min(3, "Minimum 3 Characters are required"),
    category: z
      .string()
      .min(1, "Category is required")
      .min(3, "Minimum 3 Characters are required"),
    brand: z.string().nullable().optional(),
    hasVariations: z.boolean().optional(),
    attributes: z.array(z.string()).optional(),
  }),
  step2: z.object({
    color: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    size: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    price: z.number().min(0, "Price must be a positive number").optional(),
    discount: z
      .number()
      .min(0, "Discount must be a positive number")
      .optional(),
    stock: z.number().min(0, "Stock must be a positive number").optional(),
    sku: z.string().optional(),
    variantMatrix: z
      .array(
        z.object({
          sku: z.string().min(1, "SKU is required"),
          stock: z.number().min(0, "Stock must be 0 or more"),
          price: z.number().min(1, "Price is required"),
          discount: z.number().min(0, "Discount cannot be negative").optional(),
          combinations: z.record(z.string()).optional(),
        }),
      )
      .optional(),
  }),
  step3: z.object({
    productImages: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
  step4: z.object({
    shippingAndReturns: z.string().optional(),
  }),
});
