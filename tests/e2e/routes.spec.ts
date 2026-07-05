import { expect, test } from "@playwright/test";

const locales = ["en", "ru", "uz-latn"];
// "brief", "commitments" and "prepare" resolve via redirects (goto follows
// them): /brief → /, /commitments → /roadmaps, /prepare → the login page.
const routes = [
  "",
  "brief",
  "overview",
  "trade",
  "visits",
  "prepare",
  "commitments",
  "roadmaps",
  "agreements",
  "map",
  "investments",
  "grants",
  "contacts",
  "compliance",
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

test("visit preparation is password-gated", async ({ page }) => {
  await page.goto("/en/prepare");

  await expect(page).toHaveURL(/\/en\/admin\/login\?from=%2Fen%2Fprepare/);
});

test("old commitments URL permanently redirects to roadmaps", async ({ page }) => {
  await page.goto("/ru/commitments");

  await expect(page).toHaveURL(/\/ru\/roadmaps/);
});

test("news section is removed", async ({ page }) => {
  const response = await page.goto("/en/news");

  expect(response?.status()).toBe(404);
});

test("roadmaps page renders both regional rollups", async ({ page }) => {
  await page.goto("/en/roadmaps");

  await expect(page.getByText("Samarqand viloyati").first()).toBeVisible();
  await expect(page.getByText("Xorazm viloyati").first()).toBeVisible();
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
