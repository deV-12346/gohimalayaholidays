import CreateEnquiry from '@/components/enquiry/createEnquiry'

const EnquiryMain = () => {
  return (
    <div className='w-full bg-slate-50/50  px-4  min-h-screen py-4 md:py-6 '>
      <div className='bg-black  text-center py-2'>
        <p className='text-orange-400 text-[10px] md:text-xs tracking-widest uppercase mb-2'>
          Plan Your Journey
        </p>
        <h1 className='text-2xl md:text-4xl font-bold text-white mb-2'>
          Create Your Enquiry
        </h1>
        <p className='text-gray-400 text-sm max-w-md mx-auto'>
          Tell us your dream destination — we'll craft the perfect Himalayan adventure.
        </p>
      </div>

      {/* Form Section */}
      <div className=' flex justify-center pt-4'>
        <div className='w-full max-w-2xl bg-white rounded border border-gray-100 shadow-sm p-4 md:p-6'>
          <h2 className='text-base md:text-xl font-semibold text-gray-900 mb-1'>
            Fill Enquiry Form
          </h2>

          <p className='text-xs text-gray-400 mb-4'>
            We'll respond within 2–4 hours.
          </p>

          <CreateEnquiry />
        </div>
      </div>
    </div>
  )
}

export default EnquiryMain