"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
      {/* Main Footer Content */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 48px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", marginBottom: "48px" }}>
          
          {/* Brand Column */}
          <div style={{ gridColumn: "span 1" }}>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
              <Image
                src="/rift_off_logo.png"
                alt="Rift"
                width={46}
                height={30}
                style={{ opacity: 0.8, display: "block", width: "46px", height: "auto" }}
              />
              <span className="font-serif" style={{ fontSize: 18, fontWeight: 300, color: "var(--text)", letterSpacing: "0.05em" }}>Rift</span>
            </div>
            <p className="font-sans" style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20, maxWidth: 280 }}>
              Central Link Infrastructure Platform. One permanent link for every important task. Update destinations anytime.
            </p>
            {/* Social Links */}
            <div style={{ display: "flex", gap: 12 }}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                style={{ color: "var(--muted)", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--muted)", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--muted)", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
                aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16, letterSpacing: "0.02em" }}>
              Product
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "How it works", href: "#tasks" },
                { label: "Analytics", href: "#features" },
                { label: "API Documentation", href: "/docs/api" },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: 12 }}>
                  <a href={item.href} className="font-sans" 
                    style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16, letterSpacing: "0.02em" }}>
              Company
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "About", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: 12 }}>
                  <a href={item.href} className="font-sans" 
                    style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16, letterSpacing: "0.02em" }}>
              Legal
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
                { label: "Refund Policy", href: "/refund-policy" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label} style={{ marginBottom: 12 }}>
                  <Link href={item.href} className="font-sans" 
                    style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: "1px solid var(--border)", 
          paddingTop: 24,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p className="font-sans" style={{ fontSize: 13, color: "var(--faint)", margin: 0 }}>
              © {currentYear} Rift. All rights reserved.
            </p>
            <p className="font-sans" style={{ fontSize: 12, color: "var(--faint)", margin: 0 }}>
              Contact:{" "}
              <a href="mailto:contact@rift.dpdns.org" style={{ color: "#8B6914", textDecoration: "none" }}>
                contact@rift.dpdns.org
              </a>
            </p>
          </div>
          <p className="font-mono" style={{ fontSize: 12, color: "var(--faint)", margin: 0 }}>
            Built with ❤️ by developers, for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
