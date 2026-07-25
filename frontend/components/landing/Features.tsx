import type { Feature } from "@/types/landing";
import { FEATURES } from "@/data/landing";

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="relative" style={{ background: "var(--bg)", padding: "40px 32px 36px" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 32, height: 3, background: feature.color }} />
      <h3 className="font-serif" style={{ fontSize: 21, fontWeight: 500, margin: "16px 0 12px", color: "var(--text)" }}>{feature.title}</h3>
      <p className="font-sans" style={{ fontSize: 15.5, color: "var(--muted)", lineHeight: 1.7 }}>{feature.desc}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" style={{ padding: "100px 48px 120px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <h2 className="font-serif" style={{ fontSize: "clamp(32px,4.5vw,48px)", lineHeight: 1.15, marginBottom: 20, color: "var(--text)" }}>
            Built around one job: keep the link,<br />change what&apos;s behind it.
          </h2>
          <p className="font-sans" style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.7, maxWidth: 640 }}>
            Every feature exists to make that guarantee solid, even years and dozens of destination updates later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: "var(--border)", border: "1px solid var(--border)" }}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
