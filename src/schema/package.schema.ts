import z from "zod";

export const packageSchema = z.object({
  destinationId: z
    .string()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format for destinationId",
    }),

  title: z
    .string()
    .min(1, "Title is required")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .trim(),

  packageImages: z
    .array(
      (z.instanceof(File))
    )
    .min(1, "At least one package image is required")
    .max(10, "Images should not be more than 10"),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  slots: z.coerce
    .number()
    .int("Slots must be an integer")
    .nonnegative("Slots cannot be negative"),

  duration: z.coerce
    .number()
    .positive("Duration must be greater than 0"),

  includedService: z.array(
    z.string().min(1, "Service name cannot be empty")
  ),

  excludedService: z.array(
    z.string().min(1, "Service name cannot be empty")
  ),
});