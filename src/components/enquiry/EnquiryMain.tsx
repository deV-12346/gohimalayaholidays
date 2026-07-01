import CreateEnquiry from '@/components/enquiry/createEnquiry'

const EnquiryMain = () => {
  return (
    <div className='w-full bg-slate-50/50  px-6  min-h-screen'>
      <div className='bg-black py-4 md:py-6 px-4 text-center'>
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
      <div className='px-4 py-8 md:py-6 flex justify-center'>
        <div className='w-full max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6'>
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