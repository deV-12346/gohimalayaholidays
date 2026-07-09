"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Compass, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Destination } from "@/services/destinations/destinationApi";

interface DestinationCardProps {
  item: Destination;
  priority?: boolean; // pass true only for above-the-fold cards (e.g. first 2-3 in a grid)
}

const MAX_VISIBLE_PLACES = 3;

const DestinationCard = ({ item, priority = false }: DestinationCardProps) => {
  const visiblePlaces = item?.popularPlaces?.slice(0, MAX_VISIBLE_PLACES) ?? [];
  const remainingPlacesCount = (item?.popularPlaces?.length ?? 0) - visiblePlaces.length;

  return (
    <Link
      href={`/packages?destination=${item._id}`}
      className="group w-full max-w-[21rem] sm:max-w-[23rem] flex focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-2xl"
    >
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        viewport={{ once: true, margin: "-40px" }}
        className="w-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100 flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full w-full relative"
          >
            {item?.image ? (
              <Image
                src={item.image}
                alt={item.title ? `View of ${item.title}` : "Destination photo"}
                fill
                sizes="(min-width: 1280px) 22rem, (min-width: 768px) 33vw, 100vw"
                className="object-cover"
                priority={priority}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-slate-400">
                No preview available
              </div>
            )}
          </motion.div>

          {/* Gradient for legibility */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* Location pill */}
          {item?.destinationLocation && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-xl border border-white/30 bg-white/90 
            px-3 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 stroke-[2.5] text-slate-600" />
              {item.destinationLocation}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-grow flex-col p-4">
          <h2 className="mb-1.5 line-clamp-1 text-xl font-semibold leading-tight text-slate-00 transition-colors  sm:text-2xl">
            {item?.title || "Untitled destination"}
          </h2>

          <p className="mb-4 line-clamp-3 text-sm font-medium leading-relaxed text-slate-500">
            {item?.description || "Details for this destination are coming soon."}
          </p>

          <div className="mt-auto space-y-4">
            {visiblePlaces.length > 0 && (
              <div className="space-y-1.5">
                <span className="flex items-center gap-1 text-[11px] font-medium  tracking-widest text-slate-700">
                  <Compass className="h-3 w-3 stroke-[2.5]" />
                  Must visit
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {visiblePlaces.map((place, idx) => (
                    <span
                      key={idx}
                      className="inline-block rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-700 shadow-sm"
                    >
                      {place.trim()}
                    </span>
                  ))}
                  {remainingPlacesCount > 0 && (
                    <span className="inline-block rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-400 shadow-sm">
                      +{remainingPlacesCount} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* CTA row — makes the click target's purpose explicit */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-900 transition-colors ">
                View packages
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-600 text-slate-400 
              transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-emerald-50 group-hover:text-emerald-900">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default DestinationCard;