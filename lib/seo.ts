import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, requirePublicLocale, type Locale } from "@/lib/i18n/config";

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

export const localeHrefLang: Record<Locale, string> = {
  en: "en",
  "uz-latn": "uz-Latn",
};

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
  sources: "/sources",
  prepare: "/prepare",
  adminLogin: "/admin/login",
} as const;

export type SeoRouteKey = keyof typeof SEO_ROUTES;

export function localeAlternates(locale: string, path = ""): Metadata["alternates"] {
  const activeLocale = requirePublicLocale(locale);

  return {
    canonical: routeFor(activeLocale, path),
    languages: {
      ...Object.fromEntries(locales.map((item) => [localeHrefLang[item], routeFor(item, path)])),
      "x-default": routeFor("en", path),
    },
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
  const activeLocale = requirePublicLocale(locale);
  const t = await getTranslations({ locale: activeLocale, namespace: `seo.routes.${routeKey}` });
  const routePath = path ?? SEO_ROUTES[routeKey];

  return {
    title: t("title", values),
    description: t("description", values),
    alternates: localeAlternates(activeLocale, routePath),
  };
}
