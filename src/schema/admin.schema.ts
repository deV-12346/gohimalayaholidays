import z from "zod"
export const adminSchema = z.object({
    adminName:
    z.string()
    .min(4,"Admin Name must be of 4 characters")
    .max(10,"Admin Name should not be greather than 10 characters"),
    email: z.string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
      "Enter a valid email"
    ),
    phoneNumber:
    z.string("Mobile Number is required")
    .regex(/^[0-9]{10}$/, "Mobile number must be of  10 digits"),
    password:
    z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password Must contain at least one uppercase letter (A-Z)")
    .regex(/[a-z]/, "Password Must contain at least one lowercase letter (a-z)")
    .regex(/[0-9]/, "Password Must contain at least one number (0-9)")
    .regex(/[^A-Za-z0-9]/, "Password Must contain at least one special character (!@#$%)")
    .min(12,"Password should not be at least 8 characters")
})