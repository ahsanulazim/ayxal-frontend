import z from "zod";

export const categoryValidator = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be alphanumeric and can contain hyphens",
    ),
  thumbnail: z
    .instanceof(File, { message: "Please select an image file" })
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      "File must be less than 2MB",
    )
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      "Invalid file type. Only JPEG and PNG are allowed.",
    )
    .optional(),
});

export const categoryUpdateValidator = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters long")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be alphanumeric and can contain hyphens",
    )
    .optional(),
});
