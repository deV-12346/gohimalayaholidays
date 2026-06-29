"use client";
import React from "react";
import { useGetPackageByIdQuery } from "@/services/packages/packageApi"; 
import PackageHero from "@/components/packages/PackageHero";
import PackageDetails from "@/components/packages/PackageDetails";
import { Loader2, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

const Page = ({ params }: PageProps) => {
  // Unwrapping params for Next.js 15+ compatibility
  const resolvedParams = React.use(Promise.resolve(params));
  const packageId = resolvedParams.id;

  const { data, isLoading, error } = useGetPackageByIdQuery({ packageId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-600 font-medium">Loading your next adventure...</p>
      </div>
    );
  }

  if (error || !data?.success || !data.packages) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <Compass className="h-16 w-16 text-slate-400 mb-4 stroke-[1.5]" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Package Not Found</h2>
        <p className="text-slate-600 text-center max-w-md">
          We couldn't retrieve the details for this trip. It might have expired or been removed.
        </p>
      </div>
    );
  }

  const tourPackage = data.packages;

  return (
    <div className="min-h-screen pt-18 md:pt-20  pb-5">
      <Navbar transparent={true} />
      <PackageHero tour={tourPackage} />
      <PackageDetails tour={tourPackage} />
    </div>
  );
};

export default Page;