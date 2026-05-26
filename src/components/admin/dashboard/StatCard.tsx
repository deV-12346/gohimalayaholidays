import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "cyan" | "purple" | "emerald" | "amber";
}

const colorMap = {
  cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
  purple: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20",
  emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
  amber: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
};

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  color = "cyan" 
}: StatCardProps) {
  return (
    <div className={cn(
      "relative group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm overflow-hidden",
      "hover:border-zinc-700/50 transition-all duration-300"
    )}>
      {/* Background Glow */}
      <div className={cn(
        "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30 bg-gradient-to-br",
        color === "cyan" ? "from-cyan-500" : 
        color === "purple" ? "from-purple-500" :
        color === "emerald" ? "from-emerald-500" : "from-amber-500"
      )} />

      <div className="flex items-center justify-between relative z-10">
        <div className={cn(
          "p-3 rounded-xl border bg-gradient-to-br",
          colorMap[color]
        )}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trendUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            {trendUp ? "+" : "-"}{trend}
          </div>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
