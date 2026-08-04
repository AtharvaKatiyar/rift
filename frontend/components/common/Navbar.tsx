"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Navbar() {
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
      <nav
        ref={navRef}
        className="hero-nav"
        style={{
          position: "fixed",
          top: 16,
          left: 24,
          right: 24,
          padding: "12px 32px",
          zIndex: 50,
          background: "rgba(255,255,255,0.60)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          border: "1px solid rgba(255,255,255,0.45)",
          borderRadius: 14,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.60)",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* logo */}
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image
              src="/rift_off_logo.png"
              alt="Rift"
              width={40}
              height={27}
              style={{
                opacity: 0.95,
                display: "block",
                width: "40px",
                height: "auto",
              }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 300,
                letterSpacing: "0.05em",
                color: "rgba(30,28,24,0.90)",
                transition: "color 0.3s ease",
                fontFamily: "Fraunces, Georgia, serif"
              }}
            >
              Rift
            </span>
          </div>
        </a>

        {/* nav links */}
        <div className="hero-nav-links" style={{ display: "none", gap: 32 }}>
          {(["/#features", "/#tasks", "/pricing", "/#faq"] as const).map((href, i) => (
            <a
              key={href}
              href={href}
              style={{
                fontSize: 15,
                color: "rgba(30,28,24,0.75)",
                transition: "color 0.3s ease",
                textDecoration: "none"
              }}
            >
              {i === 0 ? "Features" : i === 1 ? "How it works" : i === 2 ? "Pricing" : "FAQ"}
            </a>
          ))}
        </div>

        {/* sign in */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="/auth"
            className="hero-nav-cta"
            style={{
              fontSize: 14,
              color: "rgba(30,28,24,0.70)",
              border: "1px solid rgba(30,28,24,0.18)",
              padding: "8px 18px",
              borderRadius: 3,
              transition: "all 0.3s ease",
              letterSpacing: "0.01em",
              textDecoration: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 500,
              whiteSpace: "nowrap"
            }}
          >
            Sign in
          </a>
        </div>

        {/* hamburger button */}
        <button
          className="hero-hamburger"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          style={{
            display: "none",
            background: "none",
            border: "none",
            padding: 4,
            cursor: "pointer",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {isMenuOpen ? (
            <span style={{ fontSize: 20, color: "rgba(42,39,36,0.7)", lineHeight: 1 }}>×</span>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ width: 18, height: 1.5, background: "rgba(42,39,36,0.7)" }} />
              <div style={{ width: 18, height: 1.5, background: "rgba(42,39,36,0.7)" }} />
              <div style={{ width: 18, height: 1.5, background: "rgba(42,39,36,0.7)" }} />
            </div>
          )}
        </button>

        {/* mobile dropdown */}
        <div
          className="hero-dropdown"
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
            href="/#features"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: "block",
              padding: "15px 20px",
              fontSize: 14,
              color: "rgba(42,39,36,0.65)",
              borderBottom: "0.5px solid rgba(42,39,36,0.06)",
              textDecoration: "none"
            }}
          >
            Features
          </a>
          <a
            href="/#tasks"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: "block",
              padding: "15px 20px",
              fontSize: 14,
              color: "rgba(42,39,36,0.65)",
              borderBottom: "0.5px solid rgba(42,39,36,0.06)",
              textDecoration: "none"
            }}
          >
            How it works
          </a>
          <a
            href="/pricing"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: "block",
              padding: "15px 20px",
              fontSize: 14,
              color: "rgba(42,39,36,0.65)",
              borderBottom: "0.5px solid rgba(42,39,36,0.06)",
              textDecoration: "none"
            }}
          >
            Pricing
          </a>
          <a
            href="/#faq"
            onClick={() => setIsMenuOpen(false)}
            style={{
              display: "block",
              padding: "15px 20px",
              fontSize: 14,
              color: "rgba(42,39,36,0.65)",
              borderBottom: "0.5px solid rgba(42,39,36,0.06)",
              textDecoration: "none"
            }}
          >
            FAQ
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
              textDecoration: "none"
            }}
          >
            Create a link
          </a>
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .hero-nav-links {
            display: flex !important;
          }
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
          .hero-hamburger {
            display: flex !important;
          }
          .hero-nav-links, .hero-nav-cta {
            display: none !important;
          }
        }
      `}} />
    </>
  );
}
