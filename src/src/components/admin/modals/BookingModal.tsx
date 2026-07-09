"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { AlertCircle, Lock, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/services/bookings/bookingApi"

// ==========================================
// Constants
// ==========================================

const MIN_TRAVELERS = 1
const MAX_TRAVELERS = 20
const OTP_LENGTH = 4
const RESEND_COOLDOWN_SECONDS = 30
const MIN_CUSTOMER_AGE = 5 // sanity check, adjust to your business rule

// ==========================================
// Helpers
// ==========================================

const digitsOnly = (value: string) => value.replace(/\D/g, "")

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof (error.data as Record<string, unknown>).message === "string"
  ) {
    return (error.data as { message: string }).message
  }
  return fallback
}

// ==========================================
// Validation Schemas & Types
// ==========================================

const customerFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name looks too long"),
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => digitsOnly(val).length === 10, {
      message: "Phone number must contain exactly 10 digits",
    }),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !Number.isNaN(new Date(val).getTime()), "Enter a valid date")
    .refine((val) => new Date(val) <= startOfToday(), "Date of birth can't be in the future")
    .refine((val) => {
      const age =
        (startOfToday().getTime() - new Date(val).getTime()) /
        (1000 * 60 * 60 * 24 * 365.25)
      return age >= MIN_CUSTOMER_AGE
    }, `You must be at least ${MIN_CUSTOMER_AGE} years old`),
  totalPersons: z
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Enter a whole number")
    .min(MIN_TRAVELERS, `At least ${MIN_TRAVELERS} person required`)
    .max(MAX_TRAVELERS, `Maximum ${MAX_TRAVELERS} persons allowed`),
  travelDate: z
    .string()
    .min(1, "Travel date is required")
    .refine((val) => !Number.isNaN(new Date(val).getTime()), "Enter a valid date")
    .refine((val) => new Date(val) >= startOfToday(), "Travel date can't be in the past"),
})

