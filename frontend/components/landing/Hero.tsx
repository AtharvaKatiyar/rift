"use client";

import Image from "next/image";
import Navbar from "@/components/common/Navbar";

export default function Hero() {
  return (
    <>
      <Navbar />

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
            {/* Early Access Badge with enhanced animations */}
            <div style={{ marginBottom: 24 }}>
              <div className="early-access-badge" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "monospace",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "#FFFFFF",
                background: "linear-gradient(135deg, #C79A3E 0%, #A67C2E 50%, #C79A3E 100%)",
                backgroundSize: "200% 100%",
                padding: "10px 18px",
                borderRadius: 8,
                border: "1.5px solid rgba(255,255,255,0.3)",
                position: "relative",
                overflow: "hidden",
                textTransform: "uppercase"
              }}>
                <span className="badge-shimmer" style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  zIndex: 0
                }}></span>
                <span className="badge-icon" style={{
                  display: "inline-flex",
                  fontSize: 16,
                  position: "relative",
                  zIndex: 1
                }}>⚡</span>
                <span style={{ position: "relative", zIndex: 1 }}>Early Access — Launch Pricing</span>
              </div>
            </div>

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
                Start Free
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

          @keyframes badge-gradient-shift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes badge-shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 200%;
            }
          }

          @keyframes badge-icon-pulse {
            0%, 100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: scale(1.15) rotate(-5deg);
              opacity: 0.85;
            }
          }

          @keyframes badge-glow {
            0%, 100% {
              box-shadow: 0 4px 20px rgba(199,154,62,0.5), 
                          0 0 40px rgba(199,154,62,0.2);
            }
            50% {
              box-shadow: 0 6px 30px rgba(199,154,62,0.7), 
                          0 0 60px rgba(199,154,62,0.35);
            }
          }

          .early-access-badge {
            animation: badge-glow 3s ease-in-out infinite, badge-gradient-shift 5s ease infinite;
            box-shadow: 0 4px 20px rgba(199,154,62,0.5), 0 0 40px rgba(199,154,62,0.2);
          }

          .badge-shimmer {
            animation: badge-shimmer 3.5s ease-in-out infinite;
          }

          .badge-icon {
            animation: badge-icon-pulse 2s ease-in-out infinite;
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
