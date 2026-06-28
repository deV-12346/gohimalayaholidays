"use client"

export default function DestinationCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Image */}
      <div className="h-72 w-full animate-pulse bg-gray-200" />

      <div className="space-y-4 p-5">

        {/* Title */}
        <div className="h-7 w-2/3 rounded bg-gray-200 animate-pulse" />

        {/* Subtitle */}
        <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />

        {/* Description */}
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-gray-200 animate-pulse" />
        </div>

      </div>
    </div>
  )
}