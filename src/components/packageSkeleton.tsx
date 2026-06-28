"use client"

export default function PackageCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      
      {/* Image Skeleton */}
      <div className="h-56 w-full animate-pulse bg-gray-200" />

      <div className="space-y-4 p-4">

        {/* Title */}
        <div className="h-6 w-3/4 rounded bg-gray-200 animate-pulse" />

        {/* Location */}
        <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />

          <div className="h-10 w-28 rounded-full bg-gray-200 animate-pulse" />
        </div>

      </div>
    </div>
  )
}