import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const releaseId = "legacy-2026-07-09";
const schemaVersion = 1;

const outputPaths = {
  manifest: "PRESERVATION_MANIFEST.json",
  inventory: "DATA_INVENTORY.md",
  demoRegistry: "DEMO_DATA_REGISTRY.md",
  visualizationLog: "VISUALIZATION_PRESERVATION_LOG.md",
};

const generatedMarkers = {
  inventory: {
    start: "<!-- BEGIN GENERATED PRESERVATION INVENTORY -->",
    end: "<!-- END GENERATED PRESERVATION INVENTORY -->",
  },
  demoRegistry: {
    start: "<!-- BEGIN GENERATED DEMO COVERAGE -->",
    end: "<!-- END GENERATED DEMO COVERAGE -->",
  },
  visualizationLog: {
    start: "<!-- BEGIN GENERATED VISUALIZATION MANIFEST -->",
    end: "<!-- END GENERATED VISUALIZATION MANIFEST -->",
  },
};

const ignoredDirectories = new Set([".git", ".next", ".vercel", "node_modules", "out", "build", "coverage"]);
const codeExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const curatedExhibits = new Map([
  [
    "components/investments/InvestmentsView.tsx",
    ["investment-stage-board", "investment-register-table", "investment-map", "privatization-pipeline"],
  ],
  ["components/sectors/SectorsView.tsx", ["sector-opportunity-matrix", "sector-analysis-cards"]],
  ["components/visits/VisitsTabs.tsx", ["visits-timeline", "visits-grid", "visits-calendar"]],
  ["components/agreements/AgreementsStats.tsx", ["agreements-statistics", "agreement-category-distribution"]],
  ["components/agreements/AgreementsTable.tsx", ["agreements-register"]],
  ["components/agreements/AgreementsTimeline.tsx", ["agreements-timeline"]],
  ["components/grants/GrantsView.tsx", ["grant-project-register-cards"]],
  [
    "components/grants/ForeignAssistanceView.tsx",
    ["assistance-annual-bars", "assistance-agency-table", "assistance-category-split"],
  ],
  ["components/roadmaps/RoadmapsExplorer.tsx", ["regional-roadmap-explorer", "roadmap-step-register"]],
  ["components/map/UsCenteredMap.tsx", ["us-footprint-map"]],
  ["components/benchmark/BenchmarkView.tsx", ["benchmark-analysis", "benchmark-table"]],
  ["components/brief/AttentionList.tsx", ["executive-attention-list"]],
  ["components/brief/RoadmapExecutionBar.tsx", ["executive-roadmap-summary"]],
  ["components/brief/VisitPanel.tsx", ["executive-visits-summary"]],
  [
    "components/overview/ExecutiveCommandCenter.tsx",
    ["executive-command-summary", "verified-metric-grid", "decision-queues"],
  ],
  ["components/overview/CounterpartsRank.tsx", ["counterparts-ranking"]],
  ["components/overview/Horizon.tsx", ["visits-events-horizon"]],
  ["components/overview/RiskRadar.tsx", ["risk-radar"]],
  ["components/overview/SectorsGrid.tsx", ["sector-summary-grid"]],
  ["components/overview/TodayDecisionStrip.tsx", ["today-decision-strip"]],
]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function rel(value) {
  return toPosix(path.relative(root, value));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableSort(value) {
  if (Array.isArray(value)) return value.map(stableSort);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, stableSort(value[key])]),
  );
}

function stableJson(value) {
  return JSON.stringify(stableSort(value));
}

function walk(directory, accept, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolutePath, accept, output);
    else if (accept(absolutePath)) output.push(absolutePath);
  }
  return output;
}

function sourceFileFor(relativePath) {
  const text = read(relativePath);
  const scriptKind = relativePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return { text, ast: ts.createSourceFile(relativePath, text, ts.ScriptTarget.Latest, true, scriptKind) };
}

function hasExportModifier(node) {
  return Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function propertyName(node) {
  const name = node.name;
  if (!name) return undefined;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function literalValue(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)) {
    const value = Number(node.operand.text);
    return node.operator === ts.SyntaxKind.MinusToken ? -value : value;
  }
  return undefined;
}

