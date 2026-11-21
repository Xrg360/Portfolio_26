import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["lucide-react"] },
  // Only the custom domain should be indexed; *.vercel.app copies get noindex.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    // Plugins are passed by name so they work with Turbopack.
    rehypePlugins: [["@shikijs/rehype", { themes: { light: "github-light", dark: "github-dark" } }]],
  },
});

export default withMDX(nextConfig);
