"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* ── floating nav ─────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="hero-nav fixed flex items-center justify-between"
        style={{
          top: 16, left: 24, right: 24,
          padding: "12px 32px",
          zIndex: 50,
          background: "rgba(255,255,255,0.60)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          border: "1px solid rgba(255,255,255,0.45)",
          borderRadius: 14,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.60)",
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
            style={{
              opacity: 0.95,
              display: "block",
              width: "40px",
              height: "auto",
            }}
          />
          <span
            className="font-serif"
            style={{
              fontSize: 22, fontWeight: 300, letterSpacing: "0.05em",
              color: "rgba(30,28,24,0.90)",
              transition: "color 0.3s ease",
            }}
          >
            Rift
          </span>
        </div>

        {/* nav links */}
        <div className="hero-nav-links hidden md:flex" style={{ gap: 32 }}>
          {(["#tasks", "#features"] as const).map((href, i) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: 15,
                color: "rgba(30,28,24,0.75)",
                transition: "color 0.3s ease",
              }}
            >
              {i === 0 ? "How it works" : "Features"}
            </a>
          ))}
        </div>

        {/* sign in */}
        <div className="flex items-center" style={{ gap: 10 }}>
          <a
            href="/auth"
            className="hero-nav-cta font-sans font-medium whitespace-nowrap"
            style={{
              fontSize: 14,
              color: "rgba(30,28,24,0.70)",
              border: "1px solid rgba(30,28,24,0.18)",
              padding: "8px 18px", borderRadius: 3,
              transition: "all 0.3s ease",
              letterSpacing: "0.01em",
            }}
          >
            Sign in
          </a>
        </div>

        {/* hamburger button */}
        <button
          className="hero-hamburger flex-col justify-center items-center"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          style={{
            display: "none",
            background: "none",
            border: "none",
            padding: 4,
            cursor: "pointer",
          }}
        >
          {isMenuOpen ? (
            <span style={{ fontSize: 20, color: "rgba(42,39,36,0.7)", lineHeight: 1 }}>×</span>
          ) : (
            <div className="flex flex-col" style={{ gap: 4 }}>
              <div style={{ width: 18, height: 1.5, background: "rgba(42,39,36,0.7)" }} />
              <div style={{ width: 18, height: 1.5, background: "rgba(42,39,36,0.7)" }} />
              <div style={{ width: 18, height: 1.5, background: "rgba(42,39,36,0.7)" }} />
            </div>
          )}
        </button>

        {/* mobile dropdown */}
        <div
          className={`hero-dropdown ${isMenuOpen ? "is-open" : ""}`}
          style={{
            position: "absolute",
            top: 56,
            left: 0,
            right: 0,
            zIndex: 49,
            background: "rgba(246,241,231,0.97)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderBottom: "0.5px solid rgba(42,39,36,0.08)",
            overflow: "hidden",
            maxHeight: isMenuOpen ? 320 : 0,
            opacity: isMenuOpen ? 1 : 0,
            transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
          }}
        >
          <a
            href="#tasks"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: "block",
              padding: "15px 20px",
              fontSize: 14,
              color: "rgba(42,39,36,0.65)",
              borderBottom: "0.5px solid rgba(42,39,36,0.06)",
            }}
          >
            How it works
          </a>
          <a
            href="#features"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: "block",
              padding: "15px 20px",
              fontSize: 14,
              color: "rgba(42,39,36,0.65)",
              borderBottom: "0.5px solid rgba(42,39,36,0.06)",
            }}
          >
            Features
          </a>
          <a
            href="#features"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: "block",
              padding: "15px 20px",
              fontSize: 14,
              color: "rgba(42,39,36,0.65)",
              borderBottom: "0.5px solid rgba(42,39,36,0.06)",
            }}
          >
            Roadmap
          </a>
          <a
            href="/auth?tab=register"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: "block",
              padding: "15px 20px",
              fontSize: 14,
              color: "rgba(42,39,36,0.85)",
              fontWeight: 500,
            }}
          >
            Create a link
          </a>
        </div>
      </nav>

      <section className="hero-section relative min-h-screen overflow-hidden">

        {/* top spectrum accent line for mobile */}
        <div
          className="hero-top-accent-line"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #C79A3E, #A6503B, #4C5A78, #6E7C5C)",
            zIndex: 10,
            display: "none",
          }}
        />

        {/* ── background images ───────────────────────────────────── */}
        <Image
          src="/rift-hero.png"
          alt=""
          fill
          className="hero-bg-img object-cover"
          style={{ objectPosition: "center 35%", zIndex: 0 }}
          priority
        />

        {/* gradient overlays */}
        <div className="hero-overlay absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(238,230,218,0.08) 0%, transparent 100%)", zIndex: 1 }} />
        <div
          className="hero-overlay absolute inset-x-0 bottom-0"
          style={{
            height: "85%",
            background: "linear-gradient(0deg, rgba(12,10,8,0.95) 0%, rgba(12,10,8,0.85) 30%, rgba(12,10,8,0.65) 60%, rgba(12,10,8,0.30) 85%, transparent 100%)",
            zIndex: 1,
          }}
        />
        <div
          className="hero-overlay absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 55%, rgba(22,20,16,0.22) 100%)",
            zIndex: 1,
          }}
        />

        {/* ── hero content ─────────────────────────────────────────── */}
        <div
          className="hero-content absolute inset-x-0 bottom-0 flex items-end justify-between"
          style={{ padding: "0 48px 60px", zIndex: 5, gap: 40 }}
        >
          <div className="hero-left-content" style={{ maxWidth: 620 }}>
            <div className="hero-eyebrow font-mono uppercase" style={{ fontSize: 13, letterSpacing: "0.2em", color: "rgba(245,240,232,0.95)", marginBottom: 22, textShadow: "0 1px 12px rgba(12,10,8,0.7)" }}>
              Central link management
            </div>
            <h1 className="hero-headline font-serif" style={{ fontSize: "clamp(52px,8vw,82px)", lineHeight: 1.02, color: "#FFFFFF", marginBottom: 24, textShadow: "0 3px 50px rgba(12,10,8,0.5)", fontWeight: 500 }}>
              The address <em>stays.</em><br />
              <span style={{ opacity: 0.6 }}>The destination</span><br />
              <em>moves.</em>
            </h1>
            <p className="hero-subtext font-sans" style={{ fontSize: 17, color: "rgba(245,240,232,0.75)", lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
              One permanent link for every task you care about. Update where it points, as many times as you need. Nobody ever gets a broken link again.
            </p>
            <div className="hero-cta-group flex flex-wrap" style={{ gap: 14, alignItems: "center" }}>
              <a href="/auth?tab=register" className="hero-cta-primary font-sans font-semibold whitespace-nowrap" style={{ fontSize: 16, background: "#F5F0E8", color: "#1E1C18", padding: "15px 30px", borderRadius: 3 }}>
                Create your first link
              </a>
              <a href="#tasks" className="hero-cta-secondary font-sans font-medium whitespace-nowrap" style={{ fontSize: 16, border: "1px solid rgba(245,240,232,0.35)", color: "rgba(245,240,232,0.85)", padding: "15px 28px", borderRadius: 3 }}>
                See how it works ↓
              </a>
            </div>
          </div>
          <div className="hero-right-side flex flex-col items-end" style={{ gap: 24, paddingBottom: 6 }}>
            <div className="font-mono text-right" style={{ fontSize: 14.5, color: "rgba(245,240,232,0.4)", letterSpacing: "0.04em", lineHeight: 1.9 }}>
              <div className="hero-url hero-url-1">
                <span style={{ color: "rgba(245,240,232,0.7)" }}>rift.dpdns.org/portfolio/</span>A7XK29M4PQ8L
              </div>
              <div className="hero-url hero-url-2">
                <span style={{ color: "rgba(245,240,232,0.7)" }}>rift.dpdns.org/resume/</span>F3JKP92MLX8A
              </div>
              <div className="hero-url hero-url-3">
                <span style={{ color: "rgba(245,240,232,0.7)" }}>rift.dpdns.org/startup/</span>Q8T2MN6PWK5Z
              </div>
            </div>
            <div className="flex flex-col items-center" style={{ gap: 10 }}>
              <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.16em", color: "rgba(245,240,232,0.4)", writingMode: "vertical-rl" }}>scroll</span>
              <div className="scroll-tick-line" style={{ width: 1, height: 40, background: "rgba(245,240,232,0.25)" }} />
            </div>
          </div>
        </div>
        <style>{`
          .hero-section {
            overflow: hidden;
            max-width: 100vw;
          }

          @keyframes heroUrlFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .hero-url {
            animation: heroUrlFadeIn 0.6s ease-out both;
          }
          .hero-url-1 {
            animation-delay: 0.3s;
          }
          .hero-url-2 {
            animation-delay: 0.6s;
          }
          .hero-url-3 {
            animation-delay: 0.9s;
          }

          @keyframes scrollTickPulse {
            0% {
              height: 40px;
              opacity: 1;
            }
            100% {
              height: 16px;
              opacity: 0.3;
            }
          }
          .scroll-tick-line {
            animation: scrollTickPulse 2s ease-in-out infinite alternate;
          }

          @media (max-width: 768px) {
            .hero-nav {
              position: sticky !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              width: 100% !important;
              margin: 0 !important;
              border-radius: 0 !important;
              padding: 0 16px !important;
              height: 56px !important;
              min-height: 56px !important;
              background: rgba(242, 237, 227, 0.97) !important;
              backdrop-filter: blur(10px) !important;
              -webkit-backdrop-filter: blur(10px) !important;
              border: none !important;
              border-bottom: 0.5px solid rgba(42, 39, 36, 0.1) !important;
              box-shadow: none !important;
              z-index: 50 !important;
            }
            .hero-section {
              background-image: none !important;
              background-color: #2C3128 !important;
              min-height: auto !important;
              height: auto !important;
              padding: 32px 20px 36px !important;
              overflow: hidden !important;
              margin-top: 0 !important;
            }
            .hero-top-accent-line {
              display: block !important;
            }
            .hero-bg-img,
            .hero-overlay {
              display: none !important;
            }
            .hero-hamburger {
              display: flex !important;
            }
            .hero-nav-links, .hero-nav-cta {
              display: none !important;
            }
            .hero-content {
              position: relative !important;
              display: flex !important;
              flex-direction: column !important;
              padding: 0 !important;
              min-height: auto !important;
              bottom: auto !important;
              inset-x: auto !important;
              width: 100% !important;
            }
            .hero-left-content {
              max-width: 100% !important;
              width: 100% !important;
            }
            .hero-eyebrow {
              display: block !important;
              color: rgba(200, 196, 184, 0.4) !important;
              font-size: 10px !important;
              letter-spacing: 0.16em !important;
              margin-bottom: 12px !important;
              text-shadow: none !important;
            }
            .hero-headline {
              color: #EDE8DE !important;
              font-size: clamp(28px, 8vw, 36px) !important;
              line-height: 1.08 !important;
              margin-bottom: 12px !important;
              max-width: 100% !important;
              text-shadow: none !important;
            }
            .hero-subtext {
              display: block !important;
              color: rgba(200, 196, 184, 0.6) !important;
              font-size: 13px !important;
              line-height: 1.65 !important;
              margin-bottom: 22px !important;
              max-width: 100% !important;
            }
            .hero-cta-group {
              flex-direction: column !important;
              gap: 8px !important;
              width: 100% !important;
            }
            .hero-cta-primary {
              background: #EDE8DE !important;
              color: #1E2119 !important;
              padding: 12px 16px !important;
              font-size: 13px !important;
              font-weight: 500 !important;
              border-radius: 2px !important;
              border: none !important;
              width: 100% !important;
              text-align: center !important;
            }
            .hero-cta-secondary {
              background: none !important;
              border: 0.5px solid rgba(237,232,222,0.25) !important;
              color: rgba(237,232,222,0.7) !important;
              padding: 11px 16px !important;
              font-size: 13px !important;
              border-radius: 2px !important;
              width: 100% !important;
              text-align: center !important;
            }
            .hero-right-side {
              display: none !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}
