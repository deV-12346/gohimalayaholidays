"use client";

import { Bell, Search, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminNavbar() {
  return (
    <header className="h-20 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input 
          className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-cyan-500/50 pl-10 h-10 rounded-full text-zinc-300 placeholder:text-zinc-600"
          placeholder="Search analytics, bookings..."
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-cyan-500 rounded-full border-2 border-zinc-950" />
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-zinc-500">Super Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
            <UserCircle className="h-6 w-6 text-zinc-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
