import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/en", name: "brief home" },
  { path: "/en/overview", name: "overview" },
  { path: "/en/trade", name: "trade" },
  { path: "/en/benchmark", name: "benchmark" },
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
