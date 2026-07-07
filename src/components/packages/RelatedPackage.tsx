import React from 'react'
import { motion } from "framer-motion";
import { Loader2 } from 'lucide-react';
import { useGetRelatedPackagesQuery } from '@/services/packages/packageApi';
import PackageCard2 from './PackageCard2';

interface RelatedPackageInterface {
  destinationId: string;
  packageId: string
}

const RelatedPackage = ({ destinationId, packageId }: RelatedPackageInterface) => {
  const { relatedPackages, isFetching, isLoading } = useGetRelatedPackagesQuery({
    destinationId,
    packageId,
  }, {
    selectFromResult: ({ data, isFetching, isLoading }) => ({
      isFetching,
      isLoading,
      relatedPackages: data?.packages
    })
  })
  console.log("data", relatedPackages)
  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 my-4'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="flex justify-center items-center flex-col gap-3"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Related Packages
        </h2>
        <div className='px-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4  justify-items-center items-center  w-full'>
          {(isFetching || isLoading) && (
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          )}
          {
            relatedPackages?.map((pck) => (
              <PackageCard2 pck={pck} key={pck._id} />
            ))
          }
        </div>
      </motion.div>
    </div>
  )
}

export default RelatedPackage