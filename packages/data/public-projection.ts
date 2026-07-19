import {
  assertQuoteSafeOfficialHeadline,
  type OfficialHeadlineCandidate,
  type ProductDomain,
  type PublicResponse,
  type PublicResponseMeta,
} from "../domain";

export type PublishedProjection<TPayload> = {
  id: string;
  domain: ProductDomain;
  releaseId: string;
  projectionVersion: number;
  payload: TPayload;
  headlinePolicy: OfficialHeadlineCandidate;
};

export type PublicResponseInput<TPayload> = PublishedProjection<TPayload> & {
  meta: Omit<PublicResponseMeta, "publicationRelease" | "sourceIds" | "confidence"> & {
    requestId: string;
  };
};

/** Stable, duplicate-free source ordering for cache keys and response equality. */
export function normalizeSourceIds(sourceIds: readonly string[]): string[] {
  return [...new Set(sourceIds.map((sourceId) => sourceId.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "en"),
  );
}

/**
 * Constructs a public headline response only after the domain policy passes.
 * Projection payloads remain domain-specific; this helper never flattens them.
 */
export function createOfficialHeadlineResponse<TPayload>(
  input: PublicResponseInput<TPayload>,
): PublicResponse<TPayload> {
  assertQuoteSafeOfficialHeadline(input.headlinePolicy);

  return {
    data: input.payload,
    meta: {
      ...input.meta,
      publicationRelease: input.releaseId,
      sourceIds: normalizeSourceIds(input.headlinePolicy.sourceIds),
      confidence: input.headlinePolicy.confidence,
    },
  };
}
