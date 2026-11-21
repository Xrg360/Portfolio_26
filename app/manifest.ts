import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.title}`,
    short_name: site.shortName,
    description: site.seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#fafaf9",
    theme_color: "#1f4e79",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
