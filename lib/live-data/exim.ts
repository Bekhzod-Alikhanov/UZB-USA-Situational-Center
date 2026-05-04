import { fetchJsonWithTimeout } from "./fetcher";
import type { NormalizedObservation, SourceSnapshot } from "@/lib/data-governance/types";
import { contentHash } from "@/lib/data-governance/policy";

const EXIM_PACKAGE_URL = "https://img.exim.gov/s3fs-public/dataset/vbhv-d8am/data.json";
const EXIM_CLS_URL = "https://www.exim.gov/resources/country-limitation-schedule";

interface DataGovPackage {
  success?: boolean;
  result?: {
    metadata_modified?: string;
    resources?: Array<{ format?: string; mimetype?: string; url?: string; name?: string }>;
  };
  modified?: string;
  distribution?: Array<{ mediaType?: string; format?: string; downloadURL?: string; title?: string }>;
  dataset?: Array<{
    modified?: string;
    distribution?: Array<{ mediaType?: string; format?: string; downloadURL?: string; title?: string }>;
  }>;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function columnIndex(header: string[], candidates: string[]) {
  return header.findIndex((column) => {
    const normalized = column.toLowerCase();
    return candidates.some((candidate) => normalized.includes(candidate));
  });
}

function money(value: string | undefined) {
  if (!value) return 0;
  const parsed = Number(value.replace(/[$,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function eximAuthorizationsPackageUrl() {
  return EXIM_PACKAGE_URL;
}

export function eximCountryLimitationScheduleUrl() {
  return EXIM_CLS_URL;
}

export async function fetchEximAuthorizationsObservations(): Promise<{ observations: NormalizedObservation[]; snapshot: SourceSnapshot }> {
  const fetchedAt = new Date().toISOString();
  const pkg = await fetchJsonWithTimeout<DataGovPackage>(EXIM_PACKAGE_URL, {}, 12000);
  const ckanUrl = pkg.result?.resources?.find((resource) => {
    const descriptor = `${resource.format ?? ""} ${resource.mimetype ?? ""} ${resource.name ?? ""}`.toLowerCase();
    return descriptor.includes("csv") && resource.url;
  })?.url;
  const podUrl = pkg.distribution?.find((resource) => {
    const descriptor = `${resource.mediaType ?? ""} ${resource.format ?? ""} ${resource.title ?? ""}`.toLowerCase();
    return descriptor.includes("csv") && resource.downloadURL;
  })?.downloadURL;
  const catalogUrl = pkg.dataset?.flatMap((dataset) => dataset.distribution ?? []).find((resource) => {
    const descriptor = `${resource.mediaType ?? ""} ${resource.format ?? ""} ${resource.title ?? ""}`.toLowerCase();
    return descriptor.includes("csv") && resource.downloadURL;
  })?.downloadURL;
  const csvUrl = ckanUrl ?? podUrl ?? catalogUrl;
  const modified = pkg.result?.metadata_modified ?? pkg.modified ?? pkg.dataset?.find((dataset) => dataset.modified)?.modified;
  if (!csvUrl) throw new Error("EXIM authorizations CSV resource was not found in Data.gov package metadata.");

  const csvResponse = await fetch(csvUrl, { headers: { accept: "text/csv,*/*" }, next: { revalidate: 60 * 60 * 24 } });
  if (!csvResponse.ok) throw new Error(`EXIM authorizations CSV failed with HTTP ${csvResponse.status}`);
  const text = await csvResponse.text();
  const rows = parseCsv(text);
  const header = rows[0] ?? [];
  const countryIndex = columnIndex(header, ["country"]);
  const amountIndex = columnIndex(header, ["authorization amount", "authorized amount", "authorization"]);
  const exportValueIndex = columnIndex(header, ["export value"]);
  const dateIndex = columnIndex(header, ["authorization date", "approved date", "date"]);
  const filtered = rows.slice(1).filter((row) => String(row[countryIndex] ?? "").toLowerCase().includes("uzbekistan"));
  const totalAuthorization = filtered.reduce((sum, row) => sum + money(row[amountIndex]), 0);
  const totalExportValue = filtered.reduce((sum, row) => sum + money(row[exportValueIndex]), 0);
  const latestDate = filtered
    .map((row) => row[dateIndex])
    .filter(Boolean)
    .sort()
    .at(-1);

  const periodEnd = latestDate && /^\d{4}/.test(latestDate) ? latestDate.slice(0, 10) : fetchedAt.slice(0, 10);
  const observations: NormalizedObservation[] = [
    {
      connectorId: "exim-authorizations",
      sourceId: "exim_authorizations_data",
      metricKey: "finance.exim.authorizations.cumulative",
      label: "EXIM authorizations connected to Uzbekistan",
      domain: "finance",
      value: totalAuthorization / 1_000_000,
      unit: "USD millions",
      periodStart: "2006-10-01",
      periodEnd,
      dimensions: { country: "US", partnerCountry: "UZ", flow: "stock", sourceMethodology: "exim-authorizations" },
      sourceUrl: csvUrl,
      sourcePublishedAt: modified,
      fetchedAt,
      relevanceScore: filtered.length ? 0.78 : 0.42,
      recommendedUse: "Export-credit support context. Use as a financing signal, not as realized investment.",
      qualityFlags: filtered.length ? [] : ["no-uzbekistan-rows-found"],
    },
    {
      connectorId: "exim-authorizations",
      sourceId: "exim_authorizations_data",
      metricKey: "finance.exim.export_value.cumulative",
      label: "EXIM-supported export value connected to Uzbekistan",
      domain: "finance",
      value: totalExportValue / 1_000_000,
      unit: "USD millions",
      periodStart: "2006-10-01",
      periodEnd,
      dimensions: { country: "US", partnerCountry: "UZ", flow: "stock", sourceMethodology: "exim-authorizations" },
      sourceUrl: csvUrl,
      sourcePublishedAt: modified,
      fetchedAt,
      relevanceScore: filtered.length ? 0.76 : 0.42,
      recommendedUse: "Export-credit support context. Use as a financing signal, not as realized investment.",
      qualityFlags: filtered.length ? [] : ["no-uzbekistan-rows-found"],
    },
  ];

  return {
    observations,
    snapshot: {
      connectorId: "exim-authorizations",
      sourceId: "exim_authorizations_data",
      sourceUrl: csvUrl,
      fetchedAt,
      payload: { package: pkg, uzbekistanRows: filtered.slice(0, 50) },
      contentHash: contentHash({ package: pkg, uzbekistanRows: filtered }),
      rowCount: filtered.length,
    },
  };
}
