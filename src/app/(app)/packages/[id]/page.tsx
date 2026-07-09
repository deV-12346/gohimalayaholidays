"use client";

import React, { use, useState } from "react";
import { Loader2, Compass } from "lucide-react";
import Navbar from "@/components/layouts/Navbar";
import PackageHero from "@/components/packages/PackageHero";
import PackageDetails from "@/components/packages/PackageDetails";
import PackageItinerary from "@/components/packages/PackageItinerary";
import { BookingModal } from "@/components/admin/modals/BookingModal";
import { useGetPackageByIdQuery } from "@/services/packages/packageApi";
import RelatedPackage from "@/components/packages/RelatedPackage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const packageId = resolvedParams.id;

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data, isLoading, error } = useGetPackageByIdQuery({
    packageId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600"/>
      </div>
    );
  }
  if (error || !data?.success || !data.packages) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="mb-2 text-2xl font-bold text-slate-800">
          Package Not Found
        </h2>
        <p className="max-w-md text-center text-slate-600">
          We couldn't retrieve the details for this trip.
        </p>
      </div>
    );
  }
  const tourPackage = data.packages;
  return (
    <div className="min-h-screen bg-white pt-18 pb-5 md:pt-20  flex justify-center items-center">
      <div className="max-w-7xl">
      <Navbar transparent />
      <PackageHero tour={tourPackage} />
      <PackageDetails
        tour={tourPackage}
        onBookNow={() => setIsBookingModalOpen(true)}
      />
      <PackageItinerary tour={tourPackage} />
      <BookingModal
        isOpen={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        packageId={tourPackage._id}
        destinationId={tourPackage?.destinationId?._id}
        basePricePerPerson={tourPackage.price}
      />
      <RelatedPackage   destinationId={data?.packages?.destinationId._id} packageId={data?.packages?._id}/>
      </div>
    </div>
  );
};

export default Page;