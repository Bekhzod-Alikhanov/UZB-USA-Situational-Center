"use client";
import { useSettings, type Theme } from "@/lib/store/settings";
import { Command, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Three-state theme switch. Cycles command -> light -> dark -> command.
 * The actual class-on-<html> wiring lives in `useSettings.setTheme` and
 * `SettingsSync`; this button just rotates the value.
 */
const ORDER: Theme[] = ["command", "light", "dark"];

const ICON: Record<Theme, React.ComponentType<{ className?: string }>> = {
  command: Command,
  light: Moon,
  dark: Sun,
};

export function ThemeSwitch() {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const tShell = useTranslations("shell");
  const Icon = ICON[theme] ?? Command;

  function cycle() {
    const i = ORDER.indexOf(theme);
    const next = ORDER[(i + 1) % ORDER.length] ?? "command";
    setTheme(next);
  }

  return (
    <button
      type="button"
      aria-label={tShell("toggleTheme")}
      title={tShell("toggleTheme") + " - " + theme}
      onClick={cycle}
      className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
    >
      <Icon className="size-4" />
    </button>
  );
}
