"use client";

import {
  Bell,
  Menu,
  UserCircle2,
} from "lucide-react";

interface Props {
  onMenuClick: () => void;
}

export default function AdminNavbar({
  onMenuClick,
}: Props) {
  return (
    <header
      className="
      sticky
      top-0
      z-30
      flex
      h-20
      items-center
      justify-between
      border-b
      border-white/10
      bg-[#0b1120]/70
      px-4
      backdrop-blur-2xl
      md:px-8
    "
    >
      {/* Left */}

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            p-2
            text-zinc-300
            md:hidden
          "
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1
            className="
            text-xl
            font-bold
            text-white
            md:text-2xl
          "
          >
            Dashboard
          </h1>

          <p className="text-xs text-zinc-500 md:text-sm">
            Welcome back 👋
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-3 md:gap-5">
        <button
          className="
          relative
          rounded-xl
          border
          border-white/10
          bg-white/5
          p-2.5
          text-zinc-400
          transition-all
          hover:text-white
        "
        >
          <Bell className="h-5 w-5" />

          <span
            className="
            absolute
            right-2
            top-2
            h-2
            w-2
            rounded-full
            bg-cyan-400
          "
          />
        </button>

        <div
          className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-white/5
          px-3
          py-2
        "
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-white">
              Admin User
            </p>

            <p className="text-xs text-zinc-500">
              Super Admin
            </p>
          </div>

          <div
            className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-cyan-500
            to-blue-600
          "
          >
            <UserCircle2 className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}