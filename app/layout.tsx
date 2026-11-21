import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/content/site";
import { getPosts } from "@/lib/posts";
import { keywords, structuredData, verification } from "@/lib/seo";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { Reveal } from "@/components/Reveal";
import { AskChat } from "@/components/AskChat";
import "./globals.css";
import "./intro.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: `%s · ${site.name}` },
  description: site.seo.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords,
  category: "technology",
  formatDetection: { telephone: false, address: false, email: false },
  verification,
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d10" },
  ],
};

// Sets theme before paint (no flash), marks the page as JS-enabled for reveal animations,
// and on the home page picks this session's intro scene (never the same as last visit).
const bootScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add('js');try{var d=document.documentElement;if(location.pathname==='/'&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('intro')){var v=['dash','flash','recon','lockin'],l=localStorage.getItem('introLast'),c=v.filter(function(x){return x!==l}),p=c[Math.floor(Math.random()*c.length)];d.dataset.intro=p;sessionStorage.setItem('intro','1');localStorage.setItem('introLast',p)}}catch(e){}})()`;


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = await getPosts();
  return (
    <html lang="en" data-theme="light" className={`${sora.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }} />
      </head>
      <body>
        <a href="#main" className="skip-link btn btn-primary">Skip to content</a>
        <Nav showWriting={posts.length > 0} />
        <main id="main">{children}</main>
        <Footer />
        <Cursor />
        <Reveal />
        <AskChat />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
