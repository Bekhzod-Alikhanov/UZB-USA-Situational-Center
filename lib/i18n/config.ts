export const locales = ["en", "uz-latn", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; flag: string; code: string; shipped: boolean }> = {
  en: { label: "English", flag: "🇺🇸", code: "EN", shipped: true },
  "uz-latn": { label: "O‘zbekcha", flag: "🇺🇿", code: "UZ", shipped: true },
  ru: { label: "Русский", flag: "🇷🇺", code: "RU", shipped: true },
};
