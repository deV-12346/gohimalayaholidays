"use client";

import { 
  CalendarCheck, 
  Package, 
  DollarSign, 
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";
import StatCard from "@/components/admin/dashboard/StatCard";
import BookingsTable from "@/components/admin/dashboard/BookingsTable";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const popularDestinations = [
  { name: "Manali", bookings: 124, trend: "+12%", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=100&q=80" },
  { name: "Leh Ladakh", bookings: 98, trend: "+8%", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=100&q=80" },
  { name: "Shimla", bookings: 86, trend: "+5%", image: "https://images.unsplash.com/photo-1597074866923-dc0589ec5584?auto=format&fit=crop&w=100&q=80" },
];

export default function DashboardPage() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-zinc-500 mt-1">Welcome back, here's what's happening with your tours.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium hover:bg-zinc-800 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition-shadow hover:shadow-[0_0_20px_rgba(8,145,178,0.3)]">
            Create Package
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Bookings" 
          value="1,284" 
          icon={CalendarCheck} 
          trend="12.5%" 
          trendUp 
          color="cyan"
        />
        <StatCard 
          title="Total Packages" 
          value="48" 
          icon={Package} 
          color="purple"
        />
        <StatCard 
          title="Total Revenue" 
          value="$128,430" 
          icon={DollarSign} 
          trend="8.2%" 
          trendUp 
          color="emerald"
        />
        <StatCard 
          title="Pending Enquiries" 
          value="24" 
          icon={MessageSquare} 
          trend="2" 
          color="amber"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Table Area */}
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
           <BookingsTable />
           
           {/* Analytics Placeholder */}
           <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-semibold text-white">Revenue Analytics</h3>
                  <p className="text-sm text-zinc-500">Monthly growth and performance</p>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full text-xs font-bold">
                  <TrendingUp className="h-3 w-3" />
                  +24.5%
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 px-2">
                {[40, 65, 45, 90, 55, 75, 40, 85, 60, 95, 70, 80].map((height, i) => (
                  <div key={i} className="flex-1 group/bar relative">
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-600/20 to-cyan-400/40 rounded-t-sm transition-all duration-500 group-hover/bar:to-cyan-400 group-hover/bar:shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                      style={{ height: `${height}%` }}
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 font-medium">
                      {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </motion.div>

        {/* Sidebar Info Area */}
        <motion.div variants={item} className="space-y-8">
          {/* Popular Destinations */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-6">Popular Destinations</h3>
            <div className="space-y-6">
              {popularDestinations.map((dest) => (
                <div key={dest.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                      <img src={dest.image} alt={dest.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{dest.name}</p>
                      <p className="text-xs text-zinc-500">{dest.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400">{dest.trend}</p>
                    <ArrowUpRight className="h-3 w-3 ml-auto mt-1 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-all">
              View All Destinations
            </button>
          </div>

          {/* Recent Activity */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-6 text-sm">Recent Activity</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 3 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-zinc-800" />}
                  <div className="h-6 w-6 rounded-full bg-zinc-800 border-4 border-zinc-950 z-10 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-300 font-medium">New enquiry from Sarah Smith</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-600">
                      <Clock className="h-3 w-3" />
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
