import { fetchJsonWithTimeout } from "./fetcher";
import type { SourceSnapshot } from "@/lib/data-governance/types";
import { contentHash } from "@/lib/data-governance/policy";

const BEA_BASE_URL = "https://apps.bea.gov/api/data";

interface BeaResponse {
  BEAAPI?: {
    Results?: unknown;
    Error?: { APIErrorDescription?: string };
  };
}

function beaKey() {
  return process.env.BEA_API_KEY?.trim();
}

export function beaMetadataUrl(dataset = "IntlServTrade") {
  const search = new URLSearchParams({
    method: "GETPARAMETERLIST",
    datasetname: dataset,
    ResultFormat: "JSON",
  });
  const key = beaKey();
  if (key) search.set("UserID", key);
  return `${BEA_BASE_URL}?${search.toString()}`;
}

export async function fetchBeaMetadataSnapshot(): Promise<SourceSnapshot> {
  if (!beaKey()) {
    throw new Error("BEA_API_KEY is required before BEA services-trade ingestion can run.");
  }
  const url = beaMetadataUrl();
  const payload = await fetchJsonWithTimeout<BeaResponse>(url, {}, 12000);
  const error = payload.BEAAPI?.Error?.APIErrorDescription;
  if (error) throw new Error(error);
  return {
    connectorId: "bea-services",
    sourceId: "bea_developers",
    sourceUrl: url,
    fetchedAt: new Date().toISOString(),
    payload,
    contentHash: contentHash(payload),
    rowCount: 1,
  };
}
