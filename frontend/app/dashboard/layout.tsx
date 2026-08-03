"use client";

/**
 * app/dashboard/layout.tsx
 *
 * Dashboard shell layout.
 *  - Calls GET /api/proxy/auth/me on mount; redirects to /auth?reason=session_expired on 401.
 *  - Provides user + refetch via DashboardContext to all child pages.
 *  - Renders the sticky navbar (logo + avatar + sign-out).
 *  - Renders VerifyEmailBanner directly below the navbar when email is unverified.
 *  - Applies the existing ThemeContext (dark mode already wired in root layout).
 *  - No glassmorphism — product UI only.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { VerifyEmailBanner } from "@/components/VerifyEmailBanner";
import { ErrorBannerProvider } from "@/components/dashboard/ErrorBanner";

// ─── Dashboard user context ───────────────────────────────────────────────────

export interface DashboardUser {
  id: string;
  email: string;
  username: string;
  email_verified: boolean;
}

interface DashboardCtx {
  user: DashboardUser | null;
  refetch: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardCtx>({
  user: null,
  refetch: async () => {},
});

export function useDashboardUser() {
  return useContext(DashboardContext);
}

// ─── Sign-out spinner ─────────────────────────────────────────────────────────

function NavSpinner() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        border: "1.5px solid currentColor",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "dash-spin 0.7s linear infinite",
        marginRight: 5,
        verticalAlign: "middle",
      }}
    />
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function DashboardNav({
  user,
  onSignOut,
  signingOut,
}: {
  user: DashboardUser;
  onSignOut: () => void;
  signingOut: boolean;
}) {
  const initial = (user.username[0] ?? "?").toUpperCase();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        height: 64,
        background: "var(--bg)",
        borderBottom: "0.5px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxSizing: "border-box",
      }}
    >
      {/* Left — logo + wordmark */}
      <a
        href="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <Image
          src="/rift_off_logo.png"
          alt="Rift logo"
          width={34}
          height={22}
          style={{ opacity: 0.9, display: "block" }}
        />
        <span
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontWeight: 300,
            fontSize: 16,
            letterSpacing: "0.05em",
            color: "var(--text)",
          }}
        >
          Rift
        </span>
      </a>

      {/* Right — avatar + username + sign-out */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <a href="/dashboard/profile" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          {/* Avatar circle */}
          <div
            aria-hidden
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--surface)",
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
              userSelect: "none",
            }}
          >
            {initial}
          </div>

        {/* Username */}
        <span
          style={{
            fontSize: 14.5,
            color: "var(--text)",
            fontFamily: "Inter, system-ui, sans-serif",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {user.username}
        </span>
        </a>

        {/* Sign out */}
        <button
          id="dashboard-signout-btn"
          onClick={onSignOut}
          disabled={signingOut}
          style={{
            background: "none",
            border: "1px solid var(--border-mid)",
            borderRadius: 4,
            padding: "6px 13px",
            cursor: signingOut ? "not-allowed" : "pointer",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13,
            color: "var(--text)",
            opacity: signingOut ? 0.65 : 1,
            transition: "background 0.13s, border-color 0.13s, opacity 0.13s",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!signingOut)
              e.currentTarget.style.background = "var(--surface)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          {signingOut && <NavSpinner />}
          Sign out
        </button>
      </div>
    </nav>
  );
}

// ─── Nav skeleton (shown while /auth/me is in-flight) ─────────────────────────

function NavSkeleton() {
  return (
    <nav
      aria-hidden
      style={{
        height: 56,
        background: "var(--bg)",
        borderBottom: "0.5px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        style={{
          width: 90,
          height: 16,
          borderRadius: 4,
          background: "var(--surface)",
          animation: "dash-pulse 1.5s ease-in-out infinite alternate",
        }}
      />
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--surface)",
            animation: "dash-pulse 1.5s ease-in-out infinite alternate",
          }}
        />
        <div
          style={{
            width: 80,
            height: 14,
            borderRadius: 4,
            background: "var(--surface)",
            animation: "dash-pulse 1.5s ease-in-out infinite alternate",
          }}
        />
        <div
          style={{
            width: 68,
            height: 30,
            borderRadius: 4,
            background: "var(--surface)",
            animation: "dash-pulse 1.5s ease-in-out infinite alternate",
          }}
        />
      </div>
    </nav>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  // Fetch current user from our proxy (which handles token refresh internally).
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/proxy/auth/me", {
        credentials: "include",
      });
      if (res.status === 401) {
        router.replace("/auth?reason=session_expired");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setUser(data as DashboardUser);
      } else {
        router.replace("/auth?reason=session_expired");
      }
    } catch {
      router.replace("/auth?reason=session_expired");
    }
  }, [router]);

  useEffect(() => {
    fetchUser().finally(() => setAuthLoading(false));
  }, [fetchUser]);

  const refetch = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // Sign out: call proxy logout, clear local state, redirect to /auth.
  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await fetch("/api/proxy/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* best-effort */
    } finally {
      setUser(null);
      window.location.href = "/auth";
    }
  }, []);

  return (
    <ErrorBannerProvider>
      <style>{`
        @keyframes dash-spin  { to { transform: rotate(360deg); } }
        @keyframes dash-pulse { from { opacity: 1; } to { opacity: 0.5; } }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--text)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navbar */}
        {authLoading || !user ? (
          <NavSkeleton />
        ) : (
          <DashboardNav
            user={user}
            onSignOut={handleSignOut}
            signingOut={signingOut}
          />
        )}

        {/* Email verification banner — only when user is loaded and unverified */}
        {!authLoading && user && !user.email_verified && <VerifyEmailBanner />}

        {/* Page content — only rendered once auth is confirmed */}
        {!authLoading && user && (
          <DashboardContext.Provider value={{ user, refetch }}>
            <div style={{ flex: 1 }}>{children}</div>
          </DashboardContext.Provider>
        )}
      </div>
    </ErrorBannerProvider>
  );
}
