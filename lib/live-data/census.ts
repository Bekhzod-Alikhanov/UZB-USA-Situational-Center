import { fetchJsonWithTimeout } from "./fetcher";
import type { NormalizedObservation } from "@/lib/data-governance/types";
import type { LiveTradeSnapshot } from "./types";

const CTY_UZBEKISTAN = "4644";

type CensusRows = string[][];

function toQuery(params: Record<string, string>) {
  const search = new URLSearchParams(params);
  const key = process.env.CENSUS_API_KEY?.trim();
  if (key) search.set("key", key);
  return search.toString();
}

function valueFrom(rows: CensusRows, field: string) {
  const [header, first] = rows;
  if (!header || !first) return undefined;
  const index = header.indexOf(field);
  if (index < 0) return undefined;
  const n = Number(first[index]);
  return Number.isFinite(n) ? n : undefined;
}

function textFrom(rows: CensusRows, field: string) {
  const [header, first] = rows;
  if (!header || !first) return undefined;
  const index = header.indexOf(field);
  return index >= 0 ? first[index] : undefined;
}

function monthEnd(time: string) {
  const [year, month] = time.split("-").map(Number);
  if (!year || !month) return `${time}-28`;
  return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
}

export function censusExportsUrl(time = "2025-12") {
  return `https://api.census.gov/data/timeseries/intltrade/exports/hs?${toQuery({
    get: "CTY_NAME,ALL_VAL_MO,ALL_VAL_YR,LAST_UPDATE",
    time,
    CTY_CODE: CTY_UZBEKISTAN,
    E_COMMODITY: "-",
  })}`;
}

export function censusImportsUrl(time = "2025-12") {
  return `https://api.census.gov/data/timeseries/intltrade/imports/hs?${toQuery({
    get: "CTY_NAME,GEN_VAL_MO,GEN_VAL_YR,LAST_UPDATE",
    time,
    CTY_CODE: CTY_UZBEKISTAN,
    I_COMMODITY: "-",
  })}`;
}

export async function fetchCensusTradeSnapshot(time = "2025-12"): Promise<LiveTradeSnapshot> {
  const [exportsRows, importsRows] = await Promise.all([
    fetchJsonWithTimeout<CensusRows>(censusExportsUrl(time)),
    fetchJsonWithTimeout<CensusRows>(censusImportsUrl(time)),
  ]);

  return {
    source: "census",
    time,
    exportsUsd: valueFrom(exportsRows, "ALL_VAL_YR"),
    importsUsd: valueFrom(importsRows, "GEN_VAL_YR"),
    lastUpdate: textFrom(exportsRows, "LAST_UPDATE") ?? textFrom(importsRows, "LAST_UPDATE"),
  };
}

export async function fetchCensusTradeObservations(time = "2025-12"): Promise<NormalizedObservation[]> {
  const [exportsRows, importsRows] = await Promise.all([
    fetchJsonWithTimeout<CensusRows>(censusExportsUrl(time)),
    fetchJsonWithTimeout<CensusRows>(censusImportsUrl(time)),
  ]);
  const fetchedAt = new Date().toISOString();
  const periodStart = `${time}-01`;
  const periodEnd = monthEnd(time);
  const exportsUsd = valueFrom(exportsRows, "ALL_VAL_MO");
  const importsUsd = valueFrom(importsRows, "GEN_VAL_MO");
  const lastUpdate = textFrom(exportsRows, "LAST_UPDATE") ?? textFrom(importsRows, "LAST_UPDATE");
  const observations: NormalizedObservation[] = [];

  if (exportsUsd !== undefined) {
    observations.push({
      connectorId: "census-hs-trade",
      sourceId: "census_intl_trade_api",
      metricKey: "trade.us.goods.monthly.exports",
      label: "U.S. goods exports to Uzbekistan",
      domain: "trade",
      value: exportsUsd / 1_000_000,
      unit: "USD millions",
      periodStart,
      periodEnd,
      dimensions: { country: "US", partnerCountry: "UZ", flow: "exports", sourceMethodology: "us-census" },
      sourceUrl: censusExportsUrl(time),
      sourcePublishedAt: lastUpdate,
      fetchedAt,
      relevanceScore: 0.98,
      recommendedUse:
        "Official monthly U.S.-side goods exports; use for trade monitoring and do not combine with services.",
      qualityFlags: lastUpdate ? [] : ["missing-source-last-update"],
    });
  }

  if (importsUsd !== undefined) {
    observations.push({
      connectorId: "census-hs-trade",
      sourceId: "census_intl_trade_api",
      metricKey: "trade.us.goods.monthly.imports",
      label: "U.S. goods imports from Uzbekistan",
      domain: "trade",
      value: importsUsd / 1_000_000,
      unit: "USD millions",
      periodStart,
      periodEnd,
      dimensions: { country: "US", partnerCountry: "UZ", flow: "imports", sourceMethodology: "us-census" },
      sourceUrl: censusImportsUrl(time),
      sourcePublishedAt: lastUpdate,
      fetchedAt,
      relevanceScore: 0.98,
      recommendedUse:
        "Official monthly U.S.-side goods imports; use for trade monitoring and do not combine with services.",
      qualityFlags: lastUpdate ? [] : ["missing-source-last-update"],
    });
  }

  if (exportsUsd !== undefined && importsUsd !== undefined) {
    observations.push({
      connectorId: "census-hs-trade",
      sourceId: "census_intl_trade_api",
      metricKey: "trade.us.goods.monthly.balance",
      label: "U.S. goods balance with Uzbekistan",
      domain: "trade",
      value: (exportsUsd - importsUsd) / 1_000_000,
      unit: "USD millions",
      periodStart,
      periodEnd,
      dimensions: { country: "US", partnerCountry: "UZ", flow: "balance", sourceMethodology: "us-census" },
      sourceUrl: censusExportsUrl(time),
      sourcePublishedAt: lastUpdate,
      fetchedAt,
      relevanceScore: 0.96,
      recommendedUse: "Official monthly U.S.-side goods balance; label methodology next to the figure.",
      qualityFlags: lastUpdate ? [] : ["missing-source-last-update"],
    });
  }

  return observations;
}
