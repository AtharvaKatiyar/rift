"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

type Tab = "signin" | "register";

function Field({
  label,
  type = "text",
  autoComplete,
}: {
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
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
        {label}
      </label>
      <input
        type={type}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          padding: "11px 14px",
          fontSize: 14,
          fontFamily: "Inter, system-ui, sans-serif",
          background: "var(--field-bg)",
          border: "1px solid var(--field-border)",
          borderRadius: 4,
          color: "var(--text)",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s, background 0.15s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(166,80,59,0.5)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--field-border)";
        }}
      />
    </div>
  );
}

export default function AuthPage() {
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const [tab, setTab] = useState<Tab>("signin");

  useEffect(() => {
    if (searchParams.get("tab") === "register") setTab("register");
  }, [searchParams]);

  return (
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
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(180deg, rgba(22,20,16,0.35) 0%, rgba(22,20,16,0.55) 100%)",
        }}
      />

      {/* glass card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 460,
          background: "var(--card-bg)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid var(--card-border)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: 12,
          boxShadow: "0 8px 48px rgba(12,10,8,0.28), inset 0 1px 0 rgba(255,255,255,0.4)",
          padding: "44px 48px 40px",
        }}
      >
        {/* logo + theme toggle row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <a
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none" }}
          >
            <Image
              src="/rift_off_logo.png"
              alt="Rift"
              width={46}
              height={30}
              style={{ display: "block", width: "46px", height: "auto", opacity: 0.95 }}
            />
            <span
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 18,
                fontWeight: 300,
                letterSpacing: "0.05em",
                color: "var(--text)",
              }}
            >
              Rift
            </span>
          </a>
          <ThemeToggle variant="card" />
        </div>

        {/* heading */}
        <h1
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontWeight: 300,
            fontSize: 26,
            color: "var(--text)",
            marginBottom: 5,
            lineHeight: 1.2,
          }}
        >
          {tab === "signin" ? <>Welcome <em>back</em></> : <>Create an <em>account</em></>}
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            marginBottom: 24,
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1.5,
          }}
        >
          {tab === "signin" ? "Sign in to manage your links" : "Start managing your links"}
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
                  borderBottom: active ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                  padding: "0 0 7px 0",
                  cursor: "pointer",
                  fontSize: active ? 14 : 13.5,
                  color: active ? "var(--text)" : "var(--muted)",
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

        {/* fields */}
        <form onSubmit={(e) => e.preventDefault()}>
          {tab === "register" && <Field label="Username" autoComplete="username" />}
          <Field label="Email" type="email" autoComplete="email" />
          <Field
            label="Password"
            type="password"
            autoComplete={tab === "signin" ? "current-password" : "new-password"}
          />

          <button
            id="auth-submit"
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "Inter, system-ui, sans-serif",
              background: "var(--text)",
              color: "var(--bg)",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              marginTop: 8,
              letterSpacing: "0.01em",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {tab === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        {/* footer line */}
        <div style={{ marginTop: 16, fontSize: 12.5, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif" }}>
          {tab === "signin" ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <span>
                No account?{" "}
                <button onClick={() => setTab("register")} style={{ background: "none", border: "none", padding: 0, fontSize: 12.5, color: "var(--accent)", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
                  Create one
                </button>
              </span>
              <button style={{ background: "none", border: "none", padding: 0, fontSize: 12.5, color: "var(--muted)", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
                Forgot password
              </button>
            </div>
          ) : (
            <span>
              Already have an account?{" "}
              <button onClick={() => setTab("signin")} style={{ background: "none", border: "none", padding: 0, fontSize: 12.5, color: "var(--accent)", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
