import { createHmac, randomInt, timingSafeEqual } from "crypto"

export const OTP_LENGTH = 6
export const OTP_TTL_MS = 10 * 60 * 1000
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000
export const OTP_MAX_ATTEMPTS = 5

/** Cryptographically secure 6-digit OTP. */
export const generateOtp = (): string =>
  String(randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH))

const otpSecret = () => {
  const secret = process.env.JWT_SECRET_KEY
  if (!secret) throw new Error("JWT_SECRET_KEY is not set")
  return secret
}

/** OTPs are stored hashed, never in plaintext. */
export const hashOtp = (email: string, otp: string): string =>
  createHmac("sha256", otpSecret()).update(`${email}:${otp}`).digest("hex")

export const verifyOtpHash = (
  email: string,
  otp: string,
  storedHash: string
): boolean => {
  const a = Buffer.from(hashOtp(email, otp))
  const b = Buffer.from(storedHash)
  return a.length === b.length && timingSafeEqual(a, b)
}
