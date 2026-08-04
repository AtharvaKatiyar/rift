"use client";

export default function EarlyAccessBanner() {
  return (
    <section style={{
      width: "100%",
      padding: "28px 0",
      borderTop: "0.5px solid var(--border)",
      borderBottom: "0.5px solid var(--border)",
      background: "var(--bg)"
    }}>
      <div className="early-access-content" style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "0 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <span style={{ fontSize: 16 }}>🚀</span>
          <span style={{
            fontFamily: "monospace",
            fontSize: 12,
            textTransform: "uppercase",
            color: "#C79A3E",
            letterSpacing: "0.06em"
          }}>
            Founder Pricing — Early Access
          </span>
        </div>

        <p className="font-serif" style={{
          fontSize: 18,
          fontStyle: "italic",
          color: "var(--text)",
          margin: 0,
          flex: 1,
          minWidth: 280,
          textAlign: "center"
        }}>
          Rift is in early access. The prices you see today are the lowest they will ever be.
        </p>

        <a
          href="/pricing"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13,
            color: "var(--text)",
            textDecoration: "none",
            padding: "8px 16px",
            border: "1px solid var(--border)",
            borderRadius: 4,
            transition: "all 0.2s",
            whiteSpace: "nowrap"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text)";
          }}
        >
          See founder benefits →
        </a>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .early-access-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
