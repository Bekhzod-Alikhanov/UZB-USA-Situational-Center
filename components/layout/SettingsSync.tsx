"use client";
import { useEffect } from "react";
import { useSettings } from "@/lib/store/settings";

/**
 * Mirrors `hideDemo` / `presentationMode` from the persisted Zustand store
 * onto `<html>` data attributes so global CSS rules can suppress demo
 * markers (e.g. .demo-underline) without each consumer threading the flags
 * through props. Mount once in the locale-shell layout. The setters in
 * `lib/store/settings.ts` apply the attributes synchronously on toggle;
 * this effect handles the initial-hydration case after `persist` rehydrate.
 *
 * Also corrects `<html lang>` to the active locale. The root layout
 * (`app/layout.tsx`) ships a static `lang="en"` because the App Router only
 * lets the root own the `<html>` element; this syncs it to the real locale
 * (BCP-47 `uz-Latn` for Uzbek-Latin) so assistive tech and crawlers reading
 * the live DOM get the correct language on `/ru` and `/uz-latn` routes.
 *
 * Theme is no longer synced here — the `command` class is set statically on
 * `<html>` in the root layout and never changes.
 */
export function SettingsSync({ locale }: { locale: string }) {
  const hideDemo = useSettings((s) => s.hideDemo);
  const presentation = useSettings((s) => s.presentationMode);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.toggleAttribute("data-hide-demo", hideDemo);
    html.toggleAttribute("data-presentation", presentation);
    html.lang = locale === "uz-latn" ? "uz-Latn" : locale;
  }, [hideDemo, presentation, locale]);

  return null;
}
