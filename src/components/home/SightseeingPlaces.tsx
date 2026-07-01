"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

const sightseeingPlaces = [
  {
    title: "Shimla",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Manali",
    image:
      "https://images.unsplash.com/photo-1622308644420-b20142dc993c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Kasol",
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Dharamshala",
    image:
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Spiti Valley",
    image:
      "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Kinnaur",
    image:
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Malana",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Dalhousie",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Bir Billing",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Khajjiar",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
  },
]

export default function TopSightseeings() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <p className="text-lg font-semibold text-orange-500">
            Explore Himachal
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-5xl">
            Top Most Sightseeings
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-600 sm:text-base">
            Discover breathtaking mountains, valleys, and hidden gems
            across Himachal Pradesh.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mt-6">
          {/* Prev Button */}
          <button className="custom-prev absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-xl lg:flex">
            <ChevronLeft className="text-gray-800" />
          </button>

          {/* Next Button */}
          <button className="custom-next absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-xl lg:flex">
            <ChevronRight className="text-gray-800" />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop={true}
            spaceBetween={20}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              480: {
                slidesPerView: 1.3,
              },
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
          >
            {sightseeingPlaces.map((place, index) => (
              <SwiperSlide key={index}>
                <div className="group relative h-[360px] overflow-hidden rounded-3xl">
                  
                  {/* Image */}
                  <Image
                    src={place.image}
                    alt={place.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:blur-[2px]"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/10 transition-all duration-500 group-hover:bg-black/50" />

                  {/* Title Only On Hover */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="translate-y-8 text-center text-3xl font-bold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {place.title}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}