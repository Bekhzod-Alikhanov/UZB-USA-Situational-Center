import type { Locale } from "./config";

export const LEGACY_RUSSIAN_LOCALE = "ru" as const;
export const LEGACY_RUSSIAN_REDIRECT_LOCALE: Locale = "uz-latn";

/**
 * Maps a legacy Russian-interface pathname to the equivalent Uzbek Latin
 * pathname. Search parameters are deliberately handled by cloning the URL in
 * middleware so their ordering and values remain unchanged.
 */
export function legacyRussianRedirectPath(pathname: string): string | null {
  const legacyPrefix = `/${LEGACY_RUSSIAN_LOCALE}`;

  if (pathname === legacyPrefix) return `/${LEGACY_RUSSIAN_REDIRECT_LOCALE}`;
  if (!pathname.startsWith(`${legacyPrefix}/`)) return null;

  return `/${LEGACY_RUSSIAN_REDIRECT_LOCALE}${pathname.slice(legacyPrefix.length)}`;
}
