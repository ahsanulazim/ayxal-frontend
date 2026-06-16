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
  }),
  step2: z.object({
    color: z.array(z.string()).optional(),
    size: z.array(z.string()).optional(),
    price: z.number().min(0, "Price must be a positive number"),
  }),
  step3: z.object({
    productImages: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
  step4: z.object({
    shippingAndReturns: z.string().optional(),
  }),
});
