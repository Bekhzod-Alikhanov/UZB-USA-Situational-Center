import {
  assertQuoteSafeOfficialHeadline,
  type LocalizedText,
  type PublicResponse,
} from "../domain";
import type { Investment } from "@/data/investments";
import type { RoadmapRegionId } from "@/data/roadmaps";
import { canonicalJson } from "./publication-release";
import { normalizeSourceIds } from "./public-projection";
import {
  readSealedDomainProjection,
  SEALED_PUBLIC_FALLBACK_MANIFEST,
  type SealedProjection,
} from "./sealed-public-fallback";

/**
 * Immutable, reconciled fallback used while the governed publication database
 * is being introduced. API builders clone this sealed projection; they never
 * calculate public facts from mutable application data arrays.
 */
export const PUBLIC_API_V1_RELEASE = SEALED_PUBLIC_FALLBACK_MANIFEST;

export const PUBLIC_API_V1_DOMAINS = ["executive", "trade", "investments", "roadmaps"] as const;

export type PublicApiV1Domain = (typeof PUBLIC_API_V1_DOMAINS)[number];

type PublicFact<TValue> = {
  id: string;
  label: LocalizedText;
  value: TValue;
  unit: "USD millions" | "count" | "percent";
  asOf: string;
  period: string;
  sourceIds: string[];
  confidence: "verified_official";
};

export type TradePublicProjection = {
  selectionPolicy: "verified_official_only";
  currency: "USD";
  unit: "millions";
  summary: {
    uzReportedLatestAnnual: PublicFact<number>;
    uzReportedYearOverYearPct: PublicFact<number>;
    usReportedLatestAnnual: PublicFact<number>;
  };
  series: {
    uzReportedAnnual: Array<{
      year: number;
      turnover: number;
      exports: number;
      imports: number;
      balance: number;
      partnerSharePct?: { turnover: number; exports: number; imports: number };
    }>;
    usReportedAnnual: Array<{
      year: number;
      turnover: number;
      exports: number;
      imports: number;
      balance: number;
    }>;
    usReportedMonthly: Array<{ month: string; exports: number; imports: number; balance: number }>;
  };
  methodology: Array<{
    id: "uz-stat" | "us-census";
    label: LocalizedText;
    direction: LocalizedText;
    sourceId: string;
  }>;
};

export type PublicInvestmentProject = {
  id: string;
  title: LocalizedText;
  sector: { id: Investment["sector"]; label: LocalizedText };
  region: LocalizedText;
  disclosedValueMusd: number;
  status: { id: Investment["status"]; label: LocalizedText };
  usCounterpart: string;
  uzCounterpart: string;
  startYear: number;
  disclosedJobs?: number;
  sourceIds: string[];
  confidence: "verified_official";
};

export type InvestmentsPublicProjection = {
  selectionPolicy: "verified_official_only";
  summary: {
    verifiedProjects: number;
    disclosedValueMusd: number;
    disclosedJobs: number;
  };
  projects: PublicInvestmentProject[];
};

export type RoadmapsPublicProjection = {
  selectionPolicy: "approved_official_documents_aggregate_only";
  summary: {
    sourceDocuments: number;
    declaredProjects: number;
    declaredValueMusd: number;
    documentedSteps: number;
  };
  regions: Array<{
    id: RoadmapRegionId;
    label: LocalizedText;
    visitPeriod: { start: string; end: string };
    declaredProjects: number;
    declaredValueMusd: number;
    documentedSteps: number;
    sourceId: string;
    confidence: "verified_official";
  }>;
  disclosure: LocalizedText;
};

export type ExecutivePublicProjection = {
  selectionPolicy: "verified_official_only";
  headlineMetrics: Array<PublicFact<number>>;
  disclosure: LocalizedText;
};

export type PublicApiV1Projection =
  | ExecutivePublicProjection
  | TradePublicProjection
  | InvestmentsPublicProjection
  | RoadmapsPublicProjection;

function createStaticFallbackResponse<T extends PublicApiV1Projection>(
  sealed: SealedProjection<T>,
  requestId: string,
): PublicResponse<T> {
  assertQuoteSafeOfficialHeadline(sealed.policy);

  return {
    data: sealed.payload,
    meta: {
      asOf: sealed.asOf,
      publishedAt: PUBLIC_API_V1_RELEASE.publishedAt,
      publicationRelease: PUBLIC_API_V1_RELEASE.id,
      sourceIds: normalizeSourceIds(sealed.policy.sourceIds),
      confidence: sealed.policy.confidence,
      freshness: sealed.freshness,
      dataMode: PUBLIC_API_V1_RELEASE.dataMode,
      requestId,
    },
  };
}

export function buildTradePublicResponse(requestId: string): PublicResponse<TradePublicProjection> {
  return createStaticFallbackResponse(readSealedDomainProjection("trade"), requestId);
}

export function buildInvestmentsPublicResponse(requestId: string): PublicResponse<InvestmentsPublicProjection> {
  return createStaticFallbackResponse(readSealedDomainProjection("investments"), requestId);
}

export function buildRoadmapsPublicResponse(requestId: string): PublicResponse<RoadmapsPublicProjection> {
  return createStaticFallbackResponse(readSealedDomainProjection("roadmaps"), requestId);
}

export function buildExecutivePublicResponse(requestId: string): PublicResponse<ExecutivePublicProjection> {
  return createStaticFallbackResponse(readSealedDomainProjection("executive"), requestId);
}

export function buildPublicApiV1Response(
  domain: PublicApiV1Domain,
  requestId: string,
): PublicResponse<PublicApiV1Projection> {
  switch (domain) {
    case "executive":
      return buildExecutivePublicResponse(requestId);
    case "trade":
      return buildTradePublicResponse(requestId);
    case "investments":
      return buildInvestmentsPublicResponse(requestId);
    case "roadmaps":
      return buildRoadmapsPublicResponse(requestId);
  }
}

/** ETag material excludes per-request correlation IDs and is stable across processes. */
export function publicApiV1EtagMaterial(domain: PublicApiV1Domain): string {
  const response = buildPublicApiV1Response(domain, "etag-material");
  return canonicalJson({
    domain,
    projectionVersion: PUBLIC_API_V1_RELEASE.projectionVersion,
    data: response.data,
    meta: { ...response.meta, requestId: undefined },
  });
}
