import { describe, expect, it } from "vitest";
import {
  yoyPct,
  upcomingHorizon,
  attentionRows,
  commitmentsAvgProgress,
  investmentHighlights,
  parseDay,
} from "@/components/brief/brief-data";
import { buildBriefGlobeData, resolveRegion } from "@/components/brief/geo";
import { tradeAnnualUz } from "@/data/trade";

describe("brief-data", () => {
  it("parses date-only strings as local dates (no UTC day shift)", () => {
    const d = parseDay("2026-07-08");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 6, 8]);
    expect(d.getHours()).toBe(0);
  });

  it("computes YoY from the last two annual entries (2025 vs 2024)", () => {
    expect(yoyPct(tradeAnnualUz)).toBeCloseTo(-2.04, 1);
  });

  it("widens the horizon window when fewer than 3 items fall inside it", () => {
    const items = upcomingHorizon(new Date("2026-07-02"), 30);
    expect(items.length).toBeGreaterThanOrEqual(3);
    // Only the Tashkent pipeline (2026-07-08) is inside the literal window.
    expect(items[0].id).toBe("visit-pipeline-tashkent-2026");
    expect(items[0].beyondWindow).toBe(false);
    expect(items.slice(1).every((i) => i.beyondWindow)).toBe(true);
    // Dates stay sorted ascending.
    const dates = items.map((i) => i.date);
    expect([...dates].sort()).toEqual(dates);
  });

  it("returns overdue commitments before watch items", () => {
    const rows = attentionRows(3);
    expect(rows[0].status).toBe("overdue");
    expect(rows.every((r) => r.status === "overdue" || r.status === "watch")).toBe(true);
    expect(rows).toHaveLength(3);
  });

  it("averages commitment progress to a whole percentage", () => {
    const avg = commitmentsAvgProgress();
    expect(Number.isInteger(avg)).toBe(true);
    expect(avg).toBeGreaterThan(0);
    expect(avg).toBeLessThanOrEqual(100);
  });

  it("ranks real-portfolio sectors by disclosed value", () => {
    const top = investmentHighlights(3);
    expect(top.map((s) => s.sector)).toEqual(["finance", "energy", "mining-metals"]);
    expect(top[0].valueMusd).toBe(2000);
  });
});

describe("brief geo", () => {
  it("never resolves unconfirmed regions to a city", () => {
    expect(resolveRegion("To be confirmed")).toBeNull();
    expect(resolveRegion("Multi-region (working group)")).toBeNull();
    expect(resolveRegion("Kashkadarya")).toBe("qarshi");
  });

  it("excludes every demo entity when hideDemo is on", () => {
    const data = buildBriefGlobeData(true);
    expect(data.points.some((p) => p.isDemo)).toBe(false);
    expect(data.arcs.some((a) => a.isDemo)).toBe(false);
    expect(data.rings).toHaveLength(0);
  });

  it("carries demo pipeline arcs (flagged) when hideDemo is off", () => {
    const data = buildBriefGlobeData(false);
    expect(data.arcs.filter((a) => a.kind === "pipeline").every((a) => a.isDemo)).toBe(true);
    expect(data.arcs.some((a) => a.isDemo)).toBe(true);
    // Inbound US→UZ pipeline renders as a Tashkent pulse, not an invented arc.
    expect(data.rings).toHaveLength(1);
  });

  it("maps the 8 real visit arcs to the DC and NY corridors", () => {
    const visitArcs = buildBriefGlobeData(true).arcs.filter((a) => a.kind === "visit");
    expect(visitArcs).toHaveLength(8);
    expect(visitArcs.filter((a) => a.corridor === "dc")).toHaveLength(6);
    expect(visitArcs.filter((a) => a.corridor === "ny")).toHaveLength(2);
  });

  it("counts real incoming US→UZ visits for the hub tooltip", () => {
    expect(buildBriefGlobeData(true).incomingVisits).toBe(6);
  });
});