function objectField(node, fieldName) {
  if (!ts.isObjectLiteralExpression(node)) return undefined;
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property) || propertyName(property) !== fieldName) continue;
    return literalValue(property.initializer);
  }
  return undefined;
}

function directRowCount(node) {
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.filter((element) => ts.isObjectLiteralExpression(element)).length;
  }
  if (ts.isObjectLiteralExpression(node)) {
    return node.properties.reduce((total, property) => {
      if (!ts.isPropertyAssignment(property)) return total;
      return total + directRowCount(property.initializer);
    }, 0);
  }
  return 0;
}

function initializerKind(node) {
  if (ts.isArrayLiteralExpression(node)) return "array";
  if (ts.isObjectLiteralExpression(node)) return "object";
  if (ts.isCallExpression(node)) return "call";
  if (ts.isIdentifier(node)) return "alias";
  return ts.SyntaxKind[node.kind] ?? "unknown";
}

function exportedCollections(ast) {
  const collections = [];
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement) || !hasExportModifier(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
      collections.push({
        name: declaration.name.text,
        initializer: initializerKind(declaration.initializer),
        directRecords: directRowCount(declaration.initializer),
      });
    }
  }
  return collections.sort((a, b) => a.name.localeCompare(b.name));
}

function exportedNames(ast) {
  const names = new Set();
  for (const statement of ast.statements) {
    if (!hasExportModifier(statement)) continue;
    if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name) {
      names.add(statement.name.text);
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
      }
    }
    if (statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) names.add("default");
  }
  return [...names].sort();
}

function inspectAst(ast) {
  const stableIds = new Set();
  const sourceIds = new Set();
  const demo = { true: 0, false: 0 };
  const explicitConfidence = new Map();
  const localizedFields = new Set();
  let numericLiteralCount = 0;
  let numericLiteralSum = 0;

  function visit(node) {
    if (ts.isNumericLiteral(node)) {
      numericLiteralCount += 1;
      numericLiteralSum += Number(node.text);
    }
    if (ts.isPropertyAssignment(node)) {
      const name = propertyName(node);
      const value = literalValue(node.initializer);
      if (name === "id" && typeof value === "string") stableIds.add(value);
      if (name === "sourceId" && typeof value === "string") sourceIds.add(value);
      if (name === "sourceIds" && ts.isArrayLiteralExpression(node.initializer)) {
        for (const element of node.initializer.elements) {
          const sourceId = literalValue(element);
          if (typeof sourceId === "string") sourceIds.add(sourceId);
        }
      }
      if (name === "is_demo" && typeof value === "boolean") demo[String(value)] += 1;
      if (["confidence", "sourceConfidence", "riskLevel", "visibility"].includes(name) && typeof value === "string") {
        explicitConfidence.set(value, (explicitConfidence.get(value) ?? 0) + 1);
      }
      if (name && (/_((en)|(uz)|(uz_latn)|(ru))$/i.test(name) || name === "uz-latn")) localizedFields.add(name);
    }
    ts.forEachChild(node, visit);
  }

  visit(ast);
  return {
    stableIds: [...stableIds].sort(),
    sourceIds: [...sourceIds].sort(),
    demo,
    explicitConfidence: Object.fromEntries([...explicitConfidence.entries()].sort(([a], [b]) => a.localeCompare(b))),
    localizedFields: [...localizedFields].sort(),
    numericLiteralCount,
    numericLiteralSum: Number(numericLiteralSum.toFixed(6)),
  };
}

function extractImports(text) {
  const imports = new Set();
  for (const match of text.matchAll(/(?:from\s+|import\s*)["']([^"']+)["']/g)) imports.add(match[1]);
  for (const match of text.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)) imports.add(match[1]);
  return [...imports];
}

