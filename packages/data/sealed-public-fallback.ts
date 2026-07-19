import { createHash } from "node:crypto";
import type { OfficialHeadlineCandidate } from "../domain";
import releaseManifest from "../../data/releases/legacy-2026-07-09.public-manifest.json";
import type {
  ExecutivePublicProjection,
  InvestmentsPublicProjection,
  PublicApiV1Domain,
  PublicApiV1Projection,
  RoadmapsPublicProjection,
  TradePublicProjection,
} from "./public-api-v1";

export const SEALED_PUBLIC_FALLBACK_MANIFEST = Object.freeze({
  id: "legacy-2026-07-09",
  publishedAt: "2026-07-09T00:00:00.000Z",
  projectionVersion: 1,
  dataMode: "static-fallback" as const,
  preservationManifest: "PRESERVATION_MANIFEST.json",
  immutable: true,
});

export type SealedProjection<T extends PublicApiV1Projection> = {
  payload: T;
  asOf: string;
  freshness: "current" | "watch" | "stale";
  policy: OfficialHeadlineCandidate;
};

const approvedTranslations = { en: "approved", "uz-latn": "approved" } as const;

const trade: SealedProjection<TradePublicProjection> = {
  asOf: "2026-04-29",
  freshness: "watch",
  policy: {
    classification: "public",
    publicationState: "published",
    confidence: "verified_official",
    sourceIds: ["input_trade_stat_docx", "census_goods_uz"],
    period: "2017–2026-02",
    asOf: "2026-04-29",
    methodology:
      "Uzbekistan-reported annual trade and U.S. Census merchandise trade remain separate series; no mirror-flow reconciliation or services summation is applied.",
    label: { en: "Bilateral trade", "uz-latn": "Ikki tomonlama savdo" },
    translationState: approvedTranslations,
    qualityFlags: [],
  },
  payload: {
    selectionPolicy: "verified_official_only",
    currency: "USD",
    unit: "millions",
    summary: {
      uzReportedLatestAnnual: {
        id: "uz-reported-bilateral-trade",
        label: {
          en: "Uzbekistan-reported bilateral trade",
          "uz-latn": "O‘zbekiston hisobotidagi ikki tomonlama savdo",
        },
        value: 1004,
        unit: "USD millions",
        asOf: "2025-12-31",
        period: "2025",
        sourceIds: ["input_trade_stat_docx"],
        confidence: "verified_official",
      },
      uzReportedYearOverYearPct: {
        id: "uz-reported-bilateral-trade-yoy",
        label: { en: "Annual change", "uz-latn": "Yillik o‘zgarish" },
        value: -2.04,
        unit: "percent",
        asOf: "2025-12-31",
        period: "2024–2025",
        sourceIds: ["input_trade_stat_docx"],
        confidence: "verified_official",
      },
      usReportedLatestAnnual: {
        id: "us-reported-merchandise-trade",
        label: { en: "U.S.-reported merchandise trade", "uz-latn": "AQSh hisobotidagi tovar savdosi" },
        value: 1048.3,
        unit: "USD millions",
        asOf: "2025-12-31",
        period: "2025",
        sourceIds: ["census_goods_uz"],
        confidence: "verified_official",
      },
    },
    series: {
      uzReportedAnnual: [
        {
          year: 2017,
          turnover: 395.8,
          exports: 78.1,
          imports: 317.7,
          balance: -239.6,
          partnerSharePct: { turnover: 1.5, exports: 0.6, imports: 2.3 },
        },
        {
          year: 2018,
          turnover: 701.5,
          exports: 132.4,
          imports: 569,
          balance: -436.6,
          partnerSharePct: { turnover: 2.1, exports: 0.9, imports: 2.9 },
        },
        {
          year: 2019,
          turnover: 603.9,
          exports: 36.6,
          imports: 567.2,
          balance: -530.6,
          partnerSharePct: { turnover: 1.4, exports: 0.2, imports: 2.3 },
        },
        {
          year: 2020,
          turnover: 275,
          exports: 26.7,
          imports: 248.3,
          balance: -221.6,
          partnerSharePct: { turnover: 0.8, exports: 0.2, imports: 1.2 },
        },
        {
          year: 2021,
          turnover: 426.3,
          exports: 60.8,
          imports: 365.5,
          balance: -304.7,
          partnerSharePct: { turnover: 1, exports: 0.4, imports: 1.4 },
        },
        {
          year: 2022,
          turnover: 436.8,
          exports: 68.5,
          imports: 368.7,
          balance: -299.7,
          partnerSharePct: { turnover: 0.9, exports: 0.4, imports: 1.2 },
        },
        {
          year: 2023,
          turnover: 765.1,
          exports: 253.1,
          imports: 512,
          balance: -258.9,
          partnerSharePct: { turnover: 1.2, exports: 1, imports: 1.3 },
        },
        {
          year: 2024,
          turnover: 1024.9,
          exports: 430.7,
          imports: 594.1,
          balance: -163.3,
          partnerSharePct: { turnover: 1.5, exports: 1.6, imports: 1.5 },
        },
        {
          year: 2025,
          turnover: 1004,
          exports: 291.7,
          imports: 712.2,
          balance: -420.5,
          partnerSharePct: { turnover: 1.2, exports: 0.9, imports: 1.5 },
        },
      ],
      usReportedAnnual: [
        { year: 2017, turnover: 150.4, exports: 136.1, imports: 14.3, balance: 121.8 },
        { year: 2018, turnover: 314.7, exports: 296.5, imports: 18.2, balance: 278.4 },
        { year: 2019, turnover: 539.7, exports: 505.5, imports: 34.2, balance: 471.4 },
        { year: 2020, turnover: 261.8, exports: 181.1, imports: 80.7, balance: 100.4 },
        { year: 2021, turnover: 588.7, exports: 401.3, imports: 187.4, balance: 214 },
        { year: 2022, turnover: 330, exports: 271, imports: 59, balance: 212 },
        { year: 2023, turnover: 438.6, exports: 343.3, imports: 95.3, balance: 248 },
        { year: 2024, turnover: 423.1, exports: 380.7, imports: 42.4, balance: 338.3 },
        { year: 2025, turnover: 1048.3, exports: 473.9, imports: 574.4, balance: -100.5 },
      ],
      usReportedMonthly: [
        { month: "2024-01", exports: 49.2, imports: 1.3, balance: 47.8 },
        { month: "2024-02", exports: 13.8, imports: 3.1, balance: 10.7 },
        { month: "2024-03", exports: 52.1, imports: 1.3, balance: 50.8 },
        { month: "2024-04", exports: 15.8, imports: 2.1, balance: 13.7 },
        { month: "2024-05", exports: 31.1, imports: 3.6, balance: 27.5 },
        { month: "2024-06", exports: 17.2, imports: 3, balance: 14.1 },
        { month: "2024-07", exports: 53.3, imports: 9.2, balance: 44.1 },
        { month: "2024-08", exports: 18.6, imports: 2.7, balance: 15.9 },
        { month: "2024-09", exports: 21.7, imports: 7.3, balance: 14.4 },
        { month: "2024-10", exports: 22.5, imports: 2.5, balance: 20 },
        { month: "2024-11", exports: 25.8, imports: 3, balance: 22.8 },
        { month: "2024-12", exports: 59.7, imports: 3.3, balance: 56.4 },
        { month: "2025-01", exports: 18.9, imports: 224, balance: -205.1 },
        { month: "2025-02", exports: 27.1, imports: 178.9, balance: -151.8 },
        { month: "2025-03", exports: 38, imports: 113.8, balance: -75.8 },
        { month: "2025-04", exports: 30.6, imports: 14.9, balance: 15.7 },
        { month: "2025-05", exports: 89.1, imports: 6, balance: 83.2 },
        { month: "2025-06", exports: 24.7, imports: 4.1, balance: 20.6 },
        { month: "2025-07", exports: 38.9, imports: 4.8, balance: 34.2 },
        { month: "2025-08", exports: 24.9, imports: 8.5, balance: 16.4 },
        { month: "2025-09", exports: 46.6, imports: 6.8, balance: 39.8 },
        { month: "2025-10", exports: 70.4, imports: 4.4, balance: 66 },
        { month: "2025-11", exports: 26.1, imports: 2.2, balance: 23.9 },
        { month: "2025-12", exports: 38.7, imports: 6.2, balance: 32.5 },
        { month: "2026-01", exports: 17.9, imports: 5.5, balance: 12.5 },
        { month: "2026-02", exports: 19, imports: 7.1, balance: 11.9 },
      ],
    },
    methodology: [
      {
        id: "uz-stat",
        label: { en: "Uzbekistan national statistics", "uz-latn": "O‘zbekiston milliy statistikasi" },
        direction: {
          en: "Exports are Uzbekistan exports to the United States; imports are Uzbekistan imports from the United States.",
          "uz-latn": "Eksport — O‘zbekistondan AQShga eksport; import — AQShdan O‘zbekistonga import.",
        },
        sourceId: "input_trade_stat_docx",
      },
      {
        id: "us-census",
        label: { en: "U.S. Census merchandise trade", "uz-latn": "AQSh Census tovar savdosi" },
        direction: {
          en: "Exports are U.S. exports to Uzbekistan; imports are U.S. imports from Uzbekistan. Services are excluded.",
          "uz-latn":
            "Eksport — AQShdan O‘zbekistonga eksport; import — O‘zbekistondan AQShga import. Xizmatlar kiritilmagan.",
        },
        sourceId: "census_goods_uz",
      },
    ],
  },
};

