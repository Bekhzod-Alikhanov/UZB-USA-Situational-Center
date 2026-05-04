export type MetricDomain =
  | "trade"
  | "macro"
  | "assistance"
  | "finance"
  | "mobility"
  | "education"
  | "security"
  | "operations";

export type IngestCadence = "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "manual";

export type ReviewAction =
  | "publish-candidate"
  | "manual-review"
  | "reject-older-period"
  | "reject-invalid"
  | "ignore-irrelevant"
  | "duplicate-current";

export type ReviewSeverity = "info" | "watch" | "block";

export interface MetricDimensions {
  country?: string;
  partnerCountry?: string;
  flow?:
    | "exports"
    | "imports"
    | "balance"
    | "turnover"
    | "obligations"
    | "disbursements"
    | "stock"
    | "count"
    | "status";
  productCode?: string;
  productName?: string;
  agency?: string;
  sector?: string;
  sourceMethodology?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface NormalizedObservation {
  connectorId: string;
  sourceId: string;
  metricKey: string;
  label: string;
  domain: MetricDomain;
  value: number | string | boolean;
  unit: string;
  periodStart: string;
  periodEnd: string;
  dimensions: MetricDimensions;
  sourceUrl?: string;
  sourcePublishedAt?: string;
  fetchedAt: string;
  isPreliminary?: boolean;
  relevanceScore: number;
  recommendedUse: string;
  qualityFlags: string[];
}

export interface PublishedMetric extends NormalizedObservation {
  id: string;
  approvedAt: string;
  approvedBy: string;
  revisionId: string;
  isCurrent: boolean;
}

export interface SourceSnapshot {
  connectorId: string;
  sourceId: string;
  sourceUrl?: string;
  fetchedAt: string;
  payload: unknown;
  contentHash: string;
  rowCount: number;
}

export interface ReviewQueueItem {
  id: string;
  observation: NormalizedObservation;
  current?: PublishedMetric;
  action: ReviewAction;
  severity: ReviewSeverity;
  reason: string;
  createdAt: string;
}

export interface SourceVersionPolicy {
  connectorId: string;
  sourceId: string;
  cadence: IngestCadence;
  owner: string;
  minRelevanceScore: number;
  allowAutoPublish: boolean;
  replaceRule: "never-downgrade-period" | "manual-only" | "append-only";
  retentionDays: number;
  dashboardUse: string;
}

export interface ConnectorIngestResult {
  connectorId: string;
  ok: boolean;
  fetchedAt: string;
  sourceId?: string;
  sourceUrl?: string;
  observations: NormalizedObservation[];
  snapshots: SourceSnapshot[];
  reviewItems: ReviewQueueItem[];
  rejected: ReviewQueueItem[];
  error?: string;
}

export interface GovernedIngestResult {
  runId: string;
  mode: "dry-run" | "write";
  startedAt: string;
  finishedAt: string;
  databaseWritable: boolean;
  scope: string;
  connectors: ConnectorIngestResult[];
  summary: {
    observations: number;
    snapshots: number;
    publishCandidates: number;
    manualReview: number;
    rejectedOlder: number;
    ignoredIrrelevant: number;
    failedConnectors: number;
    writtenRows: number;
  };
}
