"use client";
import { useEffect, useRef } from "react";
import Link from "next/link"
export default function HeroSection() {
  const starsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const stars = starsRef.current;
    if (!stars) return;
    let frame: number;
    let t = 0;
    const starEls = Array.from(stars.querySelectorAll("circle"));
    function animate() {
      t += 0.012;
      starEls.forEach((star, i) => {
        const base = parseFloat(star.getAttribute("data-base-opacity") || "0.6");
        const phase = parseFloat(star.getAttribute("data-phase") || "0");
        const opacity = base * (0.6 + 0.4 * Math.sin(t + phase));
        star.setAttribute("opacity", String(opacity.toFixed(3)));
      });
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const stars = Array.from({ length: 90 }, (_, i) => ({
    cx: 5 + Math.random() * 1430,
    cy: 10 + Math.random() * 340,
    r: 0.6 + Math.random() * 1.4,
    baseOpacity: 0.3 + Math.random() * 0.7,
    phase: Math.random() * Math.PI * 2,
  }));

  return (
    <section className="relative h-screen overflow-hidden" style={{ background: "#0a0818" }}>
      {/* ── Sky gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(170deg, #0a0818 0%, #12103a 30%, #1a1060 55%, #2a1a72 70%, #3d2060 85%, #1e1040 100%)",
        }}
      />

      {/* ── Aurora bands ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "8%",
            left: "-10%",
            width: "120%",
            height: "180px",
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(56,220,180,0.13) 0%, rgba(100,80,220,0.09) 50%, transparent 100%)",
            filter: "blur(18px)",
            animation: "aurora 9s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "22%",
            left: "20%",
            width: "70%",
            height: "100px",
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(120,60,220,0.10) 0%, rgba(60,200,160,0.07) 60%, transparent 100%)",
            filter: "blur(22px)",
            animation: "aurora 12s ease-in-out infinite alternate-reverse",
          }}
        />
      </div>

      {/* ── Stars (animated) ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g ref={starsRef}>
          {stars.map((s, i) => (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="white"
              opacity={s.baseOpacity}
              data-base-opacity={s.baseOpacity}
              data-phase={s.phase}
            />
          ))}
        </g>
      </svg>

      {/* ── Mountain landscape SVG ── */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 420"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8e0ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#a89ad4" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="midGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e1f6e" />
            <stop offset="100%" stopColor="#180e44" />
          </linearGradient>
          <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#160b38" />
            <stop offset="100%" stopColor="#0a0818" />
          </linearGradient>
          <linearGradient id="farGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d2880" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#21145a" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Far distant mountains (faintest) */}
        <path
          d="M0,340 L80,260 L160,305 L240,220 L330,275 L420,200 L500,250 L590,170 L680,230 L760,155 L850,210 L940,165 L1020,200 L1110,140 L1200,185 L1290,160 L1380,200 L1440,185 L1440,420 L0,420 Z"
          fill="url(#farGrad)"
          opacity="0.55"
        />

        {/* Snow caps on far mountains */}
        <path
          d="M590,170 L610,195 L570,195 Z M760,155 L782,185 L740,185 Z M1110,140 L1133,168 L1088,168 Z"
          fill="url(#snowGrad)"
          opacity="0.5"
        />

        {/* Mid-range mountains */}
        <path
          d="M-20,380 L100,270 L200,320 L320,230 L430,290 L540,185 L650,255 L760,170 L870,240 L980,175 L1090,245 L1190,195 L1310,265 L1410,235 L1460,260 L1460,420 L-20,420 Z"
          fill="url(#midGrad)"
        />

        {/* Snow caps on mid mountains */}
        <path
          d="M540,185 L565,220 L515,220 Z M760,170 L788,208 L732,208 Z M980,175 L1007,213 L955,213 Z M1190,195 L1215,228 L1167,228 Z"
          fill="url(#snowGrad)"
          opacity="0.75"
          filter="url(#glow)"
        />

        {/* Foreground mountains (darkest) */}
        <path
          d="M-20,420 L120,305 L230,360 L370,270 L480,330 L580,250 L700,320 L810,235 L940,310 L1060,250 L1180,315 L1310,270 L1440,300 L1440,420 L-20,420 Z"
          fill="url(#foreGrad)"
        />

        {/* Snow on foreground peaks */}
        <path
          d="M370,270 L400,310 L342,310 Z M810,235 L840,278 L782,278 Z M1060,250 L1090,292 L1032,292 Z"
          fill="url(#snowGrad)"
          opacity="0.9"
          filter="url(#glow)"
        />

        {/* Pine tree silhouettes (left cluster) */}
        <g fill="#0e0828" opacity="0.95">
          <polygon points="60,420 68,385 76,420" />
          <polygon points="76,420 85,375 94,420" />
          <polygon points="90,420 100,362 110,420" />
          <polygon points="108,420 118,378 128,420" />
          <polygon points="125,420 133,390 141,420" />
        </g>

        {/* Pine tree silhouettes (right cluster) */}
        <g fill="#0e0828" opacity="0.95">
          <polygon points="1300,420 1308,385 1316,420" />
          <polygon points="1316,420 1325,375 1334,420" />
          <polygon points="1330,420 1340,360 1350,420" />
          <polygon points="1348,420 1358,378 1368,420" />
          <polygon points="1365,420 1373,390 1381,420" />
        </g>

        {/* Pine tree silhouettes (center-left) */}
        <g fill="#0f0930" opacity="0.9">
          <polygon points="540,420 550,392 560,420" />
          <polygon points="558,420 568,378 578,420" />
          <polygon points="576,420 586,365 596,420" />
          <polygon points="593,420 601,383 609,420" />
        </g>

        {/* Shimmer on distant snow */}
        <ellipse cx="760" cy="165" rx="18" ry="4" fill="white" opacity="0.18" filter="url(#glow)" />
        <ellipse cx="1110" cy="145" rx="14" ry="3" fill="white" opacity="0.15" filter="url(#glow)" />
      </svg>

      {/* ── Moon ── */}
      <div
        className="absolute"
        style={{
          top: "6%",
          right: "12%",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #f0eaff 0%, #c8b8f0 50%, #a090d0 100%)",
          boxShadow: "0 0 28px 10px rgba(200,180,255,0.22), 0 0 60px 20px rgba(140,100,220,0.10)",
        }}
      />

      {/* ── Shooting star ── */}
      <div
        className="absolute"
        style={{
          top: "18%",
          left: "25%",
          width: "90px",
          height: "1.5px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
          transform: "rotate(-28deg)",
          animation: "shoot 6s ease-in-out infinite",
          borderRadius: "2px",
        }}
      />

      {/* ── Hero content ── */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center">

          {/* Eyebrow label */}
          <div
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.18)",
              color: "#c4b5fd",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", display: "inline-block", animation: "pulse 2s infinite" }} />
            Himachal Pradesh · India
          </div>

          {/* Headline */}
          <h1
            className="font-bold leading-none tracking-tight"
            style={{
              fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
              color: "#f0ecff",
              textShadow: "0 2px 40px rgba(120,80,220,0.4)",
              letterSpacing: "-0.02em",
            }}
          >
            Explore The{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Beauty
            </span>{" "}
            <br />
            Of Himachal
          </h1>

          {/* Subheading */}
          <p
            className="mt-6 mx-auto"
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.3rem)",
              color: "rgba(210,200,255,0.75)",
              maxWidth: "480px",
              lineHeight: 1.6,
            }}
          >
            Breathtaking peaks, ancient valleys, and adventures waiting beyond the horizon.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/packages">
               <button
                 className="group relative overflow-hidden rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300"
                 style={{
                   background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                   color: "#fff",
                   boxShadow: "0 0 24px rgba(124,58,237,0.45)",
                 }}
               >
                 Explore Packages
               </button>
             </Link>
           
             <Link href="/enquiry">
               <button
                 className="rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300"
                 style={{
                   background: "rgba(255,255,255,0.07)",
                   border: "0.5px solid rgba(255,255,255,0.3)",
                   color: "rgba(240,235,255,0.9)",
                   backdropFilter: "blur(8px)",
                 }}
               >
                 Enquiry Now
               </button>
             </Link>
           
          </div>

          {/* Stats row */}
          {/* <div
            className="mt-16 flex flex-wrap items-center justify-center gap-10"
            style={{ color: "rgba(200,190,255,0.6)", fontSize: "0.85rem" }}
          >
            {[
              { num: "120+", label: "Destinations" },
              { num: "4.9★", label: "Avg Rating" },
              { num: "8K+", label: "Happy Travellers" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#e0d8ff", lineHeight: 1 }}>{num}</p>
                <p style={{ marginTop: "4px" }}>{label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* ── Scroll hint ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ color: "rgba(180,170,220,0.5)", fontSize: "0.7rem", letterSpacing: "0.12em" }}
        aria-hidden="true"
      >
        <span>SCROLL</span>
        <div
          style={{
            width: "1px",
            height: "32px",
            background: "linear-gradient(to bottom, rgba(180,160,255,0.5), transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes aurora {
          0% { transform: translateX(-5%) scaleY(0.9); opacity: 0.7; }
          100% { transform: translateX(5%) scaleY(1.1); opacity: 1; }
        }
        @keyframes shoot {
          0%,70% { opacity: 0; transform: translateX(0) rotate(-28deg); }
          75% { opacity: 1; }
          90% { opacity: 0; transform: translateX(160px) rotate(-28deg); }
          100% { opacity: 0; }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scrollPulse {
          0%,100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}