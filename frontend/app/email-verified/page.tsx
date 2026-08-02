"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function EmailVerifiedPage() {
  const { user } = useAuth();
  const destination = user ? "/dashboard" : "/auth";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        gap: 16,
        padding: "40px 16px",
        textAlign: "center",
      }}
    >
      <Image
        src="/rift_off_logo.png"
        alt="Rift"
        width={56}
        height={36}
        className="auth-logo-img"
      />

      {/* Checkmark */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(166,80,59,0.10)",
          border: "1.5px solid var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontWeight: 300,
          fontSize: 28,
          color: "var(--text)",
          marginBottom: 0,
          lineHeight: 1.2,
        }}
      >
        Email verified
      </h1>

      <p
        style={{
          fontSize: 14,
          color: "var(--muted)",
          fontFamily: "Inter, system-ui, sans-serif",
          lineHeight: 1.55,
          maxWidth: 320,
          margin: 0,
        }}
      >
        Your email has been verified. You&apos;re all set.
      </p>

      <a
        id="email-verified-cta"
        href={destination}
        style={{
          marginTop: 8,
          padding: "12px 28px",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "Inter, system-ui, sans-serif",
          background: "var(--text)",
          color: "var(--bg)",
          borderRadius: 4,
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.01em",
          textDecoration: "none",
          transition: "opacity 0.15s",
          display: "inline-block",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Go to dashboard
      </a>
    </main>
  );
}
