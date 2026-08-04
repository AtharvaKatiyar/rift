"use client";

import Link from "next/link";
import Navbar from "@/components/common/Navbar";

export default function PrivacyPolicy() {
  const lastUpdated = "August 2026";

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Welcome to Rift. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, share, and protect information when you use our permanent link management services.
          </p>
          <p>
            Rift provides permanent link management services that allow you to create, manage, and redirect links that never expire. This policy applies to all information collected through our website, dashboard, API, and related services (collectively, the "Services").
          </p>
        </>
      )
    },
    {
      id: "information-collect",
      title: "Information We Collect",
      content: (
        <>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Information You Provide Directly
          </h3>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Account Information:</strong> Email address, username, and encrypted password
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Payment Information:</strong> Billing details processed securely through Dodo Payments (we never store your full payment card details)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Link Data:</strong> Destination URLs, custom slugs, link titles, and metadata you create
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Profile Information:</strong> Optional details like display name or preferences
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Communications:</strong> Messages you send us for support, feedback, or inquiries
            </li>
          </ul>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Information Collected Automatically
          </h3>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Analytics Data:</strong> When visitors use your permanent links, we collect anonymous analytics including IP addresses (anonymized), device type, browser, operating system, and referrer information
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Geographic Data:</strong> Approximate location (country, region, city) derived from IP addresses
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Usage Data:</strong> How you interact with our Services, features used, and timestamps
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Technical Data:</strong> Browser type, device information, and connection data
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Cookies:</strong> Small data files stored on your device (see Cookies section below)
            </li>
          </ul>
        </>
      )
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>We use the collected information for the following purposes:</p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Service Delivery:</strong> Provide, operate, and maintain our permanent link management platform
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Link Management:</strong> Create, store, and redirect your permanent links
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Analytics:</strong> Provide insights about link performance, visitor behavior, and traffic sources
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Account Management:</strong> Process payments, manage subscriptions, and handle upgrades
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Communication:</strong> Send service updates, security alerts, and respond to support requests
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Improvements:</strong> Analyze usage patterns to enhance features and user experience
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Security:</strong> Detect and prevent fraud, abuse, spam, and technical issues
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Legal Compliance:</strong> Fulfill legal obligations and enforce our terms of service
            </li>
          </ul>
        </>
      )
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            <strong>We do not sell your personal information.</strong> We may share your information only in the following limited circumstances:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>With Your Consent:</strong> When you explicitly authorize us to share specific information
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Service Providers:</strong> Trusted third-party vendors who help us operate our Services:
              <ul style={{ paddingLeft: 24, marginTop: 8 }}>
                <li>Payment processing (Dodo Payments)</li>
                <li>Cloud hosting and infrastructure providers</li>
                <li>Email delivery services</li>
              </ul>
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Legal Requirements:</strong> When required by law, subpoena, court order, or to protect our legal rights
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (you'll be notified beforehand)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Aggregated Data:</strong> Anonymous, aggregated statistics that cannot identify you personally
            </li>
          </ul>
        </>
      )
    },
    {
      id: "data-security",
      title: "Data Security",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            We implement industry-standard security measures to protect your data:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Encryption:</strong> All data transmitted between your device and our servers uses TLS/SSL encryption
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Password Security:</strong> Passwords are hashed using bcrypt with industry-standard salt rounds
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Infrastructure:</strong> Data stored on secure, regularly audited cloud infrastructure
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Access Controls:</strong> Strict internal access controls and authentication requirements
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Monitoring:</strong> Continuous security monitoring and regular vulnerability assessments
            </li>
          </ul>
          <p style={{
            padding: 16,
            background: "rgba(199,154,62,0.08)",
            border: "1px solid rgba(199,154,62,0.3)",
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.6
          }}>
            <strong>Note:</strong> While we implement robust security measures, no system is completely secure. Please use a strong, unique password and enable two-factor authentication when available.
          </p>
        </>
      )
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Depending on your location (especially if you're in the EU, UK, California, or other regions with strong privacy laws), you have the following rights:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Access:</strong> Request a copy of the personal data we hold about you
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Correction:</strong> Update or correct inaccurate personal information
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Deletion:</strong> Request deletion of your personal data (subject to legal retention requirements)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Portability:</strong> Receive your data in a structured, machine-readable format
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Objection:</strong> Object to certain types of data processing
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Restriction:</strong> Request we limit how we process your data
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Opt-Out:</strong> Unsubscribe from marketing communications (service emails may still be sent)
            </li>
          </ul>
          <p style={{ marginBottom: 8 }}>
            <strong>To exercise these rights, contact us at:</strong> support@rift.dpdns.org
          </p>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>
            We'll respond to your request within 72 hours. You may also have the right to lodge a complaint with your local data protection authority.
          </p>
        </>
      )
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            We use cookies and similar technologies to improve your experience and understand how you use our Services.
          </p>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Types of Cookies We Use
          </h3>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Essential Cookies:</strong> Required for the Services to function (authentication, security)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Functional Cookies:</strong> Remember your preferences and settings
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Analytics Cookies:</strong> Help us understand usage patterns and improve our Services
            </li>
          </ul>
          <p style={{ marginBottom: 8 }}>
            You can control cookies through your browser settings. Note that disabling certain cookies may limit functionality. Learn more in our{" "}
            <Link href="/cookies" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid #8B6914" }}>
              Cookie Policy
            </Link>.
          </p>
        </>
      )
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>We retain your data as follows:</p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Account Data:</strong> Retained while your account is active
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Permanent Links:</strong> Stored indefinitely as per our service offering (permanent redirects)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Analytics Data:</strong> Retained for 24 months for performance insights
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Financial Records:</strong> Retained for 7 years for tax and legal compliance
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>After Account Deletion:</strong> Personal data deleted within 30 days, except where legally required to retain
            </li>
          </ul>
        </>
      )
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Our Services are hosted on servers that may be located in different countries. When you use Rift, your information may be transferred to and processed in countries other than your own.
          </p>
          <p>
            We ensure appropriate safeguards are in place, including standard contractual clauses and compliance with applicable data protection laws (GDPR, CCPA, etc.).
          </p>
        </>
      )
    },
    {
      id: "childrens-privacy",
      title: "Children's Privacy",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Our Services are not intended for children under 13 years of age (or 16 in the European Union). We do not knowingly collect personal information from children.
          </p>
          <p>
            If you believe we have collected information from a child under the applicable age, please contact us immediately at support@rift.dpdns.org, and we'll delete it promptly.
          </p>
        </>
      )
    },
    {
      id: "third-party-links",
      title: "Third-Party Services and Links",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            When you create permanent links on Rift, those links redirect to third-party websites. We are not responsible for the privacy practices of those destination sites.
          </p>
          <p>
            We also integrate with third-party services (like Dodo Payments for payment processing). These services have their own privacy policies, and we encourage you to review them.
          </p>
        </>
      )
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            We may update this privacy policy periodically to reflect changes in our practices, technology, legal requirements, or other factors.
          </p>
          <p style={{ marginBottom: 16 }}>
            When we make significant changes, we'll notify you by email or through a prominent notice on our Services. The "Last updated" date at the top of this policy indicates when it was last revised.
          </p>
          <p>
            Your continued use of the Services after changes are posted constitutes acceptance of the updated policy.
          </p>
        </>
      )
    },
    {
      id: "contact",
      title: "Contact Us",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            If you have questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
          </p>
          <div style={{
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
            marginTop: 16
          }}>
            <p style={{ marginBottom: 12, fontSize: 15 }}>
              <strong>Support Email:</strong>{" "}
              <a href="mailto:support@rift.dpdns.org" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>
                support@rift.dpdns.org
              </a>
            </p>
            <p style={{ marginBottom: 0, fontSize: 15 }}>
              <strong>Response Time:</strong> We aim to respond within 72 hours
            </p>
          </div>
        </>
      )
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Navbar />

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "120px 48px 96px", position: "relative" }}>
        <div style={{ display: "flex", gap: 64 }}>
          {/* Sidebar Navigation */}
          <aside style={{ 
            position: "fixed", 
            top: 120, 
            left: "calc(50% - 590px)",
            width: 280,
            height: "calc(100vh - 140px)",
            overflowY: "auto"
          }}>
            <nav>
              <p style={{
                fontFamily: "monospace",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                marginBottom: 16,
                fontWeight: 600
              }}>
                Contents
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {sections.map((section) => (
                  <li key={section.id} style={{ marginBottom: 8 }}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => handleSectionClick(e, section.id)}
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontFamily: "Inter, system-ui, sans-serif",
                        color: "var(--muted)",
                        textDecoration: "none",
                        padding: "6px 0",
                        transition: "color 0.2s",
                        borderLeft: "2px solid transparent",
                        paddingLeft: 12,
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--text)";
                        e.currentTarget.style.borderLeftColor = "#C79A3E";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--muted)";
                        e.currentTarget.style.borderLeftColor = "transparent";
                      }}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <article style={{ marginLeft: 344, flex: 1 }}>
            <header style={{ marginBottom: 56 }}>
              <h1 style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 48,
                fontWeight: 300,
                marginBottom: 16,
                lineHeight: 1.2,
                color: "var(--text)"
              }}>
                Privacy Policy
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
                <strong style={{ color: "var(--text)" }}>TL;DR:</strong> We respect your privacy. We collect only what's necessary to provide our permanent link management service, never sell your data, use industry-standard security, and give you full control over your information.
              </div>
            </header>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                style={{
                  marginBottom: 64,
                  scrollMarginTop: 120
                }}
              >
                <h2 style={{
                  fontSize: 28,
                  fontWeight: 400,
                  marginBottom: 20,
                  color: "var(--text)",
                  fontFamily: "Fraunces, Georgia, serif",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 12
                }}>
                  {section.title}
                </h2>
                <div style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "var(--text)",
                  fontFamily: "Inter, system-ui, sans-serif"
                }}>
                  {section.content}
                </div>
              </section>
            ))}

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
                This policy is effective as of {lastUpdated}. By using Rift, you agree to this Privacy Policy.
              </p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
