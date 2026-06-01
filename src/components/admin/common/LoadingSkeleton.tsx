"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full bg-white/5" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <Skeleton className="h-6 w-32 bg-white/10" />
      <Skeleton className="mt-4 h-10 w-24 bg-white/10" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-10 w-full bg-white/5" />
        </div>
      ))}
    </div>
  );
}
