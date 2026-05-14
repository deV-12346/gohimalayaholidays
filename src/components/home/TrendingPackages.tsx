"use client"
import Image from "next/image"
import { motion } from "framer-motion"

const tours = [
  {
    title: "Manali Adventure Trip",
    price: "₹12,999",
    days: "5 Days",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Shimla Kufri Tour",
    price: "₹9,999",
    days: "4 Days",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Kasol & Tosh Escape",
    price: "₹14,999",
    days: "6 Days",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
  },
]

export default function TrendingPackages() {

  return (

    <section className="bg-white px-6 py-24">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex items-center justify-between"
        >

          <div>

            <h2 className="text-4xl font-bold">
              Trending Packages
            </h2>

            <p className="mt-3 text-gray-600">
              Explore our best Himachal travel packages
            </p>

          </div>

          <button className="hidden md:block rounded-full bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500 transition">
            View All
          </button>

        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {tours.map((tour, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="overflow-hidden rounded-3xl bg-white shadow-lg"
            >

              {/* Image */}
              <div className="relative h-72 overflow-hidden">

                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover transition duration-700 hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute top-5 left-5 rounded-full bg-white px-4 py-1 text-sm font-semibold text-indigo-600">
                  {tour.days}
                </div>

              </div>

              {/* Content */}
              <div className="p-6">

                <div className="flex items-center justify-between">

                  <h3 className="text-2xl font-bold">
                    {tour.title}
                  </h3>

                  <span className="text-lg font-bold text-indigo-600">
                    {tour.price}
                  </span>

                </div>

                <p className="mt-4 text-gray-600">
                  Experience mountains, snowfall, valleys and adventure with premium stays.
                </p>
                <button className="mt-6 w-full rounded-full bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-500">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}