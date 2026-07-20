import {
  CLASSIFICATIONS,
  DATA_CONFIDENCES,
  DATA_MODES,
  FRESHNESS_STATES,
  PRODUCT_DOMAINS,
  PUBLIC_LOCALES,
  PUBLICATION_STATES,
  TRANSLATION_STATES,
  type Classification,
  type DataConfidence,
  type DataMode,
  type Freshness,
  type LocalizedText,
  type ProductDomain,
  type PublicLocale,
  type PublicResponse,
  type PublicResponseMeta,
  type PublicationState,
  type SourceText,
  type TranslationState,
} from "./types";

export type RuntimeValidator<T> = (value: unknown, path?: string) => T;

export class DomainValidationError extends Error {
  readonly path: string;

  constructor(path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = "DomainValidationError";
    this.path = path;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function record(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) throw new DomainValidationError(path, "expected an object");
  return value;
}

function nonEmptyString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new DomainValidationError(path, "expected a non-empty string");
  }
  return value;
}

function stringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) throw new DomainValidationError(path, "expected an array");
  const parsed = value.map((item, index) => nonEmptyString(item, `${path}[${index}]`));
  if (parsed.length === 0) throw new DomainValidationError(path, "expected at least one source ID");
  return parsed;
}

function enumValue<const T extends readonly string[]>(value: unknown, allowed: T, path: string): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new DomainValidationError(path, `expected one of ${allowed.join(", ")}`);
  }
  return value as T[number];
}

function isoTimestamp(value: unknown, path: string): string {
  const parsed = nonEmptyString(value, path);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(parsed)) {
    throw new DomainValidationError(path, "expected an ISO 8601 UTC timestamp");
  }
  return parsed;
}

function isoDateOrTimestamp(value: unknown, path: string): string {
  const parsed = nonEmptyString(value, path);
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/.test(parsed)) {
    throw new DomainValidationError(path, "expected an ISO date or UTC timestamp");
  }
  return parsed;
}

export function parsePublicLocale(value: unknown, path = "locale"): PublicLocale {
  return enumValue(value, PUBLIC_LOCALES, path);
}

export function parseDataConfidence(value: unknown, path = "confidence"): DataConfidence {
  return enumValue(value, DATA_CONFIDENCES, path);
}

export function parseClassification(value: unknown, path = "classification"): Classification {
  return enumValue(value, CLASSIFICATIONS, path);
}

export function parsePublicationState(value: unknown, path = "publicationState"): PublicationState {
  return enumValue(value, PUBLICATION_STATES, path);
}

export function parseTranslationState(value: unknown, path = "translationState"): TranslationState {
  return enumValue(value, TRANSLATION_STATES, path);
}

export function parseProductDomain(value: unknown, path = "domain"): ProductDomain {
  return enumValue(value, PRODUCT_DOMAINS, path);
}

export function parseLocalizedText(value: unknown, path = "localizedText"): LocalizedText {
  const input = record(value, path);
  return {
    en: nonEmptyString(input.en, `${path}.en`),
    "uz-latn": nonEmptyString(input["uz-latn"], `${path}.uz-latn`),
  };
}

export function parseSourceText(value: unknown, path = "sourceText"): SourceText {
  const input = record(value, path);
  const locator = input.locator;
  if (locator !== undefined && typeof locator !== "string") {
    throw new DomainValidationError(`${path}.locator`, "expected a string when present");
  }

  return {
    language: nonEmptyString(input.language, `${path}.language`),
    value: nonEmptyString(input.value, `${path}.value`),
    sourceId: nonEmptyString(input.sourceId, `${path}.sourceId`),
    ...(locator === undefined ? {} : { locator }),
    contentHash: nonEmptyString(input.contentHash, `${path}.contentHash`),
  };
}

export function parsePublicResponseMeta(value: unknown, path = "meta"): PublicResponseMeta {
  const input = record(value, path);
  return {
    asOf: isoDateOrTimestamp(input.asOf, `${path}.asOf`),
    publishedAt: isoTimestamp(input.publishedAt, `${path}.publishedAt`),
    publicationRelease: nonEmptyString(input.publicationRelease, `${path}.publicationRelease`),
    sourceIds: stringArray(input.sourceIds, `${path}.sourceIds`),
    confidence: parseDataConfidence(input.confidence, `${path}.confidence`),
    freshness: enumValue(input.freshness, FRESHNESS_STATES, `${path}.freshness`) as Freshness,
    dataMode: enumValue(input.dataMode, DATA_MODES, `${path}.dataMode`) as DataMode,
    requestId: nonEmptyString(input.requestId, `${path}.requestId`),
  };
}

export function parsePublicResponse<T>(
  value: unknown,
  parseData: RuntimeValidator<T>,
  path = "response",
): PublicResponse<T> {
  const input = record(value, path);
  return {
    data: parseData(input.data, `${path}.data`),
    meta: parsePublicResponseMeta(input.meta, `${path}.meta`),
  };
}

export function hasCompleteLocalizedText(value: unknown): value is LocalizedText {
  try {
    parseLocalizedText(value);
    return true;
  } catch {
    return false;
  }
}
