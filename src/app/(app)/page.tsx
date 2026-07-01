import HeroSection from "@/components/home/HeroSection"
import PopularDestinations from "@/components/home/PopularDestinations"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import TrendingPackages from "@/components/home/TrendingPackages"
import Testimonials from "@/components/home/Testimonials"
import CTASection from "@/components/home/CTASection"
import Navbar from "@/components/layouts/Navbar"
import EnquiryPopupHandler from "@/components/home/EnquiryPopupHandler"
import TopSightseeings from "@/components/home/SightseeingPlaces"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar transparent={true} />
      <HeroSection />
      <PopularDestinations />
      <WhyChooseUs />
      <TrendingPackages />
      <Testimonials />
      <TopSightseeings/>
      <CTASection />
      <EnquiryPopupHandler/>
    </main>
  )
}