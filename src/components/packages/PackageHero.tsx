import React, { useState } from "react";
import Image from "next/image";
import { Package } from "@/services/packages/packageApi";
import {
  Clock,
  Users,
  ArrowLeft,
  MapPin,
  Hotel,
  UtensilsCrossed,
  Car,
  Camera,
} from "lucide-react";
import Link from "next/link";

interface PackageHeroProps {
  tour: Package;
}

const PackageHero: React.FC<PackageHeroProps> = ({ tour }) => {
  const images = tour.packageImages || [];
  const [activeImage, setActiveImage] = useState(images[0]?.secure_url || "");

  return (
    <section className="relative bg-white border-b border-slate-100">
      {/* Upper Navigation/Breadcrumb Hook */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link
          href="/packages"
          className="inline-flex items-center text-sm font-bold text-black hover:text-emerald-600 transition-colors gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Explorations
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Visual Galleries */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-md group">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={tour.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-base text-slate-400">
                  No preview available
                </div>
              )}
            </div>

            {/* Thumbnail Selection Array */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={img.secure_url + idx}
                    onClick={() => setActiveImage(img.secure_url)}
                    className={`relative w-24 h-14 rounded-xl overflow-hidden flex-shrink-0 snap-start border-2 transition-all ${
                      activeImage === img.secure_url
                        ? "border-emerald-600 ring-4 ring-emerald-600/10 shadow-md"
                        : "border-slate-200 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.secure_url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title block and core info cards */}
          <div className="lg:col-span-5 flex flex-col justify-center lg:pl-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 tracking-wider uppercase shadow-sm">
                Premium Getaway
              </span>

              <span className="inline-flex items-center text-sm text-slate-600 font-semibold gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Himalaya Holidays
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3 leading-tight">
              {tour.title}
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-5 font-medium line-clamp-5">
              {tour.description}
            </p>

            {/* Quick Context Chips */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {/* Duration Card */}
              <div className="relative group/card flex items-center gap-3.5 p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-emerald-100 transition-all duration-300 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-md">
                {/* Decorative Top Accent Line */}
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-transparent group-hover/card:bg-emerald-500 rounded-full transition-all duration-300" />

                <div className="flex-shrink-0 p-2.5 rounded-xl bg-emerald-50 text-emerald-600 ring-4 ring-emerald-50/50 transition-colors group-hover/card:bg-emerald-600 group-hover/card:text-white">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-extrabold uppercase tracking-widest text-black mb-0.5">
                    Duration
                  </span>

                  <span className="block text-lg font-black text-slate-800 leading-none">
                    {tour.duration}{" "}
                    <span className="text-xs font-bold text-slate-500 tracking-normal">
                      Days
                    </span>
                  </span>
                </div>

                {/* Middle Elegant Visual Border */}
                <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-slate-100 group-hover/card:bg-transparent transition-colors" />
              </div>

              <div className="relative group/card flex items-center gap-3.5 p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-amber-100 transition-all duration-300 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-md">
                {/* Decorative Top Accent Line */}
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-transparent group-hover/card:bg-amber-500 rounded-full transition-all duration-300" />

                <div
                  className={`flex-shrink-0 p-2.5 rounded-xl ring-4 transition-colors ${
                    tour.slots > 0
                      ? "bg-amber-50 text-amber-600 ring-amber-50/50 group-hover/card:bg-amber-500 group-hover/card:text-white"
                      : "bg-rose-50 text-rose-600 ring-rose-50/50 group-hover/card:bg-rose-500 group-hover/card:text-white"
                  }`}
                >
                  <Users className="w-5 h-5 stroke-[2.5]" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-extrabold uppercase tracking-widest text-black mb-0.5">
                    Availability
                  </span>

                  <span
                    className={`block text-lg font-black leading-none ${
                      tour.slots > 0 ? "text-slate-800" : "text-rose-600"
                    }`}
                  >
                    {tour.slots > 0 ? (
                      <>
                        {tour.slots}{" "}
                        <span className="text-xs font-bold text-slate-500 tracking-normal">
                          Left
                        </span>
                      </>
                    ) : (
                      "Sold Out"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
              <div className="flex flex-col items-center text-center">
                <Hotel className="w-8 h-8 text-black mb-2 stroke-[2]" />
                <span className="text-sm font-medium text-slate-800">
                  Accomodation
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <UtensilsCrossed className="w-8 h-8 text-black mb-2 stroke-[2]" />
                <span className="text-sm font-medium text-slate-800">
                  Food
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <Car className="w-8 h-8 text-black mb-2 stroke-[2]" />
                <span className="text-sm font-medium text-slate-800">
                  Car Rental
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <Camera className="w-8 h-8 text-black mb-2 stroke-[2]" />
                <span className="text-sm font-medium text-slate-800">
                  Sightseeing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageHero;