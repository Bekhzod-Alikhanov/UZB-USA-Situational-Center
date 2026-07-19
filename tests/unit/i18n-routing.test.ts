import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { archivedLocales, isPublicLocale, locales, requirePublicLocale } from "@/lib/i18n/config";
import { legacyRussianRedirectPath } from "@/lib/i18n/routing";

describe("V2 locale routing", () => {
  it("publishes only English and Uzbek Latin", () => {
    expect(locales).toEqual(["en", "uz-latn"]);
    expect(archivedLocales).toEqual(["ru"]);
  });

  it("maps the Russian locale root to Uzbek Latin", () => {
    expect(legacyRussianRedirectPath("/ru")).toBe("/uz-latn");
    expect(legacyRussianRedirectPath("/ru/")).toBe("/uz-latn/");
  });

  it("preserves the complete path below the locale segment", () => {
    expect(legacyRussianRedirectPath("/ru/trade/advanced")).toBe("/uz-latn/trade/advanced");
  });

  it("does not rewrite lookalike or active locale paths", () => {
    expect(legacyRussianRedirectPath("/rural-development")).toBeNull();
    expect(legacyRussianRedirectPath("/en/trade")).toBeNull();
    expect(legacyRussianRedirectPath("/uz-latn/trade")).toBeNull();
  });

  it("rejects missing and unsupported locales instead of silently falling back to English", () => {
    expect(isPublicLocale("en")).toBe(true);
    expect(isPublicLocale("uz-latn")).toBe(true);
    expect(isPublicLocale("ru")).toBe(false);
    expect(isPublicLocale(undefined)).toBe(false);
    expect(() => requirePublicLocale("ru")).toThrow(/Unsupported public locale: ru/);
    expect(() => requirePublicLocale(undefined)).toThrow(/Unsupported public locale: missing/);
  });

  it("serves root metadata assets outside the locale catch-all", () => {
    expect(fs.existsSync(path.resolve(process.cwd(), "app/robots.ts"))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), "public/favicon.ico"))).toBe(true);
  });
});
