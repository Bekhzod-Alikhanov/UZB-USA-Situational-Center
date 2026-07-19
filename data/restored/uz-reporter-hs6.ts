import type { Hs6Row } from "../comtrade-types";
import { topUzExportsToUsByYear, topUzImportsFromUsByYear } from "./_source-uz-reporter-hs6";
import type { RecoveredDataConfidence, RecoveryLineage, RecoveryProvenance } from "./types";

export type RecoveredUzReporterFlow = "exports_to_us" | "imports_from_us";

export interface RecoveredUzReporterHs6Record {
  stableId: string;
  sourceId: "comtrade_hs6";
  confidence: RecoveredDataConfidence;
  lineage: RecoveryLineage;
  publicationEligible: false;
  provenance: RecoveryProvenance;
  reporter: { code: 860; iso3: "UZB" };
  partner: { code: 842; iso3: "USA" };
  flow: RecoveredUzReporterFlow;
  period: number;
  currency: "USD";
  valueUsd: number;
  valuationBasis: "unspecified_in_recovered_snapshot";
  methodology: typeof UZ_REPORTER_HS6_METHODOLOGY;
  record: Hs6Row;
}

export const UZ_REPORTER_HS6_PROVENANCE: RecoveryProvenance = {
  snapshotCommit: "9f2a324ce28a424ab7313361b1016386c716ed47",
  removalCommit: "985c8962fdddbf8ac04f4eac0aa95e4f7992eba7",
  sourcePath: "data/comtrade-hs6-uz.ts",
  sourceBlobSha: "4257fcdf556d265ecd0919215a7fd5c3181fe245",
};

export const UZ_REPORTER_HS6_METHODOLOGY = {
  provider: "UN Comtrade preview API (public, no auth)",
  endpoint: "https://comtradeapi.un.org/public/v1/preview/C/A/HS",
  fetchedAt: "2026-04-29",
  classificationCode: "H6",
  frequency: "annual",
  reporterPerspective: true,
} as const;

function recoverFlow(byYear: Record<number, Hs6Row[]>, flow: RecoveredUzReporterFlow): RecoveredUzReporterHs6Record[] {
  return Object.entries(byYear).flatMap(([period, rows]) =>
    rows.map((record) => ({
      stableId: `legacy-comtrade-uz-reporter-${flow}-${period}-${record.hs6}`,
      sourceId: "comtrade_hs6" as const,
      confidence: "verified_official" as const,
      lineage: "registered_public_source" as const,
      publicationEligible: false as const,
      provenance: UZ_REPORTER_HS6_PROVENANCE,
      reporter: { code: 860 as const, iso3: "UZB" as const },
      partner: { code: 842 as const, iso3: "USA" as const },
      flow,
      period: Number(period),
      currency: "USD" as const,
      valueUsd: record.valueUsd,
      valuationBasis: "unspecified_in_recovered_snapshot" as const,
      methodology: UZ_REPORTER_HS6_METHODOLOGY,
      record,
    })),
  );
}

export const restoredUzReporterHs6Rows = [
  ...recoverFlow(topUzExportsToUsByYear, "exports_to_us"),
  ...recoverFlow(topUzImportsFromUsByYear, "imports_from_us"),
];
