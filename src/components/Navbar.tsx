"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import logo from "@/../public/logo.png"

import {
  Menu,
  X,
  House,
  MapPinned,
  BriefcaseBusiness,
  Images,
  Phone,
  Info,
  ChevronRight,
} from "lucide-react"

import { usePathname } from "next/navigation"

const navItems = [
  { id: 1, icon: House, name: "Home", href: "/" },
  { id: 2, icon: MapPinned, name: "Destinations", href: "/destinations" },
  { id: 3, icon: BriefcaseBusiness, name: "Packages", href: "/packages" },
  { id: 4, icon: Images, name: "Gallery", href: "/gallery" },
  { id: 5, icon: Info, name: "About", href: "/about" },
  { id: 6, icon: Phone, name: "Contact", href: "/contact" },
]

const Navbar = () => {
  const pathname = usePathname()

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ================= MAIN NAVBAR ================= */}

      <header className="fixed top-0 left-0 z-50 w-full px-3 md:px-6 py-3">
        <nav
          className="
          max-w-5xl mx-auto
          flex items-center justify-between
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          rounded-2xl
          px-4 md:px-6
          py-3
          shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        "
        >

          {/* ================= LOGO ================= */}

          <Link href="/" className="flex items-center gap-2 shrink-0">

            <Image
              src={logo}
              alt="logo"
              width={90}
              height={70}
              className="w-[70px] md:w-[90px] h-auto object-contain"
            />

          </Link>

          {/* ================= DESKTOP NAV ================= */}

          <div className="hidden lg:flex items-center gap-2">

            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`
                relative px-4 py-2 rounded-xl
                flex items-center gap-2
                text-sm font-medium tracking-wide
                transition-all duration-300
                ${
                  pathname === item.href
                    ? "bg-black text-white shadow-lg"
                    : "text-black hover:bg-black/5"
                }
              `}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
            ))}
          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="flex items-center gap-3">

            {/* CTA */}
            <button
              className="
              hidden md:flex
              items-center gap-2
              bg-black text-white
              px-5 py-2.5
              rounded-xl
              text-sm font-medium
              hover:scale-105
              transition-all duration-300
            "
            >
              Book Now
              <ChevronRight size={16} />
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMenuOpen(true)}
              className="
              lg:hidden
              h-11 w-11
              flex items-center justify-center
              rounded-xl
              bg-black text-white
            "
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* ================= MOBILE MENU ================= */}

      <div
        className={`
        fixed inset-0 z-[999]
        bg-black/40 backdrop-blur-sm
        transition-all duration-300
        ${
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }
      `}
      >

        {/* SIDE PANEL */}

        <div
          className={`
          absolute top-0 right-0
          h-full w-[85%] max-w-sm
          bg-white
          shadow-2xl
          transition-all duration-300
          flex flex-col
          ${
            menuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
        >

          {/* TOP */}

          <div
            className="
            flex items-center justify-between
            px-5 py-5
            border-b
          "
          >

            <Image
              src={logo}
              alt="logo"
              width={80}
              height={60}
              className="w-[75px] h-auto object-contain"
            />

            <button
              onClick={() => setMenuOpen(false)}
              className="
              h-11 w-11
              rounded-xl
              bg-black text-white
              flex items-center justify-center
            "
            >
              <X size={22} />
            </button>
          </div>

          {/* NAV ITEMS */}

          <div className="flex flex-col px-4 py-5">

            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`
                flex items-center justify-between
                px-4 py-4 rounded-2xl
                mb-2
                transition-all duration-300
                ${
                  pathname === item.href
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-black"
                }
              `}
              >

                <div className="flex items-center gap-3">

                  <item.icon size={20} />

                  <span className="text-sm font-medium tracking-wide">
                    {item.name}
                  </span>

                </div>

                <ChevronRight size={16} />

              </Link>
            ))}
          </div>

          {/* BOTTOM CTA */}

          <div className="mt-auto p-4">

            <button
              className="
              w-full
              bg-black text-white
              py-4 rounded-2xl
              font-medium
              text-sm
              hover:scale-[1.02]
              transition-all duration-300
            "
            >
              Book Your Trip
            </button>

          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar