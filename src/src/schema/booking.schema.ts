import z from "zod"
export const bookingSchema = z.object({
  packageId: z.string().min(1, "Package id is required"),
  destinationId: z.string().min(1, "Destination id is required"),
  totalPersons: z.coerce.number().min(1, "Minimum 1 person required"), 
  travelDate: z.string().min(1, "Travel date is required"),
  totalPrice: z.coerce.number().min(1, "Invalid total price"),      
  email: z.string().email("Invalid email address").trim(),
  otp: z.string().length(4, "OTP must be of 4 digits")
});