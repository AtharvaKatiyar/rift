import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg)", padding: "40px 48px" }}>
      <div className="flex flex-wrap justify-between items-center" style={{ maxWidth: 1180, margin: "0 auto", gap: 20 }}>
        <div className="flex items-center" style={{ gap: -20 }}>
          <Image
            src="/rift_off_logo.png"
            alt="Rift"
            width={60}
            height={40}
            style={{ opacity: 0.7, display: "block", width: "60px", height: "auto" }}
          />
          <span className="font-serif" style={{ fontSize: 18, fontWeight: 300, color: "var(--muted)", letterSpacing: "0.05em" }}>Rift</span>
        </div>
        <div className="flex" style={{ gap: 32 }}>
          <a href="#tasks" className="font-sans" style={{ fontSize: 14, color: "var(--muted)" }}>How it works</a>
          <a href="#features" className="font-sans" style={{ fontSize: 14, color: "var(--muted)" }}>Features</a>
        </div>
        <div className="font-mono" style={{ fontSize: 12, color: "var(--faint)" }}>MIT Licensed · rift.dpdns.org</div>
      </div>
    </footer>
  );
}
