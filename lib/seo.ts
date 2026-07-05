import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/lib/i18n/config";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uz-us-center.vercel.app";
export const siteTitle = "Uzbekistan-USA Economic and Investment Intelligence Platform";
export const siteDescription =
  "Executive intelligence platform for Uzbekistan-USA economic relations, trade flows, investment opportunities, diplomatic activity, and source-backed operational analysis.";

function normalizePath(path = "") {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function routeFor(locale: Locale, path = "") {
  return `/${locale}${normalizePath(path)}`;
}

export const SEO_ROUTES = {
  brief: "",
  overview: "/overview",
  trade: "/trade",
  investments: "/investments",
  map: "/map",
  benchmark: "/benchmark",
  visits: "/visits",
  agreements: "/agreements",
  roadmaps: "/roadmaps",
  compliance: "/compliance",
  grants: "/grants",
  contacts: "/contacts",
  prepare: "/prepare",
  adminLogin: "/admin/login",
} as const;

export type SeoRouteKey = keyof typeof SEO_ROUTES;

function safeLocale(locale: string): Locale {
  return locales.includes(locale as Locale) ? (locale as Locale) : "en";
}

export function localeAlternates(locale: string, path = ""): Metadata["alternates"] {
  const activeLocale = safeLocale(locale);

  return {
    canonical: routeFor(activeLocale, path),
    languages: Object.fromEntries(locales.map((item) => [item === "uz-latn" ? "uz-Latn" : item, routeFor(item, path)])),
  };
}

export async function getRouteSeo({
  locale,
  routeKey,
  path,
  values,
}: {
  locale: string;
  routeKey: SeoRouteKey;
  path?: string;
  values?: Record<string, string | number>;
}): Promise<Metadata> {
  const activeLocale = safeLocale(locale);
  const t = await getTranslations({ locale: activeLocale, namespace: `seo.routes.${routeKey}` });
  const routePath = path ?? SEO_ROUTES[routeKey];

  return {
    title: t("title", values),
    description: t("description", values),
    alternates: localeAlternates(activeLocale, routePath),
  };
}
