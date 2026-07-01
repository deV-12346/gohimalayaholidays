"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Rahul Sharma",
    location: "Delhi, India",
    review:
      "Amazing experience with Go Himalaya Holidays. The hotels, cab service, and sightseeing were perfectly managed.",
  },
  {
    name: "Priya Verma",
    location: "Chandigarh, India",
    review:
      "Our Manali trip was unforgettable. Everything was smooth and the mountain views were breathtaking.",
  },
  {
    name: "Aman Thakur",
    location: "Mumbai, India",
    review:
      "Best travel agency for Himachal tours. Very professional team and affordable packages.",
  },
]

export default function Testimonials() {

  return (

    <section className="bg-gray-50 px-6 py-8">

      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >

          <h2 className="text-4xl font-bold">
            What Our Travelers Say
          </h2>

          <p className="mt-2 text-gray-600">
            Real experiences from our happy travelers
          </p>

        </motion.div>

        {/* Cards */}
        <div className="mt-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {testimonials.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="rounded-3xl bg-white p-8 shadow-lg"
            >

              {/* Stars */}
              <div className="flex gap-1 text-yellow-400 text-xl">
                ⭐ ⭐ ⭐ ⭐ ⭐
              </div>

              {/* Review */}
              <p className="mt-6 text-gray-600 leading-7">
                “{item.review}”
              </p>

              {/* User */}
              <div className="mt-8 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                  {item.name.charAt(0)}
                </div>

                <div>

                  <h4 className="font-semibold text-lg">
                    {item.name}
                  </h4>

                  <p className="text-sm text-gray-500">
                    {item.location}
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