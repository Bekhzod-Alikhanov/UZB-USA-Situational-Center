import { NextRequest, NextResponse } from "next/server";
import { externalDataConnectors } from "@/data/external-data";
import { censusExportsUrl } from "@/lib/live-data/census";
import { beaMetadataUrl } from "@/lib/live-data/bea";
import { eximAuthorizationsPackageUrl, eximCountryLimitationScheduleUrl } from "@/lib/live-data/exim";
import { foreignAssistanceCountrySummaryUrl } from "@/lib/live-data/foreign-assistance";
import { probeUrl } from "@/lib/live-data/fetcher";
import { worldBankIndicatorUrl } from "@/lib/live-data/worldbank";
import { databaseHealth } from "@/lib/db/adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const probe = req.nextUrl.searchParams.get("probe") === "1";
  const urls: Record<string, string | undefined> = {
    "census-hs-trade": censusExportsUrl("2025-12"),
    "world-bank-wdi": worldBankIndicatorUrl("UZB"),
    "bea-services": process.env.BEA_API_KEY ? beaMetadataUrl() : undefined,
    "foreign-assistance": foreignAssistanceCountrySummaryUrl(),
    "exim-authorizations": eximAuthorizationsPackageUrl(),
    "exim-cls": eximCountryLimitationScheduleUrl(),
    "stat-uz": "https://stat.uz/en/",
    "data-egov-uz": "https://data.egov.uz/eng/",
    "cbu-open-data": "https://cbu.uz/en/statistics/",
  };

  const probes = probe
    ? await Promise.all(
        externalDataConnectors.map((connector) =>
          urls[connector.id]
            ? probeUrl(connector.id, urls[connector.id]!)
            : Promise.resolve({
                id: connector.id,
                ok: false,
                status: connector.status === "key-required" ? "not-configured" : "not-probed",
                message: connector.setup ?? "Manual review required before probing.",
                fetchedAt: new Date().toISOString(),
                sourceUrl: connector.apiUrl,
              } as const),
        ),
      )
    : externalDataConnectors.map((connector) => ({
        id: connector.id,
        ok: connector.status === "live-ready",
        status: "not-probed" as const,
        message: probe ? "Not probed" : "Add ?probe=1 to actively test public endpoints.",
        fetchedAt: new Date().toISOString(),
        sourceUrl: connector.apiUrl,
      }));

  return NextResponse.json(
    {
      database: databaseHealth(),
      connectors: externalDataConnectors,
      probes,
    },
    {
      headers: {
        "cache-control": probe ? "no-store" : "public, max-age=300, stale-while-revalidate=900",
      },
    },
  );
}
