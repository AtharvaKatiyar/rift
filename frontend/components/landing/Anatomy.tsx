const ANATOMY_PARTS = [
  {
    label: "Domain",
    color: "var(--muted)",
    text: "Fixed. The same for every task, every user. Never changes.",
  },
  {
    label: "Slug",
    color: "#A6503B",
    text: "A human-readable name you pick — portfolio, resume, startup.",
  },
  {
    label: "Public ID",
    color: "#4C5A78",
    text: "A cryptographically generated 12-character string. Unique to you.",
  },
];

export default function Anatomy() {
  return (
    <section style={{ padding: "120px 48px 100px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div className="flex flex-wrap items-start justify-between" style={{ gap: 80 }}>
          {/* left */}
          <div style={{ maxWidth: 480 }}>
            <div className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: "0.14em", color: "#4C5A78", marginBottom: 20 }}>
              Anatomy of a link
            </div>
            <h2 className="font-serif" style={{ fontSize: "clamp(32px,4.5vw,48px)", lineHeight: 1.15, marginBottom: 24, color: "var(--text)" }}>
              Two parts. One that&apos;s yours,<br />one that&apos;s permanent.
            </h2>
            <p className="font-sans" style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.7 }}>
              Every Rift link has a readable slug you choose and a cryptographic ID that makes it yours alone. The full address never needs to change — ever.
            </p>
          </div>

          {/* right: URL breakdown */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div className="font-mono" style={{ fontSize: "clamp(16px,2.2vw,23px)", lineHeight: 1, marginBottom: 40, display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 2 }}>
              <span style={{ color: "var(--muted)" }}>rift.dpdns.org</span>
              <span style={{ color: "var(--muted)", opacity: 0.4 }}>/</span>
              <span style={{ color: "#A6503B", fontWeight: 600 }}>portfolio</span>
              <span style={{ color: "var(--muted)", opacity: 0.4 }}>/</span>
              <span style={{ color: "#4C5A78", fontWeight: 600 }}>A7XK29M4PQ8L</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {ANATOMY_PARTS.map((item) => (
                <div key={item.label} className="flex items-start" style={{ gap: 16 }}>
                  <div style={{ width: 3, height: 48, background: item.color, borderRadius: 2, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="font-mono uppercase" style={{ fontSize: 12, letterSpacing: "0.1em", color: item.color, marginBottom: 6 }}>{item.label}</div>
                    <p className="font-sans" style={{ fontSize: 15.5, color: "var(--muted)", lineHeight: 1.6 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
