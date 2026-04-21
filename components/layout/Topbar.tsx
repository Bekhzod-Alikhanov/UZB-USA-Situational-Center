"use client";
import { useTranslations } from "next-intl";
import { LocaleSwitch } from "./LocaleSwitch";
import { ThemeSwitch } from "./ThemeSwitch";
import { Search } from "lucide-react";
import { useSearch } from "@/lib/store/search";
import { useEffect } from "react";

export function Topbar() {
  const t = useTranslations("top");
  const setSearchOpen = useSearch((s) => s.setOpen);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-6 backdrop-blur">
      <div className="min-w-0 flex-1">
        <div className="truncate serif text-[15px] font-medium text-[var(--color-ink)]">
          {t("title")}
        </div>
        <div className="truncate text-[11px] text-[var(--color-ink-muted)]">{t("sub")}</div>
      </div>

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="hidden w-[340px] items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1.5 text-[12.5px] text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)] md:flex"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 truncate text-left">{t("search")}</span>
        <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-px font-mono text-[10px] text-[var(--color-ink-muted)]">
          {t("shortcut")}
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--color-pos)_30%,transparent)] bg-[var(--color-pos-soft)] px-2.5 py-1 text-[10.5px] font-medium text-[var(--color-pos)] md:inline-flex">
          <span className="size-1.5 rounded-full bg-[var(--color-pos)]" />
          {t("online")}
        </span>
        <LocaleSwitch />
        <ThemeSwitch />
      </div>
    </header>
  );
}
