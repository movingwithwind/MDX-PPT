import type { NextConfig } from "next";
import nextWithMDX from "@next/mdx";
// Use a resolvable path for the remark plugin so loader options stay serializable

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextWithMDX({
  options: {
    // pass the plugin as a resolvable module path (string) rather than a function
    // so the mdx loader receives serializable options
    // point to the CommonJS build so Node can require it while loading next.config
    remarkPlugins: [
      require.resolve("remark-gfm"),
      require.resolve("./src/components/remark-slide.cjs"),
    ],
    // use Shiki for code highlighting in MDX
    rehypePlugins: [
      [
        require.resolve("@shikijs/rehype"),
        {
          theme: "dracula",
        },
      ],
    ],
  },
})(nextConfig);