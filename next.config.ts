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
    // Keep the optimizer focused on packages that are still imported directly.
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@dnd-kit/core",
      "@visx/hierarchy",
      "@visx/group",
      "@visx/responsive",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",
      "@radix-ui/react-switch",
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
