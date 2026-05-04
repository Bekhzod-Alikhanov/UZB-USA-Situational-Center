import { externalDataConnectors } from "@/data/external-data";
import { findSourcePolicy, sourceVersionPolicies } from "@/data/source-policies";
import { sources } from "@/data/sources";
import { databaseHealth, fetchSupabaseTable, insertSupabaseRows } from "@/lib/db/adapter";
import { fetchBeaMetadataSnapshot } from "@/lib/live-data/bea";
import { fetchCensusTradeObservations } from "@/lib/live-data/census";
import { fetchEximAuthorizationsObservations } from "@/lib/live-data/exim";
import { fetchForeignAssistanceObservations } from "@/lib/live-data/foreign-assistance";
import { fetchWorldBankObservations } from "@/lib/live-data/worldbank";
import { contentHash, evaluateObservation, metricIdentity, summarizeReview } from "./policy";
import { staticPublishedMetrics } from "./static-baseline";
import type {
  ConnectorIngestResult,
  GovernedIngestResult,
  MetricDimensions,
  MetricDomain,
  NormalizedObservation,
  PublishedMetric,
  ReviewQueueItem,
  SourceSnapshot,
} from "./types";

type Scope = "all" | "scheduled" | MetricDomain;

interface RunOptions {
  scope?: string;
  write?: boolean;
  now?: Date;
}

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
  dimensions: MetricDimensions;
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

function valueColumns(value: NormalizedObservation["value"]) {
  return {
    value_num: typeof value === "number" ? value : null,
    value_text: typeof value === "string" ? value : null,
    value_bool: typeof value === "boolean" ? value : null,
  };
}

function observationRow(observation: NormalizedObservation) {
  return {
    id: `${metricIdentity(observation)}::${observation.periodEnd}::${contentHash(observation)}`,
    connector_id: observation.connectorId,
    source_id: observation.sourceId,
    metric_key: observation.metricKey,
    label: observation.label,
    domain: observation.domain,
    ...valueColumns(observation.value),
    unit: observation.unit,
    period_start: observation.periodStart,
    period_end: observation.periodEnd,
    dimensions: observation.dimensions,
    source_url: observation.sourceUrl ?? null,
    source_published_at: observation.sourcePublishedAt ?? null,
    fetched_at: observation.fetchedAt,
    is_preliminary: Boolean(observation.isPreliminary),
    relevance_score: observation.relevanceScore,
    recommended_use: observation.recommendedUse,
    quality_flags: observation.qualityFlags,
  };
}

function snapshotRow(snapshot: SourceSnapshot, runId: string) {
  return {
    id: `${runId}-${snapshot.connectorId}-${snapshot.contentHash}`,
    run_id: runId,
    connector_id: snapshot.connectorId,
    source_id: snapshot.sourceId,
    source_url: snapshot.sourceUrl ?? null,
    fetched_at: snapshot.fetchedAt,
    content_hash: snapshot.contentHash,
    row_count: snapshot.rowCount,
    payload: snapshot.payload,
  };
}

function reviewRow(item: ReviewQueueItem, runId: string) {
  return {
    id: `${runId}-${contentHash(item)}`,
    run_id: runId,
    connector_id: item.observation.connectorId,
    source_id: item.observation.sourceId,
    metric_identity: metricIdentity(item.observation),
    metric_key: item.observation.metricKey,
    action: item.action,
    severity: item.severity,
    reason: item.reason,
    observation: item.observation,
    current_metric_id: item.current?.id ?? null,
    status: item.action === "reject-older-period" || item.action === "ignore-irrelevant" || item.action === "reject-invalid" ? "closed" : "open",
    created_at: item.createdAt,
  };
}

function sourceRecordRows() {
  const needed = new Set(sourceVersionPolicies.map((policy) => policy.sourceId));
  return sources
    .filter((source) => needed.has(source.id))
    .map((source) => ({
      id: source.id,
      name: source.name,
      level: source.level,
      url: source.url ?? null,
      source_file: source.sourceFile ?? null,
      fetched_at: source.fetched_at,
      data_type: source.data_type,
      confidence: "official",
      owner_agency: null,
      note: source.note ?? null,
    }));
}

function sourcePolicyRows() {
  return sourceVersionPolicies.map((policy) => ({
    connector_id: policy.connectorId,
    source_id: policy.sourceId,
    cadence: policy.cadence,
    owner: policy.owner,
    min_relevance_score: policy.minRelevanceScore,
    allow_auto_publish: policy.allowAutoPublish,
    replace_rule: policy.replaceRule,
    retention_days: policy.retentionDays,
    dashboard_use: policy.dashboardUse,
  }));
}

