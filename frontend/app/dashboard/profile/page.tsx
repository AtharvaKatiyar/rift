"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardUser } from "@/app/dashboard/layout";
import { apiFetch } from "@/lib/auth";
import { useErrorBanner } from "@/components/dashboard/ErrorBanner";

export default function ProfilePage() {
  const { user, refetch } = useDashboardUser();
  const { showError } = useErrorBanner();
  const router = useRouter();

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (resending || cooldown > 0 || !user || user.email_verified) return;
    setResending(true);
    try {
      await apiFetch("/auth/verify-email/request", {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
      });
      setCooldown(30);
    } catch {
      showError("Failed to resend verification email.");
    } finally {
      setResending(false);
      await refetch();
    }
  };

  const handleLogoutAll = async () => {
    if (loggingOutAll) return;
    setLoggingOutAll(true);
    try {
      const res = await apiFetch("/auth/logout-all", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      } else {
        showError("Failed to log out of other devices.");
      }
    } catch {
      showError("Connection error.");
    } finally {
      setLoggingOutAll(false);
    }
  };

  if (!user) {
    return (
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", color: "var(--muted)" }}>Loading profile...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", animation: "dash-fade-in 0.25s ease" }}>
      <button
        onClick={() => router.push("/dashboard")}
        style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontSize: 13, fontFamily: "Inter, system-ui, sans-serif",
          color: "var(--muted)", marginBottom: 24, display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontSize: 16 }}>←</span> Back to Dashboard
      </button>

      <div style={{
        background: "var(--bg)", border: "0.5px solid var(--border)",
        borderRadius: 4, padding: "32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}>
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif", fontWeight: 300,
          fontSize: 24, color: "var(--text)", margin: "0 0 24px",
        }}>
          Profile Information
        </h2>

        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontSize: 12, fontWeight: 500, color: "var(--muted)",
            fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.03em",
            marginBottom: 6, textTransform: "uppercase"
          }}>
            Username
          </p>
          <p style={{
            fontSize: 16, fontFamily: "Inter, system-ui, sans-serif",
            color: "var(--text)", margin: 0
          }}>
            {user.username}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontSize: 12, fontWeight: 500, color: "var(--muted)",
            fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.03em",
            marginBottom: 6, textTransform: "uppercase"
          }}>
            Email Address
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <p style={{
              fontSize: 16, fontFamily: "Inter, system-ui, sans-serif",
              color: "var(--text)", margin: 0
            }}>
              {user.email}
            </p>
            {user.email_verified ? (
              <span style={{
                background: "rgba(58, 138, 82, 0.1)", color: "#3a8a52",
                padding: "2px 8px", borderRadius: 12, fontSize: 11,
                fontFamily: "JetBrains Mono, Courier New, monospace",
                fontWeight: 500, border: "0.5px solid rgba(58, 138, 82, 0.3)"
              }}>
                Verified
              </span>
            ) : (
              <span style={{
                background: "rgba(166, 80, 59, 0.1)", color: "#A6503B",
                padding: "2px 8px", borderRadius: 12, fontSize: 11,
                fontFamily: "JetBrains Mono, Courier New, monospace",
                fontWeight: 500, border: "0.5px solid rgba(166, 80, 59, 0.3)"
              }}>
                Unverified
              </span>
            )}
          </div>
        </div>

        {!user.email_verified && (
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "0.5px solid var(--border)" }}>
            <p style={{
              fontSize: 13, color: "var(--muted)",
              fontFamily: "Inter, system-ui, sans-serif", marginBottom: 12
            }}>
              Your email is not verified. Please verify your email to ensure you don't lose access to your account.
            </p>
            <button
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              style={{
                padding: "8px 16px",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 13, fontWeight: 500,
                color: "var(--bg)", background: "var(--text)",
                border: "none", borderRadius: 4, cursor: (resending || cooldown > 0) ? "not-allowed" : "pointer",
                transition: "opacity 0.15s", opacity: (resending || cooldown > 0) ? 0.7 : 1,
              }}
            >
              {resending ? "Sending..." : cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend verification email"}
            </button>
          </div>
        )}
      </div>

      <div style={{
        background: "var(--bg)", border: "0.5px solid var(--border)",
        borderRadius: 4, padding: "32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        marginTop: 32,
      }}>
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif", fontWeight: 300,
          fontSize: 24, color: "var(--text)", margin: "0 0 8px",
        }}>
          Security
        </h2>
        <p style={{
          fontSize: 13, color: "var(--muted)",
          fontFamily: "Inter, system-ui, sans-serif", marginBottom: 24
        }}>
          Manage your active sessions and security preferences.
        </p>

        <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 500, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>Log out of all devices</p>
            <p style={{ margin: 0, fontSize: 12.5, fontFamily: "Inter, system-ui, sans-serif", color: "var(--muted)" }}>This will sign you out everywhere, including this device.</p>
          </div>
          <button
            onClick={handleLogoutAll}
            disabled={loggingOutAll}
            style={{
              padding: "8px 16px",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 13, fontWeight: 500,
              color: "#A6503B", background: "rgba(166, 80, 59, 0.1)",
              border: "1px solid rgba(166, 80, 59, 0.3)", borderRadius: 4, cursor: loggingOutAll ? "not-allowed" : "pointer",
              transition: "opacity 0.15s", opacity: loggingOutAll ? 0.7 : 1, whiteSpace: "nowrap"
            }}
          >
            {loggingOutAll ? "Logging out..." : "Log out all devices"}
          </button>
        </div>
      </div>
    </main>
  );
}
