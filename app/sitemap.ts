import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/writing`, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((p) => ({ url: `${site.url}/writing/${p.slug}`, lastModified: p.date, priority: 0.7 })),
  ];
}
