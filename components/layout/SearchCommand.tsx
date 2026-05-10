"use client";
import { useSearch } from "@/lib/store/search";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Briefcase, FileText, Search, Target, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { ComponentType } from "react";
import Fuse from "fuse.js";
import { visits } from "@/data/visits";
import { counterparts } from "@/data/counterparts";
import { investments } from "@/data/investments";
import { agreements } from "@/data/agreements";
import { localizedHref, NAV_ITEMS } from "@/lib/navigation";

type SearchEntity = {
  id: string;
  title: string;
  subtitle: string;
  type: "page" | "visit" | "person" | "investment" | "agreement";
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const PAGE_ENTITIES = (locale: string, tNav: (k: string) => string, tGroups: (k: string) => string): SearchEntity[] =>
  NAV_ITEMS.map((item) => ({
    id: `p-${item.key}`,
    title: tNav(item.key),
    subtitle: tGroups(item.groupKey),
    type: "page",
    href: localizedHref(locale, item.href),
    icon: item.icon,
  }));

export function SearchCommand() {
  const open = useSearch((s) => s.open);
  const setOpen = useSearch((s) => s.setOpen);
  const query = useSearch((s) => s.query);
  const setQuery = useSearch((s) => s.setQuery);
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tGroups = useTranslations("navGroups");
  const tTop = useTranslations("top");
  const tSearch = useTranslations("shell.searchDialog");
  const router = useRouter();

  const items: SearchEntity[] = useMemo(() => {
    const pages = PAGE_ENTITIES(locale, tNav, tGroups);
    const vs: SearchEntity[] = visits.map((v) => ({
      id: `v-${v.id}`,
      title: v.title,
      subtitle: `${v.date} · ${v.level}`,
      type: "visit",
      href: `/${locale}/visits`,
      icon: Target,
    }));
    const ps: SearchEntity[] = counterparts.map((p) => ({
      id: `c-${p.id}`,
      title: p.name,
      subtitle: p.position,
      type: "person",
      href: `/${locale}/counterparts`,
      icon: Users,
    }));
    const inv: SearchEntity[] = investments.map((i) => ({
      id: `i-${i.id}`,
      title: i.title,
      subtitle: `${i.sector} · ${i.region}`,
      type: "investment",
      href: `/${locale}/investments`,
      icon: Briefcase,
    }));
    const ag: SearchEntity[] = agreements.map((a) => ({
      id: `a-${a.id}`,
      title: a.title,
      subtitle: `${a.category} · ${a.signedOn}`,
      type: "agreement",
      href: `/${locale}/agreements`,
      icon: FileText,
    }));
    return [...pages, ...vs, ...ps, ...inv, ...ag];
  }, [locale, tGroups, tNav]);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["title", "subtitle"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [items],
  );

  const results = useMemo(() => {
    if (!query) return items.slice(0, 10);
    return fuse
      .search(query)
      .slice(0, 14)
      .map((r) => r.item);
  }, [query, fuse, items]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open, setQuery]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-[15%] z-50 w-[94vw] max-w-[560px] -translate-x-1/2 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{tSearch("title")}</Dialog.Title>
          <Command shouldFilter={false} className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
              <Search className="size-4 text-[var(--color-ink-muted)]" aria-hidden />
              <Command.Input
                autoFocus
                aria-label={tSearch("aria")}
                value={query}
                onValueChange={setQuery}
                placeholder={tTop("search")}
                className="flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
              />
              <kbd className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-px font-mono text-[10px] text-[var(--color-ink-muted)]">
                ESC
              </kbd>
            </div>
            <Command.List className="max-h-[380px] overflow-y-auto p-2">
              <Command.Empty className="px-4 py-6 text-center text-sm text-[var(--color-ink-muted)]">
                {tSearch("empty")}
              </Command.Empty>
              {results.map((it) => {
                const Icon = it.icon;
                return (
                  <Command.Item
                    key={it.id}
                    value={`${it.title}::${it.id}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(it.href);
                    }}
                    className="group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm data-[selected=true]:bg-[var(--color-primary-soft)]"
                  >
                    <Icon
                      className="size-4 text-[var(--color-ink-faint)] group-data-[selected=true]:text-[var(--color-primary)]"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-[var(--color-ink)]">{it.title}</div>
                      <div className="truncate text-[11px] text-[var(--color-ink-muted)]">{it.subtitle}</div>
                    </div>
                    <span className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                      {tSearch(`types.${it.type}`)}
                    </span>
                    <ArrowRight
                      className="size-3 text-[var(--color-ink-faint)] opacity-0 transition group-data-[selected=true]:opacity-100"
                      aria-hidden
                    />
                  </Command.Item>
                );
              })}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
