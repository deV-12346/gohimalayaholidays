import z from "zod"
export const signinSchema = z.object({
    identifier:
    z.string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
      "Enter a valid email"
    ),
    password:
    z.string()
    .min(8, "Password must be at least 8 characters")
    .max(12,"Password should not be greater than 12 characters")
})