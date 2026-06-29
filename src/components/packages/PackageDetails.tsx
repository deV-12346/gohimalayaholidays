import React from "react";
import { Package } from "@/services/packages/packageApi";
import { CheckCircle2, XCircle, ShieldCheck, HelpCircle } from "lucide-react";

interface PackageDetailsProps {
  tour: Package;
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ tour }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Hand: Inclusions / Exclusions Overview */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Detailed overview segment */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-black text-slate-900 mb-3">Journey Description</h3>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-line font-medium">
              {tour.description}
            </p>
          </div>

          {/* Core Services Offerings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* What's Included */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2.5">
               Included Services
              </h3>
              <ul className="space-y-3">
                {tour.includedService.map((service, index) => (
                  <li key={index} className="flex items-start gap-3 text-base font-semibold text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Excluded */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2.5">
              Excluded Services
              </h3>
              <ul className="space-y-3">
                {tour.excludedService.map((service, index) => (
                  <li key={index} className="flex items-start gap-3 text-base font-semibold text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Right Hand: Sticky Checkouts widget card */}
        <div className="lg:col-span-4 lg:sticky lg:top-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 overflow-hidden relative">
            
            <div className="mb-4">
              <span className="text-xs font-bold uppercase text-black">Total Investment</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-slate-900 tracking-tight">₹{tour.price.toLocaleString("en-IN")}</span>
                <span className="text-sm font-bold text-slate-500">/ traveler</span>
              </div>
            </div>

            <div className="space-y-2.5 mb-5 pt-3 border-t border-slate-300">
              <div className="flex justify-between text-sm font-semibold text-black">
                <span>Base Fare</span>
                <span className="text-slate-800">₹{(tour.price * 0.92).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-balck">
                <span>Taxes & Operator fees</span>
                <span className="text-emerald-600 font-bold">Included</span>
              </div>
            </div>

            <button 
              disabled={tour.slots === 0}
              className={`w-full py-4 px-4 rounded-xl font-black tracking-wide text-center text-base shadow-md transition-all ${
                tour.slots > 0 
                  ? "bg-black hover:bg-gray-6000 text-white font-normal shadow-emerald-600/20 hover:shadow-xl active:scale-[0.99]" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {tour.slots > 0 ? "Book Package Now" : "Sold Out"}
            </button>

            {/* Dynamic visual warning ticker for limited spaces */}
            {tour.slots > 0 && tour.slots <= 5 && (
              <p className="text-center text-sm text-amber-600 font-extrabold mt-3 animate-pulse">
              Hurry! Only {tour.slots} spots remaining!
              </p>
            )}

            {/* Reassurance items */}
            <div className="mt-5 pt-4 border-t border-slate-00 space-y-3">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-900">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>100% Secure Checkout Protection</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-900">
                <HelpCircle className="w-5 h-5 text-slate-900 " />
                <span>Need support? Contact Go Himalayas Holidays</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PackageDetails;