"use client";

import { useGetDestinationsQuery } from "@/services/destinations/destinationApi";
import { Destination } from "@/services/destinations/destinationApi";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import DestinationCardSkeleton from "../layouts/DestinationSkeleton";
import DestinationCard from "./DestinationCard";

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
    <main className="w-full bg-slate-50/50  px-6 py-4 min-h-screen flex justify-start
    items-center flex-col">
    <div className="mx-auto w-full max-w-7xl">
      <div className="mx-auto w-full max-w-7xl mb-5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              All Destinations
            </h2>
            {isFetching && !isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            )}
          <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-xl mx-auto">
            Explore all the beautiful places of Himachal Pradesh
          </p>
        </motion.div>
        </div>
        {/* Skeleton Loading */}
        {isLoading ? (
          <div className="w-full mt-4 grid-cols-1 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1,2,3,4].map((item) => (
              <DestinationCardSkeleton key={item} />
            ))}
          </div>
        ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full max-w-7xl mx-auto">
        {destinations?.map((item) => (
        <DestinationCard key={item._id} item={item} />
        ))}
       </div>
    )}
    </div>
    </main>
  );
};

export default DestinationsPage;