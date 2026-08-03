"use client";

/**
 * app/dashboard/page.tsx
 *
 * Orchestrator: owns all state + data fetching. Children receive only props.
 * All mutations (create, edit, toggle, delete) are handled here and passed
 * as callbacks so child components remain purely presentational.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardUser } from "./layout";
import { StatsRow } from "@/components/dashboard/StatCard";
import { LinksSection } from "@/components/dashboard/LinksSection";
import { LinkModal } from "@/components/dashboard/LinkModal";
import { useErrorBanner } from "@/components/dashboard/ErrorBanner";
import type { LinkRecord, Pagination, SubscriptionResponse } from "@/types/dashboard";

// ─── Skeleton primitives ──────────────────────────────────────────────────────

function Sk({ w = "100%", h = 16, r = 4 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div aria-hidden style={{
      width: w, height: h, borderRadius: r,
      background: "var(--surface)",
      animation: "dash-pulse 1.5s ease-in-out infinite alternate",
      flexShrink: 0,
    }} />
  );
}

function DashboardSkeleton() {
  return (
    <main aria-busy="true" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <Sk w={220} h={30} /><div style={{ marginTop: 10 }}><Sk w={180} h={14} /></div>
      </div>
      {/* Stat card skeletons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
            <Sk w={70} h={10} /><Sk w={50} h={28} /><Sk w={100} h={11} />
          </div>
        ))}
      </div>
      {/* Header skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Sk w={140} h={26} /><Sk w={88} h={34} r={4} />
      </div>
      {/* Row skeletons */}
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} style={{ borderBottom: "0.5px solid var(--border)", padding: "18px 0", display: "grid", gridTemplateColumns: "minmax(180px, 260px) minmax(0, 1fr) auto", gap: "0 24px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <Sk w="65%" h={14} /><Sk w="85%" h={11} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Sk w={100} h={10} /><Sk w="90%" h={13} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Sk w={58} h={18} /><Sk w={30} h={18} /><Sk w={58} h={18} /><Sk w={44} h={18} />
          </div>
        </div>
      ))}
    </main>
  );
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 20, minHeight: "60vh" }}>
      <p style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 300, fontSize: 24, color: "var(--text)", margin: 0 }}>
        Failed to load your dashboard.
      </p>
      <p style={{ fontSize: 13.5, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif", margin: 0 }}>
        There was a problem fetching your data. Please try again.
      </p>
      <button
        id="dashboard-retry-btn" onClick={onRetry}
        style={{ marginTop: 8, padding: "9px 22px", fontFamily: "Inter, system-ui, sans-serif", fontSize: 13.5, fontWeight: 500, color: "var(--bg)", background: "var(--text)", border: "none", borderRadius: 4, cursor: "pointer", transition: "opacity 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
      >
        Try again
      </button>
    </main>
  );
}

// ─── Flash message ────────────────────────────────────────────────────────────

function Flash({ message }: { message: string }) {
  return (
    <div style={{
      padding: "10px 16px", marginBottom: 16,
      background: "rgba(58,138,82,0.10)",
      border: "0.5px solid rgba(58,138,82,0.3)",
      borderRadius: 4, fontSize: 13.5,
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#3a8a52",
      animation: "dash-flash-out 2.5s ease forwards",
    }}>
      {message}
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useDashboardUser();
  const { showError } = useErrorBanner();
  const router = useRouter();

  // Data state
  const [rows, setRows] = useState<LinkRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // UI state
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [flash, setFlash] = useState<{ msg: string; key: number } | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch helpers ────────────────────────────────────────────────────────────

  const fetchLinks = useCallback(async (page: number) => {
    const res = await fetch(`/api/proxy/links?page=${page}&page_size=10`, { credentials: "include" });
    if (res.status === 401) {
      window.location.href = "/auth?reason=session_expired";
      throw new Error("unauthorized");
    }
    if (res.status === 429) {
      showError("Too many requests. Please slow down.");
      throw new Error("rate limit");
    }
    if (!res.ok) {
      showError("Connection error. Check your internet and try again.");
      throw new Error("links");
    }
    const json = await res.json();
    setRows(json.links ?? []);
    setPagination(json.pagination ?? null);
  }, [showError]);

  const fetchSubscription = useCallback(async () => {
    const res = await fetch("/api/proxy/subscription", { credentials: "include" });
    if (!res.ok) throw new Error("subscription");
    const json = await res.json();
    setSubscription(json);
  }, []);

  const fetchAll = useCallback(async (page = 1) => {
    setFetchError(false);
    setLoading(true);
    try {
      await Promise.all([fetchLinks(page), fetchSubscription()]);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [fetchLinks, fetchSubscription]);

  // Read initial page from URL on mount
  useEffect(() => {
    const p = parseInt(new URLSearchParams(window.location.search).get("page") ?? "1", 10);
    const page = isNaN(p) || p < 1 ? 1 : p;
    setCurrentPage(page);
    fetchAll(page);
  }, [fetchAll]);

  // ── Flash helper ─────────────────────────────────────────────────────────────

  const showFlash = (msg: string) => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    setFlash({ msg, key: Date.now() });
    flashTimer.current = setTimeout(() => setFlash(null), 2700);
  };

  // ── Mutation handlers ─────────────────────────────────────────────────────────

  const handleModalSuccess = useCallback(async (msg: string) => {
    showFlash(msg);
    await Promise.all([fetchLinks(currentPage), fetchSubscription()]);
  }, [fetchLinks, fetchSubscription, currentPage]);

  const handleToggle = useCallback(async (id: string) => {
    // Optimistic update
    setRows(prev => prev.map(l => l.ID === id ? { ...l, IsActive: !l.IsActive } : l));
    try {
      const res = await fetch(`/api/proxy/links/${id}/status`, { method: "PATCH", credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/auth?reason=session_expired";
        return;
      }
      if (res.status === 404) {
        setRows(prev => prev.filter(l => l.ID !== id));
        showError("That link no longer exists and has been removed.");
        return;
      }
      if (res.status === 429) {
        setRows(prev => prev.map(l => l.ID === id ? { ...l, IsActive: !l.IsActive } : l));
        showError("Too many requests. Please slow down.");
        return;
      }
      if (!res.ok) {
        // Revert on failure
        setRows(prev => prev.map(l => l.ID === id ? { ...l, IsActive: !l.IsActive } : l));
        showError("Failed to update link status.");
      }
    } catch {
      setRows(prev => prev.map(l => l.ID === id ? { ...l, IsActive: !l.IsActive } : l));
      showError("Connection error. Check your internet and try again.");
    }
  }, [showError]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/proxy/links/${id}`, { method: "DELETE", credentials: "include" });
      if (res.status === 401) {
        window.location.href = "/auth?reason=session_expired";
        return;
      }
      if (res.status === 404) {
        setRows(prev => prev.filter(l => l.ID !== id));
        showError("That link no longer exists and has been removed.");
        return;
      }
      if (res.status === 429) {
        showError("Too many requests. Please slow down.");
        return;
      }
      if (res.ok) {
        setRows(prev => prev.filter(l => l.ID !== id));
        // Refresh subscription so links_used updates
        fetchSubscription();
      } else {
        showError("Failed to delete link.");
      }
    } catch {
      showError("Connection error. Check your internet and try again.");
    }
  }, [fetchSubscription, showError]);

  const handlePageChange = useCallback(async (page: number) => {
    window.history.replaceState({}, "", `?page=${page}`);
    setCurrentPage(page);
    await fetchLinks(page);
  }, [fetchLinks]);

  const handleCreateOpen = () => {
    if (subscription?.can_create_links) {
      setCreateOpen(true);
    } else {
      router.push("/dashboard/upgrade");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <>
        <style>{`@keyframes dash-pulse { from { opacity: 1; } to { opacity: 0.5; } }`}</style>
        <DashboardSkeleton />
      </>
    );
  }

  if (fetchError || !subscription) {
    return <DashboardError onRetry={() => fetchAll(currentPage)} />;
  }

  const totalClicks = rows.reduce((s, l) => s + (l.ClickCount ?? 0), 0);

  return (
    <>
      <style>{`
        @keyframes dash-spin  { to { transform: rotate(360deg); } }
        @keyframes dash-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes dash-modal-in { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes dash-flash-out { 0% { opacity: 1; } 70% { opacity: 1; } 100% { opacity: 0; } }
        @media (max-width: 700px) {
          .link-row-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", animation: "dash-fade-in 0.25s ease" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontWeight: 300, fontSize: 32, color: "var(--text)", margin: "0 0 6px", lineHeight: 1.2 }}>
            Welcome, <em style={{ fontStyle: "italic" }}>{user?.username}</em>
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif", margin: 0 }}>
            {user?.email}
          </p>
        </div>

        {/* Stats */}
        <StatsRow
          totalItems={pagination?.total_items ?? 0}
          totalClicks={totalClicks}
          subscription={subscription}
          onCreateOpen={handleCreateOpen}
          onUpgradeClick={() => router.push("/dashboard/upgrade")}
        />

        {/* Flash */}
        {flash && <Flash key={flash.key} message={flash.msg} />}

        {/* Links */}
        <LinksSection
          rows={rows}
          pagination={pagination}
          username={user?.username ?? ""}
          currentPage={currentPage}
          onEdit={link => router.push(`/dashboard/links/${link.ID}`)}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onCreateOpen={handleCreateOpen}
        />
      </main>

      {/* Modals & Panels */}
      <LinkModal
        open={createOpen}
        editLink={null}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
