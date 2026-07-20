/** Locales published by the V2 runtime. */
export const locales = ["en", "uz-latn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isPublicLocale(value: string | null | undefined): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function requirePublicLocale(value: string | null | undefined): Locale {
  if (!isPublicLocale(value)) {
    throw new RangeError(`Unsupported public locale: ${value ?? "missing"}`);
  }
  return value;
}

/**
 * Russian is retained in source records and the archived message bundle, but
 * it is no longer a routable product locale. Legacy bookmarks are handled by
 * the edge redirect in `proxy.ts`.
 */
export const archivedLocales = ["ru"] as const;
export type ArchivedLocale = (typeof archivedLocales)[number];

export const localeMeta: Record<Locale, { label: string; code: string; shipped: boolean }> = {
  en: { label: "English", code: "EN", shipped: true },
  "uz-latn": { label: "O‘zbekcha", code: "UZ", shipped: true },
};
