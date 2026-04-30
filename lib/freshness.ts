/**
 * Compute the dashboard's overall data freshness from `data/sources.ts`.
 *
 * Method: take every `fetched_at` timestamp from registered sources, find
 * the OLDEST one (the weakest link), and grade the dashboard accordingly:
 *  - up-to-date  → newest source ≤ 30 days
 *  - stale       → 30-90 days
 *  - outdated    → > 90 days
 *
 * Static internal sources without a meaningful `fetched_at` (e.g. the
 * F-4 ordinance, contract Annex 1) are excluded — they don't decay.
 */
import { sources, type Source } from "@/data/sources";

export type FreshnessLevel = "up-to-date" | "stale" | "outdated";

/** Sources whose value doesn't decay with time (one-time legal/contractual). */
const NON_DECAYING_IDS = new Set([
  "f4_ordinance_2026",
  "gpd_protocol_2026",
  "input_diplomatic_docx",
  "input_agreements_docx",
  "input_grants_xlsx",
  "input_trade_stat_docx",
  "input_deep_review_docx",
  "input_figma_pdf",
  "lex_uz_visa_free_2025",
  "lex_uz_embassy_us_1993",
  "lex_uz_diplomatic_missions_1992",
  "lex_uz_diplomatic_protocol_1992",
]);

export interface FreshnessReport {
  level: FreshnessLevel;
  /** Days since the oldest decaying source was refreshed. */
  oldestAgeDays: number;
  /** Source ID with the oldest fetched_at (for tooltip / drill-down). */
  oldestSourceId: string;
  oldestSourceName: string;
  /** Median age across all decaying sources. */
  medianAgeDays: number;
  /** Number of sources contributing to this score. */
  sourcesCounted: number;
  /** Reference timestamp the calculation used (ISO date). */
  asOf: string;
}

/**
 * Compute freshness using a deterministic reference date so the SSG build
 * doesn't bake in a runtime that drifts with deploys. We use the latest
 * fetched_at across all sources as the "as of" date — this is conservative
 * (treats the build as fresh) but makes the result deterministic per build.
 */
export function computeFreshness(referenceDate?: Date): FreshnessReport {
  const decaying = sources.filter((s) => !NON_DECAYING_IDS.has(s.id) && /^\d{4}-\d{2}-\d{2}$/.test(s.fetched_at));

  // Determine "as-of" — caller can pass a date for testing; otherwise
  // use the newest fetched_at from all sources (build-time stamp).
  const newest = decaying
    .map((s) => s.fetched_at)
    .sort()
    .at(-1) ?? new Date().toISOString().slice(0, 10);
  const asOf = referenceDate ? referenceDate.toISOString().slice(0, 10) : newest;
  const asOfMs = new Date(asOf + "T00:00:00Z").getTime();

  const ages = decaying.map((s) => {
    const ageMs = asOfMs - new Date(s.fetched_at + "T00:00:00Z").getTime();
    return { source: s, days: Math.max(0, Math.round(ageMs / (1000 * 60 * 60 * 24))) };
  });
  ages.sort((a, b) => b.days - a.days); // oldest first

  const oldest = ages[0];
  const median = ages.length > 0 ? ages[Math.floor(ages.length / 2)].days : 0;

  let level: FreshnessLevel = "up-to-date";
  if (oldest && oldest.days > 90) level = "outdated";
  else if (oldest && oldest.days > 30) level = "stale";

  return {
    level,
    oldestAgeDays: oldest?.days ?? 0,
    oldestSourceId: oldest?.source.id ?? "",
    oldestSourceName: oldest?.source.name ?? "",
    medianAgeDays: median,
    sourcesCounted: decaying.length,
    asOf,
  };
}

export function findSourceById(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}
