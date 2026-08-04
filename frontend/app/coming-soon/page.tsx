"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "this feature";

  return (
    <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ maxWidth: 700, textAlign: "center" }}>
          {/* Icon */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(199,154,62,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px"
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 16,
            lineHeight: 1.2
          }}>
            Coming Soon
          </h1>

          {/* Description */}
          <p style={{
            fontSize: 18,
            color: "var(--muted)",
            marginBottom: 16,
            lineHeight: 1.7,
            fontFamily: "Inter, system-ui, sans-serif"
          }}>
            We're working hard to bring you <strong style={{ color: "var(--text)" }}>{feature}</strong>. This feature is currently in development and will be available soon.
          </p>

          <p style={{
            fontSize: 15,
            color: "var(--muted)",
            marginBottom: 40,
            lineHeight: 1.7,
            fontFamily: "Inter, system-ui, sans-serif"
          }}>
            Stay tuned for updates, or check back later!
          </p>

          {/* Features in Development Badge */}
          <div style={{
            display: "inline-block",
            background: "rgba(199,154,62,0.08)",
            border: "1px solid #C79A3E",
            padding: "12px 24px",
            borderRadius: 8,
            marginBottom: 40
          }}>
            <p style={{
              margin: 0,
              fontSize: 14,
              color: "#8B6914",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 500
            }}>
              ⚡ Part of our ongoing platform development
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
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
              Back to Homepage
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
              Request a Feature
            </Link>
          </div>

          {/* What's Available */}
          <div style={{
            paddingTop: 32,
            borderTop: "1px solid var(--border)"
          }}>
            <p style={{
              fontSize: 15,
              color: "var(--muted)",
              marginBottom: 20,
              fontFamily: "Inter, system-ui, sans-serif"
            }}>
              In the meantime, check out what's already available:
            </p>
            <div style={{ display: "grid", gap: 16, maxWidth: 500, margin: "0 auto" }}>
              <Link
                href="/dashboard"
                style={{
                  padding: "16px 24px",
                  background: "var(--bg-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C79A3E";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4, fontFamily: "Inter, system-ui, sans-serif" }}>
                    Dashboard
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif" }}>
                    Manage your permanent links
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>

              <Link
                href="/pricing"
                style={{
                  padding: "16px 24px",
                  background: "var(--bg-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C79A3E";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4, fontFamily: "Inter, system-ui, sans-serif" }}>
                    Pricing
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif" }}>
                    View founder pricing plans
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
  );
}

export default function ComingSoonPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Suspense fallback={
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
          <div style={{ color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif" }}>Loading...</div>
        </main>
      }>
        <ComingSoonContent />
      </Suspense>
    </div>
  );
}
