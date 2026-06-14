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
