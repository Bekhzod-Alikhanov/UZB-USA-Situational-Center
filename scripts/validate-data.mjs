import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const warnings = [];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function walkSourceFiles(dir = root, output = []) {
  const ignoredDirs = new Set([".git", ".next", ".vercel", "node_modules", "out", "build", "coverage"]);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSourceFiles(fullPath, output);
    } else {
      output.push(path.relative(root, fullPath));
    }
  }
  return output;
}

function flattenKeys(value, prefix = "") {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value).flatMap(([key, nested]) => flattenKeys(nested, prefix ? `${prefix}.${key}` : key));
}

function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((relPath) => fs.existsSync(path.join(root, relPath)));
  } catch {
    warn("Could not read git tracked files; using a source-tree fallback for unsafe admin fallback scan.");
    return walkSourceFiles();
  }
}

const pkg = JSON.parse(read("package.json"));
const readme = read("README.md");
const sourceText = read("data/sources.ts");
const sourceIds = [...sourceText.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
const duplicateSources = sourceIds.filter((id, index) => sourceIds.indexOf(id) !== index);
if (duplicateSources.length) fail(`Duplicate source ids: ${[...new Set(duplicateSources)].join(", ")}`);

const sourceSet = new Set(sourceIds);
const dataDir = path.join(root, "data");
const dataFiles = fs.readdirSync(dataDir).filter((file) => file.endsWith(".ts"));
let sourceRefCount = 0;
for (const file of dataFiles) {
  const text = read(path.join("data", file));
  for (const match of text.matchAll(/\bsourceId:\s*"([^"]+)"/g)) {
    sourceRefCount += 1;
    if (!sourceSet.has(match[1])) fail(`Unknown sourceId "${match[1]}" in data/${file}`);
  }
}

const grantsText = read("data/grants.ts");
const internalGrantRefs = [...grantsText.matchAll(/sourceId:\s*"input_grants_xlsx"/g)].length;
const usProgramRefs = [...grantsText.matchAll(/\bid:\s*"g-usaid-/g)].length;
if (internalGrantRefs !== 7) fail(`Expected 7 internal grant workbook rows; found ${internalGrantRefs}.`);
if (usProgramRefs !== 4) fail(`Expected 4 major U.S. assistance program records; found ${usProgramRefs}.`);

const locales = ["en", "ru", "uz-latn"];
const messageKeySets = new Map();
for (const locale of locales) {
  try {
    const parsed = JSON.parse(read(`messages/${locale}.json`));
    messageKeySets.set(locale, new Set(flattenKeys(parsed).filter(Boolean)));
  } catch (error) {
    fail(`messages/${locale}.json is not valid JSON: ${error.message}`);
  }
}
const baseKeys = messageKeySets.get("en") ?? new Set();
for (const locale of locales.filter((locale) => locale !== "en")) {
  const keys = messageKeySets.get(locale) ?? new Set();
  const missing = [...baseKeys].filter((key) => !keys.has(key));
  const extra = [...keys].filter((key) => !baseKeys.has(key));
  if (missing.length) fail(`messages/${locale}.json missing keys: ${missing.join(", ")}`);
  if (extra.length) warn(`messages/${locale}.json has extra keys: ${extra.join(", ")}`);
}

const expectedRoutes = [
  "",
  "brief",
  "overview",
  "trade",
  "visits",
  "prepare",
  "commitments", // permanentRedirect stub → /roadmaps
  "roadmaps",
  "agreements",
  "map",
  "admin",
  "admin/login",
  "investments",
  "grants",
  "contacts",
  "compliance",
  "benchmark",
];

for (const route of expectedRoutes) {
  const pagePath = route
    ? path.join(root, "app", "[locale]", route, "page.tsx")
    : path.join(root, "app", "[locale]", "page.tsx");
  if (!fs.existsSync(pagePath)) fail(`README route missing page file: /[locale]/${route || ""}`);
}

if (!readme.includes(`Next.js ${pkg.dependencies.next}`)) {
  fail(`README stack version does not match package.json next@${pkg.dependencies.next}.`);
}
if (!/next-intl v4/i.test(readme)) {
  fail("README should document next-intl v4 to match package.json.");
}
if (!read(".env.example").includes("ADMIN_SESSION_SECRET")) {
  fail(".env.example must document ADMIN_SESSION_SECRET.");
}
if (!read(".env.example").includes("DATA_BACKEND")) {
  fail(".env.example must document DATA_BACKEND.");
}
if (!read(".env.example").includes("CRON_SECRET")) {
  fail(".env.example must document CRON_SECRET for scheduled ingestion.");
}
if (!readme.includes("/api/live-data/health")) {
  fail("README should document the live-data health endpoint.");
}
if (!fs.existsSync(path.join(root, "database", "schema.sql"))) {
  fail("database/schema.sql is required for production database handoff.");
}
const schema = read("database/schema.sql");
for (const table of [
  "raw_source_snapshot",
  "normalized_observation",
  "published_metric",
  "data_review_queue",
  "source_version_policy",
  "ingest_run",
]) {
  if (!schema.includes(`create table if not exists ${table}`)) {
    fail(`database/schema.sql must include governed ingestion table: ${table}.`);
  }
}
if (!schema.includes("reject-older-period")) {
  fail("database/schema.sql should preserve the reject-older-period review action.");
}
if (!read("vercel.json").includes("/api/cron/ingest")) {
  fail("vercel.json should configure the governed ingestion cron endpoint.");
}
if (!fs.existsSync(path.join(root, ".github", "workflows", "ci.yml"))) {
  fail(".github/workflows/ci.yml is required for CI verification.");
}

const unsafeAdminFallbackPatterns = ["uzus" + "2026", "ADMIN_PASSWORD" + " ??"];
for (const relPath of trackedFiles()) {
  if (!/\.(ts|tsx|js|jsx|mjs|cjs|json|md|example|toml|yml|yaml|css)$/.test(relPath)) continue;
  const text = read(relPath);
  if (unsafeAdminFallbackPatterns.some((pattern) => text.includes(pattern))) {
    fail(`Unsafe admin fallback reference found in tracked file: ${relPath}`);
  }
  // Guard against double-encoded UTF-8 (mojibake) in source and i18n files.
  // The signature "â€" (â€) appears when UTF-8 punctuation/okina is
  // re-saved as cp1252/Latin-1. Scoped to app/components/lib/data/messages so
  // historical docs are not retroactively failed.
  const normalized = relPath.replace(/\\/g, "/");
  if (
    /^(app|components|lib|data|messages)\//.test(normalized) &&
    /\.(ts|tsx|json)$/.test(normalized) &&
    text.includes("â€")
  ) {
    fail(`Mojibake (double-encoded UTF-8 "â€…") found in ${relPath}. Re-save the file as UTF-8.`);
  }
}

console.log(
  `Validated ${sourceIds.length} sources, ${sourceRefCount} source references, ${dataFiles.length} data files, ${locales.length} locale files, and ${expectedRoutes.length} localized routes.`,
);
for (const message of warnings) console.warn(`Warning: ${message}`);
if (failures.length) {
  console.error("\nValidation failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}
