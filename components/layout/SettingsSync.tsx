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
 */
export function SettingsSync() {
  const hideDemo = useSettings((s) => s.hideDemo);
  const presentation = useSettings((s) => s.presentationMode);
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.toggleAttribute("data-hide-demo", hideDemo);
    html.toggleAttribute("data-presentation", presentation);
    html.classList.toggle("dark", theme === "dark");
    html.classList.toggle("command", theme === "command");
    html.classList.toggle("strategic", theme === "command");
  }, [hideDemo, presentation, theme]);

  return null;
}
