import type { ProductDomain } from "../domain";

export type ProjectionPointer = {
  domain: ProductDomain;
  projectionId: string;
  projectionVersion: number;
};

export type ImmutablePublicationRelease = {
  id: string;
  createdAt: string;
  publishedAt: string;
  publishedBy: string;
  previousReleaseId?: string;
  projections: readonly ProjectionPointer[];
};

/** Canonical JSON input: object keys are sorted, while authored array order is preserved. */
export function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value === null || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, "en"))
      .map(([key, entry]) => [key, canonicalize(entry)]),
  );
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

/**
 * Generates the deterministic material used by a signing or hashing adapter.
 * Cryptography intentionally stays outside this portable package.
 */
export function publicationReleaseMaterial(release: ImmutablePublicationRelease): string {
  return canonicalJson(release);
}
