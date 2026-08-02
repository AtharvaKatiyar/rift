"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";

/**
 * VerifyEmailBanner
 *
 * Renders directly below the dashboard navbar (not fixed).
 * Disappears automatically if user.email_verified becomes true after a refetch.
 * Must not render on auth pages — ensure this is only included in the dashboard layout.
 */
export function VerifyEmailBanner() {
  const { user, refetch } = useAuth();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Don't render if verified or no user
  if (!user || user.email_verified) return null;

  const handleResend = async () => {
    if (sent || sending) return;
    setSending(true);
    try {
      await apiFetch("/auth/verify-email/request", {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
      });
    } catch {
      // swallow — show success regardless
    } finally {
      setSending(false);
      setSent(true);
      // Re-check verification status after sending
      await refetch();
    }
  };

  return (
    <div
      role="status"
      style={{
        width: "100%",
        padding: "12px 20px",
        background: "rgba(155, 126, 74, 0.10)",
        borderLeft: "3px solid #9B7E4A",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 13.5,
        color: "var(--text)",
        boxSizing: "border-box",
      }}
    >
      <span style={{ flex: 1, minWidth: 200 }}>
        Your email isn&apos;t verified yet.
      </span>

      {sent ? (
        <span
          style={{
            fontSize: 12.5,
            color: "var(--muted)",
          }}
        >
          Verification email sent.
        </span>
      ) : (
        <button
          id="verify-email-banner-resend"
          onClick={handleResend}
          disabled={sending}
          style={{
            padding: "6px 14px",
            fontSize: 12.5,
            fontWeight: 500,
            fontFamily: "Inter, system-ui, sans-serif",
            background: "#9B7E4A",
            color: "#fff",
            borderRadius: 4,
            border: "none",
            cursor: sending ? "not-allowed" : "pointer",
            letterSpacing: "0.01em",
            transition: "opacity 0.15s",
            opacity: sending ? 0.7 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
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
                  width: 12,
                  height: 12,
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
    </div>
  );
}
