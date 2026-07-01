"use client";
import Image from "next/image";
import { MapPin, Compass, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Destination } from "@/services/destinations/destinationApi";

interface DestinationCardProps {
  item: Destination;
}

const DestinationCard = ({ item }: DestinationCardProps) => {
  return (
    <div className="w-full max-w-[22rem] flex">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="w-full flex flex-col  bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 transition-all duration-300 group"
      >
        {/* Top Image Banner Section */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full relative"
          >
            {item?.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-w-7xl) 25vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Preview</div>
            )}
          </motion.div>

          {/* Floating Location Pill Badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1 shadow-sm border border-white/20">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
            {item?.destinationLocation}
          </div>
        </div>

        {/* Content Body Area */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Destination Title */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 line-clamp-1 mb-1.5 leading-tight group-hover:text-emerald-600 transition-colors">
            {item?.title}
          </h2>
          
          {/* Dynamic Auto-height Description Spacer */}
          <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-4 leading-relaxed">
            {item?.description}
          </p>

          {/* Equal-Height Action Push Container */}
          <div className="mt-auto space-y-4">
            
            {/* Popular Places Badges Segment */}
            {item?.popularPlaces && item.popularPlaces.length > 0 && (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Compass className="w-3 h-3 stroke-[2.5]" /> Must Visit
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.popularPlaces.map((place, idx) => (
                    <span 
                      key={idx} 
                      className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-100 text-slate-700 shadow-sm"
                    >
                      {place.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Premium CTA Row */}
            {/* <div className="w-full bg-slate-900 text-white font-black text-center py-3 rounded-xl transition-all duration-300 group-hover:bg-emerald-600 shadow-sm text-sm tracking-wide flex items-center justify-center gap-1.5">
              Explore Circuit 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div> */}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default DestinationCard;
