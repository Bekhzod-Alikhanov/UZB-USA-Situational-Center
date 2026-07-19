"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArchiveRestore,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckCircle2,
  Database,
  ExternalLink,
  FileLock2,
  FileSearch,
  Globe2,
  Landmark,
  Newspaper,
  Quote,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

export type PublicSourceEntry = {
  id: string;
  name: string;
  level: "A" | "B";
  fetchedAt: string;
  dataType: string;
  note?: string;
  url?: string;
};

type SourceFilter = "all" | "B" | "A";

type SourcesRegistryProps = {
  entries: PublicSourceEntry[];
  locale: string;
  provenanceBadge: ReactNode;
  summary: {
    total: number;
    levelA: number;
    levelB: number;
    latestFetch: string;
  };
};

const confidenceItems = [
  { key: "verifiedOfficial", tone: "pos", icon: Landmark },
  { key: "companyConfirmed", tone: "primary", icon: Building2 },
  { key: "mediaReported", tone: "warn", icon: Newspaper },
  { key: "internalUnverified", tone: "neutral", icon: FileLock2 },
  { key: "sourceNeeded", tone: "neg", icon: FileSearch },
  { key: "illustrativeDemo", tone: "demo", icon: Database },
] as const;

const confidenceTone = {
  pos: "border-[color-mix(in_oklab,var(--color-pos)_28%,var(--color-border))] bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  primary:
    "border-[color-mix(in_oklab,var(--color-primary)_28%,var(--color-border))] bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  warn: "border-[color-mix(in_oklab,var(--color-warn)_28%,var(--color-border))] bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  neutral: "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  neg: "border-[color-mix(in_oklab,var(--color-neg)_28%,var(--color-border))] bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  demo: "border-[var(--color-border)] bg-[var(--color-demo-bg)] text-[var(--color-demo-ink)]",
} as const;

function SourceLevelMark({ level, label }: { level: "A" | "B"; label: string }) {
  return (
    <span
      className={
        level === "B"
          ? "inline-flex min-h-7 items-center rounded-full border border-[color-mix(in_oklab,var(--color-primary)_28%,var(--color-border))] bg-[var(--color-primary-soft)] px-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-primary)]"
          : "inline-flex min-h-7 items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]"
      }
    >
      {label}
    </span>
  );
}

function PublicSourceMark({ entry, accessibleLabel }: { entry: PublicSourceEntry; accessibleLabel: string }) {
  if (!entry.url) return <SourceLevelMark level="B" label={`[B] ${entry.id}`} />;

  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noreferrer"
      aria-label={accessibleLabel}
      className="mono inline-flex min-h-7 items-center gap-1 rounded border border-[color-mix(in_oklab,var(--color-primary)_30%,var(--color-border))] bg-[var(--color-primary-soft)] px-2 text-[9.5px] uppercase tracking-wider text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-contrast)]"
    >
      <ExternalLink className="size-2.5" aria-hidden />
      [B] {entry.id}
    </a>
  );
}

