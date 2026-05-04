import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2] ? path.resolve(process.argv[2]) : null;

const forbidden = [
  { label: ".git history", test: (p) => p === ".git" || p.startsWith(".git/") },
  { label: "Next build output", test: (p) => p === ".next" || p.startsWith(".next/") },
  { label: "Vercel local metadata", test: (p) => p === ".vercel" || p.startsWith(".vercel/") },
  { label: "installed dependencies", test: (p) => p === "node_modules" || p.startsWith("node_modules/") },
  { label: "TypeScript build cache", test: (p) => p === "tsconfig.tsbuildinfo" },
  { label: "local Claude settings", test: (p) => p === ".claude/settings.local.json" },
  { label: "Lighthouse JSON output", test: (p) => /^lh-.*\.json$/i.test(path.basename(p)) },
  { label: "local server log", test: (p) => /^(dev-server|route-test-server).*\.(out|err)\.log$/i.test(path.basename(p)) },
];

function normalize(relPath) {
  return relPath.split(path.sep).join("/");
}

function classify(paths) {
  return paths
    .map((relPath) => {
      const normalized = normalize(relPath);
      const match = forbidden.find((rule) => rule.test(normalized));
      return match ? { path: normalized, label: match.label } : null;
    })
    .filter(Boolean);
}

function walk(dir, base = dir, output = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(base, fullPath);
    output.push(relPath);
    if (entry.isDirectory()) walk(fullPath, base, output);
  }
  return output;
}

function gitTrackedFiles() {
  try {
    return execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    console.warn("Could not read git tracked files; skipped tracked-file hygiene scan.");
    return null;
  }
}

if (target) {
  if (!fs.existsSync(target)) {
    console.error(`Package hygiene target does not exist: ${target}`);
    process.exit(1);
  }
  if (target.toLowerCase().endsWith(".zip")) {
    console.error("Zip inspection is intentionally not done in-place. Extract the archive to a temporary directory and pass that directory to this script.");
    process.exit(1);
  }
  const stats = fs.statSync(target);
  if (!stats.isDirectory()) {
    console.error(`Package hygiene target must be a directory: ${target}`);
    process.exit(1);
  }
  const bad = classify(walk(target));
  if (bad.length) {
    console.error("Deployment/package hygiene failed:");
    for (const item of bad) console.error(`- ${item.path} (${item.label})`);
    process.exit(1);
  }
  console.log(`Package hygiene passed for ${target}.`);
} else {
  const tracked = gitTrackedFiles();
  if (tracked) {
    const badTracked = classify(tracked);
    if (badTracked.length) {
      console.error("Repository hygiene failed. These forbidden artifacts are tracked:");
      for (const item of badTracked) console.error(`- ${item.path} (${item.label})`);
      process.exit(1);
    }
  }

  const lighthouseArtifacts = fs.readdirSync(root).filter((name) => /^lh-.*\.json$/i.test(name));
  const localSignals = [".next", ".vercel", "node_modules", "tsconfig.tsbuildinfo", ".claude/settings.local.json", "dev-server.out.log", "dev-server.err.log", "route-test-server.out.log", "route-test-server.err.log", ...lighthouseArtifacts]
    .filter((relPath) => fs.existsSync(path.join(root, relPath)));
  if (localSignals.length) {
    console.warn("Local/runtime artifacts are present. Keep them out of deployment packages:");
    for (const relPath of localSignals) console.warn(`- ${relPath}`);
  }
  console.log(tracked ? "Repository hygiene passed for tracked files." : "Package hygiene check completed with tracked-file scan skipped.");
}
