import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { localeAlternates, siteDescription, siteTitle, siteUrl } from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  // Italic dropped from the load list (Apr 2026 perf pass) — `.italic` body
  // text falls back to synthesised italic from Geist Sans, saving ~30 KB
  // of woff2 transfer. The serif headings on the dashboard are not italic.
  style: ["normal"],
  variable: "--font-instrument-serif",
  display: "swap",
  // The serif is for headings only — defer it; let the body Geist render
  // first and let the heading swap in. Cuts ~150 ms off first paint.
  // Re-tested May 2026: enabling preload added ~150 ms to LCP and 15 KB
  // per route. Keep deferred.
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  // Drop cyrillic-ext (rare diacritics) — basic `cyrillic` covers Russian
  // and Uzbek-Cyrillic. Saves ~25 KB woff2 transfer per route.
  subsets: ["latin", "cyrillic"] as ("latin" | "cyrillic")[],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · UZ-US Intelligence",
  },
  description: siteDescription,
  applicationName: "UZ-US Intelligence Platform",
  alternates: localeAlternates("en"),
  openGraph: {
    type: "website",
    url: "/en",
    siteName: "UZ-US Intelligence Platform",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