export function SourcesRegistry({ entries, locale, provenanceBadge, summary }: SourcesRegistryProps) {
  const t = useTranslations("sourcesPage");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SourceFilter>("all");

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "uz-latn" ? "uz-Latn-UZ" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
    [locale],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale === "uz-latn" ? "uz-Latn-UZ" : "en-US");
    return entries.filter((entry) => {
      if (filter !== "all" && entry.level !== filter) return false;
      if (!normalized) return true;
      return [entry.id, entry.name, entry.dataType, entry.note ?? ""]
        .join(" ")
        .toLocaleLowerCase(locale === "uz-latn" ? "uz-Latn-UZ" : "en-US")
        .includes(normalized);
    });
  }, [entries, filter, locale, query]);

  const grouped = useMemo(
    () => ({
      B: filtered.filter((entry) => entry.level === "B"),
      A: filtered.filter((entry) => entry.level === "A"),
    }),
    [filtered],
  );

  const filterOptions: Array<{ value: SourceFilter; count: number }> = [
    { value: "all", count: summary.total },
    { value: "B", count: summary.levelB },
    { value: "A", count: summary.levelA },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-10 pb-12 sm:gap-14">
      <section
        aria-labelledby="sources-title"
        className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card-elevated)]"
      >
        <div aria-hidden className="h-1.5 w-full bg-[var(--color-primary)]" />
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
          <div className="px-5 py-8 sm:px-9 sm:py-11 lg:px-12 lg:py-14">
            <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              <span className="h-px w-10 bg-[var(--color-primary)]" aria-hidden />
              {t("hero.eyebrow")}
            </div>
            <h1
              id="sources-title"
              className="serif max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.035em] text-[var(--color-ink)]"
            >
              {t("hero.title")}
            </h1>
            <p className="mt-7 max-w-3xl text-[16px] leading-7 text-[var(--color-ink-muted)] sm:text-[18px] sm:leading-8">
              {t("hero.subtitle")}
            </p>

            <dl className="mt-9 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-6 border-t border-[var(--color-border)] pt-7 sm:grid-cols-4">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                  {t("hero.metrics.registry")}
                </dt>
                <dd className="mono mt-1 text-[28px] font-semibold tabular-nums text-[var(--color-ink)]">
                  {summary.total}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                  {t("hero.metrics.public")}
                </dt>
                <dd className="mono mt-1 text-[28px] font-semibold tabular-nums text-[var(--color-primary)]">
                  {summary.levelB}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                  {t("hero.metrics.attached")}
                </dt>
                <dd className="mono mt-1 text-[28px] font-semibold tabular-nums text-[var(--color-ink)]">
                  {summary.levelA}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                  {t("hero.metrics.latest")}
                </dt>
                <dd className="mono mt-2 text-[13px] font-semibold tabular-nums text-[var(--color-ink)]">
                  {formatter.format(new Date(`${summary.latestFetch}T00:00:00Z`))}
                </dd>
              </div>
            </dl>
          </div>

          <aside className="border-t border-[var(--color-border)] bg-[var(--color-primary)] px-5 py-8 text-[var(--color-primary-contrast)] sm:px-9 sm:py-10 xl:border-l xl:border-t-0 xl:px-10 xl:py-14">
            <Quote className="size-9 opacity-70" aria-hidden />
            <p className="serif mt-8 text-[28px] leading-[1.12] tracking-[-0.02em] sm:text-[34px]">
              {t("hero.standard.title")}
            </p>
            <p className="mt-5 text-[14px] leading-6 opacity-85">{t("hero.standard.body")}</p>
            <div className="mt-8 border-t border-white/25 pt-6">
              {provenanceBadge}
              <p className="mt-3 text-[11px] leading-5 opacity-70">{t("hero.standard.example")}</p>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="trust-model-title" className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            {t("trust.eyebrow")}
          </p>
          <h2
            id="trust-model-title"
            className="serif mt-3 text-[36px] leading-tight tracking-[-0.025em] text-[var(--color-ink)] sm:text-[44px]"
          >
            {t("trust.title")}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[var(--color-ink-muted)]">{t("trust.intro")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-[color-mix(in_oklab,var(--color-primary)_25%,var(--color-border))] bg-[var(--color-primary-soft)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <Globe2 className="size-7 text-[var(--color-primary)]" aria-hidden />
              <SourceLevelMark level="B" label={t("levels.b.mark")} />
            </div>
            <h3 className="mt-7 text-[20px] font-semibold tracking-tight text-[var(--color-ink)]">
              {t("levels.b.title")}
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[var(--color-ink-muted)]">{t("levels.b.body")}</p>
          </article>
          <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <FileLock2 className="size-7 text-[var(--color-ink-muted)]" aria-hidden />
              <SourceLevelMark level="A" label={t("levels.a.mark")} />
            </div>
            <h3 className="mt-7 text-[20px] font-semibold tracking-tight text-[var(--color-ink)]">
              {t("levels.a.title")}
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[var(--color-ink-muted)]">{t("levels.a.body")}</p>
          </article>
          <p className="rounded-lg border-l-2 border-[var(--color-warn)] bg-[var(--color-warn-soft)] px-4 py-3 text-[12.5px] leading-5 text-[var(--color-warn)] sm:col-span-2">
            <strong>{t("levels.warningTitle")}</strong> {t("levels.warningBody")}
          </p>
        </div>
      </section>

      <section aria-labelledby="confidence-title" className="border-y border-[var(--color-border)] py-8 sm:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              {t("confidence.eyebrow")}
            </p>
            <h2 id="confidence-title" className="serif mt-2 text-[32px] tracking-[-0.02em] text-[var(--color-ink)]">
              {t("confidence.title")}
            </h2>
          </div>
          <p className="max-w-2xl text-[13px] leading-6 text-[var(--color-ink-muted)]">{t("confidence.intro")}</p>
        </div>
        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {confidenceItems.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.key}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg border ${confidenceTone[item.tone]}`}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[13px] font-bold text-[var(--color-ink)]">
                      {t(`confidence.items.${item.key}.title`)}
                    </h3>
                    <p className="mt-1 text-[12px] leading-5 text-[var(--color-ink-muted)]">
                      {t(`confidence.items.${item.key}.body`)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="publication-title">
        <div className="grid gap-8 xl:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              {t("publication.eyebrow")}
            </p>
            <h2
              id="publication-title"
              className="serif mt-3 text-[36px] leading-tight tracking-[-0.025em] text-[var(--color-ink)] sm:text-[44px]"
            >
              {t("publication.title")}
            </h2>
            <p className="mt-5 text-[14px] leading-7 text-[var(--color-ink-muted)]">{t("publication.intro")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border-t-4 border-t-[var(--color-pos)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
              <BadgeCheck className="size-7 text-[var(--color-pos)]" aria-hidden />
              <p className="mono mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-pos)]">
                {t("publication.official.kicker")}
              </p>
              <h3 className="mt-2 text-[18px] font-semibold text-[var(--color-ink)]">
                {t("publication.official.title")}
              </h3>
              <p className="mt-3 text-[12.5px] leading-6 text-[var(--color-ink-muted)]">
                {t("publication.official.body")}
              </p>
            </article>
            <article className="rounded-xl border-t-4 border-t-[var(--color-warn)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
              <AlertTriangle className="size-7 text-[var(--color-warn)]" aria-hidden />
              <p className="mono mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-warn)]">
                {t("publication.review.kicker")}
              </p>
              <h3 className="mt-2 text-[18px] font-semibold text-[var(--color-ink)]">
                {t("publication.review.title")}
              </h3>
              <p className="mt-3 text-[12.5px] leading-6 text-[var(--color-ink-muted)]">
                {t("publication.review.body")}
              </p>
            </article>
            <article className="rounded-xl border-t-4 border-t-[var(--color-demo)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
              <Database className="size-7 text-[var(--color-demo-ink)]" aria-hidden />
              <p className="mono mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-demo-ink)]">
                {t("publication.sandbox.kicker")}
              </p>
              <h3 className="mt-2 text-[18px] font-semibold text-[var(--color-ink)]">
                {t("publication.sandbox.title")}
              </h3>
              <p className="mt-3 text-[12.5px] leading-6 text-[var(--color-ink-muted)]">
                {t("publication.sandbox.body")}
              </p>
            </article>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5 sm:flex-row sm:items-start sm:p-6">
          <ArchiveRestore className="size-7 shrink-0 text-[var(--color-primary)]" aria-hidden />
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">{t("fallback.title")}</h3>
            <p className="mt-2 text-[13px] leading-6 text-[var(--color-ink-muted)]">{t("fallback.body")}</p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="methodology-title"
        className="grid overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] xl:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="bg-[var(--color-primary-soft)] p-6 sm:p-9">
          <BookOpen className="size-8 text-[var(--color-primary)]" aria-hidden />
          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            {t("methodology.eyebrow")}
          </p>
          <h2
            id="methodology-title"
            className="serif mt-3 text-[34px] leading-tight tracking-[-0.025em] text-[var(--color-ink)] sm:text-[42px]"
          >
            {t("methodology.title")}
          </h2>
          <p className="mt-5 text-[14px] leading-7 text-[var(--color-ink-muted)]">{t("methodology.body")}</p>
        </div>
        <div className="p-6 sm:p-9">
          <h3 className="text-[17px] font-semibold text-[var(--color-ink)]">{t("methodology.dimensionsTitle")}</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {["reporter", "flow", "period", "currency", "valuation", "coverage"].map((key) => (
              <li key={key} className="flex items-start gap-3 border-t border-[var(--color-border)] pt-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--color-primary)]" aria-hidden />
                <div>
                  <strong className="text-[12.5px] text-[var(--color-ink)]">
                    {t(`methodology.dimensions.${key}.title`)}
                  </strong>
                  <p className="mt-1 text-[11.5px] leading-5 text-[var(--color-ink-muted)]">
                    {t(`methodology.dimensions.${key}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-lg border-l-2 border-[var(--color-neg)] bg-[var(--color-neg-soft)] px-4 py-3 text-[12px] leading-5 text-[var(--color-neg)]">
            {t("methodology.warning")}
          </p>
        </div>
      </section>

      <section aria-labelledby="registry-title">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
              {t("registry.eyebrow")}
            </p>
            <h2
              id="registry-title"
              className="serif mt-2 text-[36px] tracking-[-0.025em] text-[var(--color-ink)] sm:text-[44px]"
            >
              {t("registry.title")}
            </h2>
            <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[var(--color-ink-muted)]">{t("registry.intro")}</p>
          </div>
          <div className="relative w-full lg:max-w-md">
            <label htmlFor="source-search" className="sr-only">
              {t("registry.searchLabel")}
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ink-faint)]"
              aria-hidden
            />
            <input
              id="source-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("registry.searchPlaceholder")}
              className="min-h-12 w-full rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] py-3 pl-11 pr-4 text-[14px] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label={t("registry.filterLabel")} className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={
                  filter === option.value
                    ? "min-h-11 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 text-[12px] font-semibold text-[var(--color-primary-contrast)] transition"
                    : "min-h-11 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[12px] font-semibold text-[var(--color-ink-muted)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
                }
              >
                {t(`registry.filters.${option.value}`)} <span className="mono ml-1 tabular-nums">{option.count}</span>
              </button>
            ))}
          </div>
          <p aria-live="polite" className="text-[12px] font-medium text-[var(--color-ink-muted)]">
            {t("registry.resultCount", { count: filtered.length })}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-6 py-14 text-center">
            <Search className="mx-auto size-8 text-[var(--color-ink-faint)]" aria-hidden />
            <h3 className="mt-4 text-[17px] font-semibold text-[var(--color-ink)]">{t("registry.emptyTitle")}</h3>
            <p className="mt-2 text-[13px] text-[var(--color-ink-muted)]">{t("registry.emptyBody")}</p>
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {(["B", "A"] as const).map((level) => {
              const levelEntries = grouped[level];
              if (levelEntries.length === 0) return null;
              const headingId = `source-group-${level}`;
              return (
                <section key={level} aria-labelledby={headingId}>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <h3
                      id={headingId}
                      className="text-[13px] font-bold uppercase tracking-[0.12em] text-[var(--color-ink)]"
                    >
                      {t(`registry.groups.${level}.title`)}
                    </h3>
                    <span className="mono text-[11px] tabular-nums text-[var(--color-ink-faint)]">
                      {t("registry.groupCount", { count: levelEntries.length })}
                    </span>
                  </div>
                  <ol className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                    {levelEntries.map((entry, index) => (
                      <li key={entry.id} className="grid gap-4 py-5 sm:grid-cols-[42px_minmax(0,1fr)_auto] sm:py-6">
                        <span className="mono text-[12px] tabular-nums text-[var(--color-ink-faint)]" aria-hidden>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-[15px] font-semibold leading-6 text-[var(--color-ink)]">
                            <span lang="en">{entry.name}</span>
                          </h4>
                          <p className="mono mt-1 break-all text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-ink-faint)]">
                            {entry.id}
                          </p>
                          {entry.note ? (
                            <p className="mt-3 max-w-3xl border-l-2 border-[var(--color-warn)] bg-[var(--color-warn-soft)] px-3 py-2 text-[11.5px] leading-5 text-[var(--color-warn)]">
                              <strong>{t("registry.noteLabel")}</strong> <span>{entry.note}</span>
                            </p>
                          ) : null}
                          <details className="group mt-3">
                            <summary className="inline-flex min-h-11 cursor-pointer items-center text-[12px] font-semibold text-[var(--color-primary)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2">
                              {t("registry.showDetail")}
                            </summary>
                            <div className="mt-1 max-w-3xl space-y-3 border-l border-[var(--color-border-strong)] pl-4 text-[12px] leading-5 text-[var(--color-ink-muted)]">
                              <p>
                                <strong className="text-[var(--color-ink)]">{t("registry.coverageLabel")}</strong>{" "}
                                <span>{entry.dataType}</span>
                              </p>
                              <p className="text-[11px] text-[var(--color-ink-faint)]">
                                {t("registry.originalMetadata")}
                              </p>
                            </div>
                          </details>
                        </div>
                        <div className="flex items-start gap-2 sm:justify-end">
                          {entry.level === "B" ? (
                            <PublicSourceMark
                              entry={entry}
                              accessibleLabel={t("registry.openSource", { source: entry.name })}
                            />
                          ) : (
                            <SourceLevelMark level="A" label={t("registry.attachedMarker")} />
                          )}
                          <time
                            dateTime={entry.fetchedAt}
                            className="mono inline-flex min-h-7 items-center whitespace-nowrap rounded-full border border-[var(--color-border)] px-2.5 text-[10px] tabular-nums text-[var(--color-ink-faint)]"
                          >
                            {formatter.format(new Date(`${entry.fetchedAt}T00:00:00Z`))}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        )}
      </section>

      <section
        aria-labelledby="quote-safe-title"
        className="grid overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] lg:grid-cols-[0.65fr_1.35fr]"
      >
        <div className="bg-[var(--color-primary)] p-6 text-[var(--color-primary-contrast)] sm:p-9">
          <ShieldCheck className="size-9" aria-hidden />
          <h2 id="quote-safe-title" className="serif mt-9 text-[34px] leading-tight tracking-[-0.02em] sm:text-[42px]">
            {t("quoteSafe.title")}
          </h2>
          <p className="mt-4 text-[13px] leading-6 opacity-80">{t("quoteSafe.intro")}</p>
        </div>
        <ol className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
          {["confidence", "lineage", "context", "quality", "separation", "release"].map((key, index) => (
            <li key={key} className="bg-[var(--color-surface)] p-5 sm:p-6">
              <span className="mono text-[11px] font-bold text-[var(--color-primary)]">0{index + 1}</span>
              <h3 className="mt-3 text-[15px] font-semibold text-[var(--color-ink)]">
                {t(`quoteSafe.rules.${key}.title`)}
              </h3>
              <p className="mt-2 text-[12.5px] leading-6 text-[var(--color-ink-muted)]">
                {t(`quoteSafe.rules.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
