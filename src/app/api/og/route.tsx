import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text") || "Where do you really stand?";
  const pillar = searchParams.get("pillar") || "general";

  const pillarColors: Record<string, string> = {
    financial: "#10b981",
    career: "#3b82f6",
    health: "#f43f5e",
    general: "#f59e0b",
  };

  const accentColor = pillarColors[pillar] || pillarColors.general;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1e1b4b",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              color: "#ffffff",
              fontSize: "28px",
              fontWeight: "700",
              letterSpacing: "4px",
              opacity: 0.6,
            }}
          >
            VYVE
          </span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              color: accentColor,
              fontSize: "22px",
              fontWeight: "700",
              textTransform: "uppercase" as const,
              letterSpacing: "3px",
            }}
          >
            Did you know?
          </span>
          <span
            style={{
              color: "#ffffff",
              fontSize: "42px",
              fontWeight: "600",
              lineHeight: "1.3",
              maxWidth: "900px",
            }}
          >
            {text}
          </span>
        </div>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "24px",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "20px" }}>
            Where do you stand? · 2 minutes · Free · No sign-up
          </span>
          <span
            style={{
              color: accentColor,
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            vyve.app/check
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
