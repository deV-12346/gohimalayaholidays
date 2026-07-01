"use client"

import Image from "next/image"
import { Clock, Users, MapPin, Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { Package } from "@/services/packages/packageApi"
import Link from "next/link"

const PackageCard = ({ item }: { item: Package }) => {
  return (
    <Link href={`/packages/${item._id}`} className="w-full max-w-[22rem] flex">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="w-full flex flex-col cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300"
      >
        {/* Top Image Section */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full relative"
          >
            {item?.packageImages?.[0]?.secure_url ? (
              <Image
                src={item.packageImages[0].secure_url}
                alt={item.title}
                fill
                sizes="(max-w-7xl) 25vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Image</div>
            )}
          </motion.div>
          
          {/* Elegant Price Floating Badge */}
          <div className="absolute top-3.5 right-3.5 bg-slate-900/90 text-white font-black px-3.5 py-1.5 rounded-xl text-sm tracking-wide backdrop-blur-md shadow-sm">
            ₹{item?.price?.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Content Body Area */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Subheader Title tag */}
          <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 mb-1">
            <MapPin className="w-3 h-3 stroke-[2.5]" /> Himachal Tour
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 line-clamp-1 mb-1.5 leading-tight">
            {item?.title}
          </h2>
          
          <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-4 leading-relaxed">
            {item?.description}
          </p>

          {/* Equal-Height Meta Push Container */}
          <div className="mt-auto space-y-4">
            {/* Quick Micro Context Info */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100/50">
              <div className="flex items-center gap-1.5 text-slate-600">
                <div className="flex gap-1 ">
                  <Sun size={15} className="text-emerald-600 stroke-[2.5]" />
                  <span>{item?.duration} Days</span>
                </div>
                <div className="flex gap-1" >
                <Moon size={15} className="text-emerald-600 stroke-[2.5]" />
                <span>{item?.duration -1 } Nights</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Users size={15} className="text-amber-500 stroke-[2.5]" />
                <span>{item?.slots} Slots Left</span>
              </div>
            </div>

            {/* Premium CTA Button Row */}
            <div className="w-full bg-slate-900 text-white font-black text-center py-3 rounded-xl transitionshadow-sm text-sm tracking-wide">
              View Details
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default PackageCard