"use client";

import { Command, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSettings, type Theme } from "@/lib/store/settings";

const ORDER: Theme[] = ["light", "dark", "command"];

const ICON: Record<Theme, React.ComponentType<{ className?: string }>> = {
  light: Sun,
  dark: Moon,
  command: Command,
};

export function ThemeSwitch() {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const t = useTranslations("shell");
  const Icon = ICON[theme] ?? Sun;

  function cycle() {
    const index = ORDER.indexOf(theme);
    setTheme(ORDER[(index + 1) % ORDER.length] ?? "light");
  }

  const current = t(`themes.${theme}`);

  return (
    <button
      type="button"
      aria-label={t("toggleThemeCurrent", { theme: current })}
      title={t("toggleThemeCurrent", { theme: current })}
      onClick={cycle}
      className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
