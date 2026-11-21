# rohit.simplewebsite.in

Portfolio for **Rohit Babu George, AI Engineer**. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and MDX. Every page is static.

## Run

```bash
npm install
npm run dev        # http://localhost:3000 (draft posts are visible in dev only)
```

## Build

```bash
npm run lint       # type-check
npm run build      # static production build
npm start          # serve the build locally
```

On the low-resource dev machine (`pookie`), wrap heavy commands:
`~/.claude/device-guard/guard run -- npm run build`. Don't run `next dev` and `next build` at the same time, because they compete for CPU and for `.next/`.

## Deploy (Vercel)

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

- In the Vercel dashboard, enable **Web Analytics**. The `<Analytics />` component is already in `app/layout.tsx`, and it uses no cookies.
- Optional env vars:
  - `NEXT_PUBLIC_SITE_URL`: canonical origin (default `https://rohit.simplewebsite.in`).
  - `NEXT_PUBLIC_ENABLE_ASK_CHAT=true`: turns on the phase-2 chat (not built yet; see `components/AskChat.tsx`).

## Where things live

| What | File |
|---|---|
| Name, links, email, hero, SEO, section titles | `content/site.ts` |
| Experience and education | `content/experience.ts` |
| Project cards | `content/projects.ts` |
| Skills | `content/skills.ts` |
| Hero agent-trace scenarios | `content/traces.ts` |
| Blog posts | `content/writing/*.mdx` |
| Résumé PDF | `public/Rohit_Babu_George_Resume.pdf` (served at `/resume`) |
| Colours, type, brutalist primitives | `app/globals.css` (tokens under `:root` and `[data-theme="dark"]`) |

Components never hard-code copy. Edit the files under `content/`.

## How to add a blog post

1. Create `content/writing/my-post-slug.mdx` (slug: lowercase letters, numbers, dashes).
2. Start it with:

   ```mdx
   export const meta = {
     title: "Post title",
     date: "2026-12-01",
     summary: "One sentence for cards and SEO.",
     tags: ["agents", "guardrails"],
     draft: false,
   };

   Your post in **MDX**. Code blocks get Shiki highlighting.
   ```

3. With `draft: true`, the post shows only in `npm run dev`. With `draft: false`, it's published. The home page's Writing section and the nav link appear automatically once at least one post is published.
4. Reading time, the "Discuss on LinkedIn" link, sitemap entry and OG tags are generated for you.

## How to add a case study or project

- **Project card:** add an entry to `content/projects.ts` (`links: []` plus a `privateNote` for private work).
- **Full case study page:** not built, by decision. Hexnode work stays in Experience only. To add case studies for personal projects later, copy the `app/writing/[slug]` pattern into `app/work/[slug]` with `content/work/*.mdx`.

## How to add a trace scenario

Append to `scenarios` in `content/traces.ts`. Each step has a `label`, a `text`, an optional `status` (`ok`, `warn`, `wait`, `held`) and the `node` it lights up in the 3D backdrop. Keep examples fictional and generic: no real product, tool or field names.

## Notes

- **Motion:** CSS only, apart from small client scripts. Everything turns off under `prefers-reduced-motion`. Without JavaScript, the hero shows the full normal run as static text.
- **3D backdrop** (`components/graph-scene.ts`): lazy-loaded three.js. It only loads on desktop with a fine pointer, at least 4 cores, no reduced motion and no data saver, after the page has gone idle. It renders at about 30 fps, pauses when off-screen, and otherwise shows a static SVG.
- **Custom cursor:** fine pointers only; the native cursor is restored under reduced motion.
