import z from "zod"

export const destinationSchema = z.object({
    title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long")
    .trim(),

    description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long")
    .trim(),
    image: z
    .instanceof(File, {
      message: "Image is required",
    })
    .refine(
      (file) => {
        const allowedTypes = [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/webp",
        ]
        return allowedTypes.includes(
          file.type
        )},
      {message:"Only png, jpg, jpeg, svg and webp images are allowed",}),
  destinationLocation: z
    .string()
    .min(2, "Location is required")
    .max(100, "Location too long")
    .trim(),
  popularPlaces: z
    .array(
    z.string()
    .min(2, "Popular place name too short")
    .trim())
    .min(1,"At least one popular place is required"),
})