"use client"
import { Package, useGetPackagesQuery } from '@/services/packages/packageApi'
import PackageCard from './PackageCard'
import { motion } from "framer-motion";
const Packages = () => {
    const {data:packages,isLoading} = useGetPackagesQuery(undefined,{
      selectFromResult: ({ data,isLoading })=>({
        data: data?.packages,
        isLoading
      })
    })
    console.log("data.....",packages)
  return (
    <div className="w-full bg-white  px-6 py-24 min-h-screen flex justify-start
    items-center flex-col">
     <div className="mx-auto max-w-7xl">
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
      {
        isLoading && (
          <h1>Please wait</h1>
        )
      }
      {
        packages && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
          {packages?.map((item) => (
            <PackageCard key={item._id} item={item} />
          ))}
          </div>
        )
      }
    </div>
  )
}

export default Packages