"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  Package,
  CalendarCheck,
  MessageSquare,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/../public/logo.png";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: MapPin,
    label: "Destinations",
    href: "/admin/destinations",
  },
  {
    icon: Package,
    label: "Packages",
    href: "/admin/packages",
  },
  {
    icon: CalendarCheck,
    label: "Bookings",
    href: "/admin/bookings",
  },
  {
    icon: MessageSquare,
    label: "Enquiries",
    href: "/admin/enquiries",
  },
];

interface Props {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: Props) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <>
      <div
        className="
        flex
        h-24
        items-center
        gap-3
        border-b
        border-white/10
        px-6
      "
      >
        <Image
          src={logo}
          alt="logo"
          width={60}
          height={60}
          className="h-auto w-[60px]"
        />

        <div>
          <h1 className="text-lg font-bold text-white">
            Go Himalaya
          </h1>

          <p className="text-xs text-zinc-500">
            Admin Dashboard
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() =>
                setMobileOpen(false)
              }
              className={cn(
                `
                group
                relative
                flex
                items-center
                gap-4
                overflow-hidden
                rounded-2xl
                px-5
                py-4
                text-[15px]
                font-medium
                transition-all
                duration-300
              `,
                isActive
                  ? "text-white"
                  : `
                  text-zinc-400
                  hover:bg-white/5
                  hover:text-white
                `
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="
                    absolute
                    inset-0
                    rounded-2xl
                    border
                    border-cyan-400/20
                    bg-gradient-to-r
                    from-cyan-500/20
                    to-blue-500/5
                  "
                />
              )}

              <item.icon
                className={cn(
                  `
                  z-10
                  h-5
                  w-5
                  transition-colors
                `,
                  isActive
                    ? "text-cyan-400"
                    : "group-hover:text-cyan-400"
                )}
              />

              <span className="z-10">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          className="
          flex
          w-full
          items-center
          gap-4
          rounded-2xl
          px-5
          py-4
          text-sm
          font-medium
          text-zinc-400
          transition-all
          hover:bg-red-500/10
          hover:text-red-400
        "
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setMobileOpen(false)
              }
              className="
                fixed
                inset-0
                z-40
                bg-black/60
                backdrop-blur-sm
                md:hidden
              "
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="
                fixed
                left-0
                top-0
                bottom-0
                z-50
                flex
                w-[85%]
                max-w-[320px]
                flex-col
                border-r
                border-white/10
                bg-[#0b1120]/95
                backdrop-blur-2xl
              "
            >
              <button
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  absolute
                  right-4
                  top-4
                  text-zinc-500
                  hover:text-white
                "
              >
                <X className="h-5 w-5" />
              </button>

              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop */}

      <aside
        className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        w-72
        flex-col
        border-r
        border-white/10
        bg-[#0b1120]/95
        backdrop-blur-2xl
        shadow-2xl
        md:flex
      "
      >
        <SidebarContent />
      </aside>
    </>
  );
}