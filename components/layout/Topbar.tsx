"use client";
import { useTranslations } from "next-intl";
import { LocaleSwitch } from "./LocaleSwitch";
import { FreshnessPill } from "./FreshnessPill";
import { MobileSidebar } from "./MobileSidebar";
import { Search, Menu } from "lucide-react";
import { useSearch } from "@/lib/store/search";
import { useEffect } from "react";

export function Topbar() {
  const t = useTranslations("top");
  const tShell = useTranslations("shell");
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
    <header className="command-topbar sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface)_88%,transparent)] px-3 sm:gap-3 sm:px-4 lg:gap-4 lg:px-6">
      {/* Mobile menu trigger — hidden on lg+ where the persistent sidebar is shown */}
      <MobileSidebar
        trigger={
          <button
            type="button"
            aria-label={tShell("openMenu")}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] lg:hidden"
          >
            <Menu className="size-4" />
          </button>
        }
      />

      <div className="min-w-0 flex-1">
        <div className="serif truncate text-[14px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[16px]">
          {t("title")}
        </div>
        <div className="hidden truncate text-[11px] text-[var(--color-ink-muted)] sm:block">{t("sub")}</div>
      </div>

      {/* Desktop full search — hidden below md */}
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="hidden w-[310px] items-center gap-2 rounded-md border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface-2)_86%,transparent)] px-3 py-1.5 text-[12.5px] text-[var(--color-ink-muted)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] xl:flex"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 truncate text-left">{t("search")}</span>
        <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-px font-mono text-[10px] text-[var(--color-ink-muted)]">
          {t("shortcut")}
        </kbd>
      </button>

      {/* Compact search button below xl */}
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        aria-label={tShell("search")}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] xl:hidden"
      >
        <Search className="size-4" />
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Online dot — md+ only */}
        <span className="hidden items-center gap-1.5 rounded-md border border-[color-mix(in_oklab,var(--color-pos)_30%,transparent)] bg-[var(--color-pos-soft)] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--color-pos)] xl:inline-flex">
          <span className="size-1.5 rounded-full bg-[var(--color-pos)]" />
          {t("online")}
        </span>
        {/* Freshness pill — sm+ */}
        <span className="hidden sm:block">
          <FreshnessPill />
        </span>
        <LocaleSwitch />
      </div>
    </header>
  );
}
