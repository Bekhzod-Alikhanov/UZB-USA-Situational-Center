"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { visits } from "@/data/visits";
import { events } from "@/data/events";

interface HorizonItem {
  id: string;
  date: string;
  label: string;
  type: "visit" | "ceremony" | "forum" | "deadline" | "council";
  party: "uz" | "us";
  href: string;
  prep?: number;
}

const TYPE_COLOR: Record<HorizonItem["type"], string> = {
  visit: "var(--color-visits)",
  council: "var(--color-primary)",
  ceremony: "var(--color-agree)",
  forum: "var(--color-trade)",
  deadline: "var(--color-rose)",
};

const TYPE_LABEL: Record<HorizonItem["type"], string> = {
  visit: "visit",
  council: "council",
  ceremony: "ceremony",
  forum: "forum",
  deadline: "deadline",
};

const DATE_FMT = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" });

function classifyVisitType(visitFormat: string, title: string): HorizonItem["type"] {
  const t = title.toLowerCase();
  if (t.includes("council") || t.includes("совет")) return "council";
  if (visitFormat === "summit" || t.includes("ceremony") || t.includes("реception")) return "ceremony";
  if (visitFormat === "forum" || t.includes("forum")) return "forum";
  return "visit";
}

function buildHorizon(today: Date, max = 90): HorizonItem[] {
  const horizonEnd = new Date(today);
  horizonEnd.setDate(horizonEnd.getDate() + max);

  const items: HorizonItem[] = [];

  for (const v of visits) {
    const d = new Date(v.date);
    if (d >= today && d <= horizonEnd) {
      items.push({
        id: v.id,
        date: v.date,
        label: v.title,
        type: classifyVisitType(v.format, v.title),
        party: v.direction === "uz-us" ? "uz" : "us",
        href: `/visits`,
      });
    }
  }

  for (const e of events) {
    const d = new Date(e.date);
    if (d >= today && d <= horizonEnd) {
      items.push({
        id: e.id,
        date: e.date,
        label: e.title,
        type: "forum",
        party: "uz",
        href: `/events`,
      });
    }
  }

  return items.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8);
}

function tMinusDays(date: string, today: Date): number {
  const d = new Date(date + "T00:00:00Z");
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 90-day visits & events horizon — top strip with timeline dots, list
 * below. Real data from visits.ts and events.ts.
 */
export function Horizon() {
  const locale = useLocale();
  const today = useMemo(() => new Date(), []);
  const items = useMemo(() => buildHorizon(today), [today]);
  const max = 90;

  const empty =
    locale === "ru"
      ? "Нет визитов и событий в горизонте 90 дней."
      : locale === "uz-latn"
        ? "90 kunlik gorizontda tashriflar va tadbirlar yo'q."
        : "No visits or events in the 90-day horizon.";

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[12px] text-[var(--color-ink-muted)]">
        {empty}
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-2 h-12">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-[var(--color-border-strong)]" />
        {[0, 30, 60, 90].map((d) => (
          <div
            key={d}
            className="absolute top-0 bottom-0 flex flex-col items-center"
            style={{ left: `${(d / max) * 100}%`, transform: "translateX(-50%)" }}
          >
            <span className="mono text-[9px] text-[var(--color-ink-faint)]">T+{d}d</span>
            <span className="mt-auto block h-2 w-px bg-[var(--color-border-strong)]" />
          </div>
        ))}
        {items.map((it) => {
          const t = tMinusDays(it.date, today);
          const pct = (t / max) * 100;
          if (pct < 0 || pct > 100) return null;
          const c = TYPE_COLOR[it.type];
          return (
            <div
              key={it.id}
              className="group absolute top-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
            >
              <div
                className="size-2.5 -translate-x-1/2 cursor-pointer rounded-full ring-2 ring-[var(--color-surface)] transition group-hover:scale-150"
                style={{ background: c }}
              />
              <div className="absolute left-1/2 -top-9 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[10px] shadow-lg group-hover:block">
                <div className="font-semibold text-[var(--color-ink)]">{it.label}</div>
                <div className="mono text-[var(--color-ink-faint)]">
                  T-{t}d · {it.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mono mb-2 flex flex-wrap items-center gap-3 text-[9.5px] text-[var(--color-ink-faint)]">
        {(Object.entries(TYPE_COLOR) as [HorizonItem["type"], string][]).map(([k, v]) => (
          <span key={k} className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full" style={{ background: v }} />
            {TYPE_LABEL[k]}
          </span>
        ))}
      </div>

      <ul className="flex flex-col gap-px">
        {items.map((it) => {
          const t = tMinusDays(it.date, today);
          const c = TYPE_COLOR[it.type];
          return (
            <li key={it.id}>
              <Link
                href={`/${locale}${it.href}`}
                className="-mx-1.5 grid grid-cols-[68px_18px_1fr_auto] items-center gap-2 rounded px-1.5 py-1 transition hover:bg-[var(--color-surface-2)]"
              >
                <span className="mono tabular text-[10px] text-[var(--color-ink-faint)]">
                  {DATE_FMT.format(new Date(it.date + "T00:00:00Z"))}
                </span>
                <span className="size-1.5 justify-self-center rounded-full" style={{ background: c }} />
                <span className="truncate text-[12px] text-[var(--color-ink)]">{it.label}</span>
                <span className="mono shrink-0 text-[9.5px] text-[var(--color-ink-faint)]">T-{t}d</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
