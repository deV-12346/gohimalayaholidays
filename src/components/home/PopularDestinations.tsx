"use client"

import { motion } from "framer-motion";
import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import { Destination } from "@/services/destinations/destinationApi";
import { Loader2 } from "lucide-react";
import DestinationCardSkeleton from "../layouts/DestinationSkeleton";
import DestinationCard from "../destinations/DestinationCard";

export default function PopularDestinations() {

  const {
    data,
    isLoading,
    isFetching,
    isError
  } = useGetDestinationsQuery();
  if (isError) {
    return <div>Error loading destinations.</div>;
  }
  const destinations: Destination[] =
    data?.destinations.slice(0, 4) || [];
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4  py-2">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
           <div>
            <div className="flex items-center gap-3 flex flex-col items-center ">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center">
                Popular Destinations
              </h2>
              {isFetching && !isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              )}
            </div>
          </div>
          <p className="mt-4 text-gray-600">
          Explore handpicked destinations filled with natural beauty, adventure, culture, and unforgettable memories.
          </p>
        </motion.div>
        {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full">
            {[1,2,3,4].map((item) => (
              <DestinationCardSkeleton key={item} />
            ))}
        </div>
        ) : (
         <div className="mt-6  grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full">
        {destinations?.map((item) => (
        <DestinationCard key={item._id} item={item} />
        ))}
       </div>
        )}
      </div>
    </section>
  )
}