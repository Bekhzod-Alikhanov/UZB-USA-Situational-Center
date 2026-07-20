export type RecoveredDataConfidence =
  | "verified_official"
  | "company_confirmed"
  | "media_reported"
  | "internal_unverified"
  | "source_needed"
  | "illustrative_demo";

export type RecoveryLineage =
  "registered_public_source" | "registered_attached_source" | "missing_or_unregistered_source";

export interface RecoveryProvenance {
  snapshotCommit: string;
  removalCommit: string;
  sourcePath: string;
  sourceBlobSha: string;
}

/**
 * An evidence-preserving envelope. `publicationEligible` is deliberately a
 * literal false so recovered records cannot be added to a publication
 * projection without an explicit review-time type change.
 */
export interface QuarantinedRecoveredRecord<T> {
  stableId: string;
  sourceId?: string;
  confidence: RecoveredDataConfidence;
  lineage: RecoveryLineage;
  publicationEligible: false;
  reviewReason: string;
  provenance: RecoveryProvenance;
  record: T;
}
