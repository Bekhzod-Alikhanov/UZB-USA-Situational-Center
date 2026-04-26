"use client";
import { news, type NewsTonality, type NewsTag } from "@/data/news";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

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

export function NewsFeed() {
  const [tonality, setTonality] = useState<NewsTonality | "all">("all");
  const [tag, setTag] = useState<NewsTag | "all">("all");
  const [search, setSearch] = useState("");

  const TONS: (NewsTonality | "all")[] = ["all", "positive", "neutral", "critical"];
  const TAGS: (NewsTag | "all")[] = [
    "all", "presidential", "trade", "investment", "minerals", "security", "diplomatic", "culture", "economy",
  ];

  const filtered = useMemo(
    () =>
      news
        .filter((n) => (tonality === "all" ? true : n.tonality === tonality))
        .filter((n) => (tag === "all" ? true : n.tags.includes(tag)))
        .filter((n) =>
          search
            ? n.title.toLowerCase().includes(search.toLowerCase()) ||
              n.summary.toLowerCase().includes(search.toLowerCase())
            : true,
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [tonality, tag, search],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
          {TONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTonality(t)}
              className={cn(
                "rounded px-2.5 py-1 text-[11.5px] font-medium capitalize transition",
                tonality === t
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value as NewsTag | "all")}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[12px]"
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All tags" : t}
            </option>
          ))}
        </select>

        <label className="ml-auto flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or summary"
            className="w-64 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>
      </div>

      <ul className="flex flex-col divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
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
                  {n.tonality}
                </span>
                {n.tags.map((tg) => (
                  <span
                    key={tg}
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium lowercase",
                      TAG_TONE[tg],
                    )}
                  >
                    {tg}
                  </span>
                ))}
              </div>
              <h3 className="text-[14px] font-medium leading-snug text-[var(--color-ink)]">{n.title}</h3>
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
                  Read
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
