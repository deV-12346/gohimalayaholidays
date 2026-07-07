"use client"

import { motion } from "framer-motion"
import { Loader2, ArrowRight } from "lucide-react"
import PackageCard from "../packages/PackageCard"
import PackageCardSkeleton from "../layouts/packageSkeleton"
import { useGetPackagesQuery } from "@/services/packages/packageApi"
import Link from "next/link"

export default function TrendingPackages() {
  const {
    data: packages,
    isLoading,
    isFetching,
    isError
  } = useGetPackagesQuery(undefined, {
    selectFromResult: ({
      data,
      isLoading,
      isFetching,
      isError
    }) => ({
      data: data?.packages ? data.packages.slice(0, 3) : [],
      isLoading,
      isFetching,
      isError
    })
  })

  if (isError) {
    return (
      <div className="w-full text-center px-4  py-10 font-semibold text-rose-600 bg-white border border-slate-100 rounded-2xl max-w-7xl mx-auto my-6">
        Error loading packages. Please refresh the page.
      </div>
    )
  }

  return (
    <section className="bg-white w-full flex flex-col items-center px-4  py-2">
      <div className="w-full max-w-7xl">
        
        {/* Heading & Top CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-50 pb-6"
        >
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center">
                Trending Packages
              </h2>
              {isFetching && !isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              )}
            </div>
            <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-medium text-center">
               Explore our best travel packages filled with adventure, comfort, breathtaking views, and memorable journeys.
            </p>
          </div>
          
          {/* Desktop/Tablet View All Button */}
          <Link 
            href="/packages"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600 shadow-sm hover:shadow transition-all duration-300"
          >
            View All Packages
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Responsive Grid Center Layout */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full">
            {[1, 2, 3, 4].map((item) => (
              <PackageCardSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full">
            {packages?.map((item) => (
              <PackageCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* Mobile View Only Bottom Button */}
        <div className="w-full flex justify-center mt-8 sm:hidden">
          <Link 
            href="/packages"
            className="w-full max-w-[24rem] text-center inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200  py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-100 transition shadow-sm"
          >
            View All Packages
            <ArrowRight className="w-4 h-4 text-slate-600" />
          </Link>
        </div>

      </div>
    </section>
  )
}