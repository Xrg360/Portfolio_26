import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate, type Post } from "@/lib/posts";

export function WritingList({ posts }: { posts: Post[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {posts.map((p) => (
        <li key={p.slug}>
          <Link href={`/writing/${p.slug}`} className="brut brut-hover flex h-full flex-col p-6" data-cursor="read →">
            <p className="font-mono text-sm text-muted">
              {formatDate(p.date)} · {p.readingMinutes} min read{p.draft ? " · draft" : ""}
            </p>
            <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
            <p className="mt-2 text-muted">{p.summary}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-semibold text-accent">
              Read <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
