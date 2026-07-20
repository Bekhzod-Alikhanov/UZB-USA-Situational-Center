import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/en", name: "brief home" },
  { path: "/en/trade", name: "trade" },
  { path: "/en/roadmaps", name: "roadmaps" },
  { path: "/en/benchmark", name: "benchmark" },
  { path: "/en/sources", name: "sources (English)" },
  { path: "/uz-latn/sources", name: "sources (Uzbek Latin)" },
  { path: "/en/admin/login", name: "admin login" },
];

for (const pageSpec of pages) {
  test(`${pageSpec.name} has no critical axe violations`, async ({ page }) => {
    await page.goto(pageSpec.path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const critical = results.violations.filter((violation) => violation.impact === "critical");
    const serious = results.violations.filter((violation) => violation.impact === "serious");

    if (serious.length) {
      console.warn(
        `${pageSpec.path} serious axe findings: ${serious
          .map((violation) => `${violation.id} (${violation.nodes.length})`)
          .join(", ")}`,
      );
    }

    expect(critical).toEqual([]);
  });
}

for (const locale of ["en", "uz-latn"] as const) {
  test(`authenticated Today (${locale}) has no serious or critical axe violations`, async ({ page }) => {
    const password = process.env.E2E_ADMIN_PASSWORD;
    test.skip(!password, "Set E2E_ADMIN_PASSWORD to exercise the authenticated control room.");

    await page.goto(`/${locale}/today`);
    const passwordLabel = locale === "en" ? "Password" : "Parol";
    const submitLabel = locale === "en" ? "Sign in" : "Kirish";
    await page.getByLabel(passwordLabel, { exact: true }).fill(password!);
    await page.getByRole("button", { name: submitLabel, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/today`));

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );

    expect(blocking).toEqual([]);
  });
}
