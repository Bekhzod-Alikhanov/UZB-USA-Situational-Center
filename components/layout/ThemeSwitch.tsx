"use client";
import { useSettings, type Theme } from "@/lib/store/settings";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Three-state theme switch. Cycles strategic → light → dark → strategic.
 * The actual class-on-<html> wiring lives in `useSettings.setTheme` and
 * `SettingsSync`; this button just rotates the value.
 */
const ORDER: Theme[] = ["strategic", "light", "dark"];

const ICON: Record<Theme, React.ComponentType<{ className?: string }>> = {
  strategic: Sparkles,
  light: Moon,
  dark: Sun,
};

export function ThemeSwitch() {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const tShell = useTranslations("shell");
  const Icon = ICON[theme] ?? Sparkles;

  function cycle() {
    const i = ORDER.indexOf(theme);
    const next = ORDER[(i + 1) % ORDER.length] ?? "strategic";
    setTheme(next);
  }

  return (
    <button
      type="button"
      aria-label={tShell("toggleTheme")}
      title={tShell("toggleTheme") + " · " + theme}
      onClick={cycle}
      className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
    >
      <Icon className="size-4" />
    </button>
  );
}
