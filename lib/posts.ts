import fs from "node:fs";
import path from "node:path";

export type PostMeta = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  draft?: boolean;
};

export type Post = PostMeta & { slug: string; readingMinutes: number };

const DIR = path.join(process.cwd(), "content", "writing");
const showDrafts = process.env.NODE_ENV === "development";

function readingMinutes(source: string) {
  const words = source
    .replace(/export const meta[\s\S]*?\};/, "")
    .replace(/[`#>*_{}\[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(DIR, `${slug}.mdx`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  const mod = (await import(`@/content/writing/${slug}.mdx`)) as { meta: PostMeta };
  if (mod.meta.draft && !showDrafts) return null;
  return { ...mod.meta, slug, readingMinutes: readingMinutes(fs.readFileSync(file, "utf8")) };
}

export async function getPosts(): Promise<Post[]> {
  const slugs = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
  const posts = await Promise.all(slugs.map(getPost));
  return posts.filter((p): p is Post => p !== null).sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