function rowToPublishedMetric(row: PublishedMetricRow): PublishedMetric {
  const value = row.value_num ?? row.value_text ?? row.value_bool ?? "";
  return {
    id: row.id,
    connectorId: row.connector_id,
    sourceId: row.source_id,
    metricKey: row.metric_key,
    label: row.label,
    domain: row.domain,
    value,
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

async function loadCurrentMetrics() {
  if (databaseHealth().writable) {
    try {
      const rows = await fetchSupabaseTable<PublishedMetricRow>("published_metric", "select=*&is_current=eq.true");
      if (rows.length) return rows.map(rowToPublishedMetric);
    } catch {
      // Static fallback is intentional; failed DB reads must not block public rendering.
    }
  }
  return staticPublishedMetrics();
}

function currentMap(metrics: PublishedMetric[]) {
  return new Map(metrics.map((metric) => [metricIdentity(metric), metric]));
}

function scopeIncludes(scope: Scope, domain: MetricDomain, connectorId?: string) {
  if (scope === "all") return true;
  if (scope === "scheduled") return connectorId ? !["state-visa", "dhs-ohss", "iie-open-doors"].includes(connectorId) : true;
  return scope === domain;
}

function emptyConnectorResult(connectorId: string, message: string): ConnectorIngestResult {
  return {
    connectorId,
    ok: true,
    fetchedAt: new Date().toISOString(),
    observations: [],
    snapshots: [],
    reviewItems: [],
    rejected: [
      {
        id: `${connectorId}-manual-review-required`,
        observation: {
          connectorId,
          sourceId: findSourcePolicy(connectorId)?.sourceId ?? connectorId,
          metricKey: `operations.${connectorId}.manual_review_required`,
          label: `${connectorId} manual review required`,
          domain: "operations",
          value: true,
          unit: "boolean",
          periodStart: new Date().toISOString().slice(0, 10),
          periodEnd: new Date().toISOString().slice(0, 10),
          dimensions: { sourceMethodology: "manual-review" },
          fetchedAt: new Date().toISOString(),
          relevanceScore: 0.5,
          recommendedUse: message,
          qualityFlags: ["manual-review-required"],
        },
        action: "ignore-irrelevant",
        severity: "info",
        reason: message,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

async function runConnector(connectorId: string, scope: Scope): Promise<Omit<ConnectorIngestResult, "reviewItems" | "rejected">> {
  const connector = externalDataConnectors.find((item) => item.id === connectorId);
  const sourceId = findSourcePolicy(connectorId)?.sourceId ?? connector?.sourceId;
  const fetchedAt = new Date().toISOString();

  try {
    if (connectorId === "census-hs-trade" && scopeIncludes(scope, "trade", connectorId)) {
      const time = process.env.CENSUS_INGEST_MONTH || "2026-02";
      const observations = await fetchCensusTradeObservations(time);
      return {
        connectorId,
        ok: true,
        fetchedAt,
        sourceId,
        sourceUrl: observations[0]?.sourceUrl,
        observations,
        snapshots: [
          {
            connectorId,
            sourceId: sourceId ?? "census_intl_trade_api",
            sourceUrl: observations[0]?.sourceUrl,
            fetchedAt,
            payload: observations,
            contentHash: contentHash(observations),
            rowCount: observations.length,
          },
        ],
      };
    }

    if (connectorId === "world-bank-wdi" && scopeIncludes(scope, "macro", connectorId)) {
      const observations = await fetchWorldBankObservations("UZB");
      return {
        connectorId,
        ok: true,
        fetchedAt,
        sourceId,
        sourceUrl: observations[0]?.sourceUrl,
        observations,
        snapshots: [
          {
            connectorId,
            sourceId: sourceId ?? "worldbank_data",
            sourceUrl: observations[0]?.sourceUrl,
            fetchedAt,
            payload: observations,
            contentHash: contentHash(observations),
            rowCount: observations.length,
          },
        ],
      };
    }

    if (connectorId === "foreign-assistance" && scopeIncludes(scope, "assistance", connectorId)) {
      const observations = await fetchForeignAssistanceObservations();
      return {
        connectorId,
        ok: true,
        fetchedAt,
        sourceId,
        sourceUrl: observations[0]?.sourceUrl,
        observations,
        snapshots: [
          {
            connectorId,
            sourceId: sourceId ?? "foreign_assistance_gov",
            sourceUrl: observations[0]?.sourceUrl,
            fetchedAt,
            payload: observations,
            contentHash: contentHash(observations),
            rowCount: observations.length,
          },
        ],
      };
    }

    if (connectorId === "bea-services" && scopeIncludes(scope, "trade", connectorId)) {
      const snapshot = await fetchBeaMetadataSnapshot();
      return { connectorId, ok: true, fetchedAt, sourceId, sourceUrl: snapshot.sourceUrl, observations: [], snapshots: [snapshot] };
    }

    if (connectorId === "exim-authorizations" && scopeIncludes(scope, "finance", connectorId)) {
      const { observations, snapshot } = await fetchEximAuthorizationsObservations();
      return { connectorId, ok: true, fetchedAt, sourceId, sourceUrl: snapshot.sourceUrl, observations, snapshots: [snapshot] };
    }

    return { connectorId, ok: true, fetchedAt, sourceId, observations: [], snapshots: [] };
  } catch (error) {
    return {
      connectorId,
      ok: false,
      fetchedAt,
      sourceId,
      sourceUrl: connector?.apiUrl,
      observations: [],
      snapshots: [],
      error: error instanceof Error ? error.message : "Connector failed",
    };
  }
}

export async function runGovernedIngestion(options: RunOptions = {}): Promise<GovernedIngestResult> {
  const startedAt = options.now?.toISOString() ?? new Date().toISOString();
  const runId = `ingest-${startedAt.replace(/[:.]/g, "-")}`;
  const requestedScope = (options.scope ?? "scheduled") as Scope;
  const db = databaseHealth();
  const write = Boolean(options.write && db.writable);
  const current = currentMap(await loadCurrentMetrics());
  const connectorIds = sourceVersionPolicies.map((policy) => policy.connectorId);

  const connectors: ConnectorIngestResult[] = [];
  for (const connectorId of connectorIds) {
    const policy = findSourcePolicy(connectorId);
    const base = await runConnector(connectorId, requestedScope);
    if (!base.ok) {
      connectors.push({ ...base, reviewItems: [], rejected: [] });
      continue;
    }
    if (!base.observations.length && !base.snapshots.length) {
      connectors.push(emptyConnectorResult(connectorId, policy?.dashboardUse ?? "Manual review required before ingestion."));
      continue;
    }
    const evaluated = base.observations.map((observation) => evaluateObservation(observation, current.get(metricIdentity(observation)), policy));
    connectors.push({
      ...base,
      reviewItems: evaluated.filter((item) => item.action === "publish-candidate" || item.action === "manual-review" || item.action === "duplicate-current"),
      rejected: evaluated.filter((item) => item.action === "reject-older-period" || item.action === "reject-invalid" || item.action === "ignore-irrelevant"),
    });
  }

  let writtenRows = 0;
  if (write) {
    const snapshots = connectors.flatMap((connector) => connector.snapshots.map((snapshot) => snapshotRow(snapshot, runId)));
    const observations = connectors.flatMap((connector) => connector.observations.map(observationRow));
    const reviews = connectors.flatMap((connector) => [...connector.reviewItems, ...connector.rejected].map((item) => reviewRow(item, runId)));
    await insertSupabaseRows("source_record", sourceRecordRows(), { upsert: true, onConflict: "id" });
    await insertSupabaseRows("source_version_policy", sourcePolicyRows(), { upsert: true, onConflict: "connector_id" });
    await insertSupabaseRows("ingest_run", [
      {
        id: runId,
        scope: requestedScope,
        mode: "write",
        started_at: startedAt,
        finished_at: new Date().toISOString(),
        summary: { snapshots: snapshots.length, observations: observations.length, reviews: reviews.length },
      },
    ]);
    await insertSupabaseRows("raw_source_snapshot", snapshots, { upsert: true, onConflict: "id" });
    await insertSupabaseRows("normalized_observation", observations, { upsert: true, onConflict: "id" });
    await insertSupabaseRows("data_review_queue", reviews, { upsert: true, onConflict: "id" });
    writtenRows = snapshots.length + observations.length + reviews.length + 1;
  }

  const allReview = connectors.flatMap((connector) => [...connector.reviewItems, ...connector.rejected]);
  const reviewSummary = summarizeReview(allReview);
  const finishedAt = new Date().toISOString();

  return {
    runId,
    mode: write ? "write" : "dry-run",
    startedAt,
    finishedAt,
    databaseWritable: db.writable,
    scope: requestedScope,
    connectors,
    summary: {
      observations: connectors.reduce((sum, connector) => sum + connector.observations.length, 0),
      snapshots: connectors.reduce((sum, connector) => sum + connector.snapshots.length, 0),
      publishCandidates: reviewSummary.publishCandidates,
      manualReview: reviewSummary.manualReview,
      rejectedOlder: reviewSummary.rejectedOlder,
      ignoredIrrelevant: reviewSummary.ignoredIrrelevant,
      failedConnectors: connectors.filter((connector) => !connector.ok).length,
      writtenRows,
    },
  };
}
