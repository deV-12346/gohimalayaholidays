import AboutUs from '@/components/about-us/AboutUs'
import Navbar from '@/components/layouts/Navbar'

const page = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar transparent={false} />
      <AboutUs/>
    </div>
  )
}

export default page