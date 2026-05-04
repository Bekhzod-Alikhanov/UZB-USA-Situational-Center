import { databaseHealth, fetchSupabaseTable } from "@/lib/db/adapter";
import { staticPublishedMetrics } from "./static-baseline";
import type { MetricDomain, PublishedMetric } from "./types";

interface PublishedMetricRow {
  id: string;
  connector_id: string;
  source_id: string;
  metric_key: string;
  label: string;
  domain: MetricDomain;
  value_num: number | null;
  value_text: string | null;
  value_bool: boolean | null;
  unit: string;
  period_start: string;
  period_end: string;
  dimensions: Record<string, string | number | boolean | undefined>;
  source_url: string | null;
  source_published_at: string | null;
  fetched_at: string;
  is_preliminary: boolean;
  relevance_score: number;
  recommended_use: string;
  quality_flags: string[];
  approved_at: string;
  approved_by: string;
  revision_id: string;
  is_current: boolean;
}

function rowToMetric(row: PublishedMetricRow): PublishedMetric {
  return {
    id: row.id,
    connectorId: row.connector_id,
    sourceId: row.source_id,
    metricKey: row.metric_key,
    label: row.label,
    domain: row.domain,
    value: row.value_num ?? row.value_text ?? row.value_bool ?? "",
    unit: row.unit,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    dimensions: row.dimensions,
    sourceUrl: row.source_url ?? undefined,
    sourcePublishedAt: row.source_published_at ?? undefined,
    fetchedAt: row.fetched_at,
    isPreliminary: row.is_preliminary,
    relevanceScore: row.relevance_score,
    recommendedUse: row.recommended_use,
    qualityFlags: row.quality_flags,
    approvedAt: row.approved_at,
    approvedBy: row.approved_by,
    revisionId: row.revision_id,
    isCurrent: row.is_current,
  };
}

export async function loadPublishedMetrics(domain?: MetricDomain) {
  const db = databaseHealth();
  if (db.writable) {
    try {
      const query = domain
        ? `select=*&is_current=eq.true&domain=eq.${domain}&order=period_end.desc`
        : "select=*&is_current=eq.true&order=period_end.desc";
      const rows = await fetchSupabaseTable<PublishedMetricRow>("published_metric", query);
      if (rows.length) return { mode: "database" as const, metrics: rows.map(rowToMetric) };
    } catch {
      // Fall through to static fallback.
    }
  }

  const staticMetrics = staticPublishedMetrics().filter((metric) => !domain || metric.domain === domain);
  return { mode: "static-fallback" as const, metrics: staticMetrics };
}
