import { ImageResponse } from "next/og";

export const alt =
  "Northline Building Services — Commercial Cleaning & Site Support in Columbus, Ohio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #161310 55%, #2a1d08 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 18,
              height: 64,
              background: "#e0a32e",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#ffffff",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>
              NORTHLINE
            </div>
            <div
              style={{ fontSize: 18, letterSpacing: 8, color: "#e0a32e" }}
            >
              OPERATION
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 70,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
            }}
          >
            Commercial Cleaning
          </div>
          <div
            style={{
              fontSize: 70,
              fontWeight: 800,
              color: "#e0a32e",
              lineHeight: 1.05,
            }}
          >
            & Site Support
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Post-construction · Janitorial · Move-out turnovers · Columbus, Ohio
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          northlineoperation.com
        </div>
      </div>
    ),
    { ...size },
  );
}
