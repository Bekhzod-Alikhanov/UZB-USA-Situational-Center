import { fetchJsonWithTimeout } from "./fetcher";
import type { NormalizedObservation } from "@/lib/data-governance/types";

export interface ForeignAssistanceCountrySummary {
  fiscalYear: string;
  obligationsUsd: number;
  disbursementsUsd: number;
  country?: string;
}

interface SocrataRows {
  meta: { view?: { columns?: Array<{ name: string }> } };
  data: unknown[][];
}

const COUNTRY_SUMMARY_URL = "https://data.usaid.gov/api/views/k87i-9i5x/rows.json?accessType=DOWNLOAD";

function columnIndex(rows: SocrataRows, candidates: string[]) {
  const columns = rows.meta.view?.columns ?? [];
  return columns.findIndex((column) => candidates.some((candidate) => column.name.toLowerCase().includes(candidate)));
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/[$,]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function foreignAssistanceCountrySummaryUrl() {
  return COUNTRY_SUMMARY_URL;
}

export async function fetchForeignAssistanceUzbekistan(limit = 8): Promise<ForeignAssistanceCountrySummary[]> {
  const rows = await fetchJsonWithTimeout<SocrataRows>(COUNTRY_SUMMARY_URL, {}, 12000);
  const countryIndex = columnIndex(rows, ["country name", "country"]);
  const yearIndex = columnIndex(rows, ["fiscal year", "year"]);
  const obligationsIndex = columnIndex(rows, ["obligations"]);
  const disbursementsIndex = columnIndex(rows, ["disbursements"]);

  return rows.data
    .filter((row) => String(row[countryIndex] ?? "").toLowerCase().includes("uzbekistan"))
    .map((row) => ({
      country: String(row[countryIndex] ?? "Uzbekistan"),
      fiscalYear: String(row[yearIndex] ?? ""),
      obligationsUsd: toNumber(row[obligationsIndex]),
      disbursementsUsd: toNumber(row[disbursementsIndex]),
    }))
    .filter((row) => row.fiscalYear)
    .sort((a, b) => b.fiscalYear.localeCompare(a.fiscalYear))
    .slice(0, limit);
}

export async function fetchForeignAssistanceObservations(limit = 8): Promise<NormalizedObservation[]> {
  const fetchedAt = new Date().toISOString();
  const rows = await fetchForeignAssistanceUzbekistan(limit);
  return rows.flatMap((row) => {
    const fiscalYear = Number(row.fiscalYear);
    const periodStart = Number.isFinite(fiscalYear) ? `${fiscalYear}-10-01` : `${row.fiscalYear}-01-01`;
    const periodEnd = Number.isFinite(fiscalYear) ? `${fiscalYear + 1}-09-30` : `${row.fiscalYear}-12-31`;
    const base = {
      connectorId: "foreign-assistance",
      sourceId: "foreign_assistance_gov",
      domain: "assistance" as const,
      periodStart,
      periodEnd,
      sourceUrl: COUNTRY_SUMMARY_URL,
      fetchedAt,
      sourcePublishedAt: fetchedAt.slice(0, 10),
      relevanceScore: 0.88,
      recommendedUse: "U.S. assistance accounting record. Do not sum with UZ-side internal grant workbook without reconciliation.",
      qualityFlags: [] as string[],
    };
    return [
      {
        ...base,
        metricKey: "assistance.us.obligations.annual",
        label: "U.S. foreign assistance obligations to Uzbekistan",
        value: row.obligationsUsd / 1_000_000,
        unit: "USD millions",
        dimensions: { country: "US", partnerCountry: "UZ", flow: "obligations", sourceMethodology: "foreign-assistance-gov" },
      },
      {
        ...base,
        metricKey: "assistance.us.disbursements.annual",
        label: "U.S. foreign assistance disbursements to Uzbekistan",
        value: row.disbursementsUsd / 1_000_000,
        unit: "USD millions",
        dimensions: { country: "US", partnerCountry: "UZ", flow: "disbursements", sourceMethodology: "foreign-assistance-gov" },
      },
    ] satisfies NormalizedObservation[];
  });
}
