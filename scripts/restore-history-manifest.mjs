import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const origins = {
  visits: {
    snapshotCommit: "a9e3f890347304eea54ec7b4266bef088be63ad2",
    removalCommit: "6b866c24ad6adcfb580357e9e4a04cc25f505bea",
    sourcePath: "data/visits.ts",
    recoveredPath: "data/restored/_source-pre-2025-visits.ts",
  },
  events: {
    snapshotCommit: "6b866c24ad6adcfb580357e9e4a04cc25f505bea",
    removalCommit: "02e1edc9e30dabeddf4c83acc7884623fdd29c6a",
    sourcePath: "data/events.ts",
    recoveredPath: "data/restored/_source-pre-2026-events.ts",
  },
  hs6: {
    snapshotCommit: "9f2a324ce28a424ab7313361b1016386c716ed47",
    removalCommit: "985c8962fdddbf8ac04f4eac0aa95e4f7992eba7",
    sourcePath: "data/comtrade-hs6-uz.ts",
    recoveredPath: "data/restored/_source-uz-reporter-hs6.ts",
  },
};

function git(...args) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" });
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function evaluateDataModule(source, filename) {
  const javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
  const runtimeModule = { exports: {} };
  vm.runInNewContext(javascript, { module: runtimeModule, exports: runtimeModule.exports }, { filename });
  return JSON.parse(JSON.stringify(runtimeModule.exports));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalHash(value) {
  return sha256(JSON.stringify(value));
}

function assertExact(label, recovered, snapshot) {
  const recoveredJson = JSON.stringify(recovered);
  const snapshotJson = JSON.stringify(snapshot);
  if (recoveredJson !== snapshotJson) {
    throw new Error(`${label} recovery differs from its Git snapshot.`);
  }
}

function sourceLineage(records, sourceLevels) {
  const result = {
    registeredPublicSource: 0,
    registeredAttachedSource: 0,
    missingOrUnregisteredSource: 0,
  };
  for (const record of records) {
    const level = record.sourceId ? sourceLevels.get(record.sourceId) : undefined;
    if (level === "B") result.registeredPublicSource += 1;
    else if (level === "A") result.registeredAttachedSource += 1;
    else result.missingOrUnregisteredSource += 1;
  }
  return result;
}

function hs6Rows(module) {
  return [
    ...Object.entries(module.topUzExportsToUsByYear).flatMap(([period, rows]) =>
      rows.map((record) => ({ flow: "exports_to_us", period: Number(period), ...record })),
    ),
    ...Object.entries(module.topUzImportsFromUsByYear).flatMap(([period, rows]) =>
      rows.map((record) => ({ flow: "imports_from_us", period: Number(period), ...record })),
    ),
  ];
}

function hs6Checksums(rows) {
  const checksums = {};
  for (const row of rows) {
    const key = `${row.flow}:${row.period}`;
    checksums[key] ??= { count: 0, valueUsd: 0 };
    checksums[key].count += 1;
    checksums[key].valueUsd += row.valueUsd;
  }
  return checksums;
}

const visitSnapshotModule = evaluateDataModule(
  git("show", `${origins.visits.snapshotCommit}:${origins.visits.sourcePath}`),
  "git:data/visits.ts",
);
const eventSnapshotModule = evaluateDataModule(
  git("show", `${origins.events.snapshotCommit}:${origins.events.sourcePath}`),
  "git:data/events.ts",
);
const hs6SnapshotModule = evaluateDataModule(
  git("show", `${origins.hs6.snapshotCommit}:${origins.hs6.sourcePath}`),
  "git:data/comtrade-hs6-uz.ts",
);

const recoveredVisitModule = evaluateDataModule(read(origins.visits.recoveredPath), origins.visits.recoveredPath);
const recoveredEventModule = evaluateDataModule(read(origins.events.recoveredPath), origins.events.recoveredPath);
const recoveredHs6Module = evaluateDataModule(read(origins.hs6.recoveredPath), origins.hs6.recoveredPath);
const sourceRegistry = evaluateDataModule(read("data/sources.ts"), "data/sources.ts").sources;
const sourceLevels = new Map(sourceRegistry.map((source) => [source.id, source.level]));

const snapshotVisits = visitSnapshotModule.visits.filter((visit) => visit.date < "2025-01-01");
const snapshotEvents = eventSnapshotModule.events.filter((event) => event.date < "2026-01-01");
const recoveredVisits = recoveredVisitModule.historicalVisitSourceRecords;
const recoveredEvents = recoveredEventModule.historicalEventSourceRecords;
const snapshotHs6Rows = hs6Rows(hs6SnapshotModule);
const recoveredHs6Rows = hs6Rows(recoveredHs6Module);

assertExact("Pre-2025 visits", recoveredVisits, snapshotVisits);
assertExact("Pre-2026 events", recoveredEvents, snapshotEvents);
assertExact("Uzbekistan-reporter HS-6 rows", recoveredHs6Rows, snapshotHs6Rows);

const manifest = {
  schemaVersion: 1,
  recoveryDate: "2026-07-10",
  policy: {
    publicationEligible: false,
    note: "All recovered records remain quarantined until source, bilingual, deduplication, and domain review gates pass.",
  },
  datasets: {
    visits: {
      ...origins.visits,
      sourceBlobSha: git("rev-parse", `${origins.visits.snapshotCommit}:${origins.visits.sourcePath}`).trim(),
      recoveredFileSha256: sha256(read(origins.visits.recoveredPath)),
      recordCount: recoveredVisits.length,
      canonicalRecordSha256: canonicalHash(recoveredVisits),
      lineage: sourceLineage(recoveredVisits, sourceLevels),
    },
    events: {
      ...origins.events,
      sourceBlobSha: git("rev-parse", `${origins.events.snapshotCommit}:${origins.events.sourcePath}`).trim(),
      recoveredFileSha256: sha256(read(origins.events.recoveredPath)),
      recordCount: recoveredEvents.length,
      canonicalRecordSha256: canonicalHash(recoveredEvents),
      lineage: sourceLineage(recoveredEvents, sourceLevels),
    },
    uzReporterHs6: {
      ...origins.hs6,
      sourceBlobSha: git("rev-parse", `${origins.hs6.snapshotCommit}:${origins.hs6.sourcePath}`).trim(),
      recoveredFileSha256: sha256(read(origins.hs6.recoveredPath)),
      recordCount: recoveredHs6Rows.length,
      canonicalRecordSha256: canonicalHash(recoveredHs6Rows),
      reporter: { code: 860, iso3: "UZB" },
      partner: { code: 842, iso3: "USA" },
      periods: [...new Set(recoveredHs6Rows.map((row) => row.period))],
      currency: "USD",
      valuationBasis: "unspecified_in_recovered_snapshot",
      methodologySourceId: "comtrade_hs6",
      checksums: hs6Checksums(recoveredHs6Rows),
      lineage: { registeredPublicSource: recoveredHs6Rows.length },
    },
  },
  deduplicationNotes: [
    "e-c51-samarkand-2015 overlaps v-2015-kerry by date, location, and C5+1 launch subject; preserve both entity types until owner review.",
    "e-spd4-washington-2024 overlaps v-2024-sd-4 by date and dialogue subject; preserve both entity types until owner review.",
    "e-c51-ny-2023 overlaps v-2023-09-unga-biden by summit subject and adjacent date; source chronology review is required.",
    "e-c51-wash-2025 links to current visit v-2025-11-c5-1; preserve as an event-to-visit relationship candidate, not a second visit.",
    "HS-6 rows remain separate from U.S.-reporter/Census series because reporter perspective, flow, period, and methodology are not interchangeable.",
  ],
};

if (process.argv.includes("--markdown")) {
  const { visits, events, uzReporterHs6 } = manifest.datasets;
  console.log(
    `# Restored Data Review\n\n` +
      `- Visits: ${visits.recordCount} records; canonical SHA-256 \`${visits.canonicalRecordSha256}\`.\n` +
      `- Events: ${events.recordCount} records; canonical SHA-256 \`${events.canonicalRecordSha256}\`.\n` +
      `- UZ-reporter HS-6: ${uzReporterHs6.recordCount} rows; canonical SHA-256 \`${uzReporterHs6.canonicalRecordSha256}\`.\n`,
  );
} else {
  console.log(JSON.stringify(manifest, null, 2));
}
