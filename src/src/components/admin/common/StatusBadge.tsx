import { cn } from "@/lib/utils";

type Status = "Pending" | "Completed" | "Cancelled";

const statusStyles: Record<Status, string> = {
  Pending:
    "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Completed:
    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Cancelled:
    "bg-red-500/15 text-red-400 border border-red-500/30",
};

interface Props {
  status: Status;
  className?: string;
}

export default function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
