import z from "zod"
export const bookingSchema = z.object({
  packageId: z.string().min(1, "Package id is required"),
  // destinationId and totalPrice are still accepted from the current client but
  // are IGNORED by the server: it takes both from the package record itself.
  destinationId: z.string().optional(),
  totalPrice: z.coerce.number().optional(),
  totalPersons: z.coerce
    .number()
    .int("Travellers must be a whole number")
    .min(1, "Minimum 1 person required")
    .max(20, "Maximum 20 persons allowed"),
  travelDate: z
    .string()
    .min(1, "Travel date is required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid travel date"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits")
});
