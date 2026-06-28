"use client";

import Navbar from "@/components/Navbar";
import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import { Destination } from "@/services/destinations/destinationApi";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import DestinationCardSkeleton from "../DestinationSkeleton";

const DestinationsPage = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError
  } = useGetDestinationsQuery();
  if (isError) {
    return <div>Error loading destinations.</div>;
  }
  const destinations: Destination[] = data?.destinations || [];
  return (
    <main className="w-full bg-white  px-6 py-24 min-h-screen flex justify-start
    items-center flex-col">
    <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-4xl font-bold">
              All Destinations
            </h2>
            {isFetching && !isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            )}
          </div>
          <p className="mt-2 text-gray-600">
            Explore all the beautiful places of Himachal Pradesh
          </p>
        </motion.div>
        {/* Skeleton Loading */}
        {isLoading ? (
          <div className="w-full mt-14 grid-cols-1 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3,4,5,6].map((item) => (
              <DestinationCardSkeleton key={item} />
            ))}
          </div>
        ) : (
        <div className="w-full t-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
            {place.description}
            </p>
            </div>
            </div>
        </motion.div>
        ))}
        </div>
    )}
    </div>
    </main>
  );
};

export default DestinationsPage;