const otpFormSchema = z.object({
  otp: z
    .string()
    .length(OTP_LENGTH, `OTP must be exactly ${OTP_LENGTH} digits`)
    .regex(/^\d+$/, "OTP must contain only numbers"),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>
type OtpFormValues = z.infer<typeof otpFormSchema>

// ==========================================
// Component Props
// ==========================================

interface BookingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  packageId: string
  destinationId: string
  basePricePerPerson: number
}

interface FormFieldProps {
  label: string
  id: string
  error?: string
  children: React.ReactNode
  required?: boolean
  hint?: string
}

// ==========================================
// Reusable Form Field Component
// ==========================================

const FormField = ({
  label,
  id,
  error,
  children,
  required = true,
  hint,
}: FormFieldProps) => {
  const errorId = `${id}-error`

  return (
    <div className="space-y-2 w-full">
      <Label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-slate-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {children}

      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}

      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-500 pt-1"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// ==========================================
// Price Summary Card (shared by both steps)
// ==========================================

interface PriceSummaryProps {
  basePricePerPerson: number
  totalPersons: number
  compact?: boolean
}

const formatINR = (amount: number) =>
  `₹ ${Math.max(0, Math.round(amount)).toLocaleString("en-IN")}`

const PriceSummary = ({
  basePricePerPerson,
  totalPersons,
  compact,
}: PriceSummaryProps) => {
  const total = basePricePerPerson * totalPersons

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
      {!compact && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 font-medium">Price per traveler</span>
          <span className="font-medium text-black">
            {formatINR(basePricePerPerson)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">
          {compact ? "Travelers" : "Total travelers"}
        </span>
        <span className="font-semibold text-black">{totalPersons}</span>
      </div>

      <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
        <span className="text-base font-medium text-black">
          {compact ? "Final Amount" : "Total Amount"}
        </span>
        <span className="text-3xl font-medium text-black">{formatINR(total)}</span>
      </div>
    </div>
  )
}

// ==========================================
// Main Booking Modal Component
// ==========================================

export function BookingModal({
  isOpen,
  onOpenChange,
  packageId,
  destinationId,
  basePricePerPerson,
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(2)
  const [customerDetails, setCustomerDetails] = useState<CustomerFormValues | null>(
    null,
  )
  const [resendCooldown, setResendCooldown] = useState(0)

  const otpInputRef = useRef<HTMLInputElement | null>(null)

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation()
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation()

  const isBusy = isSendingOtp || isVerifyingOtp

  // React Hook Form Instances
  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      email: "",
      dob: "",
      totalPersons: 1,
      travelDate: "",
    },
    mode: "onChange",
  })

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  })

  // Dynamic Price Calculations
  const watchedTotalPersons = customerForm.watch("totalPersons")
  const validTotalPersons = useMemo(() => {
    const n = Number(watchedTotalPersons)
    return Number.isNaN(n) || !n ? 1 : n
  }, [watchedTotalPersons])

  // Resend cooldown ticker
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Autofocus the OTP field when we land on step 2
  useEffect(() => {
    if (step === 2) {
      const id = setTimeout(() => otpInputRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
  }, [step])

  const buildSendOtpPayload = (values: CustomerFormValues) => ({
    email: values.email,
    phoneNumber: digitsOnly(values.phoneNumber),
    customerName: values.customerName,
    dob: values.dob,
  })

  const handleSendOtpSubmit = useCallback(
    async (values: CustomerFormValues) => {
      const cleanedPayload: CustomerFormValues = {
        ...values,
        phoneNumber: digitsOnly(values.phoneNumber),
      }

      try {
        const response = await sendOtp(buildSendOtpPayload(values)).unwrap()

        if (response.success) {
          setCustomerDetails(cleanedPayload)
          setStep(2)
          setResendCooldown(RESEND_COOLDOWN_SECONDS)
          otpForm.reset()
          toast.success(response.message || "OTP sent successfully!")
        } else {
          toast.error(response.message || "Failed to send OTP. Please try again.")
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to send OTP. Please try again."))
      }
    },
    [sendOtp, otpForm],
  )

  const handleResendOtp = useCallback(async () => {
    if (!customerDetails || resendCooldown > 0) return

    try {
      const response = await sendOtp(buildSendOtpPayload(customerDetails)).unwrap()

      if (response.success) {
        setResendCooldown(RESEND_COOLDOWN_SECONDS)
        otpForm.reset()
        toast.success(response.message || "OTP resent successfully!")
      } else {
        toast.error(response.message || "Failed to resend OTP.")
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to resend OTP."))
    }
  }, [customerDetails, resendCooldown, sendOtp, otpForm])

  const handleVerifyOtpSubmit = useCallback(
    async (values: OtpFormValues) => {
      if (!customerDetails) return

      try {
        const response = await verifyOtp({
          email: customerDetails.email,
          otp: values.otp,
          packageId,
          destinationId,
          totalPersons: customerDetails.totalPersons,
          travelDate: new Date(customerDetails.travelDate).toISOString(),
          totalPrice: basePricePerPerson * customerDetails.totalPersons,
        }).unwrap()

        if (response.success) {
          toast.success(response.message || "Booking confirmed successfully!")
          handleModalClose()
        } else {
          toast.error(response.message || "Invalid or expired OTP.")
          otpForm.setValue("otp", "")
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Invalid or expired OTP."))
        otpForm.setValue("otp", "")
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [customerDetails, verifyOtp, packageId, destinationId, basePricePerPerson],
  )

  const handleModalClose = useCallback(() => {
    if (isBusy) return
    onOpenChange(false)
    setStep(1)
    setCustomerDetails(null)
    setResendCooldown(0)
    customerForm.reset()
    otpForm.reset()
  }, [isBusy, onOpenChange, customerForm, otpForm])

  const handleBackToDetails = () => {
    setStep(1)
    setResendCooldown(0)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openStatus) => {
        if (!openStatus) handleModalClose()
      }}
    >
      <DialogContent className="w-full max-w-2xl rounded-2xl p-0 overflow-hidden border border-slate-200 shadow-2xl bg-white">
        {/* Header */}
        <div className="border-b border-slate-200 px-7 py-4 bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-black">
              {step === 1 ? "Book Your Trip" : "Verify OTP"}
            </DialogTitle>
            {step === 2 && <Lock className="w-5 h-5 text-black" aria-hidden="true" />}
          </div>

          <div
            className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3"
            role="progressbar"
            aria-valuenow={step === 1 ? 50 : 100}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full bg-black transition-all duration-500 ${
                step === 1 ? "w-1/2" : "w-full"
              }`}
            />
          </div>

          <DialogDescription className="text-sm text-slate-500 mt-2">
            {step === 1
              ? "Fill in your travel details to continue with booking."
              : `We've sent a secure OTP to ${customerDetails?.email}`}
          </DialogDescription>
        </div>

        {/* Content Section */}
        <div className="px-7 py-2 overflow-y-auto max-h-[70vh] bg-white">
          {/* STEP 1: Customer Details */}
          {step === 1 && (
            <form
              id="customer-form"
              onSubmit={customerForm.handleSubmit(handleSendOtpSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    Personal Information
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your personal details carefully.
                  </p>
                </div>

                <FormField
                  label="Full Name"
                  id="customerName"
                  error={customerForm.formState.errors.customerName?.message}
                >
                  <Input
                    id="customerName"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    aria-invalid={!!customerForm.formState.errors.customerName}
                    aria-describedby="customerName-error"
                    className="h-12 rounded-xl border-slate-300 text-black placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                    {...customerForm.register("customerName")}
                  />
                </FormField>

                <FormField
                  label="Email Address"
                  id="email"
                  error={customerForm.formState.errors.email?.message}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    autoComplete="email"
                    aria-invalid={!!customerForm.formState.errors.email}
                    aria-describedby="email-error"
                    className="h-12 rounded-xl border-slate-300 text-black placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                    {...customerForm.register("email")}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Phone Number"
                    id="phoneNumber"
                    error={customerForm.formState.errors.phoneNumber?.message}
                  >
                    <Input
                      id="phoneNumber"
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter phone number"
                      autoComplete="tel"
                      maxLength={10}
                      aria-invalid={!!customerForm.formState.errors.phoneNumber}
                      aria-describedby="phoneNumber-error"
                      className="h-12 rounded-xl border-slate-300 text-black placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                      {...customerForm.register("phoneNumber", {
                        onChange: (e) => {
                          e.target.value = digitsOnly(e.target.value).slice(0, 10)
                        },
                      })}
                    />
                  </FormField>

                  <FormField
                    label="Date of Birth"
                    id="dob"
                    error={customerForm.formState.errors.dob?.message}
                  >
                    <Input
                      id="dob"
                      type="date"
                      max={startOfToday().toISOString().split("T")[0]}
                      aria-invalid={!!customerForm.formState.errors.dob}
                      aria-describedby="dob-error"
                      className="h-12 rounded-xl border-slate-300 text-black focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                      {...customerForm.register("dob")}
                    />
                  </FormField>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    Travel Information
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Select your travel preferences.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Total Travelers"
                    id="totalPersons"
                    error={customerForm.formState.errors.totalPersons?.message}
                    hint={`${MIN_TRAVELERS}-${MAX_TRAVELERS} people`}
                  >
                    <Input
                      id="totalPersons"
                      type="number"
                      min={MIN_TRAVELERS}
                      max={MAX_TRAVELERS}
                      aria-invalid={!!customerForm.formState.errors.totalPersons}
                      aria-describedby="totalPersons-error"
                      className="h-12 rounded-xl border-slate-300 text-black focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                      {...customerForm.register("totalPersons", { valueAsNumber: true })}
                    />
                  </FormField>

                  <FormField
                    label="Travel Date"
                    id="travelDate"
                    error={customerForm.formState.errors.travelDate?.message}
                  >
                    <Input
                      id="travelDate"
                      type="date"
                      min={startOfToday().toISOString().split("T")[0]}
                      aria-invalid={!!customerForm.formState.errors.travelDate}
                      aria-describedby="travelDate-error"
                      className="h-12 rounded-xl border-slate-300 text-black focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                      {...customerForm.register("travelDate")}
                    />
                  </FormField>
                </div>
              </div>

              <PriceSummary
                basePricePerPerson={basePricePerPerson}
                totalPersons={validTotalPersons}
              />

              <Button
                type="submit"
                form="customer-form"
                disabled={isSendingOtp || !customerForm.formState.isValid}
                className="w-full h-12 rounded-xl bg-black hover:bg-slate-900 text-white font-medium text-sm"
              >
                {isSendingOtp ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </div>
                ) : (
                  "Continue & Verify OTP"
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <form
              id="otp-form"
              onSubmit={otpForm.handleSubmit(handleVerifyOtpSubmit)}
              className="space-y-3"
              noValidate
            >
              <FormField
                label="Enter OTP"
                id="otp"
                error={otpForm.formState.errors.otp?.message}
              >
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="OTP"
                  maxLength={OTP_LENGTH}
                  autoComplete="one-time-code"
                  aria-invalid={!!otpForm.formState.errors.otp}
                  aria-describedby="otp-error"
                  className="h-14 text-xl text-center  rounded-xl border-slate-300 text-black  focus-visible:ring-black/10 focus-visible:border-black font-italic"
                  {...otpForm.register("otp", {
                    onChange: (e) => {
                      e.target.value = digitsOnly(e.target.value).slice(0, OTP_LENGTH)
                    },
                  })}
                  ref={(el) => {
                    otpForm.register("otp").ref(el)
                    otpInputRef.current = el
                  }}
                />
              </FormField>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Didn't receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isSendingOtp}
                  className="inline-flex items-center gap-1.5 font-meduim text-black disabled:text-slate-400 disabled:cursor-not-allowed hover:underline"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>

              <PriceSummary
                basePricePerPerson={basePricePerPerson}
                totalPersons={customerDetails?.totalPersons || 1}
                compact
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToDetails}
                  disabled={isVerifyingOtp}
                  className="flex-1 h-12 rounded-xl border-slate-300 text-black"
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  form="otp-form"
                  disabled={isVerifyingOtp || !otpForm.formState.isValid}
                  className="flex-1 h-12 rounded-xl bg-black hover:bg-slate-900 text-white"
                >
                  {isVerifyingOtp ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}