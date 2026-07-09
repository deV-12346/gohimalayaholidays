"use client"
import { Package, packageApi } from '@/services/packages/packageApi'
import { IndianRupee, MapPin } from 'lucide-react'
import React from 'react'
import { motion } from "framer-motion"
import Image from 'next/image'

const PackageCard2 = ({ pck }: { pck: Package }) => {
  return (
    <div className="rounded-md overflow-hidden bg-white w-full">
      <div className="h-56 w-full overflow-hidden bg-slate-100 flex-shrink-0 relative">
        <motion.div
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4 }}
          className="h-full w-full relative"
        >
          {pck?.packageImages?.[0]?.secure_url && (
            <Image
              src={pck.packageImages[0].secure_url}
              alt={pck.title}
              fill
              sizes="(max-w-7xl) 25vw, 100vw"
              className="object-cover"
            />
          )}
        </motion.div>
      </div>

      {/* now outside the image container */}
      <div className='flex flex-col px-4 py-3'>
        <h1 className='text-lg md:text-xl font-bold text-slate-900'>
          {pck?.title}
        </h1>
        <div className='flex justify-between items-center mt-1'>
          <h1 className="flex items-center gap-1 text-slate-600 text-sm">
            <MapPin size={16} />
            <span>{pck?.destinationId?.destinationLocation}</span>
          </h1>
          <h1 className="flex items-center gap-1 text-amber-800 font-semibold">
            <IndianRupee size={16} />
            <span>{pck?.price}</span>
          </h1>
        </div>
      </div>
    </div>
  )
}
export default PackageCard2