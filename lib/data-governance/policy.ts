import type {
  MetricDimensions,
  NormalizedObservation,
  PublishedMetric,
  ReviewAction,
  ReviewQueueItem,
  ReviewSeverity,
  SourceVersionPolicy,
} from "./types";

export const MIN_DEFAULT_RELEVANCE = 0.55;

function parseDate(value?: string) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function stableDimensions(dimensions: MetricDimensions) {
  return Object.entries(dimensions)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${String(value)}`)
    .join("|");
}

export function metricIdentity(observation: Pick<NormalizedObservation, "metricKey" | "dimensions">) {
  return `${observation.metricKey}::${stableDimensions(observation.dimensions)}`;
}

export function contentHash(input: unknown) {
  const text = JSON.stringify(input);
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function isValidValue(value: NormalizedObservation["value"]) {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return value.trim().length > 0;
  return typeof value === "boolean";
}

function valuesMatch(candidate: NormalizedObservation, current: PublishedMetric) {
  return String(candidate.value) === String(current.value) && candidate.unit === current.unit;
}

function reviewItem(
  observation: NormalizedObservation,
  action: ReviewAction,
  severity: ReviewSeverity,
  reason: string,
  current?: PublishedMetric,
): ReviewQueueItem {
  return {
    id: `${metricIdentity(observation)}::${observation.periodEnd}::${action}`,
    observation,
    current,
    action,
    severity,
    reason,
    createdAt: new Date().toISOString(),
  };
}

export function evaluateObservation(
  observation: NormalizedObservation,
  current?: PublishedMetric,
  policy?: Pick<SourceVersionPolicy, "minRelevanceScore" | "replaceRule" | "allowAutoPublish">,
): ReviewQueueItem {
  const minRelevance = policy?.minRelevanceScore ?? MIN_DEFAULT_RELEVANCE;

  if (!isValidValue(observation.value)) {
    return reviewItem(observation, "reject-invalid", "block", "Observation has an empty or non-finite value.", current);
  }

  if (observation.relevanceScore < minRelevance) {
    return reviewItem(
      observation,
      "ignore-irrelevant",
      "info",
      `Relevance score ${observation.relevanceScore.toFixed(2)} is below the ${minRelevance.toFixed(2)} publication threshold.`,
      current,
    );
  }

  if (!current) {
    return reviewItem(
      observation,
      "manual-review",
      "watch",
      "No approved baseline exists yet; route to a data owner before publication.",
    );
  }

  const candidatePeriod = parseDate(observation.periodEnd);
  const currentPeriod = parseDate(current.periodEnd);

  if (candidatePeriod < currentPeriod) {
    return reviewItem(
      observation,
      "reject-older-period",
      "block",
      `Candidate period ${observation.periodEnd} is older than the approved period ${current.periodEnd}; current dashboard value must not be downgraded.`,
      current,
    );
  }

  if (candidatePeriod === currentPeriod && valuesMatch(observation, current)) {
    return reviewItem(
      observation,
      "duplicate-current",
      "info",
      "Candidate matches the currently approved value for the same period.",
      current,
    );
  }

  if (candidatePeriod === currentPeriod) {
    const candidatePublished = parseDate(observation.sourcePublishedAt ?? observation.fetchedAt);
    const currentPublished = parseDate(current.sourcePublishedAt ?? current.fetchedAt);
    const reason =
      candidatePublished >= currentPublished
        ? "Same period as current approval but value changed; treat as a source revision and require review."
        : "Same period as current approval but source publication timestamp is older; require manual reconciliation.";
    return reviewItem(observation, "manual-review", "watch", reason, current);
  }

  if (policy?.replaceRule === "manual-only" || policy?.allowAutoPublish === false) {
    return reviewItem(
      observation,
      "manual-review",
      "watch",
      "Candidate is newer, but this source requires manual approval before publication.",
      current,
    );
  }

  return reviewItem(
    observation,
    "publish-candidate",
    "watch",
    "Candidate is newer than the approved period and passes relevance/validity gates.",
    current,
  );
}

export function summarizeReview(items: ReviewQueueItem[]) {
  return {
    publishCandidates: items.filter((item) => item.action === "publish-candidate").length,
    manualReview: items.filter((item) => item.action === "manual-review").length,
    rejectedOlder: items.filter((item) => item.action === "reject-older-period").length,
    ignoredIrrelevant: items.filter((item) => item.action === "ignore-irrelevant").length,
  };
}
