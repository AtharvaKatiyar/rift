"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";

export default function EmailVerificationErrorPage() {
  const { user } = useAuth();
  const [emailInput, setEmailInput] = useState("");
  const [resent, setResent] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleResend = async () => {
    const emailToUse = user?.email ?? emailInput.trim();
    if (!emailToUse) {
      setShowEmailInput(true);
      return;
    }

    setSending(true);
    try {
      await apiFetch("/auth/verify-email/request", {
        method: "POST",
        body: JSON.stringify({ email: emailToUse }),
      });
    } catch {
      // swallow — we always show the safe message
    } finally {
      setSending(false);
      setResent(true);
    }
  };

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

      {/* Warning icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(166,80,59,0.08)",
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
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
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
        Verification failed
      </h1>

      <p
        style={{
          fontSize: 14,
          color: "var(--muted)",
          fontFamily: "Inter, system-ui, sans-serif",
          lineHeight: 1.55,
          maxWidth: 340,
          margin: 0,
        }}
      >
        This link may have expired or already been used. Request a new one
        below.
      </p>

      {/* Email input — shown when user is not logged in and clicks resend */}
      {showEmailInput && !user && !resent && (
        <div style={{ width: "100%", maxWidth: 320, textAlign: "left" }}>
          <label
            style={{
              display: "block",
              fontSize: 11.5,
              fontWeight: 500,
              color: "var(--muted)",
              letterSpacing: "0.06em",
              marginBottom: 6,
              fontFamily: "Inter, system-ui, sans-serif",
              textTransform: "uppercase",
            }}
          >
            Your email
          </label>
          <input
            type="email"
            className="auth-input"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: "100%",
              height: 40,
              padding: "0 14px",
              fontSize: 14,
              fontFamily: "Inter, system-ui, sans-serif",
              background: "var(--auth-field-bg)",
              border: "var(--auth-field-border)",
              borderRadius: 4,
              color: "var(--auth-field-text)",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--auth-field-focus)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
        </div>
      )}

      {resent ? (
        <p
          style={{
            fontSize: 13.5,
            color: "var(--muted)",
            fontFamily: "Inter, system-ui, sans-serif",
            maxWidth: 320,
          }}
        >
          If an account exists, we&apos;ve sent a new verification email.
        </p>
      ) : (
        <button
          id="resend-verification-btn"
          onClick={handleResend}
          disabled={sending}
          style={{
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "Inter, system-ui, sans-serif",
            background: "var(--text)",
            color: "var(--bg)",
            borderRadius: 4,
            border: "none",
            cursor: sending ? "not-allowed" : "pointer",
            letterSpacing: "0.01em",
            transition: "opacity 0.15s",
            opacity: sending ? 0.7 : 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 4,
          }}
          onMouseEnter={(e) => {
            if (!sending) e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            if (!sending) e.currentTarget.style.opacity = "1";
          }}
        >
          {sending && (
            <>
              <style>{`@keyframes rift-spin { to { transform: rotate(360deg); } }`}</style>
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  border: "2px solid currentColor",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "rift-spin 0.7s linear infinite",
                }}
              />
            </>
          )}
          Resend verification email
        </button>
      )}

      <a
        href="/auth"
        style={{
          fontSize: 12.5,
          color: "var(--auth-accent-link)",
          fontFamily: "Inter, system-ui, sans-serif",
          textDecoration: "none",
        }}
      >
        ← Back to sign in
      </a>
    </main>
  );
}
