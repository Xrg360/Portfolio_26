import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} · ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fafaf9", padding: 48 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "4px solid #1a1a1a",
            borderRadius: 16,
            background: "#ffffff",
            boxShadow: "12px 12px 0 0 #1a1a1a",
            padding: "56px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#555555", letterSpacing: 3 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#15803d" }} />
            {`${site.title.toUpperCase()} · KOCHI, INDIA`}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 84, fontWeight: 700, color: "#1a1a1a", letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
            <div style={{ width: 160, height: 8, background: "#1f4e79", marginTop: 28, marginBottom: 28 }} />
            <div style={{ fontSize: 40, color: "#1a1a1a", lineHeight: 1.25, maxWidth: 900 }}>{site.oneLiner}</div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#1a1a1a" }}>
            {["MCP", "Agents", "Guardrails", "Evals"].map((t) => (
              <div key={t} style={{ display: "flex", border: "3px solid #1a1a1a", borderRadius: 999, padding: "6px 20px" }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
