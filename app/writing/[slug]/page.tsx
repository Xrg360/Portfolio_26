import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { site, writingCopy } from "@/content/site";
import { formatDate, getPost, getPosts } from "@/lib/posts";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  // Next needs at least one entry for a static dynamic route; the placeholder 404s.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "_none" }];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: { type: "article", url: `/writing/${slug}`, title: post.title, description: post.summary, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { default: Body } = await import(`@/content/writing/${slug}.mdx`);
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${site.url}/writing/${slug}`)}`;
  return (
    <article className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 md:py-24">
      <Link href="/writing" className="link-grow inline-flex items-center gap-1.5 font-mono text-sm text-muted">
        <ArrowLeft size={14} aria-hidden="true" /> All writing
      </Link>
      <header className="mt-6 max-w-[68ch]">
        <p className="font-mono text-sm text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
          {post.draft ? " · draft" : ""}
        </p>
        <h1 className="display mt-3 !text-[clamp(2rem,5vw,3rem)]">{post.title}</h1>
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <li key={t} className="tag">{t}</li>
          ))}
        </ul>
      </header>
      <div className="prose mt-10">
        <Body />
      </div>
      <a href={share} target="_blank" rel="noopener" className="btn mt-10">
        {writingCopy.discuss}
      </a>
    </article>
  );
}
