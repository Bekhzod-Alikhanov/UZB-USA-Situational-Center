import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const publicRoutes = [
  "trade",
  "investments",
  "grants",
  "compliance",
  "benchmark",
  "visits",
  "agreements",
  "contacts",
  "roadmaps",
] as const;

describe("diplomatic editorial public route contract", () => {
  it("exposes one executive overview entry instead of duplicate brief destinations", async () => {
    const { NAV_GROUPS } = await import("@/lib/navigation");
    const executiveItems = NAV_GROUPS.find((group) => group.key === "executive")?.items ?? [];

    expect(executiveItems).toHaveLength(1);
    expect(executiveItems[0]).toMatchObject({ key: "overview", href: "" });
  });

  it("keeps legacy overview bookmarks as a permanent redirect to the executive home", () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), "app/[locale]/overview/page.tsx"), "utf8");

    expect(source).toContain("permanentRedirect");
    expect(source).toContain("searchParams");
  });

  it("keeps secondary executive analysis available through progressive disclosure", () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), "app/[locale]/page.tsx"), "utf8");

    expect(source).toContain("<details");
    expect(source).toContain('t("analysis.title")');
    expect(source).toContain('t("analysis.summary")');
  });

  it("opens directly on the briefing content without an autoplay ceremony", () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), "app/[locale]/page.tsx"), "utf8");

    expect(source).not.toContain("<BriefIntro");
    expect(source).not.toContain("dangerouslySetInnerHTML");
  });

  it("keeps the heavy cooperation globe hidden below the tablet breakpoint", () => {
    const globalStyles = fs.readFileSync(path.resolve(process.cwd(), "app/globals.css"), "utf8");

    expect(globalStyles).toMatch(/@media \(max-width: 767px\)[\s\S]*?\.brief-panel\.hidden[\s\S]*?display:\s*none/);
  });

  it("provides one shared executive-grade public page introduction", () => {
    expect(fs.existsSync(path.resolve(process.cwd(), "components/layout/PublicPageIntro.tsx"))).toBe(true);
  });

  it.each(publicRoutes)("uses the shared public page introduction on /%s", (route) => {
    const source = fs.readFileSync(path.resolve(process.cwd(), `app/[locale]/${route}/page.tsx`), "utf8");
    expect(source).toContain("<PublicPageIntro");
  });

  it("backs the shared public eyebrow with English and Uzbek Latin messages", () => {
    const en = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "messages/en.json"), "utf8"));
    const uz = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "messages/uz-latn.json"), "utf8"));
    expect(en.publicPage?.intelligenceBrief).toBeTruthy();
    expect(uz.publicPage?.intelligenceBrief).toBeTruthy();
  });

  it("localizes the executive analysis disclosure in both runtime languages", () => {
    const en = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "messages/en.json"), "utf8"));
    const uz = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "messages/uz-latn.json"), "utf8"));

    expect(en.brief?.analysis?.title).toBeTruthy();
    expect(en.brief?.analysis?.summary).toBeTruthy();
    expect(uz.brief?.analysis?.title).toBeTruthy();
    expect(uz.brief?.analysis?.summary).toBeTruthy();
  });

  it("summarizes roadmap attention without leaking source-original task titles", () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), "components/brief/AttentionList.tsx"), "utf8");
    const en = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "messages/en.json"), "utf8"));
    const uz = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "messages/uz-latn.json"), "utf8"));

    expect(source).not.toContain("roadmapStepTitle");
    expect(source).not.toContain("roadmapProjectTitle");
    expect(en.brief?.attention?.overdueCount).toBeTruthy();
    expect(uz.brief?.attention?.overdueCount).toBeTruthy();
  });

  it("uses presentation-legible numerals in shared header statistics", () => {
    const statSource = fs.readFileSync(path.resolve(process.cwd(), "components/ui/Stat.tsx"), "utf8");
    expect(statSource).toContain("text-[18px]");
  });

  it("keeps analytical card headings and icons legible at presentation distance", () => {
    const cardSource = fs.readFileSync(path.resolve(process.cwd(), "components/ui/Card.tsx"), "utf8");
    const globalStyles = fs.readFileSync(path.resolve(process.cwd(), "app/globals.css"), "utf8");
    expect(cardSource).toContain("text-[15px]");
    expect(globalStyles).toMatch(/\.icon-chip-sm\s*\{[\s\S]*?size-8/);
  });
});
