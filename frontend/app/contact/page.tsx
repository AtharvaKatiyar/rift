"use client";

import Navbar from "@/components/common/Navbar";

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Navbar />

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "120px 48px 96px" }}>
        <header style={{ textAlign: "center", marginBottom: 56 }}>
          <h1 style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontSize: 48,
            fontWeight: 300,
            marginBottom: 16,
            lineHeight: 1.2,
            color: "var(--text)"
          }}>
            Get in Touch
          </h1>
          <p style={{
            fontSize: 17,
            color: "var(--muted)",
            marginBottom: 24,
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1.6
          }}>
            Have questions about Rift? We're here to help. Reach out to us and we'll get back to you within 72 hours.
          </p>
        </header>

        {/* Contact Methods */}
        <div style={{ display: "grid", gap: 24, marginBottom: 48 }}>
          {/* General Inquiries */}
          <div style={{
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 32,
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: "rgba(199,154,62,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--text)",
                  marginBottom: 8,
                  fontFamily: "Fraunces, Georgia, serif"
                }}>
                  General Inquiries
                </h3>
                <p style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  marginBottom: 12,
                  lineHeight: 1.6,
                  fontFamily: "Inter, system-ui, sans-serif"
                }}>
                  For general questions, feedback, or partnership inquiries
                </p>
                <a 
                  href="mailto:contact@rift.dpdns.org"
                  style={{
                    fontSize: 16,
                    color: "#8B6914",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontFamily: "Inter, system-ui, sans-serif",
                    display: "inline-block",
                    borderBottom: "2px solid transparent",
                    transition: "border-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "#C79A3E"}
                  onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}
                >
                  contact@rift.dpdns.org
                </a>
              </div>
            </div>
          </div>

          {/* Technical Support */}
          <div style={{
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 32,
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: "rgba(199,154,62,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C79A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "var(--text)",
                  marginBottom: 8,
                  fontFamily: "Fraunces, Georgia, serif"
                }}>
                  Technical Support
                </h3>
                <p style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  marginBottom: 12,
                  lineHeight: 1.6,
                  fontFamily: "Inter, system-ui, sans-serif"
                }}>
                  Need help with your account, links, or experiencing technical issues?
                </p>
                <a 
                  href="mailto:support@rift.dpdns.org"
                  style={{
                    fontSize: 16,
                    color: "#8B6914",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontFamily: "Inter, system-ui, sans-serif",
                    display: "inline-block",
                    borderBottom: "2px solid transparent",
                    transition: "border-color 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = "#C79A3E"}
                  onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}
                >
                  support@rift.dpdns.org
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div style={{
          background: "rgba(199,154,62,0.08)",
          border: "1px solid #C79A3E",
          borderRadius: 12,
          padding: 24,
          marginBottom: 48,
          textAlign: "center"
        }}>
          <p style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--text)",
            fontFamily: "Inter, system-ui, sans-serif"
          }}>
            <strong>Response Time:</strong> We aim to respond to all inquiries within 72 hours during business days. For urgent issues, please mark your email as "Urgent" in the subject line.
          </p>
        </div>

        {/* Additional Information */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: 28,
            fontWeight: 400,
            marginBottom: 24,
            color: "var(--text)",
            fontFamily: "Fraunces, Georgia, serif",
            textAlign: "center"
          }}>
            Before You Contact Us
          </h2>
          
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{
              padding: 20,
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: 8
            }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
                color: "var(--text)",
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                Check Our Documentation
              </h3>
              <p style={{
                fontSize: 14,
                color: "var(--muted)",
                margin: 0,
                lineHeight: 1.6,
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                Many common questions are answered in our documentation and FAQs. This might help you get answers faster.
              </p>
            </div>

            <div style={{
              padding: 20,
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: 8
            }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
                color: "var(--text)",
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                Include Relevant Details
              </h3>
              <p style={{
                fontSize: 14,
                color: "var(--muted)",
                margin: 0,
                lineHeight: 1.6,
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                When reporting issues, please include your account email, link IDs (if applicable), and steps to reproduce the problem. This helps us resolve issues faster.
              </p>
            </div>

            <div style={{
              padding: 20,
              background: "var(--bg-alt)",
              border: "1px solid var(--border)",
              borderRadius: 8
            }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 8,
                color: "var(--text)",
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                Business Inquiries
              </h3>
              <p style={{
                fontSize: 14,
                color: "var(--muted)",
                margin: 0,
                lineHeight: 1.6,
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                For partnership opportunities, bulk licensing, or enterprise inquiries, please use contact@rift.dpdns.org with "Business Inquiry" in the subject line.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div style={{
          paddingTop: 32,
          borderTop: "1px solid var(--border)",
          textAlign: "center"
        }}>
          <p style={{
            fontSize: 14,
            color: "var(--muted)",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1.6
          }}>
            Looking for something specific?{" "}
            <a href="/privacy" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</a>
            {" · "}
            <a href="/terms" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>Terms of Service</a>
            {" · "}
            <a href="/refund-policy" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>Refund Policy</a>
          </p>
        </div>
      </main>
    </div>
  );
}
