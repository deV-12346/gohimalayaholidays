"use client"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import PackageCard from "../packages/PackageCard"
import PackageCardSkeleton from "../packageSkeleton"
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
      data: data?.packages.slice(0, 4) || [],
      isLoading,
      isFetching,
      isError
    })
  })

  if (isError) {
    return <div>Error loading packages.</div>
  }
  return (
    <section className="bg-white px-6 py-10">
      <div className="mx-auto max-w-7xl ">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold">
                Trending Packages
              </h2>
              {isFetching && !isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              )}
            </div>
            <p className="mt-2 text-gray-600">
              Explore our best Himachal travel packages
            </p>
          </div>
          <Link href="packages"
            className="
              hidden md:block
              rounded-full
              bg-indigo-600
              px-6 py-3
              font-medium text-white
              hover:bg-indigo-500
              transition
            "
          >
            View All
          </Link>
        </motion.div>
        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1,2,3,4].map((item) => (
              <PackageCardSkeleton key={item} />
            ))}
          </div>
        ) : (
         <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {packages?.map((item) => (
              <PackageCard key={item._id}  item={item}/>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}