const investments: SealedProjection<InvestmentsPublicProjection> = {
  asOf: "2026-04-24",
  freshness: "watch",
  policy: {
    classification: "public",
    publicationState: "published",
    confidence: "verified_official",
    sourceIds: ["tradegov_mining_2025"],
    period: "2021–2024",
    asOf: "2026-04-24",
    methodology:
      "Only non-demo records classified verified_official by the source-governance policy are included; amounts are disclosed project values and are not FDI flows.",
    label: { en: "Verified investment projects", "uz-latn": "Tasdiqlangan investitsiya loyihalari" },
    translationState: approvedTranslations,
    qualityFlags: [],
  },
  payload: {
    selectionPolicy: "verified_official_only",
    summary: { verifiedProjects: 2, disclosedValueMusd: 1140, disclosedJobs: 480 },
    projects: [
      {
        id: "real-air-products-fergana-h2",
        title: {
          en: "Air Products — Fergana Refinery hydrogen assets",
          "uz-latn": "Air Products — Farg‘ona neftni qayta ishlash zavodining vodorod aktivlari",
        },
        sector: { id: "energy", label: { en: "Energy", "uz-latn": "Energetika" } },
        region: { en: "Fergana", "uz-latn": "Farg‘ona" },
        disclosedValueMusd: 140,
        status: { id: "agreed", label: { en: "Agreed", "uz-latn": "Kelishilgan" } },
        usCounterpart: "Air Products",
        uzCounterpart: "Fergana Oil Refinery (Saneg)",
        startYear: 2024,
        disclosedJobs: 80,
        sourceIds: ["tradegov_mining_2025"],
        confidence: "verified_official",
      },
      {
        id: "real-air-products-gtl",
        title: {
          en: "Air Products — Uzbekistan GTL industrial gas complex",
          "uz-latn": "Air Products — Uzbekistan GTL sanoat gazlari majmuasi",
        },
        sector: { id: "energy", label: { en: "Energy", "uz-latn": "Energetika" } },
        region: { en: "Kashkadarya", "uz-latn": "Qashqadaryo" },
        disclosedValueMusd: 1000,
        status: { id: "operating", label: { en: "Operating", "uz-latn": "Faoliyat yuritmoqda" } },
        usCounterpart: "Air Products",
        uzCounterpart: "Uzbekistan GTL (Qashqadaryo / Qarshi)",
        startYear: 2021,
        disclosedJobs: 400,
        sourceIds: ["tradegov_mining_2025"],
        confidence: "verified_official",
      },
    ],
  },
};

