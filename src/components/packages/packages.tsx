"use client"

import { Package, useGetPackagesQuery } from '@/services/packages/packageApi'
import PackageCard from './PackageCard'
import { motion } from "framer-motion"
import PackageCardSkeleton from '../layouts/packageSkeleton'

const Packages = () => {
  const { data: packages, isLoading, isFetching } = useGetPackagesQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      data: data?.packages,
      isLoading,
      isFetching
    })
  })

  return (
    <div className="w-full bg-slate-50/50 px-6 py-4 min-h-screen flex flex-col 
    items-center">
      <div className="mx-auto w-full max-w-7xl mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            All Packages
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-xl mx-auto">
            Explore all the beautiful Packages of Himachal Pradesh
          </p>
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        {isLoading || isFetching ? (
          /* Grid auto-centering items on small devices */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full">
            {[1, 2, 3,4].map((item) => (
              <PackageCardSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center items-stretch w-full">
            {packages?.map((item) => (
              <PackageCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Packages