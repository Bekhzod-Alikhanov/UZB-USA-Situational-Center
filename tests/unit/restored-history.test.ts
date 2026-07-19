import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { historicalEventSourceRecords } from "@/data/restored/_source-pre-2026-events";
import { historicalVisitSourceRecords } from "@/data/restored/_source-pre-2025-visits";
import { topUzExportsToUsByYear, topUzImportsFromUsByYear } from "@/data/restored/_source-uz-reporter-hs6";
import { restoredPre2025Visits } from "@/data/restored/pre-2025-visits";
import { restoredPre2026Events } from "@/data/restored/pre-2026-events";
import { restoredUzReporterHs6Rows } from "@/data/restored/uz-reporter-hs6";
import { quarantineRecoveredRecord } from "@/data/restored/quarantine";

function canonicalHash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

describe("Git-history recovery quarantine", () => {
  it("never promotes a recovered Level B source to verified official without claim review", () => {
    const quarantined = quarantineRecoveredRecord(
      { id: "recovered-level-b", sourceId: "census_goods_uz" },
      {
        snapshotCommit: "deadbeef",
        removalCommit: "feedface",
        sourcePath: "data/example.ts",
        sourceBlobSha: "abc123",
      },
    );
    expect(quarantined.confidence).not.toBe("verified_official");
    expect(quarantined.publicationEligible).toBe(false);
  });

  it("preserves all removed visit and event values", () => {
    expect(historicalVisitSourceRecords).toHaveLength(20);
    expect(historicalEventSourceRecords).toHaveLength(8);
    expect(canonicalHash(historicalVisitSourceRecords)).toBe(
      "8b81dc032a88caa71d447711b49662c2403ab07d3cf5ac07b357e98dab59aabf",
    );
    expect(canonicalHash(historicalEventSourceRecords)).toBe(
      "8caabf960d05f2803283e255f085270f5f86fac68204dcd2c553e6b1c70dbe3c",
    );
  });

  it("keeps every recovered chronology record outside publication", () => {
    const restored = [...restoredPre2025Visits, ...restoredPre2026Events];
    expect(restored).toHaveLength(28);
    expect(restored.every((record) => record.publicationEligible === false)).toBe(true);
    expect(new Set(restored.map((record) => record.stableId)).size).toBe(28);

    const sourceNeeded = restored
      .filter((record) => record.confidence === "source_needed")
      .map((record) => record.stableId)
      .sort();
    expect(sourceNeeded).toEqual([
      "e-ustr-tai-2024",
      "v-2017-12-19-phone",
      "v-2017-riyadh",
      "v-2017-unga",
      "v-2024-03-daines",
    ]);
  });

  it("restores exactly 240 Uzbekistan-reporter HS-6 rows", () => {
    const canonicalRows = [
      ...Object.entries(topUzExportsToUsByYear).flatMap(([period, rows]) =>
        rows.map((record) => ({ flow: "exports_to_us", period: Number(period), ...record })),
      ),
      ...Object.entries(topUzImportsFromUsByYear).flatMap(([period, rows]) =>
        rows.map((record) => ({ flow: "imports_from_us", period: Number(period), ...record })),
      ),
    ];

    expect(canonicalRows).toHaveLength(240);
    expect(canonicalHash(canonicalRows)).toBe("cbe35680ea96be5a1bebde6f066bc7b0f01a2ecd8d2823bd70c114a5429041e2");
    expect(restoredUzReporterHs6Rows).toHaveLength(240);
    expect(new Set(restoredUzReporterHs6Rows.map((row) => row.stableId)).size).toBe(240);
  });

  it("preserves reporter, flow, period, currency, value, and methodology boundaries", () => {
    expect(restoredUzReporterHs6Rows.every((row) => row.publicationEligible === false)).toBe(true);
    expect(restoredUzReporterHs6Rows.every((row) => row.reporter.code === 860)).toBe(true);
    expect(restoredUzReporterHs6Rows.every((row) => row.partner.code === 842)).toBe(true);
    expect(restoredUzReporterHs6Rows.every((row) => row.currency === "USD")).toBe(true);
    expect(restoredUzReporterHs6Rows.every((row) => row.valueUsd === row.record.valueUsd)).toBe(true);
    expect(
      restoredUzReporterHs6Rows.every(
        (row) =>
          row.valuationBasis === "unspecified_in_recovered_snapshot" &&
          row.methodology.classificationCode === "H6" &&
          row.methodology.reporterPerspective,
      ),
    ).toBe(true);

    for (const flow of ["exports_to_us", "imports_from_us"] as const) {
      for (const period of [2021, 2022, 2023, 2024]) {
        expect(restoredUzReporterHs6Rows.filter((row) => row.flow === flow && row.period === period)).toHaveLength(30);
      }
    }
  });
});
