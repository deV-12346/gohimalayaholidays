import HeroSection from "@/components/home/HeroSection"
import PopularDestinations from "@/components/home/PopularDestinations"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import TrendingPackages from "@/components/home/TrendingPackages"
import Testimonials from "@/components/home/Testimonials"
import CTASection from "@/components/home/CTASection"
import Navbar from "@/components/Navbar"
import EnquiryPopupHandler from "@/components/home/EnquiryPopupHandler"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar transparent={true} />
      <HeroSection />
      <PopularDestinations />
      <WhyChooseUs />
      <TrendingPackages />
      <Testimonials />
      <CTASection />
      <EnquiryPopupHandler/>
    </main>
  )
}