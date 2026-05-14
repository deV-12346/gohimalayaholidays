"use client"
import Image from "next/image"
import { motion } from "framer-motion"

const destinations = [
  {
    title: "Manali",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Shimla",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Kasol",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Dharamshala",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Spiti Valley",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Kullu",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2070&auto=format&fit=crop",
  },
]

export default function PopularDestinations() {
  return (
    <section className="bg-white px-6 py-12">

      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <h2 className="text-4xl font-bold">
            Popular Destinations
          </h2>

          <p className="mt-4 text-gray-600">
            Explore the most beautiful places of Himachal Pradesh
          </p>

        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {destinations.map((place, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-3xl shadow-lg"
            >

              <div className="relative h-[350px] overflow-hidden">

                <Image
                  src={place.image}
                  alt={place.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 text-white">

                  <h3 className="text-3xl font-bold">
                    {place.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-200">
                    Discover scenic beauty & adventure
                  </p>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  )
}