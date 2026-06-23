"use client";
import Navbar from "@/components/Navbar";
import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import { Destination } from "@/services/destinations/destinationApi";
import Image from "next/image";
import { motion } from "framer-motion";

const DestinationsPage = () => {
  const { data, isLoading, isError } = useGetDestinationsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading destinations.</div>;
  }

  const destinations: Destination[] = data?.destinations || [];

  return (
    <div>
      <Navbar transparent={false} />
      <main className="min-h-screen bg-white text-gray-900">
        <section className="bg-white  px-6 py-6 md:py-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold">All Destinations</h2>
              <p className="mt-2 text-gray-600">
                Explore all the beautiful places of Himachal Pradesh
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
                      <h3 className="text-3xl font-bold">{place.title}</h3>
                      <p className="mt-2 text-sm text-gray-200">
                        {place.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DestinationsPage;