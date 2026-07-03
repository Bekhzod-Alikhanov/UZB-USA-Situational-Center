/**
 * Pure aggregation helpers for the /brief exhibition page. Read-only over
 * /data modules; unit-tested in tests/unit/brief-data.test.ts.
 */
import { tradeAnnualUz, type TradeYear } from "@/data/trade";
import { commitments, type Commitment } from "@/data/commitments";
import { events } from "@/data/events";
import { visitPipelines } from "@/data/visit-prep";
import { investments, type InvestmentSector } from "@/data/investments";

/**
 * Parse a date-only string ("YYYY-MM-DD") as a LOCAL date. `new Date(str)`
 * parses date-only strings as UTC midnight, which renders one day early in
 * any negative-offset timezone (e.g. a 2026-07-08 visit shows as "Jul 7" in
 * Washington). All /brief date maths and formatting must go through this.
 */
export function parseDay(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** BCP-47 tag for Intl.* formatters from a next-intl locale segment. */
export function intlLocale(locale: string): string {
  switch (locale) {
    case "ru":
      return "ru-RU";
    case "uz-latn":
      return "uz-Latn-UZ";
    default:
      return "en-US";
  }
}

/** Year-over-year % change of the last two entries of an annual series. */
export function yoyPct(series: TradeYear[] = tradeAnnualUz): number {
  const last = series[series.length - 1];
  const prev = series[series.length - 2];
  if (!last || !prev || prev.turnover === 0) return 0;
  return (last.turnover / prev.turnover - 1) * 100;
}

export interface HorizonItem {
  id: string;
  title: string;
  date: string;
  location?: string;
  kind: "event" | "visit";
  isDemo: boolean;
  /** True when the item sits past the requested window (widen fallback). */
  beyondWindow: boolean;
}

/**
 * Upcoming items for the "next 30 days" strip: diplomatic events merged with
 * visit-preparation pipelines. When fewer than `minItems` fall inside the
 * window, later items are appended and flagged `beyondWindow` so the UI can
 * label them honestly instead of showing an empty exhibition block.
 */
export function upcomingHorizon(asOf: Date, days = 30, minItems = 3, maxItems = 4): HorizonItem[] {
  const from = asOf.getTime();
  const to = from + days * 86_400_000;

  const all: HorizonItem[] = [
    ...events.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      kind: "event" as const,
      isDemo: e.is_demo,
      beyondWindow: false,
    })),
    ...visitPipelines.map((p) => ({
      id: p.id,
      title: p.title,
      date: p.date,
      kind: "visit" as const,
      isDemo: p.is_demo,
      beyondWindow: false,
    })),
  ]
    .filter((item) => parseDay(item.date).getTime() >= from)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({ ...item, beyondWindow: parseDay(item.date).getTime() > to }));

  const inWindow = all.filter((i) => !i.beyondWindow);
  if (inWindow.length >= minItems) return inWindow.slice(0, maxItems);
  return all.slice(0, Math.max(minItems, Math.min(maxItems, all.length)));
}

/** Nearest upcoming visit-preparation pipeline (falls back to the latest one
 *  so the panel never renders empty after the season's last visit). */
export function nextPipeline(asOf: Date) {
  const upcoming = visitPipelines
    .filter((p) => parseDay(p.date).getTime() >= asOf.getTime())
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? visitPipelines[visitPipelines.length - 1];
}

/** Whole days from `asOf` until a date-only string (0 when today/past). */
export function daysUntil(dateStr: string, asOf: Date): number {
  const ms = parseDay(dateStr).getTime() - asOf.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

/** Overdue first, then watch — same triage order as the overview AlertsPanel. */
export function attentionRows(limit = 3): Commitment[] {
  const byDue = (a: Commitment, b: Commitment) => a.dueDate.localeCompare(b.dueDate);
  const overdue = commitments.filter((c) => c.status === "overdue").sort(byDue);
  const watch = commitments.filter((c) => c.status === "watch").sort(byDue);
  return [...overdue, ...watch].slice(0, limit);
}

/** Mean progress across the commitments register, rounded to a whole %. */
export function commitmentsAvgProgress(): number {
  if (commitments.length === 0) return 0;
  return Math.round(commitments.reduce((a, c) => a + c.progressPct, 0) / commitments.length);
}

export interface SectorHighlight {
  sector: InvestmentSector;
  valueMusd: number;
  projects: number;
}

/** Top sectors by disclosed value across the real (non-demo) portfolio only. */
export function investmentHighlights(top = 3): SectorHighlight[] {
  const bySector = new Map<InvestmentSector, SectorHighlight>();
  for (const inv of investments) {
    if (inv.is_demo) continue;
    const row = bySector.get(inv.sector) ?? { sector: inv.sector, valueMusd: 0, projects: 0 };
    row.valueMusd += inv.valueMusd;
    row.projects += 1;
    bySector.set(inv.sector, row);
  }
  return [...bySector.values()].sort((a, b) => b.valueMusd - a.valueMusd).slice(0, top);
}
