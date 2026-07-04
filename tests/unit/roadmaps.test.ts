import { describe, expect, it } from "vitest";
import {
  khorezmProjects,
  samarkandProjects,
  regionRoadmaps,
  roadmapProjects,
  stepHealth,
  projectHealth,
  regionRollup,
  allRoadmapSteps,
  roadmapAttention,
  roadmapDonePct,
  roadmapStepCounts,
  roadmapProjectTitle,
  roadmapStepTitle,
  type RoadmapProject,
  type RoadmapStep,
} from "@/data/roadmaps";

function step(due: string, state: RoadmapStep["state"] = null): RoadmapStep {
  return { id: `t-${due}-${state}`, title: "vazifa", titleRu: "задача", due, owners: ["X"], state };
}

function project(steps: RoadmapStep[]): RoadmapProject {
  return {
    id: "t-proj",
    region: "khorezm",
    num: 99,
    title: "Test loyihasi",
    titleRu: "Тестовый проект",
    initiator: "Test",
    valueMusd: 1,
    steps,
    sourceId: "input_roadmap_khorezm_docx",
    is_demo: false,
  };
}

describe("roadmap document totals", () => {
  it("matches the signed documents: 48 Samarkand + 13 Khorezm projects", () => {
    expect(samarkandProjects).toHaveLength(48);
    expect(khorezmProjects).toHaveLength(13);
    expect(roadmapProjects).toHaveLength(61);
  });

  it("matches the declared header values ($1.5B and $1.0B)", () => {
    const samarkand = regionRoadmaps.find((r) => r.region === "samarkand")!;
    const khorezm = regionRoadmaps.find((r) => r.region === "khorezm")!;
    expect(samarkand.totalValueMusd).toBe(1500);
    expect(samarkand.declaredProjects).toBe(48);
    expect(khorezm.totalValueMusd).toBe(1000);
    expect(khorezm.declaredProjects).toBe(13);
  });

  it("keeps every project traceable to a document source", () => {
    expect(
      roadmapProjects.every(
        (p) => p.sourceId === "input_roadmap_samarkand_docx" || p.sourceId === "input_roadmap_khorezm_docx",
      ),
    ).toBe(true);
    expect(roadmapProjects.every((p) => p.is_demo === false)).toBe(true);
  });

  it("serves the document original by default and Russian on the ru locale", () => {
    const p = samarkandProjects[0];
    expect(roadmapProjectTitle(p, "ru")).toBe(p.titleRu);
    expect(roadmapProjectTitle(p, "en")).toBe(p.title);
    expect(roadmapProjectTitle(p, "uz-latn")).toBe(p.title);
    const s = p.steps[0];
    expect(roadmapStepTitle(s, "ru")).toBe(s.titleRu);
    expect(roadmapStepTitle(s, "en")).toBe(s.title);
  });
});

describe("stepHealth (derived from document deadlines)", () => {
  it("is done whenever the manual state says so, regardless of date", () => {
    expect(stepHealth(step("2020-01", "done"), new Date(2026, 6, 4))).toBe("done");
  });

  it("is on-track more than 30 days before the due month ends", () => {
    // Due 2026-08 → month ends Aug 31; from Jul 4 that is ~58 days out.
    expect(stepHealth(step("2026-08"), new Date(2026, 6, 4))).toBe("on-track");
  });

  it("is due-soon inside the 30-day window before month end", () => {
    expect(stepHealth(step("2026-08"), new Date(2026, 7, 10))).toBe("due-soon");
    // Boundary: the last day of the due month is still due-soon, not overdue.
    expect(stepHealth(step("2026-08"), new Date(2026, 7, 31, 12))).toBe("due-soon");
  });

  it("is overdue from the first day after the due month", () => {
    expect(stepHealth(step("2026-08"), new Date(2026, 8, 1))).toBe("overdue");
  });
});

describe("projectHealth", () => {
  const today = new Date(2026, 6, 4);

  it("is done only when every step is done", () => {
    expect(projectHealth(project([step("2026-08", "done"), step("2026-12", "done")]), today)).toBe("done");
  });

  it("is off-track when any step is overdue", () => {
    expect(projectHealth(project([step("2026-05"), step("2026-12", "done")]), today)).toBe("off-track");
  });

  it("is attention when the worst step is due-soon", () => {
    expect(projectHealth(project([step("2026-07"), step("2026-12")]), today)).toBe("attention");
  });

  it("is on-track when everything is comfortably ahead", () => {
    expect(projectHealth(project([step("2026-12"), step("2027-04")]), today)).toBe("on-track");
  });
});

describe("region rollups and attention feed", () => {
  const today = new Date(2026, 6, 4);

  it("rolls up per-region project and step counters consistently", () => {
    for (const region of ["samarkand", "khorezm"] as const) {
      const rollup = regionRollup(region, today);
      const declared = regionRoadmaps.find((r) => r.region === region)!.declaredProjects;
      expect(rollup.projects).toBe(declared);
      expect(rollup.done + rollup.onTrack + rollup.attention + rollup.offTrack).toBe(rollup.projects);
      expect(rollup.doneSteps).toBeLessThanOrEqual(rollup.totalSteps);
      expect(rollup.totalSteps).toBeGreaterThan(0);
    }
  });

  it("points the next milestone at the earliest not-done step", () => {
    const rollup = regionRollup("khorezm", today);
    expect(rollup.nextMilestone).toBeDefined();
    const openDues = allRoadmapSteps()
      .filter(({ project: p, step: s }) => p.region === "khorezm" && s.state !== "done")
      .map(({ step: s }) => s.due)
      .sort();
    expect(rollup.nextMilestone!.step.due).toBe(openDues[0]);
  });

  it("orders attention rows overdue-first, then by due month", () => {
    // Far-future date: every open step is overdue → sorted by due ascending.
    const rows = roadmapAttention(5, new Date(2028, 0, 1));
    expect(rows).toHaveLength(5);
    expect(rows.every((r) => r.health === "overdue")).toBe(true);
    const dues = rows.map((r) => r.step.due);
    expect([...dues].sort()).toEqual(dues);
  });

  it("keeps the step-count segments summing to the full task list", () => {
    const counts = roadmapStepCounts(today);
    const total = counts.done + counts["on-track"] + counts["due-soon"] + counts.overdue;
    expect(total).toBe(allRoadmapSteps().length);
    expect(roadmapDonePct()).toBeGreaterThanOrEqual(0);
    expect(roadmapDonePct()).toBeLessThanOrEqual(100);
  });
});
