"use client";

import Link from "next/link";
import Navbar from "@/components/common/Navbar";

export default function RefundPolicyPage() {
  const lastUpdated = "January 2025";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Navbar />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "120px 48px 96px" }}>
        <header style={{ marginBottom: 56 }}>
          <h1 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: 48,
            fontWeight: 300,
            marginBottom: 16,
            lineHeight: 1.2,
            color: "var(--text)"
          }}>
            Refund Policy
          </h1>
          <p style={{
            fontSize: 15,
            color: "var(--muted)",
            marginBottom: 24,
            fontFamily: "Inter, system-ui, sans-serif"
          }}>
            Last updated: {lastUpdated}
          </p>
          <div style={{
            background: "rgba(199,154,62,0.08)",
            border: "1px solid #C79A3E",
            borderRadius: 8,
            padding: 20,
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: "Inter, system-ui, sans-serif"
          }}>
            <strong style={{ color: "var(--text)" }}>TL;DR:</strong> Founder plans are one-time digital purchases with immediate access. Refunds are generally not available, but we'll review requests for technical issues or accidental purchases within 7 days.
          </div>
        </header>

        <article style={{
          fontSize: 15,
          lineHeight: 1.8,
          color: "var(--text)",
          fontFamily: "Inter, system-ui, sans-serif"
        }}>
          {/* General Policy */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 20,
              color: "var(--text)",
              fontFamily: "Fraunces, Georgia, serif",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 12
            }}>
              General Policy
            </h2>
            <p style={{ marginBottom: 16 }}>
              Rift offers <strong>Founder plans</strong> as one-time digital purchases that provide lifetime access to permanent link management services. Because these are digital products with immediate access granted upon purchase, <strong>all sales are generally final</strong>.
            </p>
            <p>
              By completing a purchase, you acknowledge that you are purchasing a digital service with instant access and that refunds are not typically provided.
            </p>
          </section>

          {/* Why Refunds Are Limited */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 20,
              color: "var(--text)",
              fontFamily: "Fraunces, Georgia, serif",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 12
            }}>
              Why Refunds Are Limited
            </h2>
            <p style={{ marginBottom: 16 }}>
              Our Founder plans are one-time purchases that provide:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Immediate Access:</strong> Your link capacity and features are activated instantly upon payment
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Lifetime Value:</strong> You receive permanent access to your purchased link capacity with no recurring charges
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Digital Nature:</strong> Once accessed, digital services cannot be "returned" like physical products
              </li>
            </ul>
            <p>
              We encourage all users to start with our <strong>Free plan</strong> (30 permanent links) to evaluate the service before purchasing a paid plan.
            </p>
          </section>

          {/* Exceptions and Special Circumstances */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 20,
              color: "var(--text)",
              fontFamily: "Fraunces, Georgia, serif",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 12
            }}>
              Exceptions and Special Circumstances
            </h2>
            <p style={{ marginBottom: 16 }}>
              While refunds are generally not available, we will review requests in the following circumstances:
            </p>

            <div style={{
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 24,
              marginBottom: 24
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 12,
                color: "var(--text)"
              }}>
                Technical Issues
              </h3>
              <p style={{ marginBottom: 0, lineHeight: 1.7 }}>
                If you experience persistent technical problems that prevent you from using the Services and we are unable to resolve them within a reasonable timeframe, we may consider a refund. Please contact us with details of the technical issues you've encountered.
              </p>
            </div>

            <div style={{
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 24,
              marginBottom: 24
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 12,
                color: "var(--text)"
              }}>
                Accidental Purchases
              </h3>
              <p style={{ marginBottom: 0, lineHeight: 1.7 }}>
                If you accidentally purchased the wrong plan or made a duplicate purchase, contact us immediately. We may be able to help if you haven't actively used the services and contact us within 7 days of purchase.
              </p>
            </div>

            <div style={{
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 24,
              marginBottom: 16
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 12,
                color: "var(--text)"
              }}>
                Billing Errors
              </h3>
              <p style={{ marginBottom: 0, lineHeight: 1.7 }}>
                If you were charged incorrectly due to a system error or duplicate charge, we will promptly investigate and issue a refund if appropriate.
              </p>
            </div>

            <div style={{
              background: "rgba(199,154,62,0.08)",
              border: "1px solid rgba(199,154,62,0.4)",
              borderRadius: 8,
              padding: 20,
              marginTop: 24
            }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>
                <strong>Important:</strong> All refund requests must be submitted within <strong>7 days of purchase</strong>. Requests submitted after 7 days will not be reviewed.
              </p>
            </div>
          </section>

          {/* What Is NOT Eligible */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 20,
              color: "var(--text)",
              fontFamily: "Fraunces, Georgia, serif",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 12
            }}>
              What Is NOT Eligible for Refunds
            </h2>
            <p style={{ marginBottom: 16 }}>
              Refunds will not be issued in the following cases:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 8 }}>
                Change of mind after purchasing and using the service
              </li>
              <li style={{ marginBottom: 8 }}>
                Dissatisfaction with features that were clearly described before purchase
              </li>
              <li style={{ marginBottom: 8 }}>
                Account termination due to violation of our Terms of Service
              </li>
              <li style={{ marginBottom: 8 }}>
                Requests submitted more than 7 days after purchase
              </li>
              <li style={{ marginBottom: 8 }}>
                Purchases where services have been actively and extensively used
              </li>
              <li style={{ marginBottom: 8 }}>
                User error or lack of understanding of the service (we encourage trying the Free plan first)
              </li>
            </ul>
          </section>

          {/* How to Request a Refund */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 20,
              color: "var(--text)",
              fontFamily: "Fraunces, Georgia, serif",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 12
            }}>
              How to Request a Refund
            </h2>
            <p style={{ marginBottom: 16 }}>
              If you believe your situation qualifies for a refund under the exceptions listed above, please:
            </p>
            <ol style={{ paddingLeft: 24, marginBottom: 24, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 12 }}>
                <strong>Contact us within 7 days</strong> of your purchase
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Email:</strong> <a href="mailto:support@rift.dpdns.org" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>support@rift.dpdns.org</a>
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Include:</strong> Your account email, purchase date, plan purchased, and detailed explanation of why you're requesting a refund
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Subject Line:</strong> "Refund Request - [Your Account Email]"
              </li>
            </ol>

            <div style={{
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 24,
              marginTop: 24
            }}>
              <p style={{ marginBottom: 12, fontSize: 15 }}>
                <strong>Contact Email:</strong>{" "}
                <a href="mailto:support@rift.dpdns.org" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>
                  support@rift.dpdns.org
                </a>
              </p>
              <p style={{ marginBottom: 12, fontSize: 15 }}>
                <strong>Response Time:</strong> We will review your request and respond within 72 hours
              </p>
              <p style={{ marginBottom: 0, fontSize: 15 }}>
                <strong>Review Process:</strong> Each request is reviewed individually. Approval is not guaranteed and is at our sole discretion.
              </p>
            </div>
          </section>

          {/* Refund Processing */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 20,
              color: "var(--text)",
              fontFamily: "Fraunces, Georgia, serif",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 12
            }}>
              Refund Processing
            </h2>
            <p style={{ marginBottom: 16 }}>
              If your refund request is approved:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 8 }}>
                Refunds will be processed to the original payment method used for purchase
              </li>
              <li style={{ marginBottom: 8 }}>
                Processing time is typically 5-10 business days, depending on your payment provider
              </li>
              <li style={{ marginBottom: 8 }}>
                Your account will be downgraded to the Free plan upon refund approval
              </li>
              <li style={{ marginBottom: 8 }}>
                Access to paid plan features will be revoked immediately
              </li>
            </ul>
          </section>

          {/* Try Before You Buy */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 20,
              color: "var(--text)",
              fontFamily: "Fraunces, Georgia, serif",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 12
            }}>
              Try Before You Buy
            </h2>
            <p style={{ marginBottom: 16 }}>
              To minimize the risk of purchasing a plan that doesn't meet your needs:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Start with the Free Plan:</strong> Test Rift with 30 permanent links at no cost
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Review the Features:</strong> Carefully review plan features on our <Link href="/pricing" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>Pricing page</Link>
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Read the Terms:</strong> Understand the <Link href="/terms#founder-pricing" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>Founder Pricing terms</Link> before purchasing
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Contact Support:</strong> Ask questions before purchasing if you're unsure about any features
              </li>
            </ul>
          </section>

          {/* Contact Information */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 20,
              color: "var(--text)",
              fontFamily: "Fraunces, Georgia, serif",
              borderBottom: "1px solid var(--border)",
              paddingBottom: 12
            }}>
              Questions About This Policy
            </h2>
            <p style={{ marginBottom: 16 }}>
              If you have questions about our refund policy, please contact us:
            </p>
            <div style={{
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 24
            }}>
              <p style={{ marginBottom: 12, fontSize: 15 }}>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@rift.dpdns.org" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>
                  support@rift.dpdns.org
                </a>
              </p>
              <p style={{ marginBottom: 0, fontSize: 15 }}>
                For more information about our services, see our{" "}
                <Link href="/terms" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</Link>
              </p>
            </div>
          </section>
        </article>

        {/* Footer Note */}
        <div style={{
          marginTop: 64,
          paddingTop: 32,
          borderTop: "1px solid var(--border)",
          fontSize: 14,
          color: "var(--muted)",
          fontFamily: "Inter, system-ui, sans-serif",
          textAlign: "center"
        }}>
          <p>
            This refund policy is effective as of {lastUpdated}. We reserve the right to update this policy at any time.
          </p>
        </div>
      </main>
    </div>
  );
}
