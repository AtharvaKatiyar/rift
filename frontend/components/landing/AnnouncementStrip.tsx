"use client";

export default function AnnouncementStrip() {
  const text = "🚀 Founder Pricing — Limited Early Access  ·  30 Permanent Links Free, Forever  ·  Founder spots are limited  ·  Lock in your price before launch ends";
  
  return (
    <>
      <div 
        className="announcement-strip"
        style={{
          position: "relative",
          width: "100%",
          height: 36,
          overflow: "hidden",
          background: "#1E2119",
          borderBottom: "1px solid rgba(200,196,184,0.08)"
        }}
      >
        <div className="marquee-container">
          <div className="marquee-content">
            {[...Array(4)].map((_, i) => (
              <span key={i} style={{ whiteSpace: "nowrap" }}>
                {text.split('Founder Pricing').map((part, index) => 
                  index === 0 ? (
                    part
                  ) : (
                    <span key={index}>
                      <span style={{ color: "#C79A3E" }}>Founder Pricing</span>
                      {part.split('Founder spots are limited').map((subpart, subindex) =>
                        subindex === 0 ? (
                          subpart
                        ) : (
                          <span key={subindex}>
                            <span style={{ color: "#C79A3E" }}>Founder spots are limited</span>
                            {subpart}
                          </span>
                        )
                      )}
                    </span>
                  )
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
        }

        .marquee-content {
          display: flex;
          animation: marquee 28s linear infinite;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: rgba(200, 196, 184, 0.8);
          white-space: nowrap;
          gap: 0;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .announcement-strip {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
