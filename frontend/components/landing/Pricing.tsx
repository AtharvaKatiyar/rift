"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Pricing() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/proxy/subscription/plans");
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans || []);
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleUpgrade = () => {
    if (authLoading) return;
    if (user) {
      router.push("/dashboard/upgrade");
    } else {
      router.push("/auth?redirect=/dashboard/upgrade");
    }
  };

  return (
    <section id="pricing" style={{ padding: "120px 24px", background: "var(--bg)", borderTop: "0.5px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 300,
          color: "var(--text)",
          margin: "0 0 16px",
        }}>
          Simple, one-time pricing
        </h2>
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 16,
          color: "var(--muted)",
          maxWidth: 600,
          margin: "0 auto 64px",
          lineHeight: 1.6,
        }}>
          Pay once, use forever. No recurring subscriptions or hidden fees. Upgrade to unlock unlimited links and advanced analytics.
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ width: 320, height: 400, background: "var(--surface)", borderRadius: 8, animation: "dash-pulse 1.5s ease-in-out infinite alternate" }} />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", alignItems: "stretch" }}>
            {plans.map((plan, i) => (
              <div key={i} style={{
                background: "var(--bg)",
                border: "0.5px solid var(--border)",
                borderRadius: 8,
                padding: 32,
                width: 320,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
              }}>
                {plan.price > 0 && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 4,
                    background: "var(--accent)",
                  }} />
                )}
                <h3 style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 24,
                  fontWeight: 500,
                  color: "var(--text)",
                  margin: "0 0 8px",
                }}>
                  {plan.name}
                </h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 300, fontFamily: "Fraunces, Georgia, serif", color: "var(--text)" }}>
                    ${(plan.price / 100).toFixed(2)}
                  </span>
                  {plan.price > 0 && (
                    <span style={{ fontSize: 13, fontFamily: "Inter, system-ui, sans-serif", color: "var(--muted)" }}>one-time</span>
                  )}
                </div>
                
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {plan.link_limit === -1 ? "Unlimited links" : `Up to ${plan.link_limit} links`}
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Advanced analytics
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Custom slugs
                  </li>
                </ul>

                <button
                  onClick={handleUpgrade}
                  disabled={authLoading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: plan.price > 0 ? "var(--bg)" : "var(--text)",
                    background: plan.price > 0 ? "var(--text)" : "transparent",
                    border: plan.price > 0 ? "none" : "0.5px solid var(--border)",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  {plan.price > 0 ? "Upgrade now" : "Get started"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
