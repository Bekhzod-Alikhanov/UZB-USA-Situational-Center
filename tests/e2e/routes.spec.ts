import { expect, test } from "@playwright/test";

const locales = ["en", "ru", "uz-latn"];
const routes = [
  "",
  "brief",
  "overview",
  "trade",
  "visits",
  "prepare",
  "commitments",
  "agreements",
  "map",
  "investments",
  "grants",
  "contacts",
  "compliance",
  "news",
  "benchmark",
  "admin/login",
];

test.describe("localized public routes", () => {
  for (const locale of locales) {
    for (const route of routes) {
      test(`/${locale}/${route || ""} renders`, async ({ page }) => {
        const response = await page.goto(`/${locale}${route ? `/${route}` : ""}`);

        expect(response?.status()).toBe(200);
        await expect(page.locator("body")).toBeVisible();
      });
    }
  }
});

test("landing page serves the executive brief inside the shell", async ({ page }) => {
  await page.goto("/en");

  // Brief KPI band is server-rendered; the sidebar must stay visible now
  // that the brief is an in-shell page rather than a fixed overlay.
  await expect(page.getByText("Trade turnover", { exact: false }).first()).toBeVisible();
  await expect(page.locator("aside").first()).toBeVisible();
});

test("overview keeps the working-dashboard layers behind progressive disclosure", async ({ page }) => {
  await page.goto("/en/overview");

  const summary = page.getByText("Situation read").first();
  await expect(summary).toBeVisible();
  await summary.click();
  await expect(page.getByText("Executive command center")).toBeVisible();
  await expect(page.getByText("Priority actions").first()).toBeVisible();
});

test("admin route redirects to login when unauthenticated", async ({ page }) => {
  await page.goto("/en/admin");

  await expect(page).toHaveURL(/\/en\/admin\/login/);
});

test("critical API routes preserve expected auth and fallback behavior", async ({ request }) => {
  await expect((await request.get("/api/live-data/health")).status()).toBe(200);
  await expect((await request.get("/api/data/trade/latest")).status()).toBe(200);
  await expect((await request.get("/api/data/macro/latest")).status()).toBe(200);
  await expect((await request.get("/api/data/assistance/latest")).status()).toBe(200);
  await expect((await request.get("/api/data/finance/latest")).status()).toBe(200);
  await expect((await request.get("/api/data/mobility/latest")).status()).toBe(200);
  await expect((await request.get("/api/admin/ingest/status")).status()).toBe(401);
  await expect((await request.get("/api/cron/ingest")).status()).toBe(401);
});
