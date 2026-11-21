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
  - `MONKEYTYPE_APE_KEY`: turns on the live typing stat (see below).
  - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION`: verification codes for Search Console and Bing (see SEO).

## SEO

What's built in:
- **Metadata:** title, description, keywords, canonical, Open Graph and Twitter tags, plus a generated OG image (`app/opengraph-image.tsx`).
- **Structured data:** a schema.org `ProfilePage` → `Person` + `WebSite` graph (`lib/seo.ts`). This helps Google tie name searches ("Rohit Babu George", "Rohit George", "xrg360") to this site, GitHub and LinkedIn.
- **Sitemap and robots:**
  - `/sitemap.xml` lists the home page and the résumé PDF. `/writing` is added once a post is published; until then it's `noindex`.
  - `/robots.txt` keeps crawlers out of `/api/`.
- **One indexed domain:** every `*.vercel.app` host gets `X-Robots-Tag: noindex` (`next.config.mjs`), so only the custom domain is indexed.
- **Extras:**
  - `/llms.txt`: a plain-text profile for AI search tools.
  - `/manifest.webmanifest`.
  - The résumé PDF has its title and author set, so Google shows a proper title for it.

After deploying to the custom domain:
1. In Vercel → Project → Domains, add `rohit.simplewebsite.in` and make it the primary domain. Set `NEXT_PUBLIC_SITE_URL=https://rohit.simplewebsite.in`, which is already the default.
2. Open [Google Search Console](https://search.google.com/search-console) and add the property. Either:
   - choose **Domain** (`simplewebsite.in`) and verify with a DNS TXT record, or
   - choose **URL prefix** and put the code in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, then redeploy.
3. Submit `https://rohit.simplewebsite.in/sitemap.xml`, then use **URL inspection → Request indexing** on the home page.
4. Optional: in Bing Webmaster Tools, choose **Import from Google Search Console**.
5. Link the site from your GitHub profile (website field) and from LinkedIn (Contact info → Website). Those links are the strongest signals for name searches.
6. Check the structured data with the [Rich Results Test](https://search.google.com/test/rich-results).

## Live typing stat (Monkeytype)

The Skills section shows your latest Monkeytype result and your PB for the same mode.

1. On monkeytype.com, open **Account settings → Ape keys**, generate a key and **activate** it (new keys start inactive).
2. Add it as `MONKEYTYPE_APE_KEY` in Vercel's environment variables (and in `.env.local` to try it locally), then redeploy.

How it works:
- `app/api/typing/route.ts` is cached with ISR. It calls Monkeytype at most once every 90 s, about 40 calls/hour, under the API's 60/hour limit. PBs are cached for an hour.
- The widget (`components/TypingStat.tsx`) polls that cached route every 60 s while the tab is visible, so a new test shows up within about 2 minutes.
- Monkeytype has no WebSocket or push API, so this is as close to real time as it gets without hitting the rate limit.
- The key stays on the server. If Monkeytype is down, the last good result keeps showing. Without a key, the widget doesn't render at all.

## Where things live

| What | File |
|---|---|
| Name, links, email, hero, SEO, section titles | `content/site.ts` |
| Experience and education | `content/experience.ts` |
| Project cards | `content/projects.ts` |
| Skills | `content/skills.ts` |
| Hero agent-trace scenarios | `content/traces.ts` |
| Typing-stat labels | `content/site.ts` (`typingCopy`) |
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
- **Custom cursor:** a tactical crosshair (a nod to Valorant: red spread over targets, hit marker on click). Fine pointers only; the native cursor is restored under reduced motion. Colour token `--val` in `app/globals.css`.
