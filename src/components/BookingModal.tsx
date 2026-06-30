"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/services/bookings/bookingApi"
import { AlertCircle, Lock } from "lucide-react"

// ─────────────────────────────────────────────────────────────
// Validation Schemas
// ─────────────────────────────────────────────────────────────

const customerFormSchema = z.object({
  customerName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .trim(),

  phoneNumber: z
    .string()
    .trim()
    .refine((val) => val.replace(/\D/g, "").length === 10, {
      message: "Phone number must contain exactly 10 digits",
    }),

  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

  dob: z.string().min(1, "Date of birth is required"),

  totalPersons: z.coerce
    .number()
    .min(1, "At least 1 person required")
    .max(20, "Maximum 20 persons allowed"),

  travelDate: z.string().min(1, "Travel date is required"),
})

const otpFormSchema = z.object({
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only numbers"),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>
type OtpFormValues = z.infer<typeof otpFormSchema>

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

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
}

// ─────────────────────────────────────────────────────────────
// Reusable Field
// ─────────────────────────────────────────────────────────────

const FormField = ({
  label,
  id,
  error,
  children,
  required = true,
}: FormFieldProps) => (
  <div className="space-y-2 w-full">
    <Label
      htmlFor={id}
      className="text-xs font-semibold uppercase tracking-wide text-slate-700"
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>

    {children}

    {error && (
      <div className="flex items-center gap-1 text-xs text-red-500 pt-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    )}
  </div>
)

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function BookingModal({
  isOpen,
  onOpenChange,
  packageId,
  destinationId,
  basePricePerPerson,
}: BookingModalProps) {
  const [step, setStep] = useState(1)

  const [customerDetails, setCustomerDetails] =
    useState<CustomerFormValues | null>(null)

  const [sendOtp, { isLoading: isSendingOtp }] =
    useSendOtpMutation()

  const [verifyOtp, { isLoading: isVerifyingOtp }] =
    useVerifyOtpMutation()

  // ───────────────────────────────────────────────────────────

  const customerForm = useForm<
    z.input<typeof customerFormSchema>,
    any,
    CustomerFormValues
  >({
    resolver: zodResolver(customerFormSchema),

    defaultValues: {
      customerName: "",
      phoneNumber: "",
      email: "",
      dob: "",
      totalPersons: 1 as any,
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

  // ───────────────────────────────────────────────────────────

  const watchedTotalPersons =
    customerForm.watch("totalPersons")

  const validTotalPersons =
    Number.isNaN(Number(watchedTotalPersons)) ||
    !watchedTotalPersons
      ? 1
      : Number(watchedTotalPersons)

  const currentTotalPrice =
    basePricePerPerson * validTotalPersons

  // ───────────────────────────────────────────────────────────
  // Send OTP
  // ───────────────────────────────────────────────────────────

  const handleSendOtpSubmit = async (
    values: CustomerFormValues
  ) => {
    try {
      const cleanedPayload = {
        ...values,
        phoneNumber: values.phoneNumber.replace(/\D/g, ""),
      }

      const response = await sendOtp({
        email: cleanedPayload.email,
        phoneNumber: cleanedPayload.phoneNumber,
        customerName: cleanedPayload.customerName,
        dob: cleanedPayload.dob,
      }).unwrap()

      if (response.success) {
        setCustomerDetails(cleanedPayload)

        setStep(2)

        toast.success(
          response.message || "OTP sent successfully!"
        )
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Failed to send OTP. Please try again."
      )
    }
  }

  // ───────────────────────────────────────────────────────────
  // Verify OTP
  // ───────────────────────────────────────────────────────────

  const handleVerifyOtpSubmit = async (
    values: OtpFormValues
  ) => {
    if (!customerDetails) return

    try {
      const response = await verifyOtp({
        email: customerDetails.email,
        otp: values.otp,

        packageId,
        destinationId,

        totalPersons: customerDetails.totalPersons,

        travelDate: new Date(
          customerDetails.travelDate
        ).toISOString(),

        totalPrice:
          basePricePerPerson *
          customerDetails.totalPersons,
      }).unwrap()

      if (response.success) {
        toast.success(
          response.message ||
            "Booking confirmed successfully!"
        )

        handleModalClose()
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          "Invalid or expired OTP."
      )
    }
  }

  // ───────────────────────────────────────────────────────────

  const handleModalClose = () => {
    onOpenChange(false)

    setStep(1)

    setCustomerDetails(null)

    customerForm.reset()

    otpForm.reset()
  }

  // ───────────────────────────────────────────────────────────

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(openStatus) =>
        !openStatus && handleModalClose()
      }
    >
      <DialogContent className="w-full max-w-2xl rounded-2xl p-0 overflow-hidden border border-slate-200 shadow-2xl bg-white">

        {/* Header */}

        <div className="border-b border-slate-200 px-7 py-6 bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-black">
              {step === 1
                ? "Book Your Trip"
                : "Verify OTP"}
            </DialogTitle>

            {step === 2 && (
              <Lock className="w-5 h-5 text-black" />
            )}
          </div>

          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-5">
            <div
              className={`h-full bg-black transition-all duration-500 ${
                step === 1 ? "w-1/2" : "w-full"
              }`}
            />
          </div>

          <DialogDescription className="text-sm text-slate-500 mt-4">
            {step === 1
              ? "Fill in your travel details to continue with booking."
              : `We have sent a secure OTP to ${customerDetails?.email}`}
          </DialogDescription>
        </div>

        {/* Content */}

        <div className="px-7 py-6 overflow-y-auto max-h-[70vh] bg-white">

          {/* STEP 1 */}

          {step === 1 && (
            <form
              id="customer-form"
              onSubmit={customerForm.handleSubmit(
                handleSendOtpSubmit
              )}
              className="space-y-8"
            >
              {/* Personal Info */}

              <div className="space-y-5">
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
                  error={
                    customerForm.formState.errors
                      .customerName?.message
                  }
                >
                  <Input
                    id="customerName"
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-slate-300 text-black placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                    {...customerForm.register(
                      "customerName"
                    )}
                  />
                </FormField>

                <FormField
                  label="Email Address"
                  id="email"
                  error={
                    customerForm.formState.errors.email
                      ?.message
                  }
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="h-12 rounded-xl border-slate-300 text-black placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                    {...customerForm.register("email")}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Phone Number"
                    id="phoneNumber"
                    error={
                      customerForm.formState.errors
                        .phoneNumber?.message
                    }
                  >
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      className="h-12 rounded-xl border-slate-300 text-black placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                      {...customerForm.register(
                        "phoneNumber"
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Date of Birth"
                    id="dob"
                    error={
                      customerForm.formState.errors.dob
                        ?.message
                    }
                  >
                    <Input
                      id="dob"
                      type="date"
                      className="h-12 rounded-xl border-slate-300 text-black focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                      {...customerForm.register("dob")}
                    />
                  </FormField>
                </div>
              </div>

              {/* Travel Info */}

              <div className="space-y-5">
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
                    error={
                      customerForm.formState.errors
                        .totalPersons?.message
                    }
                  >
                    <Input
                      id="totalPersons"
                      type="number"
                      min="1"
                      max="20"
                      className="h-12 rounded-xl border-slate-300 text-black focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                      {...customerForm.register(
                        "totalPersons"
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Travel Date"
                    id="travelDate"
                    error={
                      customerForm.formState.errors
                        .travelDate?.message
                    }
                  >
                    <Input
                      id="travelDate"
                      type="date"
                      className="h-12 rounded-xl border-slate-300 text-black focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black"
                      {...customerForm.register(
                        "travelDate"
                      )}
                    />
                  </FormField>
                </div>
              </div>

              {/* Price Card */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Price per traveler
                  </span>

                  <span className="font-semibold text-black">
                    ₹
                    {basePricePerPerson.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Total travelers
                  </span>

                  <span className="font-semibold text-black">
                    {validTotalPersons}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-black">
                    Total Amount
                  </span>

                  <span className="text-3xl font-bold text-black">
                    ₹
                    {currentTotalPrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>

              {/* BUTTON LAST */}

              <Button
                type="submit"
                form="customer-form"
                disabled={
                  isSendingOtp ||
                  !customerForm.formState.isValid
                }
                className="w-full h-12 rounded-xl bg-black hover:bg-slate-900 text-white font-medium text-sm"
              >
                {isSendingOtp ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Continue & Verify OTP"
                )}
              </Button>
            </form>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <form
              id="otp-form"
              onSubmit={otpForm.handleSubmit(
                handleVerifyOtpSubmit
              )}
              className="space-y-7"
            >
              <FormField
                label="Enter OTP"
                id="otp"
                error={
                  otpForm.formState.errors.otp?.message
                }
              >
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="0 0 0 0"
                  maxLength={4}
                  className="h-14 text-2xl text-center tracking-[0.4em] rounded-xl border-slate-300 text-black focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:border-black font-bold"
                  {...otpForm.register("otp")}
                />
              </FormField>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Travelers
                  </span>

                  <span className="font-semibold text-black">
                    {customerDetails?.totalPersons}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Travel Date
                  </span>

                  <span className="font-semibold text-black">
                    {customerDetails?.travelDate}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <span className="font-semibold text-black">
                    Final Amount
                  </span>

                  <span className="text-2xl font-bold text-black">
                    ₹
                    {(
                      basePricePerPerson *
                      (customerDetails?.totalPersons ||
                        1)
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isVerifyingOtp}
                  className="flex-1 h-12 rounded-xl border-slate-300 text-black"
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  form="otp-form"
                  disabled={
                    isVerifyingOtp ||
                    !otpForm.formState.isValid
                  }
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

