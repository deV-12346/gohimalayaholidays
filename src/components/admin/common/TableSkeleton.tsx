import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  rows?: number;
  cols?: number;
}

export default function TableSkeleton({ rows = 6, cols = 5 }: Props) {
  return (
    <div className="space-y-3 p-4">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 rounded-lg bg-white/5" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1 rounded-xl bg-white/5" />
          ))}
        </div>
      ))}
    </div>
  );
}
