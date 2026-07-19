import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET as getInvestments } from "@/app/api/v1/public/investments/route";
import { GET as getTrade } from "@/app/api/v1/public/trade/route";
import { investments } from "@/data/investments";
import { tradeAnnualUz } from "@/data/trade";
import {
  buildExecutivePublicResponse,
  buildInvestmentsPublicResponse,
  buildRoadmapsPublicResponse,
  buildTradePublicResponse,
  publicApiV1EtagMaterial,
} from "@/packages/data";
import { readSealedDomainProjection } from "@/packages/data/sealed-public-fallback";

function findForbiddenKey(value: unknown, forbidden: Set<string>): string | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = findForbiddenKey(item, forbidden);
      if (result) return result;
    }
    return undefined;
  }
  if (value === null || typeof value !== "object") return undefined;
  for (const [key, child] of Object.entries(value)) {
    if (forbidden.has(key)) return key;
    const result = findForbiddenKey(child, forbidden);
    if (result) return result;
  }
  return undefined;
}

describe("public API v1 governed projections", () => {
  it("keeps the two trade-reporting methodologies separate", () => {
    const response = buildTradePublicResponse("req-trade");
    expect(response.data.summary.uzReportedLatestAnnual.value).toBe(1004);
    expect(response.data.summary.uzReportedYearOverYearPct.value).toBe(-2.04);
    expect(response.data.summary.usReportedLatestAnnual.value).toBe(1048.3);
    expect(response.data.methodology.map(({ id }) => id)).toEqual(["uz-stat", "us-census"]);
    expect(response.meta).toMatchObject({
      confidence: "verified_official",
      dataMode: "static-fallback",
      publicationRelease: "legacy-2026-07-09",
    });
  });

  it("excludes every non-verified investment row from projects and totals", () => {
    const response = buildInvestmentsPublicResponse("req-investments");
    expect(response.data.summary).toEqual({
      verifiedProjects: 2,
      disclosedValueMusd: 1140,
      disclosedJobs: 480,
    });
    expect(response.data.projects.map(({ id }) => id)).toEqual([
      "real-air-products-fergana-h2",
      "real-air-products-gtl",
    ]);
    expect(response.data.projects.every(({ confidence }) => confidence === "verified_official")).toBe(true);
    expect(response.meta.sourceIds).toEqual(["tradegov_mining_2025"]);
  });

  it("publishes roadmap aggregates while excluding operational fields", () => {
    const response = buildRoadmapsPublicResponse("req-roadmaps");
    expect(response.data.summary).toMatchObject({
      sourceDocuments: 2,
      declaredProjects: 61,
      declaredValueMusd: 2500,
    });
    expect(response.data.summary.documentedSteps).toBeGreaterThan(0);
    expect(
      findForbiddenKey(
        response,
        new Set(["owners", "owner", "note", "notes", "blockers", "nextAction", "author", "state"]),
      ),
    ).toBeUndefined();
  });

  it("builds executive headlines only from governed domain projections", () => {
    const response = buildExecutivePublicResponse("req-executive");
    expect(response.data.headlineMetrics.map(({ value }) => value)).toEqual([1004, 1140, 61]);
    expect(response.data.headlineMetrics.every(({ confidence }) => confidence === "verified_official")).toBe(true);
    expect(response.meta.sourceIds).toEqual([
      "input_roadmap_khorezm_docx",
      "input_roadmap_samarkand_docx",
      "input_trade_stat_docx",
      "tradegov_mining_2025",
    ]);
  });

  it("produces stable ETag material independent of request IDs", () => {
    expect(publicApiV1EtagMaterial("trade")).toBe(publicApiV1EtagMaterial("trade"));
    expect(publicApiV1EtagMaterial("trade")).not.toContain("etag-material");
  });

  it("reads its sealed fallback instead of mutable legacy data arrays", () => {
    const latestTrade = tradeAnnualUz.at(-1);
    const firstInvestment = investments[0];
    expect(latestTrade).toBeTruthy();
    expect(firstInvestment).toBeTruthy();
    const originalTurnover = latestTrade!.turnover;
    const originalValue = firstInvestment!.valueMusd;

    try {
      latestTrade!.turnover = 999_999;
      firstInvestment!.valueMusd = 999_999;

      expect(buildTradePublicResponse("sealed-trade").data.summary.uzReportedLatestAnnual.value).toBe(1004);
      expect(buildInvestmentsPublicResponse("sealed-investments").data.summary.disclosedValueMusd).toBe(1140);
    } finally {
      latestTrade!.turnover = originalTurnover;
      firstInvestment!.valueMusd = originalValue;
    }
  });

  it("has an external approval manifest for every sealed public domain", () => {
    const manifestPath = path.resolve(process.cwd(), "data/releases/legacy-2026-07-09.public-manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);
    if (!fs.existsSync(manifestPath)) return;

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      releaseId?: string;
      domains?: Record<string, { contentHash?: string; approvalAttestationIds?: string[] }>;
    };
    expect(manifest.releaseId).toBe("legacy-2026-07-09");
    for (const domain of ["executive", "trade", "investments", "roadmaps"]) {
      expect(manifest.domains?.[domain]?.contentHash).toMatch(/^[a-f0-9]{64}$/);
      expect(manifest.domains?.[domain]?.approvalAttestationIds?.length).toBeGreaterThanOrEqual(2);
      const projection = readSealedDomainProjection(domain as "trade");
      const actualHash = createHash("sha256").update(JSON.stringify(projection)).digest("hex");
      expect.soft(manifest.domains?.[domain]?.contentHash, domain).toBe(actualHash);
    }
  });

  it("rejects a sealed projection when one payload byte no longer matches its manifest", async () => {
    const sealedModule = await import("@/packages/data/sealed-public-fallback");
    expect("assertSealedProjectionIntegrity" in sealedModule).toBe(true);
    if (!("assertSealedProjectionIntegrity" in sealedModule)) return;

    const projection = readSealedDomainProjection("trade");
    (projection.payload as { currency: string }).currency = "TAMPERED";
    expect(() =>
      (
        sealedModule as typeof sealedModule & {
          assertSealedProjectionIntegrity: (domain: "trade", value: typeof projection) => void;
        }
      ).assertSealedProjectionIntegrity("trade", projection),
    ).toThrow(/integrity/i);
  });
});

