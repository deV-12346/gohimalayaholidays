import z from "zod"

export const customerSchema = z.object({
  customerName: z
    .string()
    .min(3, "Customer name is required")
    .trim(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits"),
  email: z
    .string()
    .email("Invalid email address")
    .trim(),
  dob: z
    .string()
    .min(1, "Date of birth is required"),

})