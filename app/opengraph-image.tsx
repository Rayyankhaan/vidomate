import { ImageResponse } from "next/og";

export const alt = "VidoMate – Your Videos. Your Way. Anywhere.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "linear-gradient(135deg, #101426 0%, #171D32 100%)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 34,
              background: "linear-gradient(135deg, #8B7CFF, #43D9E8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 0, height: 0, marginLeft: 12, borderTop: "34px solid transparent", borderBottom: "34px solid transparent", borderLeft: "56px solid #101426" }} />
          </div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, letterSpacing: -3 }}>
            <span style={{ color: "#8B7CFF" }}>Vido</span>
            <span style={{ color: "#43D9E8" }}>Mate</span>
          </div>
        </div>
        <div style={{ marginTop: 44, fontSize: 44, color: "#A6AEC3" }}>Your Videos. Your Way. Anywhere.</div>
      </div>
    ),
    size
  );
}
