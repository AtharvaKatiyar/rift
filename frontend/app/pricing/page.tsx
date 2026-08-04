"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrency, formatPrice, PRICES, displayNames } from "@/lib/currency";
import Navbar from "@/components/common/Navbar";

export default function PricingPage() {
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
        'Basic Analytics',
        'Link status management',
        'Custom slugs'
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
        'Advanced Analytics',
        'Custom slugs',
        'Priority email support',
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
        'Advanced Analytics',
        'Custom slugs',
        'Priority support (24/7)',
        'Launch Period Benefits',
        'Price locked forever',
        'API access (coming soon)'
      ],
      cta: 'Get Early Bird Price',
      ctaStyle: 'primary',
      borderColor: 'var(--border)'
    }
  ];

  const handleCTA = () => {
    router.push('/auth?tab=register');
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text)"
    }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: "80px 48px 60px",
        textAlign: "center",
        maxWidth: 900,
        margin: "0 auto"
      }}>
        <div style={{
          display: "inline-block",
          fontFamily: "monospace",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: "#FFFFFF",
          background: "linear-gradient(135deg, #C79A3E 0%, #A67C2E 100%)",
          padding: "8px 16px",
          borderRadius: 6,
          textTransform: "uppercase",
          marginBottom: 24,
          boxShadow: "0 2px 10px rgba(199,154,62,0.3)"
        }}>
          ⚡ Early Access Pricing
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 52px)",
          fontWeight: 300,
          color: "var(--text)",
          marginBottom: 20,
          lineHeight: 1.15,
          fontFamily: "Fraunces, Georgia, serif"
        }}>
          Simple, transparent pricing
        </h1>
        
        <p style={{
          fontSize: 17,
          color: "var(--muted)",
          marginBottom: 16,
          lineHeight: 1.7,
          maxWidth: 680,
          margin: "0 auto 32px",
          fontFamily: "Inter, system-ui, sans-serif"
        }}>
          No subscriptions. No renewals. Pay once and keep your links forever. Lock in early bird pricing during our launch period.
        </p>
      </section>

      {/* Pricing Cards */}
      <section style={{
        padding: "0 48px 80px",
        maxWidth: 1100,
        margin: "0 auto"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 32,
          marginBottom: 48
        }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                background: "var(--bg)",
                border: `2px solid ${plan.borderColor}`,
                borderRadius: 12,
                padding: 40,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: plan.mostPopular ? "0 8px 30px rgba(199,154,62,0.15)" : "0 4px 20px rgba(0,0,0,0.05)",
                transform: plan.mostPopular ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}
            >
              {plan.mostPopular && (
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

              {plan.badge && (
                <div style={{
                  background: "rgba(199,154,62,0.12)",
                  border: "1px solid #C79A3E",
                  padding: "5px 12px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "#8B6914",
                  marginBottom: 20,
                  display: "inline-block",
                  alignSelf: "flex-start",
                  letterSpacing: "0.04em",
                  fontWeight: 500
                }}>
                  {plan.badge}
                </div>
              )}

              <h3 style={{
                fontSize: 26,
                fontWeight: 400,
                color: "var(--text)",
                marginBottom: 12,
                marginTop: plan.badge ? 0 : 20,
                fontFamily: "Fraunces, Georgia, serif"
              }}>
                {plan.name}
              </h3>

              <div style={{ marginBottom: 28 }}>
                <div style={{
                  fontSize: 42,
                  fontFamily: "Fraunces, Georgia, serif",
                  fontWeight: 300,
                  color: "var(--text)",
                  marginBottom: 6
                }}>
                  {plan.price}
                </div>
                <div style={{
                  fontSize: 13,
                  fontFamily: "Inter, system-ui, sans-serif",
                  color: "var(--muted)"
                }}>
                  {plan.priceSubtext}
                </div>
              </div>

              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 36px",
                flex: 1
              }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 14,
                    fontSize: 14,
                    fontFamily: "Inter, system-ui, sans-serif",
                    color: "var(--text)",
                    lineHeight: 1.5
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={plan.mostPopular ? "#C79A3E" : "var(--accent)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCTA()}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "Inter, system-ui, sans-serif",
                  background: plan.ctaStyle === 'primary' ? "var(--text)" : "transparent",
                  color: plan.ctaStyle === 'primary' ? "var(--bg)" : "var(--text)",
                  border: plan.ctaStyle === 'ghost' ? "2px solid var(--border)" : "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.85";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Early Bird Details */}
        <div style={{
          background: "rgba(199,154,62,0.08)",
          border: "1px solid #C79A3E",
          borderRadius: 12,
          padding: 40,
          marginBottom: 48
        }}>
          <h3 style={{
            fontSize: 22,
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 16,
            fontFamily: "Fraunces, Georgia, serif"
          }}>
            Why Early Bird Pricing?
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
              "One-time payment, no recurring fees",
              "Price locked forever",
              "All future updates included",
              "No feature restrictions later",
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
        </div>

        {/* FAQ Section */}
        <div style={{
          maxWidth: 800,
          margin: "0 auto"
        }}>
          <h3 style={{
            fontSize: 28,
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 32,
            textAlign: "center",
            fontFamily: "Fraunces, Georgia, serif"
          }}>
            Frequently Asked Questions
          </h3>
          
          {[
            {
              q: "Do my links expire?",
              a: "Never. Once you create a link, it's yours permanently. You can update where it points as many times as you want. This is a one-time payment—no renewals, no expiration."
            },
            {
              q: "Can I upgrade later?",
              a: "Yes! You can upgrade from Free to Starter or Pro at any time. However, early bird pricing is only available during our launch period, so upgrading later may cost more."
            },
            {
              q: "What's included in 'Launch Period Benefits'?",
              a: "Early adopters lock in the lowest prices we'll ever offer. Your price never increases, you get lifetime access to your links, and all future platform improvements are included at no extra cost."
            },
            {
              q: "Can features or pricing change in the future?",
              a: "Your purchased link capacity is locked in forever—you'll always have lifetime access to create that many redirecting links at no extra charge. However, advanced features we introduce in the future may require additional purchase. Early bird customers will receive discounted pricing on future premium features."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards and debit cards through our secure payment processor. Payments are processed in USD or INR depending on your location."
            },
            {
              q: "Do you offer refunds?",
              a: "Due to the nature of lifetime access, all sales are final. We recommend starting with the Free plan (30 links) to try Rift risk-free before upgrading."
            }
          ].map((faq, i) => (
            <details key={i} style={{
              marginBottom: 20,
              borderBottom: "1px solid var(--border)",
              paddingBottom: 20
            }}>
              <summary style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--text)",
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
                paddingBottom: 12
              }}>
                {faq.q}
              </summary>
              <p style={{
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1.7,
                marginTop: 12,
                paddingLeft: 4,
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: "linear-gradient(135deg, rgba(199,154,62,0.1) 0%, rgba(166,124,46,0.05) 100%)",
        padding: "80px 48px",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 300,
          color: "var(--text)",
          marginBottom: 16,
          fontFamily: "Fraunces, Georgia, serif"
        }}>
          Ready to get started?
        </h2>
        <p style={{
          fontSize: 16,
          color: "var(--muted)",
          marginBottom: 32,
          maxWidth: 600,
          margin: "0 auto 32px",
          fontFamily: "Inter, system-ui, sans-serif"
        }}>
          Create your account and start with 30 free links. Upgrade anytime.
        </p>
        <a
          href="/auth?tab=register"
          style={{
            display: "inline-block",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--bg)",
            background: "var(--text)",
            padding: "16px 40px",
            borderRadius: 6,
            textDecoration: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            transition: "transform 0.2s ease, opacity 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Start Free Today
        </a>
      </section>
    </div>
  );
}
