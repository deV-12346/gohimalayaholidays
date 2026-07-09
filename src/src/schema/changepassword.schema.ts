import z from "zod"
export const changePassword = z.object({
    newPassword:
    z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password Must contain at least one uppercase letter (A-Z)")
    .regex(/[a-z]/, "Password Must contain at least one lowercase letter (a-z)")
    .regex(/[0-9]/, "Password Must contain at least one number (0-9)")
    .regex(/[^A-Za-z0-9]/, "Password Must contain at least one special character (!@#$%)"),
    confirmPassword:
    z.string()
    .min(8, "Confirm Password must be matched with New Password")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})