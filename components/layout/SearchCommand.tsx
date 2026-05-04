"use client";
import { useSearch } from "@/lib/store/search";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, ArrowRight, FileText, Users, Target, Briefcase, Globe2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { visits } from "@/data/visits";
import { counterparts } from "@/data/counterparts";
import { investments } from "@/data/investments";
import { agreements } from "@/data/agreements";

type SearchEntity = {
  id: string;
  title: string;
  subtitle: string;
  type: "page" | "visit" | "person" | "investment" | "agreement";
  href: string;
};

const PAGE_ENTITIES = (locale: string, tNav: (k: string) => string): SearchEntity[] => [
  { id: "p-overview", title: tNav("overview"), subtitle: tNav("overview"), type: "page", href: `/${locale}` },
  { id: "p-trade", title: tNav("trade"), subtitle: tNav("trade"), type: "page", href: `/${locale}/trade` },
  { id: "p-investments", title: tNav("investments"), subtitle: tNav("investments"), type: "page", href: `/${locale}/investments` },
  { id: "p-visits", title: tNav("visits"), subtitle: tNav("visits"), type: "page", href: `/${locale}/visits` },
  { id: "p-prepare", title: tNav("prepare"), subtitle: tNav("prepare"), type: "page", href: `/${locale}/prepare` },
  { id: "p-commitments", title: tNav("commitments"), subtitle: tNav("commitments"), type: "page", href: `/${locale}/commitments` },
  { id: "p-agreements", title: tNav("agreements"), subtitle: tNav("agreements"), type: "page", href: `/${locale}/agreements` },
  { id: "p-events", title: tNav("events"), subtitle: tNav("events"), type: "page", href: `/${locale}/events` },
  { id: "p-grants", title: tNav("grants"), subtitle: tNav("grants"), type: "page", href: `/${locale}/grants` },
  { id: "p-map", title: tNav("map"), subtitle: tNav("map"), type: "page", href: `/${locale}/map` },
  { id: "p-compliance", title: tNav("compliance"), subtitle: tNav("compliance"), type: "page", href: `/${locale}/compliance` },
  { id: "p-counterparts", title: tNav("counterparts"), subtitle: tNav("counterparts"), type: "page", href: `/${locale}/counterparts` },
  { id: "p-benchmark", title: tNav("benchmark"), subtitle: tNav("benchmark"), type: "page", href: `/${locale}/benchmark` },
  { id: "p-staff", title: tNav("staff"), subtitle: tNav("staff"), type: "page", href: `/${locale}/staff` },
  { id: "p-contacts", title: tNav("contacts"), subtitle: tNav("contacts"), type: "page", href: `/${locale}/contacts` },
  { id: "p-news", title: tNav("news"), subtitle: tNav("news"), type: "page", href: `/${locale}/news` },
  { id: "p-assistant", title: tNav("assistant"), subtitle: tNav("assistant"), type: "page", href: `/${locale}/assistant` },
  { id: "p-admin", title: tNav("admin"), subtitle: tNav("admin"), type: "page", href: `/${locale}/admin` },
];

const ICONS: Record<SearchEntity["type"], React.ComponentType<{ className?: string }>> = {
  page: Globe2,
  visit: Target,
  person: Users,
  investment: Briefcase,
  agreement: FileText,
};

export function SearchCommand() {
  const open = useSearch((s) => s.open);
  const setOpen = useSearch((s) => s.setOpen);
  const query = useSearch((s) => s.query);
  const setQuery = useSearch((s) => s.setQuery);
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tTop = useTranslations("top");
  const router = useRouter();

  const items: SearchEntity[] = useMemo(() => {
    const pages = PAGE_ENTITIES(locale, tNav);
    const vs: SearchEntity[] = visits.map((v) => ({
      id: `v-${v.id}`,
      title: v.title,
      subtitle: `${v.date} · ${v.level}`,
      type: "visit",
      href: `/${locale}/visits`,
    }));
    const ps: SearchEntity[] = counterparts.map((p) => ({
      id: `c-${p.id}`,
      title: p.name,
      subtitle: p.position,
      type: "person",
      href: `/${locale}/counterparts`,
    }));
    const inv: SearchEntity[] = investments.map((i) => ({
      id: `i-${i.id}`,
      title: i.title,
      subtitle: `${i.sector} · ${i.region}`,
      type: "investment",
      href: `/${locale}/investments`,
    }));
    const ag: SearchEntity[] = agreements.map((a) => ({
      id: `a-${a.id}`,
      title: a.title,
      subtitle: `${a.category} · ${a.signedOn}`,
      type: "agreement",
      href: `/${locale}/agreements`,
    }));
    return [...pages, ...vs, ...ps, ...inv, ...ag];
  }, [locale, tNav]);

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
    if (!query) return items.slice(0, 8);
    return fuse.search(query).slice(0, 12).map((r) => r.item);
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
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <Command shouldFilter={false} className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
              <Search className="size-4 text-[var(--color-ink-muted)]" aria-hidden />
              <Command.Input
                autoFocus
                aria-label="Search dashboard"
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
                No results
              </Command.Empty>
              {results.map((it) => {
                const Icon = ICONS[it.type];
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
                    <Icon className="size-4 text-[var(--color-ink-faint)] group-data-[selected=true]:text-[var(--color-primary)]" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-[var(--color-ink)]">{it.title}</div>
                      <div className="truncate text-[11px] text-[var(--color-ink-muted)]">{it.subtitle}</div>
                    </div>
                    <span className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                      {it.type}
                    </span>
                    <ArrowRight className="size-3 text-[var(--color-ink-faint)] opacity-0 transition group-data-[selected=true]:opacity-100" aria-hidden />
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
