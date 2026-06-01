"use client";

import {
  CalendarCheck2,
  Clock3,
  BadgeCheck,
  XCircle,
  IndianRupee,
} from "lucide-react";

import {
  useGetDashboardStatsQuery,
} from "@/services/adminDashboard/dashboardSlice";

import StatCard from "../../../components/admin/dashboard/StatCard";
import AdminActions from "../../../components/admin/dashboard/AdminAction";

const statsConfig = [
  {
    key: "totalBookings",
    title: "Total Bookings",
    icon: CalendarCheck2,
    gradient:
      "from-cyan-500 to-blue-600",
  },

  {
    key: "pendingBookings",
    title: "Pending Bookings",
    icon: Clock3,
    gradient:
      "from-yellow-500 to-orange-500",
  },

  {
    key: "completedBookings",
    title: "Completed Bookings",
    icon: BadgeCheck,
    gradient:
      "from-emerald-500 to-green-600",
  },

  {
    key: "cancelledBookings",
    title: "Cancelled Bookings",
    icon: XCircle,
    gradient:
      "from-red-500 to-rose-600",
  },

  {
    key: "totalRevenue",
    title: "Total Revenue",
    icon: IndianRupee,
    gradient:
      "from-violet-500 to-purple-600",
  },
];

export default function DashboardStats() {

  const {
    data,
    isLoading,
  } =
    useGetDashboardStatsQuery();

  if (isLoading) {

    return (
      <div
        className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        xl:grid-cols-5
      "
      >
        {[1, 2, 3, 4, 5].map(
          (item) => (

            <div
              key={item}
              className="
                h-32
                animate-pulse
                rounded-3xl
                border
                border-white/10
                bg-white/5
              "
            />
          )
        )}
      </div>
    );
  }

  const stats = data?.data;

  return (
    <div className="space-y-8">
      {/* Top */}

      <div
        className="
        flex
        flex-col
        gap-5
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
      >
        {/* Heading */}

        <div>
          <h1
            className="
            text-3xl
            font-bold
            text-white
          "
          >
            Dashboard Overview
          </h1>

          <p className="mt-2 text-zinc-500">
            Monitor bookings,
            revenue and admin actions.
          </p>
        </div>

        {/* Actions */}

        <AdminActions />
      </div>

      {/* Stats */}

      <div
        className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        xl:grid-cols-5
      "
      >
        {statsConfig.map((item) => {

          const value =
            stats?.[
              item.key as keyof typeof stats
            ];

          return (
            <StatCard
              key={item.key}
              title={item.title}
              value={
                item.key ===
                "totalRevenue"

                  ? `₹${value}`

                  : value || 0
              }
              icon={item.icon}
              gradient={item.gradient}
            />
          );
        })}
      </div>
    </div>
  );
}