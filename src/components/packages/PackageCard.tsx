"use client"

import Image from "next/image"
import { Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Package } from "@/services/packages/packageApi"
import Link from "next/link"

const PackageCard = ({ item }: { item: Package }) => {

  return (
    <Link href={`/packages/${item._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="w-80 cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl"
      >
        <div className="relative h-64 w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <Image
              src={item?.packageImages?.[0]?.secure_url}
              alt={item?.title}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute top-4 right-4 bg-white/90 px-4 py-1 rounded-full text-sm font-semibold text-black backdrop-blur-sm">
            ₹ {item?.price}
          </div>
        </div>
        <div className="p-3">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {item?.title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-3 mb-2">
            {item?.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{item?.duration} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{item?.slots} Slots</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            View Details
          </motion.button>
        </div>
      </motion.div>
    </Link>
  )
}

export default PackageCard