/** Locales that may be published by the V2 applications. */
export const PUBLIC_LOCALES = ["en", "uz-latn"] as const;

export type PublicLocale = (typeof PUBLIC_LOCALES)[number];

export const DATA_CONFIDENCES = [
  "verified_official",
  "company_confirmed",
  "media_reported",
  "internal_unverified",
  "source_needed",
  "illustrative_demo",
] as const;

export type DataConfidence = (typeof DATA_CONFIDENCES)[number];

export const CLASSIFICATIONS = ["public", "internal", "confidential", "restricted"] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];

export const PUBLICATION_STATES = [
  "draft",
  "in_review",
  "approved",
  "published",
  "superseded",
  "rejected",
  "archived",
] as const;

export type PublicationState = (typeof PUBLICATION_STATES)[number];

export const TRANSLATION_STATES = ["draft", "reviewed", "approved"] as const;

export type TranslationState = (typeof TRANSLATION_STATES)[number];

export const FRESHNESS_STATES = ["current", "watch", "stale"] as const;

export type Freshness = (typeof FRESHNESS_STATES)[number];

export const DATA_MODES = ["published", "static-fallback"] as const;

export type DataMode = (typeof DATA_MODES)[number];

export type LocalizedText = {
  en: string;
  "uz-latn": string;
};

export type SourceText = {
  language: string;
  value: string;
  sourceId: string;
  locator?: string;
  contentHash: string;
};

export type PublicResponseMeta = {
  asOf: string;
  publishedAt: string;
  publicationRelease: string;
  sourceIds: string[];
  confidence: DataConfidence;
  freshness: Freshness;
  dataMode: DataMode;
  requestId: string;
};

export type PublicResponse<T> = {
  data: T;
  meta: PublicResponseMeta;
};

/**
 * Rich product domains remain first-class. This list identifies projection and
 * authorization boundaries; it is not a generic metric/EAV model.
 */
export const PRODUCT_DOMAINS = [
  "trade",
  "investments",
  "grants",
  "roadmaps",
  "visits",
  "agreements",
  "contacts",
  "compliance",
  "benchmark",
  "maps",
] as const;

export type ProductDomain = (typeof PRODUCT_DOMAINS)[number];
