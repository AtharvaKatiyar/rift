"use client";

import Link from "next/link";
import Navbar from "@/components/common/Navbar";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ maxWidth: 600, textAlign: "center" }}>
          {/* 404 Number */}
          <div style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "clamp(80px, 15vw, 140px)",
            fontWeight: 300,
            color: "var(--text)",
            lineHeight: 1,
            marginBottom: 24,
            opacity: 0.3
          }}>
            404
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 16,
            lineHeight: 1.2
          }}>
            Page Not Found
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 17,
            color: "var(--muted)",
            marginBottom: 40,
            lineHeight: 1.7,
            fontFamily: "Inter, system-ui, sans-serif"
          }}>
            The page you're looking for doesn't exist or has been moved. Don't worry, let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "Inter, system-ui, sans-serif",
                background: "var(--text)",
                color: "var(--bg)",
                border: "none",
                borderRadius: 6,
                textDecoration: "none",
                transition: "transform 0.2s ease, opacity 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Go to Homepage
            </Link>

            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "Inter, system-ui, sans-serif",
                background: "transparent",
                color: "var(--text)",
                border: "2px solid var(--border)",
                borderRadius: 6,
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--text)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Contact Support
            </Link>
          </div>

          {/* Helpful Links */}
          <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <p style={{
              fontSize: 14,
              color: "var(--muted)",
              marginBottom: 16,
              fontFamily: "Inter, system-ui, sans-serif"
            }}>
              Popular pages you might be looking for:
            </p>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/pricing" style={{ fontSize: 14, color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>
                Pricing
              </Link>
              <Link href="/dashboard" style={{ fontSize: 14, color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>
                Dashboard
              </Link>
              <Link href="/privacy" style={{ fontSize: 14, color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>
                Privacy Policy
              </Link>
              <Link href="/terms" style={{ fontSize: 14, color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
