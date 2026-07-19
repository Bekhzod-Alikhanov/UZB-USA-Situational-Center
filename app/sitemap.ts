import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { localeHrefLang, SEO_ROUTES, siteUrl } from "@/lib/seo";

const publicRoutePaths = [
  SEO_ROUTES.brief,
  SEO_ROUTES.trade,
  SEO_ROUTES.investments,
  SEO_ROUTES.grants,
  SEO_ROUTES.compliance,
  SEO_ROUTES.benchmark,
  SEO_ROUTES.visits,
  SEO_ROUTES.agreements,
  SEO_ROUTES.contacts,
  SEO_ROUTES.roadmaps,
  SEO_ROUTES.map,
  SEO_ROUTES.sources,
] as const;

function absoluteUrl(locale: (typeof locales)[number], path: string): string {
  return `${siteUrl.replace(/\/$/, "")}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutePaths.flatMap((path) => {
    const languages = {
      ...Object.fromEntries(locales.map((locale) => [localeHrefLang[locale], absoluteUrl(locale, path)])),
      "x-default": absoluteUrl("en", path),
    };

    return locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      alternates: { languages },
    }));
  });
}
