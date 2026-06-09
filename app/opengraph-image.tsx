import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  const logo = new URL("/brand/cat-mirage-logo.png", siteConfig.url).toString();
  const card = new URL("/tarot/star-cat.png", siteConfig.url).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg,#03040b 0%,#08071b 42%,#170b2e 100%)",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 34,
            border: "2px solid rgba(217,190,119,0.45)",
            borderRadius: 34,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 54,
            border: "1px solid rgba(217,190,119,0.22)",
            borderRadius: 24,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 70,
            width: 250,
            height: 250,
            display: "flex",
            borderRadius: 999,
            border: "2px solid rgba(217,190,119,0.38)",
            overflow: "hidden",
            boxShadow: "0 0 48px rgba(217,190,119,0.26)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={250} height={250} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div
          style={{
            position: "absolute",
            right: 88,
            top: 54,
            width: 230,
            height: 345,
            display: "flex",
            borderRadius: 22,
            border: "3px solid rgba(217,190,119,0.62)",
            overflow: "hidden",
            boxShadow: "0 22px 80px rgba(0,0,0,0.55)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card} alt="" width={230} height={345} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", left: 360, top: 96, width: 650, display: "flex", flexDirection: "column" }}>
          <div style={{ color: "rgba(217,190,119,0.75)", fontSize: 26, letterSpacing: 8, fontWeight: 700 }}>NEKOSEI MIRAGE ORACLE</div>
          <div style={{ marginTop: 24, fontSize: 68, fontWeight: 800, lineHeight: 1.05, textShadow: "0 0 28px rgba(217,190,119,0.2)" }}>
            猫星ミラージュ占譜
          </div>
          <div style={{ marginTop: 24, fontSize: 31, lineHeight: 1.45, color: "rgba(245,240,255,0.78)", fontFamily: "sans-serif" }}>
            姓名判断・星の暦・猫タロットを重ねて、今日の気分と行動のヒントを読むエンタメ占い。
          </div>
          <div
          style={{
              marginTop: 32,
              display: "flex",
              width: 520,
              borderRadius: 22,
              border: "1px solid rgba(217,190,119,0.32)",
              background: "rgba(0,0,0,0.28)",
              padding: "18px 24px",
              color: "rgba(255,246,214,0.9)",
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "sans-serif",
            }}
          >
            今日の猫星ランキングと22枚の猫タロット図鑑を公開中
          </div>
        </div>
        <div style={{ position: "absolute", left: 78, bottom: 66, color: "rgba(217,190,119,0.62)", fontSize: 30, letterSpacing: 10 }}>
          ✦ ☾ ✦  STAR / MOON / CAT TAROT  ✦ ☽ ✦
        </div>
      </div>
    ),
    size,
  );
}
