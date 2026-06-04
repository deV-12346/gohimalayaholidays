import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
  message: z.string().min(1, "Message is required"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;