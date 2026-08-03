"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { LinkRecord } from "@/types/dashboard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Overview {
  total_clicks: number;
  clicks_today: number;
  unique_visitors: number;
  change_percentage: number;
  trend: string;
  repeat_visitors: number;
  avg_clicks_per_visitor: number;
}
interface TimelinePoint { day: string; clicks: number; }
interface Breakdown { name: string; clicks: number; }
interface RecentClick {
  clicked_at: string;
  referrer: string;
  country: string;
  city: string;
  browser: string;
  os: string;
  device: string;
}
interface AnalyticsData {
  overview: Overview;
  timeline: TimelinePoint[] | null;
  browsers: Breakdown[] | null;
  devices: Breakdown[] | null;
  countries: Breakdown[] | null;
  referrers: Breakdown[] | null;
  recent_clicks: RecentClick[] | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

type Range = "1h" | "24h" | "7d" | "30d" | "90d" | "all";
const RANGES: Range[] = ["1h", "24h", "7d", "30d", "90d", "all"];

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function isAllEmpty(d: AnalyticsData): boolean {
  return (
    d.overview.total_clicks === 0 &&
    !(d.timeline?.length) &&
    !(d.browsers?.length) &&
    !(d.devices?.length) &&
    !(d.countries?.length) &&
    !(d.referrers?.length) &&
    !(d.recent_clicks?.length)
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function Sk({ w = "100%", h = 14 }: { w?: string | number; h?: number }) {
  return (
    <div aria-hidden style={{
      width: w, height: h, borderRadius: 3,
      background: "var(--surface)",
      animation: "dash-pulse 1.5s ease-in-out infinite alternate",
      flexShrink: 0,
    }} />
  );
}

function AnalyticsSkeleton() {
  return (
    <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ border: "0.5px solid var(--border)", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <Sk w={60} h={9} /><Sk w={40} h={20} />
          </div>
        ))}
      </div>
      {/* Timeline */}
      <div>
        <Sk w={80} h={10} />
        <div style={{ marginTop: 12, display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: `${30 + Math.random() * 50}%`, background: "var(--surface)", animation: "dash-pulse 1.5s ease-in-out infinite alternate" }} />
          ))}
        </div>
      </div>
      {/* Rows */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Sk w={90} h={9} />
          {[0, 1, 2].map(j => (
            <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "0.5px solid var(--border)" }}>
              <Sk w="60%" h={12} /><Sk w={30} h={12} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Stat box ──────────────────────────────────────────────────────────────────

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ border: "0.5px solid var(--border)", padding: 16 }}>
      <p style={{ margin: "0 0 6px", fontSize: 10, fontFamily: "JetBrains Mono, Courier New, monospace", textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.1em" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 24, fontFamily: "Fraunces, Georgia, serif", fontWeight: 300, color: "var(--text)", lineHeight: 1 }}>
        {value}
      </p>
    </div>
  );
}

