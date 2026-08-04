"use client";

import Link from "next/link";
import Navbar from "@/components/common/Navbar";

export default function CookiePolicy() {
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
      id: "what-are-cookies",
      title: "What Are Cookies",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and help website owners understand how their sites are being used.
          </p>
          <p>
            Cookies store information about your visit, such as your preferences, login status, and other data that helps us improve your experience on Rift.
          </p>
        </>
      )
    },
    {
      id: "how-we-use",
      title: "How We Use Cookies",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Rift uses cookies to enhance your experience and provide essential functionality. We use cookies for:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Authentication:</strong> Keeping you securely logged in to your account
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Security:</strong> Protecting your account from unauthorized access
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Preferences:</strong> Remembering your settings (like theme preference)
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Analytics:</strong> Understanding how our service is used to make improvements
            </li>
          </ul>
        </>
      )
    },
    {
      id: "cookie-types",
      title: "Types of Cookies We Use",
      content: (
        <>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, marginTop: 24, color: "var(--text)" }}>
            1. Essential Cookies (Required)
          </h3>
          <p style={{ marginBottom: 16 }}>
            These cookies are necessary for the website to function and cannot be disabled in our systems. They are set in response to your actions, such as logging in or managing your links.
          </p>
          
          <div style={{
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
            marginBottom: 24,
            overflowX: "auto"
          }}>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, color: "var(--text)" }}>Cookie Name</th>
                  <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, color: "var(--text)" }}>Purpose</th>
                  <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, color: "var(--text)" }}>Duration</th>
                  <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, color: "var(--text)" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <td style={{ padding: "12px 8px", fontFamily: "monospace", fontSize: 13, color: "#8B6914" }}>access_token</td>
                  <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                    Authenticates your session and verifies your identity for API requests
                  </td>
                  <td style={{ padding: "12px 8px", color: "var(--muted)" }}>15 minutes</td>
                  <td style={{ padding: "12px 8px", color: "var(--muted)" }}>HttpOnly, Secure</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px 8px", fontFamily: "monospace", fontSize: 13, color: "#8B6914" }}>refresh_token</td>
                  <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                    Allows automatic session renewal without requiring you to log in again
                  </td>
                  <td style={{ padding: "12px 8px", color: "var(--muted)" }}>7 days</td>
                  <td style={{ padding: "12px 8px", color: "var(--muted)" }}>HttpOnly, Secure</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{
            background: "rgba(199,154,62,0.08)",
            border: "1px solid #C79A3E",
            borderRadius: 8,
            padding: 16,
            marginBottom: 32,
            fontSize: 14,
            lineHeight: 1.6
          }}>
            <strong style={{ color: "var(--text)" }}>Security Note:</strong> Both authentication cookies are HttpOnly (not accessible via JavaScript) and Secure (transmitted only over HTTPS in production), protecting against XSS and man-in-the-middle attacks.
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, marginTop: 32, color: "var(--text)" }}>
            2. Functional Cookies (Optional)
          </h3>
          <p style={{ marginBottom: 16 }}>
            These cookies enable enhanced functionality and personalization. They help us remember your preferences and provide a tailored experience.
          </p>

          <div style={{
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
            marginBottom: 32,
            overflowX: "auto"
          }}>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, color: "var(--text)" }}>Storage Key</th>
                  <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, color: "var(--text)" }}>Purpose</th>
                  <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600, color: "var(--text)" }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px 8px", fontFamily: "monospace", fontSize: 13, color: "#8B6914" }}>rift-theme</td>
                  <td style={{ padding: "12px 8px", color: "var(--text)" }}>
                    Remembers your theme preference (light/dark mode) for the dashboard
                  </td>
                  <td style={{ padding: "12px 8px", color: "var(--muted)" }}>Persistent</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, marginTop: 32, color: "var(--text)" }}>
            3. Analytics Cookies (Optional)
          </h3>
          <p>
            We collect anonymous analytics data to understand how visitors use your permanent links. This helps us improve the service and provide better insights to you about your link performance. No personally identifiable information is collected through analytics cookies.
          </p>
        </>
      )
    },
    {
      id: "third-party",
      title: "Third-Party Cookies",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            We use services from trusted third parties that may set their own cookies to provide their services:
          </p>
          
          <div style={{
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
            marginBottom: 16
          }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text)" }}>
              Payment Processing (Dodo Payments)
            </h4>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)", marginBottom: 8 }}>
              When you make a payment, Dodo Payments may set cookies to process your transaction securely. These cookies are essential for payment processing.
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Purpose: Secure payment processing, fraud prevention
            </p>
          </div>

          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
            These third parties have their own privacy policies governing their use of cookies. We recommend reviewing their policies to understand how they handle your data.
          </p>
        </>
      )
    },
    {
      id: "managing-cookies",
      title: "Managing Your Cookie Preferences",
      content: (
        <>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Browser Settings
          </h3>
          <p style={{ marginBottom: 16 }}>
            Most web browsers allow you to control cookies through their settings. You can typically:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 24, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>View all cookies stored on your device</li>
            <li style={{ marginBottom: 8 }}>Delete specific cookies or all cookies</li>
            <li style={{ marginBottom: 8 }}>Block cookies from specific websites</li>
            <li style={{ marginBottom: 8 }}>Block all third-party cookies</li>
            <li style={{ marginBottom: 8 }}>Delete all cookies when you close your browser</li>
            <li style={{ marginBottom: 8 }}>Set cookie expiration preferences</li>
          </ul>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, marginTop: 24, color: "var(--text)" }}>
            Browser-Specific Instructions
          </h3>
          <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
            {[
              { browser: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
              { browser: "Mozilla Firefox", url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" },
              { browser: "Apple Safari", url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
              { browser: "Microsoft Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
              { browser: "Opera", url: "https://help.opera.com/en/latest/web-preferences/#cookies" }
            ].map((item, i) => (
              <div key={i} style={{
                padding: 16,
                background: "var(--bg-alt)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{item.browser}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 14,
                    color: "#8B6914",
                    textDecoration: "none",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  Cookie Settings →
                </a>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(199,154,62,0.08)",
            border: "1px solid rgba(199,154,62,0.3)",
            borderRadius: 8,
            padding: 20,
            marginTop: 24
          }}>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text)" }}>
              <strong>⚠️ Important:</strong> Blocking or deleting essential cookies (especially authentication cookies) will prevent you from logging in and using Rift. Some features may not work properly without cookies enabled.
            </p>
          </div>
        </>
      )
    },
    {
      id: "cookie-security",
      title: "Cookie Security",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            We take cookie security seriously and implement industry-standard protections:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>HttpOnly Flags:</strong> Authentication cookies cannot be accessed by client-side JavaScript, protecting against XSS attacks
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Secure Flags:</strong> Cookies are transmitted only over encrypted HTTPS connections in production
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>SameSite Protection:</strong> Cookies use SameSite=Strict mode in production to prevent CSRF attacks
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Short Expiration:</strong> Access tokens expire after 15 minutes, limiting the window of potential misuse
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Token Rotation:</strong> Refresh tokens are rotated after use to prevent replay attacks
            </li>
          </ul>
        </>
      )
    },
    {
      id: "do-not-track",
      title: "Do Not Track (DNT)",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you prefer not to be tracked. Currently, there is no universal standard for how websites should respond to DNT signals.
          </p>
          <p>
            At this time, Rift does not respond to DNT signals. However, we are committed to respecting your privacy and only collect data necessary to provide and improve our service.
          </p>
        </>
      )
    },
    {
      id: "updates",
      title: "Updates to This Policy",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
          </p>
          <p>
            When we make significant changes, we'll notify you by posting the updated policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically to stay informed about how we use cookies.
          </p>
        </>
      )
    },
    {
      id: "contact",
      title: "Questions About Cookies",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            If you have questions about our use of cookies or this Cookie Policy, please contact us:
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
            <p style={{ marginBottom: 12, fontSize: 15 }}>
              <strong>Response Time:</strong> We aim to respond within 72 hours
            </p>
            <p style={{ marginBottom: 0, fontSize: 15 }}>
              For more information about how we handle your personal data, see our{" "}
              <Link href="/privacy" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid #8B6914" }}>
                Privacy Policy
              </Link>
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
                Cookie Policy
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
                <strong style={{ color: "var(--text)" }}>TL;DR:</strong> We use cookies primarily for authentication and security. Your login tokens are stored securely with HttpOnly and Secure flags. You can manage cookies through your browser settings, but disabling authentication cookies will prevent you from using Rift.
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
                This policy is effective as of {lastUpdated}. By using Rift, you consent to our use of cookies as described in this policy.
              </p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
