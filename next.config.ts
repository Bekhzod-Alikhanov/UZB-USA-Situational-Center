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
  // Defense-in-depth security headers applied to every response. Kept
  // framework-agnostic (no CSP with nonce yet — the brief page ships one small
  // inline bootstrap script; add a nonce-based CSP when that is refactored).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
