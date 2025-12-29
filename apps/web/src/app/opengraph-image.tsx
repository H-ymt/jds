import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "算命学鑑定";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        background: "linear-gradient(to bottom right, #0f172a, #1e1e2e)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Zen Kaku Gothic New", sans-serif',
      }}
    >
      {/* Background Decorative Circles */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "#6366f1",
          opacity: 0.1,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "#a855f7",
          opacity: 0.1,
          filter: "blur(100px)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "40px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "50%",
          padding: "40px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
          {/* Reusing the icon design */}
          <circle cx="50" cy="50" r="48" fill="#1e1e2e" />
          <circle cx="50" cy="22" r="8" fill="#10b981" />
          <circle cx="77" cy="41" r="8" fill="#ef4444" />
          <circle cx="67" cy="73" r="8" fill="#f59e0b" />
          <circle cx="33" cy="73" r="8" fill="#64748b" />
          <circle cx="23" cy="41" r="8" fill="#6366f1" />
          <path
            d="M50 22 L77 41 L67 73 L33 73 L23 41 Z"
            stroke="#ffffff"
            strokeOpacity="0.3"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M50 22 L67 73 L23 41 L77 41 L33 73 Z"
            stroke="#ffffff"
            strokeOpacity="0.2"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="50" cy="50" r="4" fill="#a855f7" />
          <path
            d="M50 40 L52 48 L60 50 L52 52 L50 60 L48 52 L40 50 L48 48 Z"
            fill="#ffffff"
            fillOpacity="0.9"
          />
        </svg>
      </div>
      <div
        style={{
          color: "white",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "0.05em",
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      >
        算命学鑑定
      </div>
      <div style={{ color: "#cbd5e1", fontSize: 32, marginTop: 24, fontWeight: 400, opacity: 0.9 }}>
        生年月日から宿命を読み解く
      </div>
    </div>,
    {
      ...size,
    },
  );
}
