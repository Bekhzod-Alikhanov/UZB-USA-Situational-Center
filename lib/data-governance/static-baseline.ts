import { benchmark } from "@/data/benchmark";
import { foreignAssistanceMeta, foreignAssistanceYears } from "@/data/foreign-assistance";
import { tradeAnnualUs, tradeMonthlyMeta, tradeMonthlyUs } from "@/data/trade";
import type { MetricDomain, MetricDimensions, PublishedMetric } from "./types";

const APPROVED_AT = "2026-05-04T00:00:00.000Z";
const APPROVED_BY = "static-source-registry";

function metric(
  id: string,
  domain: MetricDomain,
  metricKey: string,
  label: string,
  value: number | string | boolean,
  unit: string,
  periodStart: string,
  periodEnd: string,
  sourceId: string,
  connectorId: string,
  dimensions: MetricDimensions,
  recommendedUse: string,
  sourcePublishedAt?: string,
): PublishedMetric {
  return {
    id,
    connectorId,
    sourceId,
    metricKey,
    label,
    domain,
    value,
    unit,
    periodStart,
    periodEnd,
    dimensions,
    sourcePublishedAt,
    fetchedAt: APPROVED_AT,
    relevanceScore: 1,
    recommendedUse,
    qualityFlags: [],
    approvedAt: APPROVED_AT,
    approvedBy: APPROVED_BY,
    revisionId: `${id}-${periodEnd}`,
    isCurrent: true,
  };
}

export function staticPublishedMetrics(): PublishedMetric[] {
  const latestMonth = tradeMonthlyUs[tradeMonthlyUs.length - 1];
  const latestAnnual = tradeAnnualUs[tradeAnnualUs.length - 1];
  const latestAssistance = foreignAssistanceYears.find((year) => year.fiscalYear === foreignAssistanceMeta.fyMostRecent);
  const uzBenchmark = benchmark.find((row) => row.country === "UZ");
  const metrics: PublishedMetric[] = [];

  if (latestMonth) {
    const periodStart = `${latestMonth.month}-01`;
    const periodEnd = `${latestMonth.month}-28`;
    metrics.push(
      metric(
        "static-us-goods-exports-monthly",
        "trade",
        "trade.us.goods.monthly.exports",
        "U.S. goods exports to Uzbekistan",
        latestMonth.exports,
        "USD millions",
        periodStart,
        periodEnd,
        tradeMonthlyMeta.sourceId,
        "census-hs-trade",
        { country: "US", partnerCountry: "UZ", flow: "exports", sourceMethodology: "us-census" },
        "Monthly U.S.-side goods monitoring.",
        tradeMonthlyMeta.fetched_at,
      ),
      metric(
        "static-us-goods-imports-monthly",
        "trade",
        "trade.us.goods.monthly.imports",
        "U.S. goods imports from Uzbekistan",
        latestMonth.imports,
        "USD millions",
        periodStart,
        periodEnd,
        tradeMonthlyMeta.sourceId,
        "census-hs-trade",
        { country: "US", partnerCountry: "UZ", flow: "imports", sourceMethodology: "us-census" },
        "Monthly U.S.-side goods monitoring.",
        tradeMonthlyMeta.fetched_at,
      ),
      metric(
        "static-us-goods-balance-monthly",
        "trade",
        "trade.us.goods.monthly.balance",
        "U.S. goods balance with Uzbekistan",
        latestMonth.balance,
        "USD millions",
        periodStart,
        periodEnd,
        tradeMonthlyMeta.sourceId,
        "census-hs-trade",
        { country: "US", partnerCountry: "UZ", flow: "balance", sourceMethodology: "us-census" },
        "Monthly U.S.-side goods monitoring.",
        tradeMonthlyMeta.fetched_at,
      ),
    );
  }

  if (latestAnnual) {
    metrics.push(
      metric(
        "static-us-goods-exports-annual",
        "trade",
        "trade.us.goods.annual.exports",
        "Annual U.S. goods exports to Uzbekistan",
        latestAnnual.exports,
        "USD millions",
        `${latestAnnual.year}-01-01`,
        `${latestAnnual.year}-12-31`,
        "census_goods_uz",
        "census-hs-trade",
        { country: "US", partnerCountry: "UZ", flow: "exports", sourceMethodology: "us-census" },
        "Annual U.S.-side goods total.",
        tradeMonthlyMeta.fetched_at,
      ),
      metric(
        "static-us-goods-imports-annual",
        "trade",
        "trade.us.goods.annual.imports",
        "Annual U.S. goods imports from Uzbekistan",
        latestAnnual.imports,
        "USD millions",
        `${latestAnnual.year}-01-01`,
        `${latestAnnual.year}-12-31`,
        "census_goods_uz",
        "census-hs-trade",
        { country: "US", partnerCountry: "UZ", flow: "imports", sourceMethodology: "us-census" },
        "Annual U.S.-side goods total.",
        tradeMonthlyMeta.fetched_at,
      ),
    );
  }

  if (latestAssistance) {
    metrics.push(
      metric(
        "static-foreign-assistance-obligations",
        "assistance",
        "assistance.us.obligations.annual",
        "U.S. foreign assistance obligations to Uzbekistan",
        latestAssistance.totalUsdM,
        "USD millions",
        `${latestAssistance.fiscalYear}-10-01`,
        `${latestAssistance.fiscalYear + 1}-09-30`,
        foreignAssistanceMeta.sourceId,
        "foreign-assistance",
        { country: "US", partnerCountry: "UZ", flow: "obligations", sourceMethodology: "foreign-assistance-gov" },
        "Annual obligations basis; do not sum with UZ-side internal grants.",
        foreignAssistanceMeta.fetched_at,
      ),
    );
  }

  if (uzBenchmark) {
    metrics.push(
      metric(
        "static-worldbank-uz-gdp",
        "macro",
        "macro.uz.gdp.current_usd",
        "Uzbekistan GDP",
        uzBenchmark.gdpUsdBn,
        "USD billions",
        "2024-01-01",
        "2024-12-31",
        "worldbank_data",
        "world-bank-wdi",
        { country: "UZ", sourceMethodology: "world-bank-wdi" },
        "Macro benchmark context; latest official annual observation may lag.",
        "2026-04-26",
      ),
      metric(
        "static-worldbank-uz-population",
        "macro",
        "macro.uz.population",
        "Uzbekistan population",
        uzBenchmark.populationM,
        "millions",
        "2024-01-01",
        "2024-12-31",
        "worldbank_data",
        "world-bank-wdi",
        { country: "UZ", sourceMethodology: "world-bank-wdi" },
        "Macro benchmark context; latest official annual observation may lag.",
        "2026-04-26",
      ),
    );
  }

  return metrics;
}
