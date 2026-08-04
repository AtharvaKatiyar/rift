"use client";

import { USE_CASES } from "@/data/landing";

export default function CTA() {
  return (
    <section style={{ background: "var(--bg-alt)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "120px 48px" }}>
        <div className="flex flex-wrap items-center justify-between" style={{ gap: 48 }}>
          <div style={{ maxWidth: 580 }}>
            <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--faint)", marginBottom: 24 }}>
              Share once. Update forever.
            </div>
            <h2 className="font-serif" style={{ fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.08, marginBottom: 16, color: "var(--text)" }}>
              Give your next task<br />a link that <em style={{ color: "var(--accent)" }}>outlives it.</em>
            </h2>
            <p style={{
              fontFamily: "monospace",
              fontSize: 13,
              color: "#8B6914",
              letterSpacing: "0.04em",
              marginBottom: 28
            }}>
              Launch pricing ends soon — Lock in your discount today
            </p>
            <p className="font-sans" style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, maxWidth: 460, marginBottom: 40 }}>
              Links shouldn&apos;t expire just because their destinations do. Rift separates the identity of a link from the location it points to.
            </p>
            <div className="flex flex-wrap" style={{ gap: 14 }}>
              <a
                href="/auth?tab=register"
                className="font-sans font-semibold whitespace-nowrap"
                style={{ fontSize: 16, background: "var(--text)", color: "var(--bg)", padding: "15px 30px", borderRadius: 3 }}
              >
                Create your first link
              </a>
              <a
                href="#tasks"
                className="font-sans font-medium whitespace-nowrap"
                style={{ fontSize: 16, border: "1px solid var(--border-mid)", color: "var(--text)", padding: "15px 28px", borderRadius: 3 }}
              >
                See how it works
              </a>
            </div>
          </div>

          {/* right: use cases */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, minWidth: 260 }}>
            {USE_CASES.map((uc, i) => (
              <div key={uc.role} style={{ padding: "20px 0", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>
                <div className="font-serif" style={{ fontSize: 17, fontWeight: 500, marginBottom: 4, color: "var(--text)" }}>{uc.role}</div>
                <div className="font-sans" style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>{uc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
