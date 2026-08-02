"use client";

import { useAuth } from "@/context/AuthContext";
import { VerifyEmailBanner } from "@/components/VerifyEmailBanner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

/* ─── Spinner ─── */
function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "rift-spin 0.7s linear infinite",
        verticalAlign: "middle",
        marginRight: 6,
      }}
    />
  );
}

/* ─── Skeleton block ─── */
function Skeleton({ width = "100%", height = 20 }: { width?: string | number; height?: number }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 4,
        background: "var(--surface)",
        animation: "rift-pulse 1.6s ease-in-out infinite",
      }}
    />
  );
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes rift-spin { to { transform: rotate(360deg); } }
          @keyframes rift-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>
        <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
          {/* Navbar skeleton */}
          <nav style={{
            height: 56,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 12,
          }}>
            <Skeleton width={80} height={18} />
          </nav>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
            <Skeleton width={200} height={28} />
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <Skeleton height={100} />
              <Skeleton height={100} />
              <Skeleton height={100} />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!user) return null;

  const initials = user.username
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <style>{`
        @keyframes rift-spin { to { transform: rotate(360deg); } }
        @keyframes rift-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes rift-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        .dash-stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 20px 22px;
          transition: border-color 0.15s;
        }
        .dash-stat-card:hover { border-color: var(--border-mid); }

        .dash-nav-btn {
          background: none;
          border: 1px solid var(--border-mid);
          border-radius: 4px;
          padding: 7px 14px;
          cursor: pointer;
          font-family: Inter, system-ui, sans-serif;
          font-size: 13px;
          color: var(--text);
          transition: background 0.13s, border-color 0.13s;
        }
        .dash-nav-btn:hover { background: var(--surface); border-color: var(--border-mid); }
        .dash-nav-btn-danger { color: var(--accent); border-color: rgba(166,80,59,0.3); }
        .dash-nav-btn-danger:hover { background: rgba(166,80,59,0.06); border-color: var(--accent); }

        .overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.35);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: rift-fade-in 0.15s ease;
        }
        .modal {
          background: var(--bg);
          border: 1px solid var(--border-mid);
          border-radius: 4px;
          padding: 32px 36px;
          max-width: 360px;
          width: 100%;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        {/* Navbar */}
        <nav
          style={{
            height: 56,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            background: "var(--bg)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          {/* Logo */}
          <a
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <Image
              src="/rift_off_logo.png"
              alt="Rift"
              width={36}
              height={24}
              style={{ opacity: 0.9 }}
            />
            <span
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 16,
                fontWeight: 300,
                letterSpacing: "0.05em",
                color: "var(--text)",
              }}
            >
              Rift
            </span>
          </a>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Avatar */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--border-mid)",
                border: "1px solid var(--border-mid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Inter, system-ui, sans-serif",
                color: "var(--text)",
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <span
              style={{
                fontSize: 13,
                color: "var(--muted)",
                fontFamily: "Inter, system-ui, sans-serif",
                maxWidth: 140,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.username}
            </span>

            <button
              id="dashboard-logout-btn"
              className="dash-nav-btn dash-nav-btn-danger"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Sign out
            </button>
          </div>
        </nav>

        {/* Email verification banner — sits directly under navbar */}
        <VerifyEmailBanner />

        {/* Page body */}
        <main
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "40px 24px",
            animation: "rift-fade-in 0.25s ease",
          }}
        >
          {/* Welcome header */}
          <div style={{ marginBottom: 36 }}>
            <h1
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontWeight: 300,
                fontSize: 30,
                color: "var(--text)",
                marginBottom: 6,
                lineHeight: 1.2,
              }}
            >
              Welcome, <em>{user.username}</em>
            </h1>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--muted)",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {user.email}
              {!user.email_verified && (
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: 10,
                    fontSize: 11,
                    fontWeight: 500,
                    background: "rgba(166,80,59,0.12)",
                    color: "var(--accent)",
                    padding: "2px 7px",
                    borderRadius: 20,
                    letterSpacing: "0.04em",
                    verticalAlign: "middle",
                  }}
                >
                  UNVERIFIED
                </span>
              )}
            </p>
          </div>

          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 40,
            }}
          >
            <StatCard label="Total Links" value="—" hint="Create your first link" />
            <StatCard label="Total Clicks" value="—" hint="Across all your links" />
            <StatCard label="Plan" value="Free" hint="Upgrade anytime" />
          </div>

          {/* Coming soon placeholder */}
          <div
            style={{
              border: "1px dashed var(--border-mid)",
              borderRadius: 4,
              padding: "48px 32px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontWeight: 300,
                fontSize: 22,
                color: "var(--text)",
                marginBottom: 8,
              }}
            >
              Your links will appear here
            </p>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--muted)",
                fontFamily: "Inter, system-ui, sans-serif",
                maxWidth: 360,
                margin: "0 auto",
                lineHeight: 1.55,
              }}
            >
              Rift lets you create permanent short links that you can update anytime without breaking existing shares.
            </p>
          </div>
        </main>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontWeight: 300,
                fontSize: 22,
                color: "var(--text)",
                marginBottom: 8,
              }}
            >
              Sign out?
            </h2>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--muted)",
                fontFamily: "Inter, system-ui, sans-serif",
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              You&apos;ll be taken back to the sign in page.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                id="dashboard-logout-cancel"
                className="dash-nav-btn"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
              >
                Cancel
              </button>
              <button
                id="dashboard-logout-confirm"
                className="dash-nav-btn dash-nav-btn-danger"
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  opacity: loggingOut ? 0.7 : 1,
                  cursor: loggingOut ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {loggingOut && <Spinner />}
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="dash-stat-card">
      <p
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "var(--muted)",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          fontFamily: "Inter, system-ui, sans-serif",
          marginBottom: 8,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 26,
          fontFamily: "Fraunces, Georgia, serif",
          fontWeight: 300,
          color: "var(--text)",
          marginBottom: 4,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: 12,
          color: "var(--faint)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {hint}
      </p>
    </div>
  );
}
