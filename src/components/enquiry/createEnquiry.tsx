"use client"
import { EnquiryInput, enquirySchema } from '@/schema/enquiey.schema'
import { useCreateEnquiryMutation } from '@/services/enquiries/enquiriesApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import FormField from '../admin/common/FormField'
import { Button } from '../ui/button'
import { toast } from 'sonner'

const CreateEnquiry = () => {
    const [createEnquiry,{isLoading,isSuccess}] = useCreateEnquiryMutation()
    const {register,formState:{errors},handleSubmit,reset} = useForm<EnquiryInput>({
        resolver:zodResolver(enquirySchema),
        defaultValues:{
            name:"",
            phoneNumber:"",
            email:"",
            message:""
        }
    })

    const handleCreateEnquiry = async(data:EnquiryInput) =>{
      try {
        const res = await createEnquiry(data).unwrap()
        if(res.success){
          reset()
          toast.success(res.message)
        }
      }catch(error) {
        toast.error("Something went wrong")
      }
    }
  return (
    <div >
      <form onSubmit={handleSubmit(handleCreateEnquiry)} className="space-y-2 w-full">
        <FormField
        label="Your Name"
        name="name"
        placeholder="Enter your name"
        required
        register={register}
        error={errors.name}
        />
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
        placeholder="Enter your phone number"
        required
        register={register}
        error={errors.phoneNumber}
        />
        <FormField
        textarea={true}
        label="Message"
        name="message"
        placeholder="Write your messsage here ....."
        required
        register={register}
        rows={6}
        error={errors.message}
        />

        <Button type='submit' disabled={isLoading}  className="w-full h-auto py-2">
        {isLoading ? "Please Wait" : "Enquiry Now"}
        </Button>
      </form>
    </div>
  )
}

export default CreateEnquiry