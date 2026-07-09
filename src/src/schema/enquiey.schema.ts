import { z } from "zod";

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name should not exceed 30 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Name can only contain letters and spaces"
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .max(100, "Email is too long")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
      "Please enter a valid email address"
    ),

  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian phone number"
    ),

  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(500, "Message should not exceed 500 characters")
    .regex(
      /^(?!.*(.)\1{5,}).*$/,
      "Message contains too many repeated characters"
    ),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;