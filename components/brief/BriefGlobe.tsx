"use client";
import { useEffect, useRef } from "react";
import type { GlobeInstance } from "globe.gl";
import type { BriefGlobeArc, BriefGlobePoint, BriefGlobeRing, Corridor } from "@/components/brief/geo";

export type BriefHoverPayload = { kind: "point"; point: BriefGlobePoint } | { kind: "arc"; arc: BriefGlobeArc };

interface BriefGlobeProps {
  points: BriefGlobePoint[];
  arcs: BriefGlobeArc[];
  rings: BriefGlobeRing[];
  highlightCorridor: Corridor | null;
  onHover: (payload: BriefHoverPayload | null) => void;
}

/**
 * Imperative globe.gl canvas ("use client", loaded via next/dynamic ssr:false
 * AND dynamically imported inside the effect — both gates are required to
 * keep three.js out of the server module graph). Cleanup follows the pattern
 * of the pre-39d1854 Globe3D: a `cancelled` flag guards the async import
 * against React Strict Mode double-effects, `_destructor()` disposes the
 * WebGL context on unmount.
 *
 * Colors are read once from the --brief-* CSS variables at init (hex
 * fallbacks documented below — canvas paint cannot consume var() directly,
 * the same exception hard rule #4 grants the maplibre paint specs).
 */
export function BriefGlobe({ points, arcs, rings, highlightCorridor, onHover }: BriefGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const highlightRef = useRef<Corridor | null>(highlightCorridor);
  const onHoverRef = useRef(onHover);
  const reducedRef = useRef(false);
  useEffect(() => {
    onHoverRef.current = onHover;
  }, [onHover]);

  // Accessors close over refs so highlight changes only re-style, never
  // rebuild the globe. Declared here to share between init and updates.
  const arcColorRef = useRef<(a: object) => string>(() => "#e8c766");
  const arcStrokeRef = useRef<(a: object) => number>(() => 0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    let globe: GlobeInstance | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = reducedMotion;

    const cssVar = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };
    const alpha = (hex: string, a: number) => {
      const m = /^#([0-9a-f]{6})$/i.exec(hex);
      if (!m) return hex;
      const n = parseInt(m[1], 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    };

    (async () => {
      const { default: Globe } = await import("globe.gl");
      if (cancelled || !containerRef.current) return;

      const gold = cssVar("--brief-accent-bright", "#e8c766");
      const goldBase = cssVar("--brief-accent", "#d3ab2e");
      const neutral = cssVar("--brief-ink-faint", "#83847c");
      const ink = cssVar("--brief-ink", "#ece9df");

      const arcColor = (obj: object) => {
        const a = obj as BriefGlobeArc;
        const hl = highlightRef.current;
        if (hl && a.corridor !== hl) return alpha(gold, 0.1);
        if (a.kind === "pipeline") return alpha(gold, 0.55);
        return hl ? gold : alpha(gold, 0.85);
      };
      const arcStroke = (obj: object) => {
        const a = obj as BriefGlobeArc;
        const hl = highlightRef.current;
        if (hl && a.corridor === hl) return 0.8;
        return a.kind === "pipeline" ? 0.4 : 0.55;
      };
      arcColorRef.current = arcColor;
      arcStrokeRef.current = arcStroke;

      const pointColor = (obj: object) => {
        const p = obj as BriefGlobePoint;
        if (p.kind === "hub") return ink;
        if (p.kind === "investment") return goldBase;
        return alpha(neutral, 0.9);
      };

      const g = new Globe(containerRef.current)
        .width(el.clientWidth)
        .height(el.clientHeight)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("/textures/earth-night.jpg")
        .bumpImageUrl("/textures/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor(goldBase)
        .atmosphereAltitude(0.12)
        .arcsData(arcs as unknown as object[])
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcAltitude("altitude")
        .arcColor(arcColor)
        .arcStroke(arcStroke)
        .arcDashLength(0.45)
        .arcDashGap(0.6)
        .arcDashAnimateTime((obj: object) =>
          reducedMotion ? 0 : (obj as BriefGlobeArc).kind === "pipeline" ? 4200 : 2800,
        )
        .arcLabel(() => "")
        .pointsData(points as unknown as object[])
        .pointLat("lat")
        .pointLng("lng")
        .pointAltitude(0.012)
        .pointRadius((obj: object) => (obj as BriefGlobePoint).size * 0.55)
        .pointColor(pointColor)
        .pointLabel(() => "")
        .onPointHover((point) => {
          const p = point as BriefGlobePoint | null;
          onHoverRef.current(p ? { kind: "point", point: p } : null);
        })
        .onArcHover((arc) => {
          const a = arc as BriefGlobeArc | null;
          onHoverRef.current(a ? { kind: "arc", arc: a } : null);
        });

      if (!reducedMotion && rings.length > 0) {
        g.ringsData(rings as unknown as object[])
          .ringLat("lat")
          .ringLng("lng")
          .ringColor(() => (t: number) => alpha(gold, Math.max(0, 0.5 * (1 - t))))
          .ringMaxRadius(3.4)
          .ringPropagationSpeed(1.1)
          .ringRepeatPeriod(2000);
      }

      // Idle rotation ≈ one revolution per 75 s; paused while the viewer's
      // pointer is over the globe or after they start dragging it.
      g.controls().autoRotate = !reducedMotion;
      g.controls().autoRotateSpeed = 0.4;
      g.controls().enableZoom = false;
      g.pointOfView({ lat: 35, lng: -5, altitude: 2.2 }, 0);

      resizeObserver = new ResizeObserver(() => {
        if (containerRef.current) {
          g.width(containerRef.current.clientWidth).height(containerRef.current.clientHeight);
        }
      });
      resizeObserver.observe(el);

      globe = g;
      globeRef.current = g;
    })();

    const pause = () => {
      if (globeRef.current && !reducedRef.current) globeRef.current.controls().autoRotate = false;
    };
    const resume = () => {
      if (globeRef.current && !reducedRef.current) globeRef.current.controls().autoRotate = true;
    };
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);

    return () => {
      cancelled = true;
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      resizeObserver?.disconnect();
      globeRef.current = null;
      globe?._destructor?.();
    };
    // Data arrays are stable per hideDemo state; a change legitimately
    // rebuilds the globe (cheap relative to how rarely the toggle flips).
  }, [points, arcs, rings]);

  // Re-style arcs in place when the corridor highlight changes.
  useEffect(() => {
    highlightRef.current = highlightCorridor;
    const g = globeRef.current;
    if (g) {
      g.arcColor(arcColorRef.current).arcStroke(arcStrokeRef.current);
    }
  }, [highlightCorridor]);

  return <div ref={containerRef} className="h-full w-full" />;
}
