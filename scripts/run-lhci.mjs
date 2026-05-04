import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { chromium } from "@playwright/test";

const chromePath = chromium.executablePath();

if (!existsSync(chromePath)) {
  console.error(`Playwright Chromium was not found at ${chromePath}.`);
  console.error("Run `pnpm exec playwright install chromium` before running `pnpm lhci`.");
  process.exit(1);
}

const command = process.platform === "win32" ? "cmd.exe" : "pnpm";
const args =
  process.platform === "win32"
    ? ["/d", "/s", "/c", "pnpm exec lhci autorun --config=lhci.config.cjs"]
    : ["exec", "lhci", "autorun", "--config=lhci.config.cjs"];

const child = spawn(command, args, {
  env: {
    ...process.env,
    CHROME_PATH: chromePath,
  },
  shell: false,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`LHCI exited because it received ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 1);
});
