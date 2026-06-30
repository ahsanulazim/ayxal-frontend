import z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional().nullable(),
  productImages: z
    .array(z.any())
    .min(1, "Product Images is required")
    .transform((value) => value.map((item) => item.file)),

  productDescription: z.string().min(1, "Description is required"),
  productType: z.enum(["single", "variable"]),

  singleProduct: z
    .object({
      sku: z.string().optional().nullable(),
      stock: z.number().optional().nullable(),
      price: z.number().min(1, "Price is required"),
      discount: z.number().optional().nullable(),
    })
    .optional(),

  attributes: z.record(z.array(z.string())).transform((val) =>
    Object.entries(val).map(([name, values]) => ({
      name,
      values,
    })),
  ),
  variants: z
    .array(
      z.object({
        name: z.string(),
        price: z.number().min(1, "Price is required"),
        discount: z.number().optional().nullable(),
        stock: z.number().optional().nullable(),
        sku: z.string().optional().nullable(),
        image: z.any().optional(),
      }),
    )
    .transform((val) => Object.values(val)),
});
