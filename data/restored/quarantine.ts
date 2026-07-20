import { sources } from "../sources";
import type { QuarantinedRecoveredRecord, RecoveryProvenance } from "./types";

const sourceLevelById = new Map(sources.map((source) => [source.id, source.level] as const));

export function quarantineRecoveredRecord<T extends { id: string; sourceId?: string }>(
  record: T,
  provenance: RecoveryProvenance,
): QuarantinedRecoveredRecord<T> {
  const sourceLevel = record.sourceId ? sourceLevelById.get(record.sourceId) : undefined;

  if (sourceLevel === "B") {
    return {
      stableId: record.id,
      sourceId: record.sourceId,
      confidence: "internal_unverified",
      lineage: "registered_public_source",
      publicationEligible: false,
      reviewReason:
        "Recovered from Git with registered public-source lineage; claim review and deduplication are still required before confidence may be upgraded.",
      provenance,
      record,
    };
  }

  if (sourceLevel === "A") {
    return {
      stableId: record.id,
      sourceId: record.sourceId,
      confidence: "internal_unverified",
      lineage: "registered_attached_source",
      publicationEligible: false,
      reviewReason: "Recovered attached-source record requires domain review and deduplication.",
      provenance,
      record,
    };
  }

  return {
    stableId: record.id,
    ...(record.sourceId ? { sourceId: record.sourceId } : {}),
    confidence: "source_needed",
    lineage: "missing_or_unregistered_source",
    publicationEligible: false,
    reviewReason: record.sourceId
      ? `Recovered source ID ${record.sourceId} is not in the current source registry.`
      : "The recovered record has no source ID.",
    provenance,
    record,
  };
}
