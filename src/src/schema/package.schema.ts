import z from "zod";

const packageBaseFields = {
  destinationId: z
    .string()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Please select a Destination",
    }),

  title: z
    .string()
    .min(1, "Title is required")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .trim(),

  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be greater than 0",
    }),

  slots: z
    .string()
    .min(1, "Slots is required")
    .refine((val) => Number.isInteger(Number(val)) && Number(val) >= 0, {
      message: "Slots must be a non-negative integer",
    }),

  duration: z
    .string()
    .min(1, "Duration is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Duration must be greater than 0",
    }),

  includedService: z.array(
    z.string().min(1, "Service name cannot be empty")
  ),

  excludedService: z.array(
    z.string().min(1, "Service name cannot be empty")
  ),

  placesCovered: z
    .array(
      z
        .string()
        .min(5, "Mininum 5 places required it must in an order")
        .max(50, "Enter a valid Name")
    )
    .max(20, "Covered Places limit exceeded"),

  itinerary: z
    .array(
      z.object({
        day: z.number().min(1, "Day must be greater than 0"),
        description: z
          .string()
          .min(10, "Day Description should atleast 10 character")
          .max(1000, "Day Description not more than 100 characters"),
      })
    )
    .min(1, "At least one itinerary day is required"),
};

// CREATE: at least 1 image required (new File objects)
export const packageSchema = z.object({
  ...packageBaseFields,
  packageImages: z
    .array(z.instanceof(File))
    .min(1, "At least one package image is required")
    .max(10, "Images should not be more than 10"),
});

// EDIT: packageImages only ever holds newly-added files (existing images
// are tracked separately in component state), so 0 is valid here.
// The "must have at least one image overall" check happens manually
// in onSubmit using existingImages.length + newFiles.length.
export const editPackageSchema = z.object({
  ...packageBaseFields,
  packageImages: z
    .array(z.instanceof(File))
    .max(10, "Images should not be more than 10"),
});

export type PackageType = z.infer<typeof packageSchema>;