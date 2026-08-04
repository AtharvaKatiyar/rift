"use client";

export default function MovingStrip() {
  const text = "⚡ Limited Time Launch Pricing  ·  30 Permanent Links Free Forever  ·  Early Bird Discounts End Soon  ·  Lock in Your Price Today  ·  ";
  
  return (
    <div 
      style={{
        position: "relative",
        width: "100%",
        height: 40,
        overflow: "hidden",
        background: "#1E2119",
        borderTop: "1px solid rgba(200,196,184,0.08)",
        borderBottom: "1px solid rgba(200,196,184,0.08)"
      }}
    >
      <div 
        className="moving-strip-wrapper"
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center"
        }}
      >
        <div 
          className="moving-strip-content"
          style={{
            display: "flex",
            whiteSpace: "nowrap"
          }}
        >
          <span className="moving-strip-text">
            {text}{text}{text}{text}
          </span>
        </div>
      </div>

      <style jsx>{`
        .moving-strip-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.06em;
          color: rgba(200, 196, 184, 0.85);
          animation: scroll-left 40s linear infinite;
          display: inline-block;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
