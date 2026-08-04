"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          display: "inline-block",
          fontFamily: "monospace",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: "#FFFFFF",
          background: "linear-gradient(135deg, #C79A3E 0%, #A67C2E 100%)",
          padding: "6px 14px",
          borderRadius: 4,
          textTransform: "uppercase",
          marginBottom: 20,
          boxShadow: "0 2px 10px rgba(199,154,62,0.3)"
        }}>
          ⚡ Founder Pricing
        </div>

        <h1 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: 36,
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
          margin: "0 auto 16px",
          lineHeight: 1.6,
        }}>
          Lock in founder pricing during our early access period. Pay once, yours forever—no subscriptions, no renewals.
        </p>
        <p style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "#8B6914",
          letterSpacing: "0.04em"
        }}>
          Early adopters get lifetime access at the lowest prices we'll ever offer
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", alignItems: "stretch", marginBottom: 56 }}>
        {plans.map((plan, i) => {
          const isFounder = plan.name.toLowerCase().includes('starter') || plan.name.toLowerCase().includes('pro');
          const isMostPopular = plan.name.toLowerCase().includes('starter');
          
          return (
            <div key={i} style={{
              background: "var(--bg)",
              border: `2px solid ${isFounder ? '#C79A3E' : 'var(--border)'}`,
              borderRadius: 12,
              padding: 32,
              width: 320,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              boxShadow: isMostPopular ? "0 8px 30px rgba(199,154,62,0.15)" : "0 4px 20px rgba(0,0,0,0.05)",
              position: "relative",
              transform: isMostPopular ? "scale(1.03)" : "scale(1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}>
              {isMostPopular && (
                <div style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #C79A3E 0%, #A67C2E 100%)",
                  color: "#FFFFFF",
                  padding: "6px 16px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: "monospace",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  boxShadow: "0 2px 10px rgba(199,154,62,0.4)"
                }}>
                  Most Popular
                </div>
              )}

              {isFounder && (
                <div style={{
                  background: "rgba(199,154,62,0.12)",
                  border: "1px solid #C79A3E",
                  padding: "5px 12px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "#8B6914",
                  marginBottom: 16,
                  display: "inline-block",
                  alignSelf: "flex-start",
                  letterSpacing: "0.04em",
                  fontWeight: 500
                }}>
                  Founder Pricing
                </div>
              )}

              <h3 style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 24,
                fontWeight: 400,
                color: "var(--text)",
                margin: `${isFounder ? '0' : '36px'} 0 12px`,
              }}>
                {plan.name}
              </h3>

              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 300, fontFamily: "Fraunces, Georgia, serif", color: "var(--text)" }}>
                  ${(plan.price / 100).toFixed(2)}
                </span>
                {plan.price > 0 && (
                  <span style={{ fontSize: 13, fontFamily: "Inter, system-ui, sans-serif", color: "var(--muted)" }}>
                    one-time
                    <Link href="/terms#founder-pricing" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600, marginLeft: 2 }}>*</Link>
                  </span>
                )}
              </div>
              
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isMostPopular ? "#C79A3E" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {plan.link_limit === -1 ? "Unlimited links" : `${plan.link_limit} Permanent Links`}
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isMostPopular ? "#C79A3E" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Unlimited Redirects
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isMostPopular ? "#C79A3E" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Basic Analytics
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isMostPopular ? "#C79A3E" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Custom slugs
                </li>
                {isFounder && (
                  <>
                    <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isMostPopular ? "#C79A3E" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Link capacity locked forever
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontFamily: "Inter, system-ui, sans-serif", color: "var(--text)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isMostPopular ? "#C79A3E" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Discounts on future features
                    </li>
                  </>
                )}
              </ul>

              <button
                onClick={() => handleCheckout(plan.name)}
                disabled={checkingOut !== null || plan.price === 0}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: plan.price > 0 ? "var(--bg)" : "var(--text)",
                  background: plan.price > 0 ? "var(--text)" : "transparent",
                  border: plan.price > 0 ? "none" : "2px solid var(--border)",
                  borderRadius: 6,
                  cursor: (checkingOut !== null || plan.price === 0) ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: checkingOut === plan.name ? 0.7 : 1,
                }}
                onMouseEnter={e => { 
                  if (plan.price > 0 && checkingOut === null) {
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={e => { 
                  if (checkingOut === null) {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {checkingOut === plan.name ? "Redirecting..." : plan.price > 0 ? "Upgrade now" : "Current plan"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pricing Comparison Table */}
      <div style={{ marginBottom: 56 }}>
        <h2 style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontSize: 28,
          fontWeight: 300,
          color: "var(--text)",
          textAlign: "center",
          marginBottom: 32
        }}>
          Plan Comparison
        </h2>

        <div style={{ 
          maxWidth: 900, 
          margin: "0 auto",
          overflowX: "auto"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 14
          }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <th style={{
                  textAlign: "left",
                  padding: "16px 12px",
                  fontWeight: 500,
                  color: "var(--text)"
                }}>
                  Feature
                </th>
                <th style={{
                  textAlign: "center",
                  padding: "16px 12px",
                  fontWeight: 500,
                  color: "var(--text)"
                }}>
                  Free
                </th>
                <th style={{
                  textAlign: "center",
                  padding: "16px 12px",
                  fontWeight: 500,
                  color: "var(--text)",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span>Founder Starter</span>
                    <span style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: "#8B6914",
                      background: "rgba(199,154,62,0.12)",
                      padding: "2px 8px",
                      borderRadius: 2
                    }}>POPULAR</span>
                  </div>
                </th>
                <th style={{
                  textAlign: "center",
                  padding: "16px 12px",
                  fontWeight: 500,
                  color: "var(--text)"
                }}>
                  Founder Pro
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td style={{ padding: "16px 12px", color: "var(--text)" }}>
                  Permanent Links
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center", color: "var(--muted)" }}>
                  30
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center", color: "var(--text)", fontWeight: 500 }}>
                  1,500
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center", color: "var(--text)", fontWeight: 500 }}>
                  10,000
                </td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td style={{ padding: "16px 12px", color: "var(--text)" }}>
                  Unlimited Redirects
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td style={{ padding: "16px 12px", color: "var(--text)" }}>
                  Basic Analytics
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td style={{ padding: "16px 12px", color: "var(--text)" }}>
                  Founder Pricing
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center", color: "var(--muted)" }}>
                  —
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </td>
                <td style={{ padding: "16px 12px", textAlign: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Founder Pricing Section */}
      <div style={{
        background: "rgba(199,154,62,0.08)",
        border: "1px solid #C79A3E",
        borderRadius: 12,
        padding: 36,
        marginBottom: 48
      }}>
        <h3 style={{
          fontSize: 22,
          fontWeight: 400,
          color: "var(--text)",
          marginBottom: 16,
          fontFamily: "Fraunces, Georgia, serif"
        }}>
          Why Founder Pricing?
        </h3>
        <p style={{
          fontSize: 15,
          color: "var(--muted)",
          lineHeight: 1.7,
          marginBottom: 20,
          fontFamily: "Inter, system-ui, sans-serif"
        }}>
          We're launching Rift and want early adopters to benefit from the lowest prices. When you purchase during our early access period, your price is locked in forever—even if we increase prices later.
        </p>
        <ul style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 16
        }}>
          {[
            <>One-time payment<Link href="/terms#founder-pricing" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600, marginLeft: 4 }}>*</Link>, no recurring fees</>,
            "Link capacity locked forever",
            "Discounted pricing on future features",
            "Core features never restricted",
            "Support our launch"
          ].map((benefit, i) => (
            <li key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 14,
              fontFamily: "Inter, system-ui, sans-serif",
              color: "var(--text)"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
        <div style={{
          marginTop: 20,
          padding: 16,
          background: "rgba(199,154,62,0.05)",
          borderRadius: 8,
          fontSize: 13,
          fontFamily: "Inter, system-ui, sans-serif",
          color: "var(--muted)",
          lineHeight: 1.6
        }}>
          <strong style={{ color: "var(--text)" }}>Note:</strong> Your purchased link capacity and unlimited redirects are yours forever. Future advanced features we introduce may require additional purchase, but founder members receive exclusive discounted pricing.
        </div>
      </div>

      {/* Terms and Conditions */}
      <div style={{
        textAlign: "center",
        fontSize: 13,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "var(--muted)",
        lineHeight: 1.6
      }}>
        <p>
          By upgrading, you agree to our{" "}
          <a 
            href="/terms" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#8B6914",
              textDecoration: "none",
              fontWeight: 500,
              borderBottom: "1px solid transparent",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderBottom = "1px solid #8B6914"}
            onMouseLeave={(e) => e.currentTarget.style.borderBottom = "1px solid transparent"}
          >
            Terms of Service
          </a>
          {" "}and{" "}
          <a 
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#8B6914",
              textDecoration: "none",
              fontWeight: 500,
              borderBottom: "1px solid transparent",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderBottom = "1px solid #8B6914"}
            onMouseLeave={(e) => e.currentTarget.style.borderBottom = "1px solid transparent"}
          >
            Privacy Policy
          </a>
          . All sales are final.
        </p>
      </div>
    </main>
  );
}
