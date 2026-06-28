import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.AUDIT_BASE_URL ?? "http://localhost:3000";
const auditBase = "C:/Users/behzo/Downloads/US-UZB Dashboard/docs/audits/platform-improvements-2026-06-27";
const screenshotDir = path.join(auditBase, "screenshots");

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2_000);
    try {
      const response = await fetch(`${baseUrl}/en`, { signal: controller.signal });
      clearTimeout(timer);
      if (response.ok) return;
    } catch {
      clearTimeout(timer);
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error("Timed out waiting for local dev server.");
}

await fs.mkdir(screenshotDir, { recursive: true });
await waitForServer();

const browser = await chromium.launch({ headless: true });
const captures = [];

async function capture(name, route, options = {}) {
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    locale: options.locale || "en-GB",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  const startedAt = Date.now();
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.locator("main").waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(options.waitMs || 1_200);
  if (options.action) await options.action(page);
  await page.waitForTimeout(700);

  const file = path.join(screenshotDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  captures.push({
    name,
    route,
    file,
    title: await page.title(),
    finalUrl: page.url(),
    durationMs: Date.now() - startedAt,
    consoleErrors: errors.slice(0, 8),
  });
  await context.close();
}

await capture("01-overview-desktop", "/en");
await capture("02-overview-source-readiness", "/en", {
  action: async (page) => {
    await page.getByText("Source confidence and freshness", { exact: false }).scrollIntoViewIfNeeded();
  },
});
await capture("03-trade-desktop", "/en/trade");
await capture("04-investments-desktop", "/en/investments");
await capture("05-map-load-gate", "/en/map");
await capture("06-mobile-menu", "/en", {
  viewport: { width: 390, height: 844 },
  action: async (page) => {
    await page.getByLabel("Open menu").click();
  },
});
await capture("07-mobile-overview", "/en", {
  viewport: { width: 390, height: 844 },
});
await capture("08-russian-overview", "/ru", {
  locale: "ru-RU",
});

await browser.close();
await fs.writeFile(path.join(auditBase, "capture-results.json"), `${JSON.stringify(captures, null, 2)}\n`);
console.log(JSON.stringify(captures, null, 2));
