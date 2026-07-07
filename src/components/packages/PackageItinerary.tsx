"use client";
import React, { useState } from "react";
import { Package } from "@/services/packages/packageApi";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";

interface PackageItineraryProps {
  tour: Package;
}

const PackageItinerary: React.FC<PackageItineraryProps> = ({ tour }) => {
  const itinerary = tour.itinerary || [];

  // Day 1 open by default, rest closed
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));

  const toggleDay = (index: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 my-4 ">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Day-wise Itinerary Accordion */}
        <div className="lg:col-span-8 bg-white p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-5">
            Days Description
          </h3>

          {itinerary.length === 0 ? (
            <p className="text-slate-500 text-base font-medium">
              Itinerary details will be shared soon.
            </p>
          ) : (
            <div className="divide-y divide-slate-300">
              {itinerary.map((day, index) => {
                const isOpen = openDays.has(index);

                return (
                  <div key={index} className="py-4 first:pt-0 last:pb-0 ">
                    <button
                      onClick={() => toggleDay(index)}
                      className="w-full flex items-center gap-4 text-left group"
                      aria-expanded={isOpen}
                    >
                      {/* Diamond day badge */}
                      <div className="relative flex-shrink-0 w-11 h-11 cursor-pointer">
                        <div className="absolute inset-0 rotate-45 rounded-md bg-slate-900 group-hover:bg-gray-700 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      {/* Title + location */}
                      <div className="flex-1 min-w-0 cursor-pointer">
                        <span className="block text-base sm:text-lg font-semibold text-slate-900">
                          Day {day.day}
                        </span>
                      </div>

                      {/* Chevron toggle */}
                      <span className="flex-shrink-0 text-slate-500 group-hover:text-gray-600 transition-colors">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </span>
                    </button>

                    {/* Expandable description */}
                    {isOpen && (
                      <div className="mt-3 text-center  pr-2">
                        <p className="text-slate-600 text-base font-medium leading-relaxed whitespace-pre-line">
                          {day.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageItinerary;