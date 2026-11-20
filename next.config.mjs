import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["lucide-react"] },
};

const withMDX = createMDX({
  options: {
    // Plugins are passed by name so they work with Turbopack.
    rehypePlugins: [["@shikijs/rehype", { themes: { light: "github-light", dark: "github-dark" } }]],
  },
});

export default withMDX(nextConfig);
