"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { EnquiryInput, enquirySchema } from "@/schema/enquiey.schema"
import { useCreateEnquiryMutation } from "@/services/enquiries/enquiriesApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FormField from "../admin/common/FormField"
import { Button } from "../ui/button"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
}

const EnquiryModal = ({ open, onClose }: Props) => {
  const [createEnquiry, { isLoading }] = useCreateEnquiryMutation()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      message: ""
    }
  })

  const handleCreateEnquiry = async (data: EnquiryInput) => {
    try {
      const res = await createEnquiry(data).unwrap()
      if (res.success) {
        toast.success(res.message)
        reset()
        onClose()
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Added item centering alignment tweaks for small heights
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            // Added max-h-[90vh], overflow-y-auto, and responsive width checks
            className="relative w-[calc(100%-1rem)] sm:w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-2xl"
          >
            {/* Close Button - Adjusted top positioning for layout integrity */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header Content */}
            <div className="pr-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-left sm:text-center">
                Plan Your Himachal Trip
              </h2>
              <p className="mt-2 text-sm sm:text-base text-left sm:text-center text-gray-600">
                Fill this form and get the best travel package deals.
              </p>
            </div>

            {/* Form Container */}
            <form
              onSubmit={handleSubmit(handleCreateEnquiry)}
              className="mt-5 sm:mt-6 space-y-4"
            >
              <FormField
                label="Your Name"
                name="name"
                placeholder="Enter your name"
                required
                register={register}
                error={errors.name}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  register={register}
                  error={errors.email}
                />

                <FormField
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  required
                  register={register}
                  error={errors.phoneNumber}
                />
              </div>

              {/* Reduced rows slightly to save valuable vertical screen real estate on mobile */}
              <FormField
                textarea={true}
                label="Message"
                name="message"
                placeholder="Write your message here..."
                required
                register={register}
                rows={3} 
                error={errors.message}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-auto py-3 text-base font-medium mt-2"
              >
                {isLoading ? "Please Wait..." : "Enquiry Now"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EnquiryModal