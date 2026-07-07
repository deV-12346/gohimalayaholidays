"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminNavbar from "@/components/admin/navbar/Navbar";
import AdminSidebar from "@/components/admin/sidebar/Sidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
   const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="md:pl-72">
        <AdminNavbar
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}