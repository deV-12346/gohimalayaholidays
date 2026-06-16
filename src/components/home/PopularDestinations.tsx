"use client"
import Image from "next/image"
import { motion } from "framer-motion";
import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import { Destination } from "@/services/destinations/destinationApi";
import DestinationCard from "@/components/DestinationCard";

export default function PopularDestinations() {
  const { data, isLoading, isError } = useGetDestinationsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading destinations.</div>;
  }

  const destinations: Destination[] = data?.destinations.slice(0, 5) || [];
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

          {destinations.map((destination, index) => (
            <DestinationCard key={index} destination={destination} index={index} />
          ))}

          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 5 * 0.1,
            }}
            viewport={{ once: true }}
            className="group overflow-hidden rounded-3xl shadow-lg"
          >
            <a
              href="/destinations"
              className="relative flex h-[350px] items-center justify-center overflow-hidden bg-gray-100 text-gray-800 transition duration-300 hover:bg-gray-200"
            >
              <h3 className="text-xl font-bold">View All Destinations</h3>
            </a>
          </motion.div> */}


        </div>

      </div>

    </section>
  )
}