import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createGateSessionToken,
  verifyGateSessionToken,
  verifyGatePassword,
  isSafeAdminRedirect,
} from "@/lib/auth/admin";
import { overrideStep, roadmapDonePct, roadmapStepCounts, allRoadmapSteps, type RoadmapStep } from "@/data/roadmaps";

const ENV_KEYS = [
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "REGION_PASSWORD_SAMARKAND",
  "REGION_PASSWORD_KHOREZM",
] as const;
const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) saved[key] = process.env[key];
  process.env.ADMIN_PASSWORD = "admin-pass-for-tests";
  process.env.ADMIN_SESSION_SECRET = "unit-test-session-secret-0123456789abcdef";
  process.env.REGION_PASSWORD_SAMARKAND = "smq-pass";
  process.env.REGION_PASSWORD_KHOREZM = "khz-pass";
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("gate roles (stage 2)", () => {
  it("maps each password to its role and rejects wrong passwords", () => {
    expect(verifyGatePassword("admin-pass-for-tests")).toBe("admin");
    expect(verifyGatePassword("smq-pass")).toBe("samarkand");
    expect(verifyGatePassword("khz-pass")).toBe("khorezm");
    expect(verifyGatePassword("wrong")).toBeNull();
    expect(verifyGatePassword("")).toBeNull();
  });

  it("round-trips the role through the signed session token", async () => {
    for (const role of ["admin", "samarkand", "khorezm"] as const) {
      const token = await createGateSessionToken(role);
      expect(await verifyGateSessionToken(token)).toBe(role);
    }
  });

  it("rejects tampered and expired tokens", async () => {
    const token = await createGateSessionToken("samarkand");
    const [body, signature] = token.split(".");
    expect(await verifyGateSessionToken(`${body}x.${signature}`)).toBeNull();
    expect(await verifyGateSessionToken(body)).toBeNull();
    const old = await createGateSessionToken("admin", Date.now() - 9 * 60 * 60 * 1000);
    expect(await verifyGateSessionToken(old)).toBeNull();
  });

  it("keeps /prepare a valid post-login target but never login itself", () => {
    expect(isSafeAdminRedirect("/ru/prepare", "ru")).toBe(true);
    expect(isSafeAdminRedirect("/ru/admin", "ru")).toBe(true);
    expect(isSafeAdminRedirect("/ru/admin/login", "ru")).toBe(false);
    expect(isSafeAdminRedirect("/ru/roadmaps", "ru")).toBe(false);
    expect(isSafeAdminRedirect("//evil.example", "ru")).toBe(false);
  });
});

describe("roadmap step overrides (stage 2)", () => {
  const base: RoadmapStep = {
    id: "t-1",
    title: "vazifa",
    titleRu: "задача",
    due: "2026-12",
    owners: ["X"],
    state: null,
  };

  it("applies journal state and note over the file baseline", () => {
    expect(overrideStep(base, { "t-1": { state: "done" } }).state).toBe("done");
    expect(overrideStep(base, { "t-1": { note: "готово к визиту" } }).note).toBe("готово к визиту");
    // reset arrives as an explicit null state and must beat a file "done"
    expect(overrideStep({ ...base, state: "done" }, { "t-1": { state: null } }).state).toBeNull();
    // untouched step passes through unchanged
    expect(overrideStep(base, { other: { state: "done" } })).toEqual(base);
    expect(overrideStep(base)).toEqual(base);
  });

  it("feeds overrides through the aggregate helpers", () => {
    const firstStep = allRoadmapSteps()[0].step;
    const overrides = { [firstStep.id]: { state: "done" as const } };
    expect(roadmapDonePct(overrides)).toBeGreaterThanOrEqual(roadmapDonePct());
    const counts = roadmapStepCounts(new Date(2026, 6, 4), overrides);
    const baseline = roadmapStepCounts(new Date(2026, 6, 4));
    expect(counts.done).toBe(baseline.done + (firstStep.state === "done" ? 0 : 1));
  });
});
