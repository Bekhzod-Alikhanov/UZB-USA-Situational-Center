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
      "@dnd-kit/utilities",
      // Visx — full surface, not just treemap.
      "@visx/hierarchy",
      "@visx/scale",
      "@visx/shape",
      "@visx/group",
      "@visx/treemap",
      "@visx/sankey",
      "@visx/chord",
      "@visx/responsive",
      // Radix — without these the full barrel ships on every page that
      // mounts a single primitive (Sidebar uses Dialog + Dropdown, Topbar
      // uses Popover + Tooltip).
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-popover",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-switch",
      "@radix-ui/react-progress",
      "@radix-ui/react-separator",
      "@radix-ui/react-avatar",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
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