const roadmaps: SealedProjection<RoadmapsPublicProjection> = {
  asOf: "2026-05-31",
  freshness: "watch",
  policy: {
    classification: "public",
    publicationState: "published",
    confidence: "verified_official",
    sourceIds: ["input_roadmap_khorezm_docx", "input_roadmap_samarkand_docx"],
    period: "2026-05-10–2026-05-31",
    asOf: "2026-05-31",
    methodology:
      "Counts and declared values are reconciled to the two approved regional roadmap source documents; operational updates are not projected publicly.",
    label: { en: "Regional roadmap register", "uz-latn": "Hududiy yo‘l xaritalari reestri" },
    translationState: approvedTranslations,
    qualityFlags: [],
  },
  payload: {
    selectionPolicy: "approved_official_documents_aggregate_only",
    summary: { sourceDocuments: 2, declaredProjects: 61, declaredValueMusd: 2500, documentedSteps: 199 },
    regions: [
      {
        id: "khorezm",
        label: { en: "Khorezm Region", "uz-latn": "Xorazm viloyati" },
        visitPeriod: { start: "2026-05-26", end: "2026-05-31" },
        declaredProjects: 13,
        declaredValueMusd: 1000,
        documentedSteps: 43,
        sourceId: "input_roadmap_khorezm_docx",
        confidence: "verified_official",
      },
      {
        id: "samarkand",
        label: { en: "Samarkand Region", "uz-latn": "Samarqand viloyati" },
        visitPeriod: { start: "2026-05-10", end: "2026-05-17" },
        declaredProjects: 48,
        declaredValueMusd: 1500,
        documentedSteps: 156,
        sourceId: "input_roadmap_samarkand_docx",
        confidence: "verified_official",
      },
    ],
    disclosure: {
      en: "Declared roadmap values are source-document commitments, not realized investment. Operational owners, notes, and unpublished status updates are excluded.",
      "uz-latn":
        "Yo‘l xaritasidagi e’lon qilingan qiymatlar amalga oshirilgan investitsiya emas, balki manba hujjatidagi majburiyatlardir. Operatsion egalar, izohlar va e’lon qilinmagan holat yangilanishlari kiritilmagan.",
    },
  },
};