describe("public API v1 route behavior", () => {
  it("returns immutable projection metadata, cache policy, ETag, and correlation ID", async () => {
    const response = getInvestments(
      new NextRequest("http://localhost/api/v1/public/investments", {
        headers: { "x-request-id": "test-request-1" },
      }),
    );
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("s-maxage=86400");
    expect(response.headers.get("etag")).toMatch(/^"[A-Za-z0-9_-]+"$/);
    expect(response.headers.get("x-request-id")).toBe("test-request-1");
    expect(body.meta).not.toHaveProperty("requestId");
    expect(body.meta.dataMode).toBe("static-fallback");
  });

  it("keeps shared-cache bodies and strong ETags independent of correlation IDs", async () => {
    const first = getTrade(
      new NextRequest("http://localhost/api/v1/public/trade", {
        headers: { "x-request-id": "request-a" },
      }),
    );
    const second = getTrade(
      new NextRequest("http://localhost/api/v1/public/trade", {
        headers: { "x-request-id": "request-b" },
      }),
    );

    expect(first.headers.get("x-request-id")).toBe("request-a");
    expect(second.headers.get("x-request-id")).toBe("request-b");
    expect(first.headers.get("etag")).toBe(second.headers.get("etag"));
    expect(await first.text()).toBe(await second.text());
  });

  it("returns 304 when If-None-Match matches the current projection", () => {
    const initial = getTrade(new NextRequest("http://localhost/api/v1/public/trade"));
    const etag = initial.headers.get("etag");
    expect(etag).toBeTruthy();
    const conditional = getTrade(
      new NextRequest("http://localhost/api/v1/public/trade", {
        headers: { "if-none-match": `W/${etag}` },
      }),
    );
    expect(conditional.status).toBe(304);
    expect(conditional.body).toBeNull();
    expect(conditional.headers.get("etag")).toBe(etag);
  });

  it("returns 304 for the If-None-Match wildcard", () => {
    const conditional = getTrade(
      new NextRequest("http://localhost/api/v1/public/trade", {
        headers: { "if-none-match": "*" },
      }),
    );
    expect(conditional.status).toBe(304);
    expect(conditional.body).toBeNull();
  });
});
