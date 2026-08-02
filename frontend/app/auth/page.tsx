"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, mapApiError } from "@/lib/auth";

type Tab = "signin" | "register";

/* ─── Spinner ─── */
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

/* ─── Field ─── */
function Field({
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  disabled,
}: {
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
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
        {label}
      </label>
      <input
        type={type}
        autoComplete={autoComplete}
        className="auth-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
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
          transition: "border-color 0.15s, background 0.15s",
          opacity: disabled ? 0.6 : 1,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--auth-field-focus)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "";
        }}
      />
    </div>
  );
}

/* ─── Auth Page ─── */
export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, refetch } = useAuth();

  const [tab, setTab] = useState<Tab>("signin");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Sign-in fields
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Register fields
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Read ?tab= param
  useEffect(() => {
    if (searchParams.get("tab") === "register") setTab("register");
  }, [searchParams]);

  // If already authenticated, send to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Clear error when tab changes
  useEffect(() => {
    setError("");
  }, [tab]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: siEmail, password: siPassword }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(mapApiError(res.status, body));
        return;
      }
      await refetch();
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(mapApiError(res.status, body));
        return;
      }
      await refetch();
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // While auth check is in progress, show nothing to avoid flash
  if (loading) return null;

  return (
    <>
      <style>{`
        @keyframes rift-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          overflow: "hidden",
        }}
      >
        {/* hero background */}
        <Image
          src="/rift-hero.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "center 35%", zIndex: 0 }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(180deg, rgba(22,20,16,0.35) 0%, rgba(22,20,16,0.55) 100%)",
          }}
        />

        {/* glass card */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 460,
            background: "var(--auth-card-bg)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid var(--auth-card-border)",
            borderLeft: "3px solid var(--auth-accent-strip)",
            borderRadius: 4,
            boxShadow:
              "0 8px 48px rgba(12,10,8,0.28), inset 0 1px 0 rgba(255,255,255,0.4)",
            padding: "44px 48px 40px",
          }}
        >
          <div style={{ minHeight: 494, display: "flex", flexDirection: "column" }}>
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

            {/* heading */}
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
              {tab === "signin" ? (
                <>
                  Welcome <em>back</em>
                </>
              ) : (
                <>
                  Create an <em>account</em>
                </>
              )}
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--auth-text-secondary)",
                marginBottom: 24,
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: 1.5,
              }}
            >
              {tab === "signin"
                ? "Sign in to manage your links"
                : "Start managing your links"}
            </p>

            {/* tabs */}
            <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
              {(["signin", "register"] as Tab[]).map((t) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    id={`auth-tab-${t}`}
                    onClick={() => setTab(t)}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: active
                        ? "1.5px solid var(--auth-accent-link)"
                        : "1.5px solid transparent",
                      padding: "0 0 7px 0",
                      cursor: "pointer",
                      fontSize: active ? 14 : 13.5,
                      color: active
                        ? "var(--auth-text-primary)"
                        : "var(--auth-text-secondary)",
                      fontWeight: active ? 500 : 400,
                      fontFamily: "Inter, system-ui, sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    {t === "signin" ? "Sign in" : "Register"}
                  </button>
                );
              })}
            </div>

            {/* forms */}
            {tab === "signin" ? (
              <form onSubmit={handleSignIn}>
                <Field
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={siEmail}
                  onChange={setSiEmail}
                  disabled={submitting}
                />
                <Field
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={siPassword}
                  onChange={setSiPassword}
                  disabled={submitting}
                />

                {/* Forgot password link */}
                <div style={{ marginBottom: 8, marginTop: -4 }}>
                  <a
                    href="/forgot-password"
                    style={{
                      fontSize: 12,
                      color: "var(--auth-accent-link)",
                      fontFamily: "Inter, system-ui, sans-serif",
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Error message */}
                {error && (
                  <p
                    role="alert"
                    style={{
                      fontSize: 12.5,
                      color: "var(--accent)",
                      marginTop: 2,
                      marginBottom: 6,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  id="auth-submit-signin"
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
                  Sign in
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <Field
                  label="Username"
                  autoComplete="username"
                  value={regUsername}
                  onChange={setRegUsername}
                  disabled={submitting}
                />
                <Field
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={regEmail}
                  onChange={setRegEmail}
                  disabled={submitting}
                />
                <Field
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={setRegPassword}
                  disabled={submitting}
                />

                {/* Error message */}
                {error && (
                  <p
                    role="alert"
                    style={{
                      fontSize: 12.5,
                      color: "var(--accent)",
                      marginTop: 2,
                      marginBottom: 6,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  id="auth-submit-register"
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
                  Create account
                </button>
              </form>
            )}

            {/* footer line */}
            <div
              style={{
                marginTop: 16,
                fontSize: 12.5,
                color: "var(--auth-text-secondary)",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {tab === "signin" ? (
                <span>
                  No account?{" "}
                  <button
                    onClick={() => setTab("register")}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: 12.5,
                      color: "var(--auth-accent-link)",
                      cursor: "pointer",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    Create one
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => setTab("signin")}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontSize: 12.5,
                      color: "var(--auth-accent-link)",
                      cursor: "pointer",
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
