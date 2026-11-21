import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getPosts } from "@/lib/posts";

const built = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: `${site.url}/`, lastModified: built, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/Rohit_Babu_George_Resume.pdf`, lastModified: built, changeFrequency: "monthly", priority: 0.8 },
    // The Writing index only goes in once there's something to read.
    ...(posts.length
      ? [
          { url: `${site.url}/writing`, lastModified: built, changeFrequency: "weekly" as const, priority: 0.6 },
          ...posts.map((p) => ({ url: `${site.url}/writing/${p.slug}`, lastModified: p.date, priority: 0.7 })),
        ]
      : []),
  ];
}
