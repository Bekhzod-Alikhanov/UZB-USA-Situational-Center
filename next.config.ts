import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Next.js 16: typedRoutes promoted out of experimental.
  typedRoutes: false,
  experimental: {
    // Tree-shake icon barrels + heavy ESM packages so Lighthouse First-Load JS
    // doesn't drag in the whole library when only a handful of imports are used.
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "date-fns",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@visx/hierarchy",
      "@visx/scale",
      "@visx/shape",
      "@visx/group",
      "@visx/treemap",
    ],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.whitehouse.gov" },
      { protocol: "https", hostname: "www.state.gov" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
