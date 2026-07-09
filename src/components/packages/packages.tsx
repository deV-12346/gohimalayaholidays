"use client"

import { Package, useGetPackagesQuery } from '@/services/packages/packageApi'
import PackageCard from './PackageCard'
import { motion } from "framer-motion"
import PackageCardSkeleton from '../layouts/packageSkeleton'
import { PackageX } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

interface PackagesProps {
  destinationId?: string
}

const Packages = ({ destinationId }: PackagesProps) => {
  const { data: packages, isLoading, isFetching } = useGetPackagesQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      data: data?.packages,
      isLoading,
      isFetching
    })
  })
  const filteredPackages = destinationId
    ? packages?.filter((pkg) => pkg?.destinationId?._id === destinationId)
    : packages
  return (
    <div className="w-full bg-slate-50/50 px-6 py-4 min-h-screen flex flex-col 
    items-center">
      <div className="mx-auto w-full max-w-7xl mb-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {destinationId ? "Packages For This Destination" : "All Packages"}
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-xl mx-auto">
             Explore our best travel packages filled with adventure, comfort, breathtaking views, and memorable journeys.
          </p>
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full">
            {[1, 2, 3, 4].map((item) => (
              <PackageCardSkeleton key={item} />
            ))}
          </div>
        ) : filteredPackages && filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full">
            {filteredPackages.map((item) => (
              <PackageCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
            <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-3 text-center py-12 px-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 w-full"
          >
            <PackageX className="h-12 w-12 text-gray-400" />
            <p className="text-base font-medium text-gray-600">
              No related packages found for this destination
            </p>
            <Link href={"/"} className='cursor-pointer bg-gray-700 text-white hover:bg-gray-600 rounded font-normal px-2 py-1 sm:py-2'>
             Back to home
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Packages