function resolveImport(importer, specifier, fileSet) {
  if (!specifier.startsWith("@/") && !specifier.startsWith(".")) return undefined;
  const base = specifier.startsWith("@/")
    ? path.join(root, specifier.slice(2))
    : path.resolve(path.dirname(path.join(root, importer)), specifier);
  const candidates = [
    base,
    ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].map((extension) => `${base}${extension}`),
    ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].map((extension) => path.join(base, `index${extension}`)),
  ].map((candidate) => rel(candidate));
  return candidates.find((candidate) => fileSet.has(candidate));
}

function buildDependencyGraph() {
  const files = walk(root, (absolutePath) => codeExtensions.has(path.extname(absolutePath))).map(rel);
  const fileSet = new Set(files);
  const forward = new Map(files.map((file) => [file, new Set()]));
  const reverse = new Map(files.map((file) => [file, new Set()]));

  for (const importer of files) {
    for (const specifier of extractImports(read(importer))) {
      const imported = resolveImport(importer, specifier, fileSet);
      if (!imported) continue;
      forward.get(importer).add(imported);
      reverse.get(imported).add(importer);
    }
  }
  return { files, forward, reverse };
}

function reachable(start, graph, predicate) {
  const found = new Set();
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    for (const next of graph.get(current) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      if (predicate(next)) found.add(next);
      queue.push(next);
    }
  }
  return [...found].sort();
}

