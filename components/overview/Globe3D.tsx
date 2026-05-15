"use client";
import { useEffect, useRef } from "react";

interface ArcPoint {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
}

const ARCS: ArcPoint[] = [
  { startLat: 41.2995, startLng: 69.2401, endLat: 38.9072, endLng: -77.0369, color: ["#1A3A6C", "#0A7C5A"] },
  { startLat: 41.2995, startLng: 69.2401, endLat: 40.7128, endLng: -74.006, color: ["#1A3A6C", "#C88A12"] },
  { startLat: 40.7821, startLng: 72.3442, endLat: 32.7357, endLng: -97.1081, color: ["#1A3A6C", "#A5342A"] },
  { startLat: 39.6542, startLng: 66.9597, endLat: 40.7608, endLng: -111.891, color: ["#0A7C5A", "#1A3A6C"] },
  { startLat: 39.7747, startLng: 64.4286, endLat: 35.5175, endLng: -86.5804, color: ["#C88A12", "#1A3A6C"] },
];

const POINTS = [
  { lat: 41.2995, lng: 69.2401, label: "Tashkent", size: 0.8, color: "#1A3A6C" },
  { lat: 38.9072, lng: -77.0369, label: "Washington", size: 0.7, color: "#A5342A" },
  { lat: 40.7128, lng: -74.006, label: "New York", size: 0.55, color: "#0A7C5A" },
];

export function Globe3D({ height = 380 }: { height?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let cancelled = false;
    let globe: { _destructor?: () => void } | null = null;
    (async () => {
      const { default: Globe } = await import("globe.gl");
      if (cancelled || !ref.current) return;
      // Respect OS-level reduced-motion preference. globe.gl runs both an
      // arc-dash animation and a constant auto-rotation; both are gated.
      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      const g = new Globe(ref.current)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("/textures/earth-night.jpg")
        .bumpImageUrl("/textures/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor("#88A9D8")
        .atmosphereAltitude(0.15)
        .arcsData(ARCS)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor("color")
        .arcAltitudeAutoScale(0.4)
        .arcStroke(0.5)
        .arcDashLength(0.4)
        .arcDashGap(2)
        .arcDashAnimateTime(reducedMotion ? 0 : 2800)
        .pointsData(POINTS)
        .pointLat("lat")
        .pointLng("lng")
        .pointAltitude(0.02)
        .pointColor("color")
        .pointRadius("size")
        .pointLabel("label");

      g.controls().autoRotate = !reducedMotion;
      g.controls().autoRotateSpeed = 0.4;
      g.pointOfView({ lat: 40, lng: 0, altitude: 2.2 }, 0);
      globe = g as unknown as { _destructor?: () => void };
    })();
    return () => {
      cancelled = true;
      globe?._destructor?.();
    };
  }, []);
  return <div ref={ref} style={{ width: "100%", height }} className="overflow-hidden rounded-md" />;
}
