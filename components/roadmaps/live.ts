"use client";
import { useCallback, useEffect, useState } from "react";
import type { RoadmapOverrides } from "@/data/roadmaps";
import type { GateRole } from "@/lib/auth/admin";

/**
 * Stage-2 client plumbing: who is behind the gate cookie (to decide whether
 * to render edit forms) and the live per-step overrides journal-reduced by
 * /api/roadmaps/step-updates. Both fail closed/empty so a static deploy or
 * an offline database degrades to the bundled data — never to an error UI.
 */

export function useGateRole(): { role: GateRole | null; loaded: boolean } {
  const [role, setRole] = useState<GateRole | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { role: null }))
      .then((data: { role?: GateRole | null }) => {
        if (!cancelled) setRole(data.role ?? null);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { role, loaded };
}

export function useRoadmapOverrides(): {
  overrides: RoadmapOverrides;
  loaded: boolean;
  refresh: () => Promise<void>;
} {
  const [overrides, setOverrides] = useState<RoadmapOverrides>({});
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/roadmaps/step-updates", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { updates?: RoadmapOverrides };
      setOverrides(data.updates ?? {});
    } catch {
      // network/DB hiccup → keep whatever we had (baseline data still renders)
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch-on-mount, state set after await
    void refresh();
  }, [refresh]);

  return { overrides, loaded, refresh };
}
