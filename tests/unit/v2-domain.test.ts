import { describe, expect, it } from "vitest";
import {
  DomainValidationError,
  OFFICIAL_HEADLINE_BLOCKED_CONFIDENCES,
  PublicationPolicyError,
  evaluateOfficialHeadline,
  isQuoteSafeOfficialHeadline,
  parseLocalizedText,
  parsePublicLocale,
  parsePublicResponse,
  type OfficialHeadlineCandidate,
} from "@/packages/domain";
import { canonicalJson, createOfficialHeadlineResponse, normalizeSourceIds } from "@/packages/data";

function official(overrides: Partial<OfficialHeadlineCandidate> = {}): OfficialHeadlineCandidate {
  return {
    classification: "public",
    publicationState: "published",
    confidence: "verified_official",
    sourceIds: ["census_intl_trade_api"],
    period: "2025",
    asOf: "2026-02-10",
    methodology: "U.S.-reported general imports plus total exports.",
    label: { en: "Bilateral goods trade", "uz-latn": "Ikki tomonlama tovar savdosi" },
    translationState: { en: "approved", "uz-latn": "approved" },
    qualityFlags: [],
    ...overrides,
  };
}

describe("V2 domain validation", () => {
  it("accepts only the two V2 public locales", () => {
    expect(parsePublicLocale("en")).toBe("en");
    expect(parsePublicLocale("uz-latn")).toBe("uz-latn");
    expect(() => parsePublicLocale("ru")).toThrow(DomainValidationError);
  });

  it("requires independently populated English and Uzbek Latin text", () => {
    expect(parseLocalizedText({ en: "Trade", "uz-latn": "Savdo" })).toEqual({
      en: "Trade",
      "uz-latn": "Savdo",
    });
    expect(() => parseLocalizedText({ en: "Trade", "uz-latn": "" })).toThrow(/uz-latn/);
  });

  it("validates response metadata at the runtime boundary", () => {
    const parsed = parsePublicResponse(
      {
        data: { value: 1004 },
        meta: {
          asOf: "2025-12-31",
          publishedAt: "2026-02-10T12:00:00.000Z",
          publicationRelease: "release-2026-02-10",
          sourceIds: ["census_intl_trade_api"],
          confidence: "verified_official",
          freshness: "current",
          dataMode: "published",
          requestId: "req-123",
        },
      },
      (value) => value as { value: number },
    );

    expect(parsed.meta.publicationRelease).toBe("release-2026-02-10");
  });

  it("rejects public response metadata without at least one source ID", () => {
    expect(() =>
      parsePublicResponse(
        {
          data: { value: 1004 },
          meta: {
            asOf: "2025-12-31",
            publishedAt: "2026-02-10T12:00:00.000Z",
            publicationRelease: "release-2026-02-10",
            sourceIds: [],
            confidence: "verified_official",
            freshness: "current",
            dataMode: "published",
            requestId: "req-123",
          },
        },
        (value) => value as { value: number },
      ),
    ).toThrow(/sourceIds/);
  });
});

describe("official headline publication policy", () => {
  it("allows a complete verified official record", () => {
    expect(isQuoteSafeOfficialHeadline(official())).toBe(true);
    expect(evaluateOfficialHeadline(official())).toEqual([]);
  });

  it.each(OFFICIAL_HEADLINE_BLOCKED_CONFIDENCES)("blocks %s from official headline totals", (confidence) => {
    expect(evaluateOfficialHeadline(official({ confidence })).map(({ code }) => code)).toContain(
      "NOT_VERIFIED_OFFICIAL",
    );
  });

  it("reports every failed gate in deterministic policy order", () => {
    expect(
      evaluateOfficialHeadline(
        official({
          classification: "internal",
          publicationState: "approved",
          confidence: "illustrative_demo",
          sourceIds: [],
          period: "",
          asOf: "",
          methodology: "",
          label: { en: "", "uz-latn": "" },
          translationState: { en: "reviewed", "uz-latn": "draft" },
          qualityFlags: ["reconciliation_failed"],
        }),
      ).map(({ code }) => code),
    ).toEqual([
      "NOT_PUBLIC",
      "NOT_PUBLISHED",
      "NOT_VERIFIED_OFFICIAL",
      "MISSING_SOURCE",
      "MISSING_PERIOD",
      "MISSING_AS_OF",
      "MISSING_METHODOLOGY",
      "MISSING_LOCALIZED_TEXT",
      "EN_TRANSLATION_NOT_APPROVED",
      "UZ_TRANSLATION_NOT_APPROVED",
      "BLOCKING_QUALITY_FLAG",
    ]);
  });
});

describe("public projection helpers", () => {
  it("deduplicates and stably sorts source IDs", () => {
    expect(normalizeSourceIds([" z-source ", "a-source", "z-source", ""])).toEqual(["a-source", "z-source"]);
  });

  it("constructs a governed public response without flattening its domain payload", () => {
    const response = createOfficialHeadlineResponse({
      id: "trade-headline-2025",
      domain: "trade",
      releaseId: "release-2026-02-10",
      projectionVersion: 1,
      payload: { totalMusd: 1004, flows: { exportsMusd: 700, importsMusd: 304 } },
      headlinePolicy: official({ sourceIds: ["source-b", "source-a", "source-b"] }),
      meta: {
        asOf: "2025-12-31",
        publishedAt: "2026-02-10T12:00:00.000Z",
        freshness: "current",
        dataMode: "published",
        requestId: "req-123",
      },
    });

    expect(response.data.flows).toEqual({ exportsMusd: 700, importsMusd: 304 });
    expect(response.meta.sourceIds).toEqual(["source-a", "source-b"]);
    expect(response.meta.confidence).toBe("verified_official");
  });

  it("throws with inspectable issues when projection policy fails", () => {
    expect(() =>
      createOfficialHeadlineResponse({
        id: "demo-investment-total",
        domain: "investments",
        releaseId: "release-1",
        projectionVersion: 1,
        payload: { totalMusd: 9000 },
        headlinePolicy: official({ confidence: "illustrative_demo" }),
        meta: {
          asOf: "2026-07-10",
          publishedAt: "2026-07-10T12:00:00.000Z",
          freshness: "current",
          dataMode: "published",
          requestId: "req-demo",
        },
      }),
    ).toThrow(PublicationPolicyError);
  });

  it("canonicalizes object keys while preserving meaningful array order", () => {
    expect(canonicalJson({ z: 1, a: { d: 4, b: 2 }, order: ["second", "first"] })).toBe(
      '{"a":{"b":2,"d":4},"order":["second","first"],"z":1}',
    );
  });
});
