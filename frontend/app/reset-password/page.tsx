"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/auth";
import { Suspense } from "react";

function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "rift-spin 0.7s linear infinite",
        verticalAlign: "middle",
        marginRight: 8,
      }}
    />
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // mounted guards against SSR: useSearchParams() returns null server-side,
  // so without this flag the redirect fires before client hydration reads
  // the real ?token= from the URL, silently sending the user to /forgot-password.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only redirect after the client has hydrated and search params are real
  useEffect(() => {
    if (mounted && !token) {
      router.replace("/forgot-password");
    }
  }, [mounted, token, router]);

  // After success, redirect to /auth after 2 seconds
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => router.replace("/auth"), 2000);
      return () => clearTimeout(t);
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        // Never expose raw backend error — map everything to a safe message
        setError("This reset link is invalid or has expired.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Show nothing until mounted so we never flash wrong content server-side
  if (!mounted) return null;
  if (!token) return null; // redirect in progress

  return (
    <>
      <style>{`
        @keyframes rift-spin { to { transform: rotate(360deg); } }
      `}</style>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            background: "var(--auth-card-bg)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid var(--auth-card-border)",
            borderLeft: "3px solid var(--auth-accent-strip)",
            borderRadius: 4,
            boxShadow:
              "0 8px 48px rgba(12,10,8,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
            padding: "44px 48px 40px",
          }}
        >
          {/* logo row */}
          <div style={{ marginBottom: 32 }}>
            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                textDecoration: "none",
              }}
            >
              <Image
                src="/rift_off_logo.png"
                alt="Rift"
                width={46}
                height={30}
                className="auth-logo-img"
              />
              <span
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 18,
                  fontWeight: 300,
                  letterSpacing: "0.05em",
                  color: "var(--auth-wordmark)",
                }}
              >
                Rift
              </span>
            </a>
          </div>

          <h1
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontWeight: 300,
              fontSize: 26,
              color: "var(--auth-text-primary)",
              marginBottom: 5,
              lineHeight: 1.2,
            }}
          >
            New <em>password</em>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--auth-text-secondary)",
              marginBottom: 28,
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.5,
            }}
          >
            Choose a new password for your account.
          </p>

          {success ? (
            <div
              style={{
                padding: "16px 18px",
                background: "rgba(166,80,59,0.07)",
                borderLeft: "3px solid var(--accent)",
                borderRadius: 4,
                fontSize: 13.5,
                color: "var(--auth-text-primary)",
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: 1.55,
              }}
            >
              Password updated. Redirecting to sign in…
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* New password */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: "var(--auth-text-secondary)",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                    fontFamily: "Inter, system-ui, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  New password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  required
                  minLength={8}
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
                    transition: "border-color 0.15s",
                    opacity: submitting ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--auth-field-focus)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                />
              </div>

              {/* Confirm password */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: "var(--auth-text-secondary)",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                    fontFamily: "Inter, system-ui, sans-serif",
                    textTransform: "uppercase",
                  }}
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  className="auth-input"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={submitting}
                  required
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
                    transition: "border-color 0.15s",
                    opacity: submitting ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--auth-field-focus)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  style={{
                    fontSize: 12.5,
                    color: "var(--accent)",
                    marginBottom: 8,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                id="reset-password-submit"
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "Inter, system-ui, sans-serif",
                  background: "var(--auth-cta-bg)",
                  color: "var(--auth-cta-text)",
                  borderRadius: 4,
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  marginTop: 8,
                  letterSpacing: "0.01em",
                  transition: "opacity 0.15s",
                  opacity: submitting ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  if (!submitting) e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  if (!submitting) e.currentTarget.style.opacity = "1";
                }}
              >
                {submitting && <Spinner />}
                Update password
              </button>
            </form>
          )}

          <div
            style={{
              marginTop: 20,
              fontSize: 12.5,
              color: "var(--auth-text-secondary)",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            <a
              href="/auth"
              style={{ color: "var(--auth-accent-link)", textDecoration: "none" }}
            >
              ← Back to sign in
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
