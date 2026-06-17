import z from "zod";

export const variantValidator = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .nonempty("Name is required"),
  slug: z
    .string({
      required_error: "Slug is required",
      invalid_type_error: "Slug must be a string",
    })
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be alphanumeric and can contain hyphens",
    ),
  value: z.string({
    required_error: "Value is required",
    invalid_type_error: "Value must be a string",
  }),
});
