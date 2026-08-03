import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { SITE_HOST } from "@/lib/site-url";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Work Aged Leads";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "default";

  const categoryColors: Record<string, { bg: string; accent: string }> = {
    blog: { bg: "#1e3a5f", accent: "#60a5fa" },
    "lead-type": { bg: "#1e293b", accent: "#38bdf8" },
    playbook: { bg: "#1e1b4b", accent: "#818cf8" },
    glossary: { bg: "#14532d", accent: "#4ade80" },
    guide: { bg: "#431407", accent: "#fb923c" },
    calculator: { bg: "#1c1917", accent: "#fbbf24" },
    default: { bg: "#0f172a", accent: "#3b82f6" },
  };

  const colors = categoryColors[type] || categoryColors.default;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: `linear-gradient(135deg, ${colors.bg} 0%, #0a0a0a 100%)`,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {category && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: colors.accent,
                }}
              />
              <span
                style={{
                  fontSize: "20px",
                  color: colors.accent,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontWeight: 600,
                }}
              >
                {category}
              </span>
            </div>
          )}
          <h1
            style={{
              fontSize: title.length > 60 ? "48px" : "56px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: colors.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 800,
                color: "#000",
              }}
            >
              W
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#e2e8f0",
              }}
            >
              Work Aged Leads
            </span>
          </div>
          <span
            style={{
              fontSize: "16px",
              color: "#94a3b8",
            }}
          >
            {SITE_HOST}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