// ─── Bar chart ─────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: TimelinePoint[] }) {
  if (!data.length || data.every(d => d.clicks === 0)) {
    return (
      <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif", margin: 0 }}>No clicks in this period.</p>
      </div>
    );
  }
  const max = Math.max(...data.map(d => d.clicks));
  const showEveryOther = data.length > 10;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 140, padding: "0 4px" }}>
        {data.map((pt, i) => {
          const h = Math.max((pt.clicks / max) * 120, 2);
          return (
            <div
              key={i}
              title={`${pt.clicks} clicks on ${pt.day}`}
              style={{ flex: 1, position: "relative", cursor: "default" }}
              onMouseEnter={e => { (e.currentTarget.firstChild as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.currentTarget.firstChild as HTMLElement).style.opacity = "0.55"; }}
            >
              <div style={{
                width: "100%",
                height: h,
                background: "var(--accent)",
                opacity: 0.55,
                transition: "opacity 0.15s",
                borderRadius: "1px 1px 0 0",
              }} />
            </div>
          );
        })}
      </div>
      {/* X-axis labels */}
      <div style={{ display: "flex", gap: 3, marginTop: 4, padding: "0 4px" }}>
        {data.map((pt, i) => (
          <div key={i} style={{ flex: 1, overflow: "hidden" }}>
            {(!showEveryOther || i % 2 === 0) && (
              <span style={{ fontSize: 9, fontFamily: "JetBrains Mono, Courier New, monospace", color: "var(--faint)", display: "block", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "clip" }}>
                {pt.day.slice(5)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Breakdown table ───────────────────────────────────────────────────────────

function BreakdownTable({ label, rows, empty }: { label: string; rows: Breakdown[] | null; empty: string }) {
  const items = (rows ?? []).slice(0, 5);
  return (
    <div style={{ marginBottom: 24, borderTop: "0.5px solid var(--border)", paddingTop: 20 }}>
      <p style={{ margin: "0 0 12px", fontSize: 11, fontFamily: "JetBrains Mono, Courier New, monospace", textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.1em" }}>
        {label}
      </p>
      {items.length === 0 ? (
        <p style={{ fontSize: 12, color: "var(--faint)", fontFamily: "Inter, system-ui, sans-serif", margin: 0 }}>{empty}</p>
      ) : (
        items.map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid var(--border)" }}>
            <span style={{ fontSize: 13.5, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "78%" }}>
              {row.name || "Direct"}
            </span>
            <span style={{ fontSize: 13, fontFamily: "JetBrains Mono, Courier New, monospace", color: "var(--muted)", flexShrink: 0 }}>
              {row.clicks}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Analytics view ───────────────────────────────────────────────────────────

export interface AnalyticsViewProps {
  link: LinkRecord | null;
  username: string;
  onError: (msg: string) => void;
}

export function AnalyticsView({ link, username, onError }: AnalyticsViewProps) {
  const [range, setRange] = useState<Range>("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const prevLinkId = useRef<string | null>(null);

  const fetchAnalytics = useCallback(async (linkId: string, r: Range) => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await fetch(`/api/proxy/links/${linkId}/analytics?range=${r}`, {
        credentials: "include",
      });
      if (res.status === 401) {
        window.location.href = "/auth?reason=session_expired";
        return;
      }
      if (!res.ok) {
        setFetchError(true);
        onError("Failed to load analytics.");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setFetchError(true);
      onError("Connection error. Check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }, [onError]);

  // Fetch when panel opens or link changes
  useEffect(() => {
    if (!link) { setData(null); setFetchError(false); return; }
    if (link.ID !== prevLinkId.current) {
      prevLinkId.current = link.ID;
      setRange("7d");
      fetchAnalytics(link.ID, "7d");
    }
  }, [link, fetchAnalytics]);

  // Fetch when range changes
  const handleRangeChange = (r: Range) => {
    if (!link) return;
    setRange(r);
    fetchAnalytics(link.ID, r);
  };

  const publicUrl = link
    ? `${BASE_URL}/u/${username}/${link.Slug}/${link.UniqueID}`
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {link && (
        <>
            {/* ── Header ──────────────────────────────────────────── */}
            <div style={{ padding: "0 0 16px", borderBottom: "0.5px solid var(--border)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    margin: "0 0 4px",
                    fontSize: 18,
                    fontFamily: "Fraunces, Georgia, serif",
                    fontWeight: 500,
                    color: "var(--text)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {link.Title}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: 11.5,
                    fontFamily: "JetBrains Mono, Courier New, monospace",
                    color: "var(--muted)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    /u/{username}/<span style={{ color: "var(--accent)" }}>{link.Slug}</span>/{link.UniqueID}
                  </p>
                </div>
              </div>

              {/* Range tabs */}
              <div style={{ display: "flex", gap: 4, marginTop: 14, marginBottom: 20 }}>
                {RANGES.map(r => (
                  <button
                    key={r}
                    onClick={() => handleRangeChange(r)}
                    style={{
                      background: "none", border: "none",
                      borderBottom: range === r ? "2px solid var(--accent)" : "2px solid transparent",
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "JetBrains Mono, Courier New, monospace",
                      color: range === r ? "var(--text)" : "var(--muted)",
                      transition: "color 0.13s, border-color 0.13s",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Body ────────────────────────────────────────────── */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading && <AnalyticsSkeleton />}

              {!loading && fetchError && (
                <div style={{ padding: "40px 20px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif" }}>
                    Failed to load analytics.
                  </p>
                  <button
                    onClick={() => link && fetchAnalytics(link.ID, range)}
                    style={{
                      background: "none", border: "0.5px solid var(--border-mid)",
                      borderRadius: 4, padding: "6px 14px", cursor: "pointer",
                      fontSize: 12.5, fontFamily: "Inter, system-ui, sans-serif",
                      color: "var(--text)", transition: "background 0.13s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--surface)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !fetchError && data && (
                isAllEmpty(data) ? (
                  <div style={{ padding: "60px 20px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 8px", fontSize: 16, fontFamily: "Fraunces, Georgia, serif", fontStyle: "italic", fontWeight: 300, color: "var(--text)" }}>
                      No analytics data yet.
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif" }}>
                      Share your link to start tracking clicks.
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 28 }}>

                    {/* Overview */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                      <StatBox label="Total clicks" value={data.overview.total_clicks.toLocaleString()} />
                      <StatBox label="Top country" value={data.countries?.[0]?.name || "—"} />
                      <StatBox label="Top browser" value={data.browsers?.[0]?.name || "—"} />
                      <StatBox label="Top device" value={data.devices?.[0]?.name || "—"} />
                    </div>

                    {/* Timeline */}
                    <div>
                      <p style={{ margin: "0 0 10px", fontSize: 10, fontFamily: "JetBrains Mono, Courier New, monospace", textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.05em" }}>
                        Clicks over time
                      </p>
                      <BarChart data={data.timeline ?? []} />
                    </div>

                    {/* Referrers */}
                    <BreakdownTable label="Top referrers" rows={data.referrers} empty="No referrer data yet." />

                    {/* Devices */}
                    <BreakdownTable label="Devices" rows={data.devices} empty="No device data yet." />

                    {/* Countries */}
                    <BreakdownTable label="Top countries" rows={data.countries} empty="No location data yet." />

                    {/* Recent clicks */}
                    {(data.recent_clicks?.length ?? 0) > 0 && (
                      <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 20, marginBottom: 24 }}>
                        <p style={{ margin: "0 0 12px", fontSize: 11, fontFamily: "JetBrains Mono, Courier New, monospace", textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.1em" }}>
                          Recent clicks
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: "0 12px" }}>
                          {["When", "Country", "Browser", "Device"].map(h => (
                            <span key={h} style={{ fontSize: 10, fontFamily: "JetBrains Mono, Courier New, monospace", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", paddingBottom: 4 }}>
                              {h}
                            </span>
                          ))}
                          {(data.recent_clicks ?? []).slice(0, 10).map((c, i) => (
                            <Fragment key={i}>
                              <span style={{ fontSize: 12.5, fontFamily: "JetBrains Mono, Courier New, monospace", color: "var(--muted)", padding: "10px 0", borderTop: "0.5px solid var(--border)" }}>{relativeTime(c.clicked_at)}</span>
                              <span style={{ fontSize: 12.5, fontFamily: "JetBrains Mono, Courier New, monospace", color: "var(--text)", padding: "10px 0", borderTop: "0.5px solid var(--border)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.country || "—"}</span>
                              <span style={{ fontSize: 12.5, fontFamily: "JetBrains Mono, Courier New, monospace", color: "var(--text)", padding: "10px 0", borderTop: "0.5px solid var(--border)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.browser || "—"}</span>
                              <span style={{ fontSize: 12.5, fontFamily: "JetBrains Mono, Courier New, monospace", color: "var(--text)", padding: "10px 0", borderTop: "0.5px solid var(--border)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.device || "—"}</span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                    {!(data.recent_clicks?.length) && (
                      <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 20, marginBottom: 24 }}>
                        <p style={{ margin: 0, fontSize: 12, color: "var(--faint)", fontFamily: "Inter, system-ui, sans-serif" }}>No clicks recorded yet.</p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </>
        )}
    </div>
  );
}
