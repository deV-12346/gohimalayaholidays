"use client";

import { motion } from "framer-motion";
import { Loader2, PackageX } from 'lucide-react';
import { useGetRelatedPackagesQuery } from '@/services/packages/packageApi';
import PackageCard2 from './PackageCard2';
import Link from 'next/link';

interface RelatedPackageInterface {
  destinationId: string;
  packageId: string;
}

// Framer Motion Variants for Staggered Animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
}as const

const RelatedPackage = ({ destinationId, packageId }: RelatedPackageInterface) => {
  const { relatedPackages, isFetching, isLoading } = useGetRelatedPackagesQuery(
    { destinationId, packageId },
    {
      selectFromResult: ({ data, isFetching, isLoading }) => ({
        isFetching,
        isLoading,
        relatedPackages: data?.packages,
      }),
    }
  );

  const showLoading = isFetching || isLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-12">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-col items-center justify-center gap-2 text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Related Packages
        </h2>
        <div className="h-1 w-16 rounded-full bg-indigo-600" />
      </motion.div>

      {/* Grid Content Container */}
      <div className="w-full">
        {showLoading ? (
          <div className="flex justify-center items-center h-48 w-full">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          </div>
        ) : relatedPackages?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-3 text-center py-12 px-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 w-full"
          >
            <PackageX className="h-12 w-12 text-gray-400" />
            <p className="text-base font-medium text-gray-600">
              No related packages found
            </p>
            <Link href={"/"} className='cursor-pointer bg-gray-700 text-white hover:bg-gray-600 rounded font-normal px-2 py-1 sm:py-2'>
             Back to home
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center items-stretch w-full"
          >
            {relatedPackages?.map((pck: any) => (
              <motion.div key={pck._id} variants={cardVariants} className="w-full h-full flex">
                <PackageCard2 pck={pck} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RelatedPackage;