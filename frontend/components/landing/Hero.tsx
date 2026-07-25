"use client";

import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* ── background images — cross-fade on theme toggle ──────── */}
      <Image
        src="/rift-hero.png"
        alt=""
        fill
        className="object-cover"
        style={{ objectPosition: "center 35%", zIndex: 0 }}
        priority
      />

      {/* gradient overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(238,230,218,0.08) 0%, transparent 100%)", zIndex: 1 }} />
      <div className="absolute inset-x-0 bottom-0 h-[56%]" style={{ background: "linear-gradient(0deg, rgba(22,20,16,0.75) 0%, rgba(22,20,16,0.4) 60%, transparent 100%)", zIndex: 1 }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(22,20,16,0.22) 100%)", zIndex: 1 }} />

      {/* ── floating nav ─────────────────────────────────────────── */}
      <nav
        className="fixed flex items-center justify-between"
        style={{
          top: 16, left: 24, right: 24,
          padding: "12px 32px",
          zIndex: 50,
          background: isDark ? "rgba(20,18,15,0.72)" : "rgba(255,255,255,0.60)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.10)"
            : "1px solid rgba(255,255,255,0.45)",
          borderRadius: 14,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.60)",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* logo */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <Image
            src="/rift_off_logo.png"
            alt="Rift"
            width={40}
            height={27}
            className="shrink-0"
            style={{ opacity: 0.95, display: "block", width: "40px", height: "auto" }}
          />
          <span
            className="font-serif"
            style={{
              fontSize: 22, fontWeight: 300, letterSpacing: "0.05em",
              color: isDark ? "rgba(240,235,225,0.90)" : "rgba(30,28,24,0.90)",
              transition: "color 0.3s ease",
            }}
          >
            Rift
          </span>
        </div>

        {/* nav links */}
        <div className="hidden md:flex" style={{ gap: 32 }}>
          {(["#tasks", "#features"] as const).map((href, i) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: 15,
                color: isDark ? "rgba(240,235,225,0.70)" : "rgba(30,28,24,0.75)",
                transition: "color 0.3s ease",
              }}
            >
              {i === 0 ? "How it works" : "Features"}
            </a>
          ))}
        </div>

        {/* sign in + toggle */}
        <div className="flex items-center" style={{ gap: 10 }}>
          <a
            href="/auth"
            className="font-sans font-medium whitespace-nowrap"
            style={{
              fontSize: 14,
              color: isDark ? "rgba(240,235,225,0.70)" : "rgba(30,28,24,0.70)",
              border: isDark
                ? "1px solid rgba(240,235,225,0.22)"
                : "1px solid rgba(30,28,24,0.18)",
              padding: "8px 18px", borderRadius: 3,
              transition: "all 0.3s ease",
              letterSpacing: "0.01em",
            }}
          >
            Sign in
          </a>
          <ThemeToggle variant="nav" />
        </div>
      </nav>

      {/* ── hero content ─────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between"
        style={{ padding: "0 48px 60px", zIndex: 5, gap: 40 }}
      >
        <div style={{ maxWidth: 620 }}>
          <div className="font-mono uppercase" style={{ fontSize: 13, letterSpacing: "0.2em", color: "rgba(245,240,232,0.95)", marginBottom: 22, textShadow: "0 1px 12px rgba(12,10,8,0.7)" }}>
            Central link management
          </div>
          <h1 className="font-serif" style={{ fontSize: "clamp(52px,8vw,82px)", lineHeight: 1.02, color: "#FFFFFF", marginBottom: 24, textShadow: "0 3px 50px rgba(12,10,8,0.5)", fontWeight: 500 }}>
            The address <em>stays.</em><br />
            <span style={{ opacity: 0.6 }}>The destination</span><br />
            <em>moves.</em>
          </h1>
          <p className="font-sans" style={{ fontSize: 17, color: "rgba(245,240,232,0.75)", lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
            One permanent link for every task you care about. Update where it points, as many times as you need. Nobody ever gets a broken link again.
          </p>
          <div className="flex flex-wrap" style={{ gap: 14, alignItems: "center" }}>
            <a href="/auth?tab=register" className="font-sans font-semibold whitespace-nowrap" style={{ fontSize: 16, background: "#F5F0E8", color: "#1E1C18", padding: "15px 30px", borderRadius: 3 }}>
              Create your first link
            </a>
            <a href="#tasks" className="font-sans font-medium whitespace-nowrap" style={{ fontSize: 16, border: "1px solid rgba(245,240,232,0.35)", color: "rgba(245,240,232,0.85)", padding: "15px 28px", borderRadius: 3 }}>
              See how it works ↓
            </a>
          </div>
        </div>
        <div className="flex flex-col items-end" style={{ gap: 24, paddingBottom: 6 }}>
          <div className="font-mono text-right" style={{ fontSize: 14.5, color: "rgba(245,240,232,0.4)", letterSpacing: "0.04em", lineHeight: 1.9 }}>
            <span style={{ color: "rgba(245,240,232,0.7)" }}>rift.dpdns.org/portfolio/</span>A7XK29M4PQ8L<br />
            <span style={{ color: "rgba(245,240,232,0.7)" }}>rift.dpdns.org/resume/</span>F3JKP92MLX8A<br />
            <span style={{ color: "rgba(245,240,232,0.7)" }}>rift.dpdns.org/startup/</span>Q8T2MN6PWK5Z
          </div>
          <div className="flex flex-col items-center" style={{ gap: 10 }}>
            <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.16em", color: "rgba(245,240,232,0.4)", writingMode: "vertical-rl" }}>scroll</span>
            <div style={{ width: 1, height: 40, background: "rgba(245,240,232,0.25)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
