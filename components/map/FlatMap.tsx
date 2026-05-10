"use client";
import { useEffect, useRef } from "react";
import type { Map as MlMap, GeoJSONSourceSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { uzRegions, usMajorCities } from "@/data/regions";
import { investments } from "@/data/investments";
import { liveDelegations } from "@/data/delegations";
import { MAP_COLORS } from "./colors";

type Layer = "invest" | "trade" | "delegations";

interface Props {
  activeLayers: Record<Layer, boolean>;
}

export function FlatMap({ activeLayers }: Props) {
  const container = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MlMap | null>(null);

  // Instantiate once
  useEffect(() => {
    if (!container.current || mapRef.current) return;
    let disposed = false;
    (async () => {
      const maplibre = (await import("maplibre-gl")).default;
      if (disposed || !container.current) return;

      const map = new maplibre.Map({
        container: container.current,
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [45, 38],
        zoom: 1.4,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;

      map.on("load", () => {
        // -------- investment points --------
        const investFeatures = uzRegions.map((r) => {
          const projects = investments.filter((i) => i.region === r.nameEn);
          const totalValue = projects.reduce((acc, p) => acc + p.valueMusd, 0);
          return {
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [r.lng, r.lat] },
            properties: {
              name: r.nameEn,
              projects: projects.length,
              valueMusd: Number(totalValue.toFixed(1)),
            },
          };
        });
        const investSource: GeoJSONSourceSpecification = {
          type: "geojson",
          data: { type: "FeatureCollection", features: investFeatures },
        };
        map.addSource("invest-src", investSource);
        map.addLayer({
          id: "invest-bubbles",
          type: "circle",
          source: "invest-src",
          layout: { visibility: activeLayers.invest ? "visible" : "none" },
          paint: {
            "circle-color": MAP_COLORS.primary,
            "circle-opacity": 0.55,
            "circle-radius": ["interpolate", ["linear"], ["get", "valueMusd"], 0, 4, 50, 7, 250, 14, 600, 22],
            "circle-stroke-color": MAP_COLORS.primary,
            "circle-stroke-width": 1.5,
          },
        });
        map.addLayer({
          id: "invest-labels",
          type: "symbol",
          source: "invest-src",
          layout: {
            visibility: activeLayers.invest ? "visible" : "none",
            "text-field": ["concat", ["get", "name"], "  $", ["to-string", ["get", "valueMusd"]], "M"],
            "text-size": 10,
            "text-offset": [0, 1.6],
            "text-anchor": "top",
          },
          paint: {
            "text-color": MAP_COLORS.ink,
            "text-halo-color": MAP_COLORS.haloLight,
            "text-halo-width": 1.2,
          },
        });

        // -------- trade arcs (UZ capitals ↔ US cities) --------
        const arcFeatures: GeoJSON.Feature[] = [];
        const anchorsUz = uzRegions.slice(0, 5);
        anchorsUz.forEach((r, idx) => {
          const us = usMajorCities[idx % usMajorCities.length];
          arcFeatures.push({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: greatCircle([r.lng, r.lat], [us.lng, us.lat], 60),
            },
            properties: { from: r.nameEn, to: us.name },
          });
        });
        map.addSource("trade-src", {
          type: "geojson",
          data: { type: "FeatureCollection", features: arcFeatures },
        });
        map.addLayer({
          id: "trade-arcs",
          type: "line",
          source: "trade-src",
          layout: { visibility: activeLayers.trade ? "visible" : "none" },
          paint: {
            "line-color": MAP_COLORS.warn,
            "line-width": 1.5,
            "line-dasharray": [1.5, 1.5],
            "line-opacity": 0.75,
          },
        });

        // US-city endpoints
        map.addSource("us-src", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: usMajorCities.map((c) => ({
              type: "Feature" as const,
              geometry: { type: "Point" as const, coordinates: [c.lng, c.lat] },
              properties: { name: c.name },
            })),
          },
        });
        map.addLayer({
          id: "us-points",
          type: "circle",
          source: "us-src",
          layout: { visibility: activeLayers.trade ? "visible" : "none" },
          paint: {
            "circle-color": MAP_COLORS.pos,
            "circle-radius": 4,
            "circle-stroke-color": MAP_COLORS.haloLight,
            "circle-stroke-width": 1,
          },
        });

        // -------- delegations --------
        map.addSource("deleg-src", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: liveDelegations.map((d) => ({
              type: "Feature" as const,
              geometry: { type: "Point" as const, coordinates: [d.lng, d.lat] },
              properties: {
                title: d.title,
                status: d.status,
                head: d.head,
                members: d.members,
              },
            })),
          },
        });
        map.addLayer({
          id: "deleg-points",
          type: "circle",
          source: "deleg-src",
          layout: { visibility: activeLayers.delegations ? "visible" : "none" },
          paint: {
            "circle-color": MAP_COLORS.neg,
            "circle-radius": 7,
            "circle-stroke-color": MAP_COLORS.haloLight,
            "circle-stroke-width": 2,
          },
        });
        map.addLayer({
          id: "deleg-labels",
          type: "symbol",
          source: "deleg-src",
          layout: {
            visibility: activeLayers.delegations ? "visible" : "none",
            "text-field": ["get", "title"],
            "text-size": 10,
            "text-offset": [0, 1.4],
            "text-anchor": "top",
          },
          paint: {
            "text-color": MAP_COLORS.ink,
            "text-halo-color": MAP_COLORS.haloLight,
            "text-halo-width": 1.2,
          },
        });

        // popups
        map.on("click", "invest-bubbles", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          const p = f.properties as { name: string; projects: number; valueMusd: number };
          new maplibre.Popup({ closeButton: true })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font:500 12px system-ui">${escapeHtml(p.name)}</div>
               <div style="font:400 11px system-ui;color:${MAP_COLORS.popupMuted};margin-top:2px">${p.projects} projects · $${p.valueMusd}M</div>`,
            )
            .addTo(map);
        });

        map.on("click", "deleg-points", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          const p = f.properties as { title: string; status: string; head: string; members: number };
          new maplibre.Popup({ closeButton: true })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div style="font:500 12px system-ui">${escapeHtml(p.title)}</div>
               <div style="font:400 11px system-ui;color:${MAP_COLORS.popupMuted};margin-top:2px">${escapeHtml(p.head)} · ${p.members} members · ${escapeHtml(p.status)}</div>`,
            )
            .addTo(map);
        });
      });
    })();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle visibility when activeLayers changes
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !m.isStyleLoaded()) return;
    const set = (id: string, on: boolean) => {
      if (m.getLayer(id)) m.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    };
    set("invest-bubbles", activeLayers.invest);
    set("invest-labels", activeLayers.invest);
    set("trade-arcs", activeLayers.trade);
    set("us-points", activeLayers.trade);
    set("deleg-points", activeLayers.delegations);
    set("deleg-labels", activeLayers.delegations);
  }, [activeLayers]);

  return (
    <div ref={container} className="h-[560px] w-full overflow-hidden rounded-md border border-[var(--color-border)]" />
  );
}

function greatCircle(from: [number, number], to: [number, number], steps = 50): [number, number][] {
  const [lng1, lat1] = from.map((v) => (v * Math.PI) / 180);
  const [lng2, lat2] = to.map((v) => (v * Math.PI) / 180);
  const d =
    2 *
    Math.asin(
      Math.sqrt(Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2),
    );
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const a = Math.sin((1 - f) * d) / Math.sin(d);
    const b = Math.sin(f * d) / Math.sin(d);
    const x = a * Math.cos(lat1) * Math.cos(lng1) + b * Math.cos(lat2) * Math.cos(lng2);
    const y = a * Math.cos(lat1) * Math.sin(lng1) + b * Math.cos(lat2) * Math.sin(lng2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lng = Math.atan2(y, x);
    out.push([(lng * 180) / Math.PI, (lat * 180) / Math.PI]);
  }
  return out;
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}
