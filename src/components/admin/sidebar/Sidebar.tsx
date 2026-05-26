"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  CalendarCheck, 
  MessageSquare, 
  LogOut,
  Mountain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: MapPin, label: "Destinations", href: "/admin/destinations" },
  { icon: Package, label: "Packages", href: "/admin/packages" },
  { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings" },
  { icon: MessageSquare, label: "Enquiries", href: "/admin/enquiries" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-zinc-950 border-r border-zinc-800/50 text-zinc-400">
      <div className="flex h-20 items-center px-6 gap-3">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
          <Mountain className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 tracking-tight">
          GoHimalaya
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all relative overflow-hidden",
                isActive 
                  ? "text-white" 
                  : "hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-colors z-10",
                isActive ? "text-cyan-400" : "group-hover:text-cyan-400"
              )} />
              <span className="z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800/50">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