const executive: SealedProjection<ExecutivePublicProjection> = {
  asOf: "2026-07-09",
  freshness: "watch",
  policy: {
    classification: "public",
    publicationState: "published",
    confidence: "verified_official",
    sourceIds: [
      "input_trade_stat_docx",
      "tradegov_mining_2025",
      "input_roadmap_khorezm_docx",
      "input_roadmap_samarkand_docx",
    ],
    period: "2025–2026",
    asOf: "2026-07-09",
    methodology:
      "Executive metrics are composed from domain projections that independently pass verified-official publication policy; figures with different methodologies are not summed.",
    label: { en: "Executive baseline", "uz-latn": "Rahbariyat uchun asosiy ko‘rsatkichlar" },
    translationState: approvedTranslations,
    qualityFlags: [],
  },
  payload: {
    selectionPolicy: "verified_official_only",
    headlineMetrics: [
      trade.payload.summary.uzReportedLatestAnnual,
      {
        id: "verified-investment-value",
        label: {
          en: "Verified disclosed investment value",
          "uz-latn": "Tasdiqlangan investitsiyalarning e’lon qilingan qiymati",
        },
        value: 1140,
        unit: "USD millions",
        asOf: "2026-04-24",
        period: "2021–2024",
        sourceIds: ["tradegov_mining_2025"],
        confidence: "verified_official",
      },
      {
        id: "official-roadmap-projects",
        label: {
          en: "Projects in approved regional roadmaps",
          "uz-latn": "Tasdiqlangan hududiy yo‘l xaritalaridagi loyihalar",
        },
        value: 61,
        unit: "count",
        asOf: "2026-05-31",
        period: "2026-05",
        sourceIds: ["input_roadmap_khorezm_docx", "input_roadmap_samarkand_docx"],
        confidence: "verified_official",
      },
    ],
    disclosure: {
      en: "Headline metrics use verified official sources only. Investment values exclude illustrative, internal, media-reported, source-needed, and company-confirmed records.",
      "uz-latn":
        "Asosiy ko‘rsatkichlar faqat tasdiqlangan rasmiy manbalardan olinadi. Investitsiya qiymatlariga tasviriy, ichki, OAV xabariga asoslangan, manbasi talab qilinadigan va kompaniya tasdiqlagan yozuvlar kiritilmagan.",
    },
  },
};

const sealedDomainProjections = { executive, trade, investments, roadmaps } as const;

type SealedManifestDomain = {
  contentHash: string;
  approvalAttestationIds: string[];
};

const manifestDomains = releaseManifest.domains as Record<PublicApiV1Domain, SealedManifestDomain>;

export function assertSealedProjectionIntegrity(
  domain: PublicApiV1Domain,
  projection: SealedProjection<PublicApiV1Projection>,
): void {
  if (
    releaseManifest.releaseId !== SEALED_PUBLIC_FALLBACK_MANIFEST.id ||
    releaseManifest.publishedAt !== SEALED_PUBLIC_FALLBACK_MANIFEST.publishedAt ||
    releaseManifest.projectionVersion !== SEALED_PUBLIC_FALLBACK_MANIFEST.projectionVersion
  ) {
    throw new Error("Sealed public release manifest metadata failed integrity validation.");
  }

  const domainManifest = manifestDomains[domain];
  if (!domainManifest || domainManifest.approvalAttestationIds.length < 2) {
    throw new Error(`Sealed public ${domain} projection is missing required approval attestations.`);
  }
  const actualHash = createHash("sha256").update(JSON.stringify(projection)).digest("hex");
  if (actualHash !== domainManifest.contentHash) {
    throw new Error(`Sealed public ${domain} projection failed content integrity validation.`);
  }
}

export function readSealedDomainProjection(domain: "executive"): SealedProjection<ExecutivePublicProjection>;
export function readSealedDomainProjection(domain: "trade"): SealedProjection<TradePublicProjection>;
export function readSealedDomainProjection(domain: "investments"): SealedProjection<InvestmentsPublicProjection>;
export function readSealedDomainProjection(domain: "roadmaps"): SealedProjection<RoadmapsPublicProjection>;
export function readSealedDomainProjection(domain: PublicApiV1Domain): SealedProjection<PublicApiV1Projection> {
  const projection = structuredClone(sealedDomainProjections[domain]);
  assertSealedProjectionIntegrity(domain, projection);
  return projection;
}
