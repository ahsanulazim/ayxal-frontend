import z from "zod";

export const attributeSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  slug: z
    .string()
    .min(1, "Slug is Required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  attributeType: z.string().min(1, "Attribute Type is Required"),
});
