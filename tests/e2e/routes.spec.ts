import { expect, test } from "@playwright/test";

const locales = ["en", "uz-latn"];
// "brief", "commitments" and "prepare" resolve via redirects (goto follows
// them): /brief → /, /commitments → /roadmaps, /prepare → the login page.
const routes = [
  "",
  "brief",
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
  "sources",
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

  // Brief KPI band is server-rendered; the shell nav must stay present now
  // that the brief is an in-shell page rather than a fixed overlay.
  await expect(page.getByText("Trade turnover", { exact: false }).first()).toBeVisible();

  // Nav chrome differs by breakpoint: the persistent <aside> sidebar on desktop
  // (hidden lg:flex), and the hamburger menu trigger on mobile (lg:hidden).
  const isDesktop = (page.viewportSize()?.width ?? 1280) >= 1024;
  if (isDesktop) {
    await expect(page.locator("aside").first()).toBeVisible();
  } else {
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  }
});

test("executive home reveals supporting analysis without a duplicate overview page", async ({ page }) => {
  await page.goto("/en");

  const summary = page.locator("summary.brief-analysis-summary");
  await expect(summary).toBeVisible();
  await summary.click();
  await expect(page.locator("details.brief-analysis")).toHaveAttribute("open", "");
  await expect(page.getByText("Investment — leading sectors", { exact: true })).toBeVisible();
});

test("legacy overview URL permanently redirects to the executive home and preserves query context", async ({
  request,
}) => {
  const response = await request.get("/en/overview?period=2025&flow=exports", { maxRedirects: 0 });

  expect(response.status()).toBe(308);
  const redirectUrl = new URL(response.headers().location!, "http://localhost");
  expect(`${redirectUrl.pathname}${redirectUrl.search}`).toBe("/en?period=2025&flow=exports");
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
  await page.goto("/en/commitments");

  await expect(page).toHaveURL(/\/en\/roadmaps/);
});

test("control-room Today is password-gated", async ({ page }) => {
  await page.goto("/en/today");

  await expect(page).toHaveURL(/\/en\/admin\/login\?from=%2Fen%2Ftoday/);
});

test("authenticated control-room Today exposes the executive decision surface", async ({ page }) => {
  const password = process.env.E2E_ADMIN_PASSWORD;
  test.skip(!password, "Set E2E_ADMIN_PASSWORD to exercise the authenticated control room.");

  await page.goto("/en/today");
  await page.getByLabel("Password", { exact: true }).fill(password!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  await expect(page).toHaveURL(/\/en\/today/);
  await expect(page.getByRole("heading", { name: "Leadership attention", exact: true })).toBeVisible();
  await expect(page.getByText("Verified U.S. investment", { exact: true })).toBeVisible();
  await expect(page.getByText("Demo / source-needed", { exact: true })).toBeVisible();
});

test("Russian bookmarks permanently redirect to the equivalent Uzbek Latin route", async ({ request }) => {
  const response = await request.get("/ru/trade?period=2024&flow=exports", { maxRedirects: 0 });

  expect(response.status()).toBe(308);
  const location = response.headers().location;
  expect(location).toBeTruthy();
  const redirectUrl = new URL(location, "http://localhost");
  expect(`${redirectUrl.pathname}${redirectUrl.search}`).toBe("/uz-latn/trade?period=2024&flow=exports");
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

test("Uzbek source registry renders approved Uzbek metadata", async ({ page }) => {
  await page.goto("/uz-latn/sources");

  await expect(
    page.getByText("AQSh Aholini ro‘yxatga olish byurosining rasmiy balans jadvali.", { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByText("Official Census balance table.", { exact: false })).toHaveCount(0);
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
