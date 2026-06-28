import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failOnFindings = process.argv.includes("--fail-on-findings");
const baseUrlArg = process.argv.find((arg) => arg.startsWith("--base-url="));
const baseUrl = (baseUrlArg?.slice("--base-url=".length) || process.env.I18N_BASE_URL || "").replace(/\/$/, "");

const locales = ["en", "ru", "uz-latn"];
const nonEnglishLocales = ["ru", "uz-latn"];

const findings = [];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function addFinding({ severity = "warn", area, file, message, evidence }) {
  findings.push({ severity, area, file, message, evidence });
}

function flattenKeys(value, prefix = "") {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [[prefix, value]];
  return Object.entries(value).flatMap(([key, nested]) => flattenKeys(nested, prefix ? `${prefix}.${key}` : key));
}

function loadMessages(locale) {
  return Object.fromEntries(flattenKeys(JSON.parse(read(`messages/${locale}.json`))).filter(([key]) => Boolean(key)));
}

function auditMessageParity() {
  const messages = Object.fromEntries(locales.map((locale) => [locale, loadMessages(locale)]));
  const enKeys = Object.keys(messages.en);
  const allowedSameAsEnglish = new Set([
    "top.shortcut",
    "demo.badge",
    "compliance.sections.federal",
    "compliance.calculator.fields.eccn",
    "admin.import",
    "shell.footer.record",
    "investments.workspace.statuses.mou",
    "agreements.spheres.transport",
    // Official source identifiers — BEA program code, U.S. Census agency
    // name, Open Doors / IIE report name. Kept in original per project
    // exception rule for source-title strings.
    "map.strategic.metrics.gdpSub",
    "map.strategic.metrics.popSub",
    "map.strategic.metrics.studentsSub",
  ]);

  for (const locale of nonEnglishLocales) {
    const keys = Object.keys(messages[locale]);
    const missing = enKeys.filter((key) => !(key in messages[locale]));
    const extra = keys.filter((key) => !(key in messages.en));
    if (missing.length) {
      addFinding({
        severity: "error",
        area: "messages",
        file: `messages/${locale}.json`,
        message: `Missing ${missing.length} English message keys.`,
        evidence: missing.slice(0, 20).join(", "),
      });
    }
    if (extra.length) {
      addFinding({
        area: "messages",
        file: `messages/${locale}.json`,
        message: `Contains ${extra.length} keys not present in English.`,
        evidence: extra.slice(0, 20).join(", "),
      });
    }

    const sameAsEnglish = enKeys.filter(
      (key) => messages[locale][key] === messages.en[key] && !allowedSameAsEnglish.has(key),
    );
    if (sameAsEnglish.length) {
      addFinding({
        severity: "error",
        area: "messages",
        file: `messages/${locale}.json`,
        message: `Non-English locale has ${sameAsEnglish.length} values identical to English.`,
        evidence: sameAsEnglish.slice(0, 25).join(", "),
      });
    }
  }
}

function auditSourceHotspots() {
  const checks = [
    {
      file: "components/layout/TimezoneClocks.tsx",
      patterns: [/Часовые пояса/, /Восточное США/, /Центральное США/],
      message: "Timezone widget contains hardcoded Russian shell labels.",
      severity: "error",
    },
    {
      file: "components/layout/Sidebar.tsx",
      patterns: [/Tashkent\s+·\s+Presidential Administration/],
      message: "Desktop sidebar footer contains hardcoded English location text.",
      severity: "error",
    },
    {
      file: "components/layout/MobileSidebar.tsx",
      patterns: [/Tashkent\s+·\s+Presidential Administration/],
      message: "Mobile sidebar footer contains hardcoded English location text.",
      severity: "error",
    },
    {
      file: "components/layout/SearchCommand.tsx",
      patterns: [/Search dashboard/, /No results/, /Search dashboard pages, people, visits, agreements, and projects/],
      message: "Command palette contains hardcoded English labels or empty states.",
      severity: "error",
    },
    {
      file: "app/[locale]/sectors/page.tsx",
      patterns: [/Sector opportunities/, /Export sector brief/, /Where bilateral cooperation has the most leverage/],
      message: "Sectors page contains hardcoded English page copy.",
      severity: "error",
    },
    {
      file: "app/[locale]/benchmark/page.tsx",
      patterns: [/Regional benchmark/, /Export benchmark report/, /Comparative posture/],
      message: "Benchmark page contains hardcoded English page copy.",
      severity: "error",
    },
    {
      file: "components/investments/InvestmentsView.tsx",
      patterns: [/All sectors/, /All confidence/, /No projects/, /What this means/, /Source-backed privatization data required/],
      message: "Investment workspace contains hardcoded English controls, empty states, or drawer copy.",
      severity: "error",
    },
    {
      file: "components/trade/AdvancedTradeAnalysis.tsx",
      patterns: [/Advanced Trade Analysis/, /What this section preserves/, /"Open"/, /"Close"/],
      message: "Advanced trade disclosure contains hardcoded English UI copy.",
      severity: "error",
    },
    {
      file: "components/events/EventsView.tsx",
      patterns: [/const TODAY = new Date\("2026-04-21"\)/, /All/, /Export \.ics/, /Upcoming/, /Past/],
      message: "Events view contains hardcoded English controls and a stale fixed current-date constant.",
      severity: "error",
    },
    {
      file: "app/[locale]/admin/login/page.tsx",
      patterns: [/Admin sign-in/, /Password/, /Sign in/, /Incorrect password/],
      message: "Admin login page contains hardcoded English form copy.",
      severity: "error",
    },
  ];

  for (const check of checks) {
    const text = read(check.file);
    const hits = check.patterns.filter((pattern) => pattern.test(text)).map(String);
    if (hits.length) {
      addFinding({
        severity: check.severity,
        area: "source",
        file: check.file,
        message: check.message,
        evidence: hits.join(", "),
      });
    }
  }
}

