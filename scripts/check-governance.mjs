import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function fail(message) {
  failures.push(message);
}

const policy = read("lib/data-governance/policy.ts");
const ingest = read("lib/data-governance/ingest.ts");
const cron = read("app/api/cron/ingest/route.ts");
const schema = read("database/schema.sql");

try {
  execFileSync(process.execPath, [path.join(root, "scripts", "generate-preservation-manifest.mjs")], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (error) {
  const details = error.stderr?.trim() || error.stdout?.trim() || error.message;
  fail(`Preservation manifest check failed: ${details}`);
}

if (!policy.includes("candidatePeriod < currentPeriod")) {
  fail("No-downgrade policy must compare candidate period against current period.");
}
if (!policy.includes('"reject-older-period"')) {
  fail("No-downgrade policy must emit reject-older-period.");
}
if (!ingest.includes("staticPublishedMetrics")) {
  fail("Governed ingestion must load static approved metrics as the fallback baseline.");
}
if (!ingest.includes("sourceRecordRows()")) {
  fail("Governed ingestion must seed source records before writing snapshot/review rows.");
}
if (!cron.includes("verifyCronSecretHeader")) {
  fail("Cron ingestion route must verify CRON_SECRET authorization.");
}
for (const table of ["raw_source_snapshot", "normalized_observation", "published_metric", "data_review_queue"]) {
  if (!schema.includes(`alter table ${table} enable row level security`)) {
    fail(`${table} must have RLS enabled in database/schema.sql.`);
  }
}

if (failures.length) {
  console.error("Governance checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  "Governance checks passed: preservation parity, no-downgrade policy, static fallback, cron auth, source seeding, and RLS are present.",
);
