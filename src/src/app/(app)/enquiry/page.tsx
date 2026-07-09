import CreateEnquiry from '@/components/enquiry/createEnquiry'
import EnquiryMain from '@/components/enquiry/EnquiryMain'
import Navbar from '@/components/layouts/Navbar'

const page = () => {
  
  return (
    <div>
      <Navbar transparent={false} />
      <EnquiryMain/>
    </div>
  )
}

export default page