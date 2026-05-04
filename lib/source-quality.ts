import { sources, type Source } from "@/data/sources";

export type SourceFreshness = "fresh" | "watch" | "stale" | "undated";
export type SourceConfidence = "official" | "internal" | "partner" | "derived";

export interface SourceQuality {
  id: string;
  name: string;
  level: Source["level"];
  confidence: SourceConfidence;
  freshness: SourceFreshness;
  fetchedAt?: string;
  ageDays?: number;
  reason: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function daysSince(date: string, now: Date) {
  const parsed = new Date(`${date}T00:00:00Z`).getTime();
  if (!Number.isFinite(parsed)) return undefined;
  return Math.max(0, Math.floor((now.getTime() - parsed) / DAY_MS));
}

function confidenceFor(source: Source): SourceConfidence {
  if (source.level === "A") return "internal";
  if (/world bank|census|state|dhs|homeland|open doors|iie|ustr|dfc|exim|usaid|lex\.uz|gov\.uz|president\.uz|central bank|trade\.gov/i.test(source.name)) {
    return "official";
  }
  if (/gateway|council|chamber/i.test(source.name)) return "partner";
  return "derived";
}

function freshnessFor(ageDays: number | undefined): SourceFreshness {
  if (ageDays === undefined) return "undated";
  if (ageDays <= 45) return "fresh";
  if (ageDays <= 120) return "watch";
  return "stale";
}

function reasonFor(source: Source, confidence: SourceConfidence, freshness: SourceFreshness, ageDays?: number) {
  const age = ageDays === undefined ? "undated" : `${ageDays}d old`;
  if (source.level === "A") return `Attached/internal source, ${age}; confirm owner sign-off before publication.`;
  if (freshness === "stale") return `Public source is ${age}; refresh before executive use.`;
  if (confidence === "official") return `Official public source, ${age}.`;
  return `Public partner/derived source, ${age}; keep source note visible.`;
}

export function assessSources(now = new Date("2026-05-04T00:00:00Z")): SourceQuality[] {
  return sources.map((source) => {
    const ageDays = daysSince(source.fetched_at, now);
    const freshness = freshnessFor(ageDays);
    const confidence = confidenceFor(source);
    return {
      id: source.id,
      name: source.name,
      level: source.level,
      confidence,
      freshness,
      fetchedAt: source.fetched_at,
      ageDays,
      reason: reasonFor(source, confidence, freshness, ageDays),
    };
  });
}

export function sourceQualitySummary(now = new Date("2026-05-04T00:00:00Z")) {
  const assessed = assessSources(now);
  return {
    total: assessed.length,
    fresh: assessed.filter((s) => s.freshness === "fresh").length,
    watch: assessed.filter((s) => s.freshness === "watch").length,
    stale: assessed.filter((s) => s.freshness === "stale").length,
    official: assessed.filter((s) => s.confidence === "official").length,
    internal: assessed.filter((s) => s.confidence === "internal").length,
    needsAttention: assessed.filter((s) => s.freshness === "watch" || s.freshness === "stale").slice(0, 8),
  };
}