function currentRoutes(file, reverse) {
  return reachable(file, reverse, (candidate) => /^app\/.+\/page\.(t|j)sx?$/.test(candidate)).map((page) => {
    const route = page
      .replace(/^app\//, "/")
      .replace(/\/page\.(t|j)sx?$/, "")
      .replace(/\[locale\]/, "[locale]");
    return route || "/";
  });
}

function dataDependencies(file, forward) {
  const directOrTransitive = reachable(file, forward, (candidate) => /^data\/[^/]+\.ts$/.test(candidate));
  for (const direct of forward.get(file) ?? []) {
    if (/^data\/[^/]+\.ts$/.test(direct)) directOrTransitive.push(direct);
  }
  return [...new Set(directOrTransitive)].sort();
}

function sourceArtifacts(sourceAst, dataModules) {
  let sourcesInitializer;
  for (const statement of sourceAst.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === "sources")
        sourcesInitializer = declaration.initializer;
    }
  }
  if (!sourcesInitializer || !ts.isArrayLiteralExpression(sourcesInitializer)) return [];

  return sourcesInitializer.elements
    .filter(ts.isObjectLiteralExpression)
    .map((entry) => {
      const id = objectField(entry, "id");
      if (typeof id !== "string") return undefined;
      return {
        id,
        level: objectField(entry, "level") ?? "unknown",
        locator: objectField(entry, "url") ?? objectField(entry, "sourceFile") ?? "not_recorded",
        contentHash: sha256(entry.getText(sourceAst)),
        consumingDataModules: dataModules
          .filter((module) => module.sourceIds.includes(id))
          .map((module) => module.path),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function visualTarget(file) {
  if (file.includes("/overview/")) return "/[locale]";
  if (file.includes("/sectors/")) return "/[locale]/investments#sector-analysis";
  if (file.includes("/trade/") || file.includes("/charts/Trade") || file.includes("BriefTrade")) {
    if (/Advanced|Comtrade|Hs2|Hs6|Trademap|Services|StructureTreemap/.test(file))
      return "/[locale]/trade#advanced-analysis";
    return "/[locale]/trade";
  }
  if (file.includes("/investments/")) return "/[locale]/investments";
  if (file.includes("/map/")) return "/[locale]/map";
  if (file.includes("/benchmark/")) return "/[locale]/benchmark";
  if (file.includes("/agreements/")) return "/[locale]/agreements";
  if (file.includes("/visits/") || file.includes("VisitPanel")) return "/[locale]/visits";
  if (file.includes("/grants/") || file.includes("ForeignAssistance")) return "/[locale]/grants";
  if (file.includes("/roadmaps/") || file.includes("Roadmap")) return "/[locale]/roadmaps";
  if (file.includes("/brief/")) return "/[locale]";
  return "owner_review_required";
}

function decisionQuestion(file) {
  if (/trade|Trade|Hs2|Hs6|Comtrade|Trademap|Services/.test(file))
    return "How are bilateral trade flows changing, and which products or methods explain the movement?";
  if (/investment/i.test(file))
    return "Which opportunities are verified, material, geographically relevant, and actionable?";
  if (/visit/i.test(file)) return "What is the bilateral engagement sequence and what requires preparation?";
  if (/roadmap/i.test(file)) return "Which delivery steps are complete, due, blocked, or overdue?";
  if (/agreement/i.test(file)) return "What is the legal base, its composition, and its chronology?";
  if (/grant|assistance/i.test(file))
    return "How much assistance is recorded, by programme, agency, category, and year?";
  if (/benchmark/i.test(file)) return "How does Uzbekistan compare with relevant regional peers?";
  if (/map|globe/i.test(file)) return "Where are bilateral ties, activities, and opportunities concentrated?";
  return "What executive signal does this exhibit preserve?";
}

function isVisualization(file, text) {
  if (!file.startsWith("components/") || !file.endsWith(".tsx")) return false;
  if (curatedExhibits.has(file)) return true;
  const scope =
    /components\/(brief|charts|trade|investments|map|benchmark|agreements|visits|grants|roadmaps|overview|sectors)\//.test(
      file,
    );
  const visualSignal =
    /(Chart|Map|Timeline|Table|Treemap|Globe|Donut|Sparkline|MiniBars|Progress|recharts|maplibre|<svg|<canvas)/.test(
      `${file}\n${text}`,
    );
  return scope && visualSignal;
}

function visualizationEntries(graph) {
  return graph.files
    .filter((file) => isVisualization(file, read(file)))
    .map((file) => {
      const { text, ast } = sourceFileFor(file);
      const inputs = dataDependencies(file, graph.forward);
      const heavy = /(recharts|maplibre|globe\.gl|@visx|three)/.test(text);
      const lazy = /(dynamic\(|React\.lazy|lazy\(|Suspense)/.test(text);
      const sourceTreatment = /(SourceBadge|ConfidenceBadge|DemoBadge|DemoBanner)/.test(text)
        ? "visible-treatment-detected"
        : inputs.length
          ? "manual-review-required"
          : "not-applicable-or-manual-review";
      const bilingual = /(useTranslations|getTranslations|intlLocale|\blocale\b)/.test(text)
        ? "locale-contract-detected"
        : "manual-review-required";
      const accessibility = /(<table|<caption|aria-label|aria-labelledby|sr-only|role=["']img["'])/.test(text)
        ? "text-or-semantic-equivalent-detected"
        : "manual-review-required";
      const exported = exportedNames(ast);
      const exhibitNames =
        curatedExhibits.get(file) ?? (exported.length > 1 ? exported.filter((name) => name !== "default") : exported);
      const fallbackExhibitName = path
        .basename(file, ".tsx")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase();
      const exhibits = (exhibitNames.length ? exhibitNames : [fallbackExhibitName]).map((name) => ({
        id: `visual:${file.replace(/\.tsx$/, "")}#${name}`,
        name,
        parityApproval: "pending-owner-review",
        recommendation: "keep-pending-parity-review",
      }));
      const currentProblems = [
        accessibility === "manual-review-required" ? "accessible-equivalent-review" : undefined,
        bilingual === "manual-review-required" ? "bilingual-label-review" : undefined,
        sourceTreatment === "manual-review-required" ? "source-confidence-treatment-review" : undefined,
        heavy && !lazy ? "eager-heavy-runtime-review" : undefined,
      ].filter(Boolean);
      return {
        id: `visual:${file.replace(/\.tsx$/, "")}`,
        currentComponent: file,
        exports: exported,
        exhibits,
        dataInputs: inputs,
        decisionQuestion: decisionQuestion(file),
        valueProvided: decisionQuestion(file),
        currentProblem: currentProblems.length ? currentProblems.join(", ") : "no-static-blocker-detected",
        whatRemainsPreserved:
          "Component implementation, typed data relationships, current route access, and visible source/demo treatment.",
        migrationRisk: currentProblems.length ? "medium-owner-review-required" : "low-static-review",
        confidenceLevel: "medium-static-analysis",
        audience: file.includes("/brief/") ? ["executive", "public"] : ["executive", "analyst"],
        currentRoutes: currentRoutes(file, graph.reverse),
        targetV2Location: visualTarget(file),
        sourceConfidenceTreatment: sourceTreatment,
        bilingualLabels: bilingual,
        accessibleEquivalent: accessibility,
        performanceStrategy: lazy
          ? "lazy-or-dynamic-detected"
          : heavy
            ? "eager-heavy-runtime-review"
            : "standard-bundle",
        parityApproval: "pending-owner-review",
        recommendation: "keep-pending-parity-review",
        contentHash: sha256(text),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function buildManifest() {
  const graph = buildDependencyGraph();
  const dataFiles = walk(path.join(root, "data"), (absolutePath) => absolutePath.endsWith(".ts"));
  const dataModules = dataFiles.map((absolutePath) => {
    const pathName = rel(absolutePath);
    const { text, ast } = sourceFileFor(pathName);
    const inspection = inspectAst(ast);
    const exports = exportedCollections(ast);
    const recordCount = exports.reduce((total, entry) => total + entry.directRecords, 0);
    return {
      id: `dataset:${pathName.replace(/^data\//, "").replace(/\.ts$/, "")}`,
      path: pathName,
      contentHash: sha256(text),
      bytes: Buffer.byteLength(text),
      lines: text.split(/\r?\n/).length,
      recordCount,
      explicitStableIds: inspection.stableIds,
      recordsWithoutExplicitStableId: Math.max(recordCount - inspection.stableIds.length, 0),
      exports,
      sourceIds: inspection.sourceIds,
      confidence: {
        isDemoTrue: inspection.demo.true,
        isDemoFalse: inspection.demo.false,
        explicitLabels: inspection.explicitConfidence,
      },
      localizedFields: inspection.localizedFields,
      numericChecksum: {
        literalCount: inspection.numericLiteralCount,
        literalSum: inspection.numericLiteralSum,
      },
      consumingRoutes: currentRoutes(pathName, graph.reverse),
    };
  });
  const sourceAst = sourceFileFor("data/sources.ts").ast;
  const sources = sourceArtifacts(sourceAst, dataModules);
  const visualizations = visualizationEntries(graph);

  const body = {
    schemaVersion,
    releaseId,
    generatedBy: "scripts/generate-preservation-manifest.mjs",
    policy: {
      dataTreatment: "inventory-only-no-records-deleted-or-reclassified",
      demoTreatment: "demo-records-remain-preserved-and-must-not-enter-verified-headlines",
      visualizationTreatment: "keep-pending-owner-approved-parity-review",
      hashAlgorithm: "sha256",
      deterministic: true,
    },
    summary: {
      dataModules: dataModules.length,
      syntacticallyCountedRecords: dataModules.reduce((total, module) => total + module.recordCount, 0),
      explicitStableIds: dataModules.reduce((total, module) => total + module.explicitStableIds.length, 0),
      recordsWithoutExplicitStableId: dataModules.reduce(
        (total, module) => total + module.recordsWithoutExplicitStableId,
        0,
      ),
      sourceArtifacts: sources.length,
      sourceReferences: dataModules.reduce((total, module) => total + module.sourceIds.length, 0),
      demoFlagsTrue: dataModules.reduce((total, module) => total + module.confidence.isDemoTrue, 0),
      demoFlagsFalse: dataModules.reduce((total, module) => total + module.confidence.isDemoFalse, 0),
      visualizationComponents: visualizations.length,
      visualizationExhibits: visualizations.reduce((total, entry) => total + entry.exhibits.length, 0),
      visualizationParityApproved: visualizations.reduce(
        (total, entry) => total + entry.exhibits.filter((exhibit) => exhibit.parityApproval === "approved").length,
        0,
      ),
    },
    dataModules,
    sources,
    visualizations,
  };
  return { ...body, integrity: { algorithm: "sha256", contentHash: sha256(stableJson(body)) } };
}

function markdownCell(value) {
  return String(value ?? "—")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ");
}

function shortHash(value) {
  return value.slice(0, 12);
}

function inventorySection(manifest) {
  const rows = manifest.dataModules.map(
    (module) =>
      `| ${[
        `\`${module.path}\``,
        module.recordCount,
        module.explicitStableIds.length,
        module.recordsWithoutExplicitStableId,
        module.sourceIds.length,
        module.confidence.isDemoTrue,
        shortHash(module.contentHash),
        module.consumingRoutes.map((route) => `\`${route}\``).join(", ") || "No rendered route detected",
      ]
        .map(markdownCell)
        .join(" | ")} |`,
  );
  return [
    generatedMarkers.inventory.start,
    "## Machine-checkable preservation snapshot",
    "",
    `Immutable baseline: \`${manifest.releaseId}\` · Manifest integrity: \`${shortHash(manifest.integrity.contentHash)}\` · Deterministic record count: **${manifest.summary.syntacticallyCountedRecords}** across **${manifest.summary.dataModules}** typed modules.`,
    "",
    "> Counts are syntax-derived and intentionally conservative. `Records without explicit ID` is a migration gap, not permission to drop a row. Every module remains protected by its full SHA-256 content hash and numeric-literal checksum in `PRESERVATION_MANIFEST.json`.",
    "",
    "| Module | Records | Explicit IDs | Records without explicit ID | Source IDs | Demo flags | SHA-256 | Consuming routes |",
    "| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |",
    ...rows,
    "",
    generatedMarkers.inventory.end,
  ].join("\n");
}

function demoSection(manifest) {
  const rows = manifest.dataModules
    .filter(
      (module) =>
        module.confidence.isDemoTrue ||
        module.confidence.isDemoFalse ||
        Object.keys(module.confidence.explicitLabels).length,
    )
    .map((module) => {
      const labels = Object.entries(module.confidence.explicitLabels)
        .map(([label, count]) => `${label}: ${count}`)
        .join(", ");
      return `| ${[
        `\`${module.path}\``,
        module.confidence.isDemoTrue,
        module.confidence.isDemoFalse,
        labels || "No explicit labels",
        module.sourceIds.length,
        shortHash(module.contentHash),
      ]
        .map(markdownCell)
        .join(" | ")} |`;
    });
  return [
    generatedMarkers.demoRegistry.start,
    "## Generated demo and confidence coverage",
    "",
    `Baseline \`${manifest.releaseId}\` contains **${manifest.summary.demoFlagsTrue}** explicit \`is_demo: true\` flags and **${manifest.summary.demoFlagsFalse}** explicit \`is_demo: false\` flags. These counts include nested workflow rows and metadata so that hidden demo content cannot silently disappear from governance review.`,
    "",
    "| Module | Demo true | Demo false | Explicit confidence / visibility labels | Source IDs | SHA-256 |",
    "| --- | ---: | ---: | --- | ---: | --- |",
    ...rows,
    "",
    "> This generated coverage supplements the owner/status registry above. It does not upgrade confidence, validate a claim, or authorize a demo row for official totals.",
    "",
    generatedMarkers.demoRegistry.end,
  ].join("\n");
}

function visualizationSection(manifest) {
  const rows = manifest.visualizations.map(
    (entry) =>
      `| ${[
        `\`${entry.currentComponent}\``,
        entry.exhibits.map((exhibit) => `\`${exhibit.name}\``).join(", "),
        entry.exports.map((name) => `\`${name}\``).join(", ") || "Default/local export",
        entry.dataInputs.map((input) => `\`${input}\``).join(", ") || "No typed data import detected",
        entry.currentRoutes.map((route) => `\`${route}\``).join(", ") || "No rendered route detected",
        `\`${entry.targetV2Location}\``,
        entry.accessibleEquivalent,
        entry.bilingualLabels,
        entry.performanceStrategy,
        entry.sourceConfidenceTreatment,
        entry.parityApproval,
      ]
        .map(markdownCell)
        .join(" | ")} |`,
  );
  return [
    generatedMarkers.visualizationLog.start,
    "## Machine-checkable visualization manifest",
    "",
    `Baseline \`${manifest.releaseId}\` preserves **${manifest.summary.visualizationExhibits}** exhibits across **${manifest.summary.visualizationComponents}** detected component files. Deletion is not authorized by this inventory; every item remains \`pending-owner-review\` until data, bilingual, accessibility, performance, and visual parity are approved.`,
    "",
    "| Current component | Exhibit(s) | Export(s) | Data inputs | Current route(s) | Target V2 location | Accessible equivalent | Bilingual contract | Performance | Source/confidence | Parity |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "> Decision question, audience, content hash, and recommendation are recorded per exhibit in `PRESERVATION_MANIFEST.json`. A static detector result of `manual-review-required` is a release gate, not evidence that an equivalent is absent.",
    "",
    generatedMarkers.visualizationLog.end,
  ].join("\n");
}

function withGeneratedSection(existing, section, markers) {
  const startIndex = existing.indexOf(markers.start);
  const endIndex = existing.indexOf(markers.end);
  if (startIndex === -1 && endIndex === -1) return `${existing.trimEnd()}\n\n${section}\n`;
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`Malformed generated section markers: ${markers.start}`);
  }
  const endBoundary = endIndex + markers.end.length;
  return `${existing.slice(0, startIndex).trimEnd()}\n\n${section}${existing.slice(endBoundary)}`.trimEnd() + "\n";
}

async function buildOutputs() {
  const manifest = buildManifest();
  const prettierConfig = JSON.parse(read(".prettierrc.json"));
  const inventory = withGeneratedSection(
    read(outputPaths.inventory),
    inventorySection(manifest),
    generatedMarkers.inventory,
  );
  const demoRegistry = withGeneratedSection(
    read(outputPaths.demoRegistry),
    demoSection(manifest),
    generatedMarkers.demoRegistry,
  );
  const visualizationLog = withGeneratedSection(
    read(outputPaths.visualizationLog),
    visualizationSection(manifest),
    generatedMarkers.visualizationLog,
  );
  return {
    [outputPaths.manifest]: await prettier.format(JSON.stringify(manifest), {
      ...prettierConfig,
      parser: "json",
    }),
    [outputPaths.inventory]: await prettier.format(inventory, { ...prettierConfig, parser: "markdown" }),
    [outputPaths.demoRegistry]: await prettier.format(demoRegistry, { ...prettierConfig, parser: "markdown" }),
    [outputPaths.visualizationLog]: await prettier.format(visualizationLog, {
      ...prettierConfig,
      parser: "markdown",
    }),
  };
}

async function main() {
  const outputs = await buildOutputs();
  const stageArgument = process.argv.find((argument) => argument.startsWith("--stage-dir="));
  if (stageArgument) {
    const stageDirectory = path.resolve(stageArgument.slice("--stage-dir=".length));
    fs.mkdirSync(stageDirectory, { recursive: true });
    for (const [relativePath, content] of Object.entries(outputs)) {
      fs.writeFileSync(path.join(stageDirectory, relativePath), content, "utf8");
    }
    console.log(`Staged ${Object.keys(outputs).length} preservation artifacts for ${releaseId}.`);
    return;
  }
  if (process.argv.includes("--print")) {
    process.stdout.write(JSON.stringify(outputs));
    return;
  }
  if (process.argv.includes("--write")) {
    for (const [relativePath, content] of Object.entries(outputs)) {
      fs.writeFileSync(path.join(root, relativePath), content, "utf8");
    }
    console.log(`Wrote ${Object.keys(outputs).length} preservation artifacts for ${releaseId}.`);
    return;
  }

  const stale = [];
  for (const [relativePath, expected] of Object.entries(outputs)) {
    const absolutePath = path.join(root, relativePath);
    const current = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : undefined;
    if (current !== expected) stale.push(relativePath);
  }
  if (stale.length) {
    console.error(`Preservation artifacts are stale or missing: ${stale.join(", ")}`);
    console.error("Run: node scripts/generate-preservation-manifest.mjs --write");
    process.exit(1);
  }
  console.log(`Preservation artifacts match ${releaseId}; ${Object.keys(outputs).length} files verified.`);
}

await main();
