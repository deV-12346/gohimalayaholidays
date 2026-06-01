"use client";

import AdminNavbar from "@/components/admin/navbar/Navbar";
import AdminSidebar from "@/components/admin/sidebar/Sidebar";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div
      className="
      min-h-screen
      bg-[#020617]
      text-zinc-300
      selection:bg-cyan-500/20
      selection:text-cyan-200
    "
    >
      {/* Glow */}

      <div
        className="
        pointer-events-none
        fixed
        top-[-200px]
        right-[-100px]
        h-[500px]
        w-[500px]
        rounded-full
        bg-cyan-500/10
        blur-[120px]
      "
      />

      <div
        className="
        pointer-events-none
        fixed
        bottom-[-250px]
        left-[-150px]
        h-[500px]
        w-[500px]
        rounded-full
        bg-blue-500/10
        blur-[120px]
      "
      />

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="md:pl-72">
        <AdminNavbar
          onMenuClick={() =>
            setMobileOpen(true)
          }
        />

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}