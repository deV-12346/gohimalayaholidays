"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Menu, UserCircle2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface Props {
  onMenuClick: () => void;
}

export default function AdminNavbar({
  onMenuClick,
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  const user = session?.user;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0b1120]/70 px-4 backdrop-blur-2xl md:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-300 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-white md:text-2xl">
            Dashboard
          </h1>

          <p className="text-xs text-zinc-500 md:text-sm">
            Welcome back 👋
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 md:gap-5">
        <button className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-zinc-400 transition-all hover:text-white">
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white/10"
          >
            <div className="text-right sm:block font-bold">
              <p className="text-lg text-white">
                {user?.name || ""}
              </p>

              <p className="text-lg text-zinc-600">Admin</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
              <UserCircle2 className="h-6 w-6 text-white" />
            </div>
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-xl border border-white/10 bg-[#0b1120] p-3 shadow-2xl">
              <div className="flex items-center justify-center gap-1 border-b border-white/10 pb-3 font-normal ">
                <span className="text-md text-zinc-300 italic">
                  Hello
                </span>

                <p className="text-md text-zinc-300 italic">
                  {user?.adminName || ""}
                </p>
              </div>

              <div className="py-3">
                <p className="text-xs text-zinc-500">Last login</p>

                <p className="text-sm text-zinc-300">
                {new Date().toLocaleString() || "N/A"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-sm font-bold text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}