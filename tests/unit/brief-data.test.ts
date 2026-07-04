import { describe, expect, it } from "vitest";
import { yoyPct, upcomingHorizon, investmentHighlights, parseDay, daysUntil } from "@/components/brief/brief-data";
import { buildBriefGlobeData, resolveRegion } from "@/components/brief/geo";
import { tradeAnnualUz } from "@/data/trade";
import { nextVisit, materialsReceived, upcomingVisits } from "@/data/visit-prep";

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
    // Only the inbound Tashkent visit (2026-07-08) is inside the literal window.
    expect(items[0].id).toBe("uv-us-delegation-tashkent-2026-07");
    expect(items[0].beyondWindow).toBe(false);
    expect(items.slice(1).every((i) => i.beyondWindow)).toBe(true);
    // Dates stay sorted ascending.
    const dates = items.map((i) => i.date);
    expect([...dates].sort()).toEqual(dates);
  });

  it("excludes completed visits from the horizon", () => {
    const items = upcomingHorizon(new Date("2026-05-01"), 365);
    expect(items.some((i) => i.id === "uv-samarkand-usa-2026-05")).toBe(false);
    expect(items.some((i) => i.id === "uv-khorezm-usa-2026-05")).toBe(false);
  });

  it("ranks real-portfolio sectors by disclosed value", () => {
    const top = investmentHighlights(3);
    expect(top.map((s) => s.sector)).toEqual(["finance", "energy", "mining-metals"]);
    expect(top[0].valueMusd).toBe(2000);
  });
});

describe("visit-prep", () => {
  it("picks the nearest not-yet-finished visit and counts days to it", () => {
    const asOf = new Date(2026, 6, 2); // 2026-07-02 local
    const visit = nextVisit(asOf);
    expect(visit.id).toBe("uv-us-delegation-tashkent-2026-07");
    expect(daysUntil(visit.startDate, asOf)).toBe(6);
    // After the season's last visit it falls back to the latest record.
    expect(nextVisit(new Date(2027, 0, 1)).id).toBe("uv-unga-followup-2026-09");
  });

  it("keeps an in-progress visit current until its end date", () => {
    const during = nextVisit(new Date(2026, 6, 9)); // 2026-07-09, mid-visit
    expect(during.id).toBe("uv-us-delegation-tashkent-2026-07");
  });

  it("counts received materials against the package total", () => {
    const samarkand = upcomingVisits.find((v) => v.id === "uv-samarkand-usa-2026-05")!;
    expect(materialsReceived(samarkand)).toEqual({ received: 1, total: 1 });
    const tashkent = upcomingVisits.find((v) => v.id === "uv-us-delegation-tashkent-2026-07")!;
    expect(materialsReceived(tashkent).received).toBe(0);
  });

  it("never stores personal identifiers in visit records (hard rule #8)", () => {
    const serialized = JSON.stringify(upcomingVisits).toLowerCase();
    for (const forbidden of ["passport", "pnr", "booking", "visa number"]) {
      expect(serialized).not.toContain(forbidden);
    }
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

  it("carries demo visit arcs (flagged) when hideDemo is off", () => {
    const data = buildBriefGlobeData(false);
    expect(data.arcs.filter((a) => a.kind === "pipeline").every((a) => a.isDemo)).toBe(true);
    expect(data.arcs.some((a) => a.isDemo)).toBe(true);
    // Inbound US→UZ visit renders as a Tashkent pulse, not an invented arc.
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
