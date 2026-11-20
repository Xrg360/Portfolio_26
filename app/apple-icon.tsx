import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a" }}>
        <svg width="120" height="122" viewBox="0 0 50 51">
          <path d="M45.62 1h3l-43.81 48.85H2L45.62 1Z" fill="#fafaf9" stroke="#fafaf9" strokeWidth="1.5" />
          <path d="M18.12 11.41H3.49l29.26 29.39h14.5L18.12 11.41Z" fill="#1a1a1a" stroke="#fafaf9" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
