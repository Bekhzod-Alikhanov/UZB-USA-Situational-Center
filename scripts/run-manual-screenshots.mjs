import { spawnSync } from "node:child_process";

const result = spawnSync("playwright", ["test", "tests/e2e/manual-screenshots.spec.ts", "--project=chromium"], {
  env: { ...process.env, MANUAL_SCREENSHOTS: "1" },
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
