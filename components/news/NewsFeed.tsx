// Server component — formerly a client-side filter UI with useState. Now
// driven by URL search params (?tonality=...&tag=...&q=...) so the entire
// list and the filter chips render in the initial HTML, no JS needed.
//
// Result: ~45 KB of client JS (Lucide icons + Fuse-style search + state)
// removed from /news's first-load bundle. Per Wave 2.4 of the perf plan.
import Link from "next/link";
import { news, type NewsTonality, type NewsTag } from "@/data/news";
import { cn } from "@/lib/utils";
import { ExternalLink, Search } from "lucide-react";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { getTranslations } from "next-intl/server";

const TONALITY_TONE: Record<NewsTonality, string> = {
  positive: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  neutral: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  critical: "bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
};

const TAG_TONE: Record<NewsTag, string> = {
  presidential: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  trade: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  investment: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  minerals: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  security: "bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  diplomatic: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  culture: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  economy: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

const TONS: (NewsTonality | "all")[] = ["all", "positive", "neutral", "critical"];
const TAGS: (NewsTag | "all")[] = [
  "all",
  "presidential",
  "trade",
  "investment",
  "minerals",
  "security",
  "diplomatic",
  "culture",
  "economy",
];

interface Props {
  /** Locale used to build the chip-link hrefs. */
  locale: string;
  /** Active tonality filter, defaults to "all". */
  tonality?: NewsTonality | "all";
  /** Active tag filter, defaults to "all". */
  tag?: NewsTag | "all";
  /** Free-text search query. */
  q?: string;
}

function buildHref(
  locale: string,
  base: { tonality: string; tag: string; q: string },
  patch: Partial<{ tonality: string; tag: string; q: string }>,
): string {
  const next = { ...base, ...patch };
  const params = new URLSearchParams();
  if (next.tonality !== "all") params.set("tonality", next.tonality);
  if (next.tag !== "all") params.set("tag", next.tag);
  if (next.q) params.set("q", next.q);
  const qs = params.toString();
  return `/${locale}/news${qs ? `?${qs}` : ""}`;
}

export async function NewsFeed({ locale, tonality = "all", tag = "all", q = "" }: Props) {
  const t = await getTranslations({ locale, namespace: "news" });
  const filtered = news
    .filter((n) => (tonality === "all" ? true : n.tonality === tonality))
    .filter((n) => (tag === "all" ? true : n.tags.includes(tag as NewsTag)))
    .filter((n) =>
      q ? n.title.toLowerCase().includes(q.toLowerCase()) || n.summary.toLowerCase().includes(q.toLowerCase()) : true,
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const baseState = { tonality, tag, q };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label={t("feed.tonalityAria")}
          className="flex items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5"
        >
          {TONS.map((item) => {
            const active = tonality === item;
            return (
              <Link
                key={item}
                href={buildHref(locale, baseState, { tonality: item })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded px-2.5 py-1 text-[11.5px] font-medium capitalize transition",
                  active
                    ? "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]"
                    : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
                )}
              >
                {t(`filters.${item}`)}
              </Link>
            );
          })}
        </div>

        {/* Native form: GET-submits the search query, the locale stays in the
            URL path so we don't need to ship it as a hidden input. The select
            also lives inside the form so a single submission carries all
            filters. JavaScript-free. */}
        <form method="get" action={`/${locale}/news`} className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="news-tag">
            {t("feed.tagLabel")}
          </label>
          <select
            id="news-tag"
            name="tag"
            defaultValue={tag}
            aria-label={t("feed.tagAria")}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[12px]"
          >
            {TAGS.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? t("feed.tags.all") : t(`feed.tags.${item}`)}
              </option>
            ))}
          </select>
          {tonality !== "all" ? <input type="hidden" name="tonality" value={tonality} /> : null}
          <label className="ml-auto flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
            <Search className="size-3.5 text-[var(--color-ink-muted)]" aria-hidden />
            <input
              type="search"
              name="q"
              defaultValue={q}
              aria-label={t("feed.searchAria")}
              placeholder={t("feed.searchPlaceholder")}
              className="w-64 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
            />
          </label>
          <button
            type="submit"
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11.5px] font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]"
          >
            {t("feed.apply")}
          </button>
        </form>
      </div>

      <ul className="flex flex-col divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {filtered.length === 0 ? (
          <li className="py-6 text-center text-[12px] text-[var(--color-ink-muted)]">
            {t("feed.empty")}
          </li>
        ) : null}
        {filtered.map((n) => (
          <li key={n.id} className="flex flex-col gap-2 py-3 md:flex-row md:gap-5">
            <div className="mono w-[96px] shrink-0 text-[11px] tabular text-[var(--color-ink-muted)]">{n.date}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 pb-1.5">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    TONALITY_TONE[n.tonality],
                  )}
                >
                  {t(`filters.${n.tonality}`)}
                </span>
                {n.tags.map((tg) => (
                  <span
                    key={tg}
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium lowercase",
                      TAG_TONE[tg],
                    )}
                  >
                    {t(`feed.tags.${tg}`)}
                  </span>
                ))}
              </div>
              <h2 className="text-[14px] font-medium leading-snug text-[var(--color-ink)]">{n.title}</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{n.summary}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--color-ink-muted)]">
                <span className="italic">{n.source}</span>
                <a
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline"
                >
                  <ExternalLink className="size-3" />
                  {t("read")}
                </a>
                {n.sourceId ? <SourceBadge sourceId={n.sourceId} /> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
