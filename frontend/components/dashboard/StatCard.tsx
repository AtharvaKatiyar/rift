"use client";

import { useState } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  accentColor: string;
  subtext: React.ReactNode;
  onSubtextClick?: () => void;
}

export function StatCard({ label, value, accentColor, subtext, onSubtextClick }: StatCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        padding: "24px",
        minHeight: 120,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 3,
          width: hovered ? "100%" : 26,
          background: accentColor,
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      <p style={{
        fontSize: 11, fontWeight: 500, color: "var(--muted)", letterSpacing: "0.12em",
        textTransform: "uppercase", fontFamily: "JetBrains Mono, Courier New, monospace",
        margin: "0",
      }}>
        {label}
      </p>

      <p style={{
        fontSize: 36, fontFamily: "Fraunces, Georgia, serif", fontWeight: 300,
        color: "var(--text)", margin: "12px 0 8px", lineHeight: 1,
      }}>
        {value}
      </p>

      <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "Inter, system-ui, sans-serif" }}>
        {onSubtextClick ? (
          <button
            onClick={onSubtextClick}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              fontSize: 13, color: "var(--muted)", fontFamily: "inherit",
              textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 2,
            }}
          >
            {subtext}
          </button>
        ) : subtext}
      </div>
    </div>
  );
}

interface StatsRowProps {
  totalItems: number;
  totalClicks: number;
  subscription: {
    plan: string;
    links_used: number;
    link_limit: number;
    can_create_links: boolean;
    can_upgrade_to: string[];
  };
  onCreateOpen: () => void;
  onUpgradeClick: () => void;
}

export function StatsRow({ totalItems, totalClicks, subscription, onCreateOpen, onUpgradeClick }: StatsRowProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: 16,
      marginBottom: 32,
    }}>
      <StatCard
        label="Total Links"
        accentColor="#C79A3E"
        value={totalItems}
        subtext={subscription.can_create_links ? "Create a new link" : "Link limit reached — Upgrade"}
        onSubtextClick={onCreateOpen}
      />
      <StatCard
        label="Total Clicks"
        accentColor="#A6503B"
        value={totalClicks.toLocaleString()}
        subtext="Across all your links"
      />
      <StatCard
        label="Plan"
        accentColor="#4C5A78"
        value={subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
        subtext={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span>{subscription.links_used} / {subscription.link_limit} links used</span>
            {subscription.can_upgrade_to.length > 0 && (
              <button
                onClick={onUpgradeClick}
                style={{
                  background: "none", border: "none", padding: 0,
                  color: "#4C5A78", textDecoration: "underline", textDecorationStyle: "dotted",
                  textUnderlineOffset: 2, fontSize: 11.5, fontWeight: 500, cursor: "pointer",
                }}>
                Upgrade
              </button>
            )}
          </span>
        }
      />
    </div>
  );
}
