"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboardUser } from "@/app/dashboard/layout";
import { useErrorBanner } from "@/components/dashboard/ErrorBanner";

export default function UpgradePage() {
  const { user } = useDashboardUser();
  const { showError } = useErrorBanner();
  const router = useRouter();

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch("/api/proxy/subscription/plans");
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans || []);
        } else {
          showError("Failed to fetch plans.");
        }
      } catch {
        showError("Connection error.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [showError]);

  const handleCheckout = async (planName: string) => {
    setCheckingOut(planName);
    try {
      const res = await fetch("/api/proxy/subscription/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName.toLowerCase() }),
      });
      if (res.status === 401) {
        window.location.href = "/auth?reason=session_expired";
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        showError(body.error || "Failed to start checkout process.");
        setCheckingOut(null);
        return;
      }
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        showError("Invalid checkout URL received.");
        setCheckingOut(null);
      }
    } catch {
      showError("Connection error.");
      setCheckingOut(null);
    }
  };

  if (loading) {
    return (
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <p style={{ fontFamily: "Inter, system-ui, sans-serif", color: "var(--muted)" }}>Loading plans...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", animation: "dash-fade-in 0.25s ease" }}>
      <button
        onClick={() => router.push("/dashboard")}
        style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontSize: 13, fontFamily: "Inter, system-ui, sans-serif",
          color: "var(--muted)", marginBottom: 32, display: "flex", alignItems: "center", gap: 6,
        }}
      >
        <span style={{ fontSize: 16 }}>←</span> Back to Dashboard
      </button>

      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h1 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: 32,
          fontWeight: 300,
          color: "var(--text)",
          margin: "0 0 16px",
        }}>
          Upgrade your account
        </h1>
        <p style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 15,
          color: "var(--muted)",
          maxWidth: 600,
          margin: "0 auto",
        }}>
          Select a one-time plan to unlock advanced features and create more links. Pay once, yours forever.
        </p>
      </div>

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
              onClick={() => handleCheckout(plan.name)}
              disabled={checkingOut !== null || plan.price === 0}
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
                cursor: (checkingOut !== null || plan.price === 0) ? "not-allowed" : "pointer",
                transition: "opacity 0.15s",
                opacity: checkingOut === plan.name ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (plan.price > 0 && checkingOut === null) e.currentTarget.style.opacity = "0.8"; }}
              onMouseLeave={e => { if (checkingOut === null) e.currentTarget.style.opacity = "1"; }}
            >
              {checkingOut === plan.name ? "Redirecting..." : plan.price > 0 ? "Upgrade now" : "Current plan"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
