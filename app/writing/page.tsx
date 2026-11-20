import type { Metadata } from "next";
import { sections, site, writingCopy } from "@/content/site";
import { getPosts } from "@/lib/posts";
import { WritingList } from "@/components/WritingList";

export const metadata: Metadata = {
  title: "Writing",
  description: `Notes from ${site.name} on building safe AI agents: guardrails, MCP, evals and tracing.`,
  alternates: { canonical: "/writing" },
  openGraph: { url: "/writing" },
};

export default async function WritingIndex() {
  const posts = await getPosts();
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <p className="eyebrow text-muted">{sections.writing.eyebrow}</p>
      <h1 className="display mt-3 !text-[clamp(2rem,5vw,3.4rem)]">{sections.writing.title}</h1>
      <div className="mt-12">
        {posts.length ? (
          <WritingList posts={posts} />
        ) : (
          <div className="brut max-w-xl p-6">
            <h2 className="text-lg font-bold">{writingCopy.emptyTitle}</h2>
            <p className="mt-2 text-muted">{writingCopy.emptyBody}</p>
            <a href={site.links.github} className="prose-link mt-4 inline-block" target="_blank" rel="me noopener">
              github.com/xrg360
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
