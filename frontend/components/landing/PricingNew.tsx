"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrency, formatPrice, PRICES, displayNames } from "@/lib/currency";

export default function PricingNew() {
  const router = useRouter();
  const [currency, setCurrency] = useState<'INR' | 'USD'>('USD');

  useEffect(() => {
    setCurrency(getCurrency());
  }, []);

  const plans = [
    {
      id: 'free',
      badge: null,
      name: displayNames.free,
      price: formatPrice(PRICES.free.USD, PRICES.free.INR, currency),
      priceSubtext: 'Free forever',
      features: [
        '30 Permanent Links',
        'Unlimited Redirects',
        'Basic Analytics'
      ],
      cta: 'Start Free',
      ctaStyle: 'ghost',
      borderColor: 'var(--border)'
    },
    {
      id: 'starter',
      badge: 'Early Bird Pricing',
      name: displayNames.starter,
      price: formatPrice(PRICES.starter.USD, PRICES.starter.INR, currency),
      priceSubtext: <>One-time payment<Link href="/terms#founder-pricing" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600, marginLeft: 2 }}>*</Link></>,
      features: [
        '1,500 Permanent Links',
        'Unlimited Redirects',
        'Basic Analytics',
        'Launch Period Benefits',
        'Price locked forever'
      ],
      cta: 'Get Early Bird Price',
      ctaStyle: 'primary',
      borderColor: '#C79A3E',
      mostPopular: true
    },
    {
      id: 'pro',
      badge: 'Early Bird Pricing',
      name: displayNames.pro,
      price: formatPrice(PRICES.pro.USD, PRICES.pro.INR, currency),
      priceSubtext: <>One-time payment<Link href="/terms#founder-pricing" style={{ color: '#DC2626', textDecoration: 'none', fontWeight: 600, marginLeft: 2 }}>*</Link></>,
      features: [
        '10,000 Permanent Links',
        'Unlimited Redirects',
        'Basic Analytics',
        'Launch Period Benefits',
        'Price locked forever',
        'Priority support'
      ],
      cta: 'Get Early Bird Price',
      ctaStyle: 'primary',
      borderColor: 'var(--border)'
    }
  ];

  const handleCTA = (planId: string) => {
    if (planId === 'free') {
      router.push('/auth?tab=register');
    } else {
      router.push('/pricing');
    }
  };

  return (
    <section id="pricing" style={{ 
      padding: "120px 48px",
      background: "var(--bg-alt)"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{
            fontFamily: "monospace",
            fontSize: 11,
            textTransform: "uppercase",
            color: "var(--muted)",
            letterSpacing: "0.12em",
            marginBottom: 16
          }}>
            Pricing
          </div>
          <h2 className="font-serif" style={{
            fontSize: 38,
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 12,
            lineHeight: 1.2
          }}>
            Simple, one-time pricing.
          </h2>
          <p className="font-sans" style={{
            fontSize: 15,
            color: "var(--muted)",
            marginBottom: 16,
            lineHeight: 1.6
          }}>
            No subscriptions. No renewals. Pay once, keep your links forever.
          </p>
          <p style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: "#8B6914",
            letterSpacing: "0.04em"
          }}>
            Early bird pricing — Lock in the lowest price forever*
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
          marginBottom: 32,
          maxWidth: 980,
          margin: "0 auto 32px"
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: "var(--bg)",
                border: `1px solid ${plan.borderColor}`,
                borderRadius: 8,
                padding: 32,
                position: "relative",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {plan.mostPopular && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--bg)",
                  border: "1px solid #C79A3E",
                  padding: "4px 12px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "#8B6914",
                  whiteSpace: "nowrap"
                }}>
                  Most Popular
                </div>
              )}

              {plan.badge && (
                <div style={{
                  background: "rgba(199,154,62,0.12)",
                  border: "0.5px solid #C79A3E",
                  padding: "3px 10px",
                  borderRadius: 2,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "#8B6914",
                  marginBottom: 20,
                  display: "inline-block",
                  alignSelf: "flex-start",
                  letterSpacing: "0.02em"
                }}>
                  {plan.badge}
                </div>
              )}

              <h3 className="font-serif" style={{
                fontSize: 22,
                fontWeight: 400,
                color: "var(--text)",
                marginBottom: 12,
                marginTop: plan.badge ? 0 : 20
              }}>
                {plan.name}
              </h3>

              <div style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: 36,
                  fontFamily: "Fraunces, Georgia, serif",
                  fontWeight: 300,
                  color: "var(--text)",
                  marginBottom: 4
                }}>
                  {plan.price}
                </div>
                <div style={{
                  fontSize: 12,
                  fontFamily: "Inter, system-ui, sans-serif",
                  color: "var(--muted)"
                }}>
                  {plan.priceSubtext}
                </div>
              </div>

              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 32px",
                flex: 1
              }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 10,
                    fontSize: 14,
                    fontFamily: "Inter, system-ui, sans-serif",
                    color: "var(--text)",
                    lineHeight: 1.5
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCTA(plan.id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "Inter, system-ui, sans-serif",
                  background: plan.ctaStyle === 'primary' ? "var(--text)" : "transparent",
                  color: plan.ctaStyle === 'primary' ? "var(--bg)" : "var(--text)",
                  border: plan.ctaStyle === 'ghost' ? "1px solid var(--border)" : "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div style={{
          textAlign: "center",
          maxWidth: 680,
          margin: "0 auto"
        }}>
          <p style={{
            fontSize: 13,
            fontFamily: "Inter, system-ui, sans-serif",
            color: "var(--muted)",
            lineHeight: 1.6
          }}>
            <Link 
              href="/terms#founder-pricing"
              style={{
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 600
              }}
            >
              *
            </Link>{" "}
            Launch pricing available for a limited time during early access.{" "}
            <a 
              href="/pricing"
              style={{
                color: "#8B6914",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              See full details →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