async function auditRenderedRoutes() {
  if (!baseUrl) return;

  const routes = [
    "",
    "trade",
    "investments",
    "sectors",
    "map",
    "benchmark",
    "visits",
    "agreements",
    "events",
    "commitments",
    "compliance",
    "grants",
    "news",
    "prepare",
    "staff",
    "admin/login",
  ];

  const englishLeakPatterns = [
    "Executive brief",
    "Recommended next actions",
    "Quote-ready series",
    "Advanced Trade Analysis",
    "What this means",
    "All sectors",
    "No projects",
    "Sign in",
    "Password",
    "Registry",
    "Calendar",
  ];
  const russianShellPatterns = ["Часовые пояса", "Восточное США", "Центральное США", "Тихоокеанское США"];

  for (const locale of locales) {
    for (const route of routes) {
      const url = `${baseUrl}/${locale}${route ? `/${route}` : ""}`;
      let html = "";
      try {
        const response = await fetch(url, { redirect: "manual" });
        if (response.status < 200 || response.status >= 400) {
          addFinding({
            severity: "error",
            area: "rendered-route",
            file: url,
            message: `Route returned HTTP ${response.status}.`,
          });
          continue;
        }
        html = await response.text();
      } catch (error) {
        addFinding({
          severity: "error",
          area: "rendered-route",
          file: url,
          message: "Route fetch failed.",
          evidence: error instanceof Error ? error.message : String(error),
        });
        continue;
      }

      const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
      const ruHits = russianShellPatterns.filter((pattern) => visibleHtml.includes(pattern));
      if (locale !== "ru" && ruHits.length) {
        addFinding({
          severity: "error",
          area: "rendered-route",
          file: url,
          message: "Non-Russian locale renders Russian shell labels.",
          evidence: ruHits.join(", "),
        });
      }

      if (locale !== "en") {
        const enHits = englishLeakPatterns.filter((pattern) => visibleHtml.includes(pattern));
        if (enHits.length) {
          addFinding({
            severity: "error",
            area: "rendered-route",
            file: url,
            message: "Non-English locale renders English UI copy.",
            evidence: enHits.join(", "),
          });
        }
      }
    }
  }
}

function printSummary() {
  const errors = findings.filter((finding) => finding.severity === "error");
  const warnings = findings.filter((finding) => finding.severity !== "error");

  console.log(`i18n audit: ${errors.length} errors, ${warnings.length} warnings`);
  if (baseUrl) console.log(`Rendered route audit base: ${baseUrl}`);
  else console.log("Rendered route audit skipped. Set I18N_BASE_URL or pass --base-url=http://localhost:3000.");

  for (const finding of findings) {
    const prefix = finding.severity === "error" ? "ERROR" : "WARN";
    console.log(`\n${prefix} [${finding.area}] ${finding.file}`);
    console.log(`  ${finding.message}`);
    if (finding.evidence) console.log(`  Evidence: ${finding.evidence}`);
  }

  if (failOnFindings && errors.length) {
    process.exitCode = 1;
  }
}

auditMessageParity();
auditSourceHotspots();
await auditRenderedRoutes();
printSummary();
