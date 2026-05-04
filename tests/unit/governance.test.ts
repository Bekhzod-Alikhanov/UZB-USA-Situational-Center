import { describe, expect, it } from "vitest";
import { contentHash, evaluateObservation, metricIdentity } from "@/lib/data-governance/policy";
import type { NormalizedObservation, PublishedMetric } from "@/lib/data-governance/types";

function observation(overrides: Partial<NormalizedObservation> = {}): NormalizedObservation {
  return {
    connectorId: "census-hs-trade",
    sourceId: "census_intl_trade_api",
    metricKey: "trade.us.goods.monthly.exports",
    label: "U.S. goods exports to Uzbekistan",
    domain: "trade",
    value: 36.9,
    unit: "USD millions",
    periodStart: "2026-02-01",
    periodEnd: "2026-02-28",
    dimensions: { country: "US", partnerCountry: "UZ", flow: "exports", sourceMethodology: "us-census" },
    sourceUrl: "https://api.census.gov/data/timeseries/intltrade/exports/hs",
    sourcePublishedAt: "2026-03-10",
    fetchedAt: "2026-05-04T00:00:00.000Z",
    relevanceScore: 0.98,
    recommendedUse: "Official monthly U.S.-side goods monitoring.",
    qualityFlags: [],
    ...overrides,
  };
}

function current(overrides: Partial<PublishedMetric> = {}): PublishedMetric {
  const base = observation();
  return {
    ...base,
    id: "approved-us-goods-exports",
    approvedAt: "2026-05-04T00:00:00.000Z",
    approvedBy: "static-source-registry",
    revisionId: "approved-us-goods-exports-2026-02-28",
    isCurrent: true,
    ...overrides,
  };
}

describe("data governance policy", () => {
  it("creates a stable metric identity independent of dimension order", () => {
    const first = observation({ dimensions: { country: "US", partnerCountry: "UZ", flow: "exports" } });
    const second = observation({ dimensions: { flow: "exports", partnerCountry: "UZ", country: "US" } });

    expect(metricIdentity(first)).toBe(metricIdentity(second));
  });

  it("rejects older official pulls so approved dashboard values cannot be downgraded", () => {
    const item = evaluateObservation(
      observation({ periodStart: "2026-01-01", periodEnd: "2026-01-31" }),
      current({ periodStart: "2026-02-01", periodEnd: "2026-02-28" }),
    );

    expect(item.action).toBe("reject-older-period");
    expect(item.severity).toBe("block");
    expect(item.reason).toContain("must not be downgraded");
  });

  it("routes same-period value changes to manual review", () => {
    const item = evaluateObservation(observation({ value: 40.1 }), current({ value: 36.9 }));

    expect(item.action).toBe("manual-review");
    expect(item.reason).toContain("Same period");
  });

  it("marks identical same-period observations as duplicates", () => {
    const item = evaluateObservation(observation(), current());

    expect(item.action).toBe("duplicate-current");
    expect(item.severity).toBe("info");
  });

  it("allows newer candidates only when the source policy explicitly permits auto-publication", () => {
    const item = evaluateObservation(
      observation({ periodStart: "2026-03-01", periodEnd: "2026-03-31" }),
      current({ periodStart: "2026-02-01", periodEnd: "2026-02-28" }),
      { minRelevanceScore: 0.9, replaceRule: "never-downgrade-period", allowAutoPublish: true },
    );

    expect(item.action).toBe("publish-candidate");
  });

  it("ignores observations below the relevance threshold", () => {
    const item = evaluateObservation(observation({ relevanceScore: 0.2 }), current(), {
      minRelevanceScore: 0.8,
      replaceRule: "manual-only",
      allowAutoPublish: false,
    });

    expect(item.action).toBe("ignore-irrelevant");
  });

  it("hashes content deterministically", () => {
    expect(contentHash({ a: 1, b: "x" })).toBe(contentHash({ a: 1, b: "x" }));
  });
});
