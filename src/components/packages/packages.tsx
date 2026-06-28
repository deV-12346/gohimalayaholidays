"use client"
import { Package, useGetPackagesQuery } from '@/services/packages/packageApi'
import PackageCard from './PackageCard'
import { motion } from "framer-motion";
import PackageCardSkeleton from '../packageSkeleton';
const Packages = () => {
    const {data:packages,isLoading,isFetching} = useGetPackagesQuery(undefined,{
      selectFromResult: ({ data,isLoading,isFetching })=>({
        data: data?.packages,
        isLoading,
        isFetching
      })
    })
  return (
    <div className="w-full bg-white  px-6 py-24 min-h-screen flex justify-start
    items-center flex-col">
     <div className="mx-auto w-full max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold">All Packages</h2>
        <p className="mt-2 text-gray-600">
          Explore all the beautiful Packages of Himachal Pradesh
        </p>
      </motion.div>
      </div>
       {isLoading || isFetching ? (
        <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-6">
          {[1,2,3,4,5,6,7,8].map((item) => (
            <PackageCardSkeleton key={item} />
          ))}
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-6">
          {packages?.map((item) => (
            <PackageCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Packages