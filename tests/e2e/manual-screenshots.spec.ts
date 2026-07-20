import { devices, expect, test } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.join("test-results", "manual-screenshots");
const routes: Array<[string, string]> = [
  ["en", ""],
  ["uz-latn", ""],
  ["en", "trade"],
  ["uz-latn", "trade"],
  ["en", "investments"],
  ["uz-latn", "investments"],
  ["en", "map"],
  ["uz-latn", "map"],
  ["en", "benchmark"],
  ["uz-latn", "benchmark"],
];

const viewports = {
  desktop: { viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  mobile: devices["Pixel 7"],
};

function fileName(locale: string, route: string, viewportName: string) {
  const routeName = route ? route.replace(/\//g, "-") : "overview";
  return `${locale}-${routeName}-${viewportName}.png`;
}

test("capture manual desktop and mobile screenshots", async ({ browser, baseURL }) => {
  test.skip(process.env.MANUAL_SCREENSHOTS !== "1", "Run through `pnpm screenshots:manual`.");
  test.setTimeout(240_000);
  await fs.mkdir(outDir, { recursive: true });

  const results: Array<{
    status: "captured" | "failed";
    viewport: string;
    route: string;
    file: string;
    httpStatus?: number;
    error?: string;
    ms: number;
  }> = [];

  for (const [viewportName, contextOptions] of Object.entries(viewports)) {
    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    for (const [locale, route] of routes) {
      const startedAt = Date.now();
      const routePath = `/${locale}${route ? `/${route}` : ""}`;
      const target = path.join(outDir, fileName(locale, route, viewportName));

      try {
        const response = await page.goto(routePath, { waitUntil: "domcontentloaded", timeout: 60_000 });
        await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => undefined);
        await page.screenshot({ path: target, fullPage: true });
        results.push({
          status: "captured",
          viewport: viewportName,
          route: routePath,
          file: target,
          httpStatus: response?.status(),
          ms: Date.now() - startedAt,
        });
      } catch (error) {
        results.push({
          status: "failed",
          viewport: viewportName,
          route: routePath,
          file: target,
          error: error instanceof Error ? error.message : String(error),
          ms: Date.now() - startedAt,
        });
      }
    }

    await context.close();
  }

  const captured = results.filter((item) => item.status === "captured").length;
  const failed = results.filter((item) => item.status === "failed");
  const note = [
    "# Manual Screenshot QA",
    "",
    `Base URL: ${baseURL ?? "playwright baseURL"}`,
    `Generated: ${new Date().toISOString()}`,
    `Captured: ${captured}/${results.length}`,
    "",
    "## Pages Checked",
    "",
    ...results.map((item) => {
      const suffix =
        item.status === "captured"
          ? `captured ${item.file} (${item.httpStatus ?? "unknown"}, ${item.ms}ms)`
          : `FAILED (${item.ms}ms): ${item.error}`;
      return `- ${item.route} ${item.viewport}: ${suffix}`;
    }),
    "",
    "## QA Notes",
    "",
    failed.length
      ? "Some screenshots failed to capture. Review the failed rows above before preview deployment."
      : "All requested desktop and mobile screenshots captured. Review the PNGs for locale copy, clipping, filter rows, chart/table width, and map rendering.",
    "",
  ].join("\n");

  await fs.writeFile(path.join(outDir, "QA-NOTES.md"), note, "utf8");
  expect(failed, note).toHaveLength(0);
});
