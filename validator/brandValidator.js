import z from "zod";

export const brandValidator = z.object({
  label: z
    .string()
    .min(1, "Brand name is required")
    .min(2, "Brand name must be at least 2 characters long"),
  value: z
    .string()
    .min(1, "Brand value is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Brand value must be alphanumeric and can contain hyphens",
    ),
  logo: z
    .instanceof(File, { message: "Logo is required" })
    .refine((file) => file.size <= 2000000, "File size must be less than 2MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Only JPG and PNG images are allowed",
    ),
});
