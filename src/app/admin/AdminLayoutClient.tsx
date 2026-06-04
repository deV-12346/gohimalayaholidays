"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/navbar/Navbar";
import AdminSidebar from "@/components/admin/sidebar/Sidebar";

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {

  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-300">

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="md:pl-72">

        <AdminNavbar
          adminName={user?.adminName}
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