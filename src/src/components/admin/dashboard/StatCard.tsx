"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
}: Props) {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-5
      backdrop-blur-xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-white/20
    "
    >
      {/* Glow */}

      <div
        className={`
        absolute
        inset-0
        opacity-0
        blur-3xl
        transition-opacity
        duration-500
        group-hover:opacity-20
        bg-gradient-to-br
        ${gradient}
      `}
      />

      {/* Content */}

      <div className="relative flex items-start justify-between">
        {/* Left */}

        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h2
            className="
            mt-3
            text-3xl
            font-bold
            text-white
          "
          >
            {value}
          </h2>
        </div>

        {/* Right */}

        <div
          className={`
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-gradient-to-br
          ${gradient}
        `}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}