"use client";
import { useSettings } from "@/lib/store/settings";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export function ThemeSwitch() {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const tShell = useTranslations("shell");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return (
    <button
      type="button"
      aria-label={tShell("toggleTheme")}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
