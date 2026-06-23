"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import PackageCard from "../packages/PackageCard"
import { useGetPackagesQuery } from "@/services/packages/packageApi"

export default function TrendingPackages() {
  const {data:packages,isLoading} = useGetPackagesQuery(undefined,{
        selectFromResult: ({ data,isLoading })=>({
          data: data?.packages.slice(0,4) || [],
          isLoading
        })
  })
  return (
    <section className="bg-white px-6 py-6">
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
            <h2 className="text-2xl font-bold">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
          {packages?.map((item) => (
           <PackageCard key={item._id} item={item} />
          ))}
          </div>
      </div>
    </section>
  )
}