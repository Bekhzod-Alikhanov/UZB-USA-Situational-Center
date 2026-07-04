/**
 * Globe data assembly for the /brief exhibition page.
 *
 * City coordinates below are geographic facts (reference constants), not data
 * claims about the bilateral relationship, so they need no sourceId and no
 * DEMO_DATA_REGISTRY entry. Every plotted entity itself comes from a sourced
 * record or an already-registered demo-flagged record in /data — this module
 * only positions them. Rows whose region cannot be resolved to a city
 * ("To be confirmed", "Multi-region…") are skipped, never guessed.
 */
import { investments, type Investment } from "@/data/investments";
import { uzMissionsUs } from "@/data/uz-missions-us";
import { visits } from "@/data/visits";
import { visitPipelines } from "@/data/visit-prep";

export const CITY_COORDS = {
  tashkent: { lat: 41.3111, lng: 69.2797 },
  samarkand: { lat: 39.6542, lng: 66.9597 },
  namangan: { lat: 41.0011, lng: 71.6725 },
  fergana: { lat: 40.3864, lng: 71.7843 },
  navoi: { lat: 40.0844, lng: 65.3792 },
  qarshi: { lat: 38.8606, lng: 65.7891 },
  washington: { lat: 38.9072, lng: -77.0369 },
  newyork: { lat: 40.7128, lng: -74.006 },
} as const;

export type CityKey = keyof typeof CITY_COORDS;
export type Corridor = "dc" | "ny";

/** Exact `region` strings of the real (non-demo) investment rows. */
const REGION_TO_CITY: Record<string, CityKey | null> = {
  Kashkadarya: "qarshi",
  Fergana: "fergana",
  Navoi: "navoi",
  "Samarkand / Namangan": "samarkand",
  "Tashkent city (national)": "tashkent",
  "To be confirmed": null,
  "Multi-region (working group)": null,
};

export function resolveRegion(region: string): CityKey | null {
  return REGION_TO_CITY[region] ?? null;
}

export interface BriefGlobePoint {
  id: string;
  kind: "hub" | "investment" | "mission";
  lat: number;
  lng: number;
  /** globe.gl pointRadius input. */
  size: number;
  /** Entity titles (multiple when projects share a city). Proper nouns stay as authored in /data. */
  titles: string[];
  /** Combined disclosed value, million USD; null when nothing disclosed. */
  valueMusd: number | null;
  /** Mission status / investment status detail for the tooltip meta line. */
  detail?: string;
  isDemo: boolean;
}

export interface BriefGlobeArc {
  id: string;
  /** Source record id in data/visits.ts or data/visit-prep.ts (for localized title lookups). */
  refId: string;
  kind: "visit" | "pipeline";
  corridor: Corridor;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  altitude: number;
  title: string;
  date: string;
  isDemo: boolean;
}

export interface BriefGlobeRing {
  id: string;
  lat: number;
  lng: number;
  title: string;
  isDemo: boolean;
}

export interface BriefGlobeData {
  points: BriefGlobePoint[];
  arcs: BriefGlobeArc[];
  rings: BriefGlobeRing[];
  /** Real incoming US→UZ visits 2025–26 (hub tooltip). */
  incomingVisits: number;
}

function corridorsOf(location: string): Corridor[] {
  const out: Corridor[] = [];
  if (location.includes("Washington")) out.push("dc");
  if (location.includes("New York")) out.push("ny");
  return out;
}

/** Point radius from disclosed value — sqrt scale so $2B doesn't dwarf $140M. */
function investmentSize(valueMusd: number): number {
  if (valueMusd <= 0) return 0.35;
  return Math.min(1.1, 0.35 + Math.sqrt(valueMusd) / 55);
}

export function buildBriefGlobeData(hideDemo: boolean): BriefGlobeData {
  const incomingVisits = visits.filter((v) => v.direction === "us-uz").length;

  const points: BriefGlobePoint[] = [
    {
      id: "hub-tashkent",
      kind: "hub",
      ...CITY_COORDS.tashkent,
      size: 0.9,
      titles: ["Tashkent"],
      valueMusd: null,
      isDemo: false,
    },
  ];

  // Real investment projects, grouped per resolved city.
  const byCity = new Map<CityKey, Investment[]>();
  for (const inv of investments) {
    if (inv.is_demo) continue;
    const city = resolveRegion(inv.region);
    if (!city) continue;
    const list = byCity.get(city) ?? [];
    list.push(inv);
    byCity.set(city, list);
  }
  for (const [city, rows] of byCity) {
    const disclosed = rows.reduce((a, r) => a + r.valueMusd, 0);
    points.push({
      id: `inv-${city}`,
      kind: "investment",
      ...CITY_COORDS[city],
      size: investmentSize(disclosed),
      titles: rows.map((r) => r.title),
      valueMusd: disclosed > 0 ? disclosed : null,
      isDemo: false,
    });
  }

  for (const mission of uzMissionsUs) {
    points.push({
      id: mission.id,
      kind: "mission",
      lat: mission.lat,
      lng: mission.lng,
      size: mission.status === "active" ? 0.4 : 0.26,
      titles: [mission.name],
      valueMusd: null,
      detail: mission.status,
      isDemo: mission.is_demo,
    });
  }

  const arcs: BriefGlobeArc[] = [];
  const corridorCount: Record<Corridor, number> = { dc: 0, ny: 0 };
  const pushArc = (
    kind: "visit" | "pipeline",
    id: string,
    title: string,
    date: string,
    corridor: Corridor,
    isDemo: boolean,
  ) => {
    const n = corridorCount[corridor]++;
    const end = corridor === "dc" ? CITY_COORDS.washington : CITY_COORDS.newyork;
    arcs.push({
      id: `${id}-${corridor}`,
      refId: id,
      kind,
      corridor,
      startLat: CITY_COORDS.tashkent.lat,
      startLng: CITY_COORDS.tashkent.lng,
      endLat: end.lat,
      endLng: end.lng,
      // Stagger altitudes so same-corridor arcs read as a bundle, not one line.
      altitude: 0.16 + n * 0.045,
      title,
      date,
      isDemo,
    });
  };

  for (const v of visits) {
    for (const corridor of corridorsOf(v.location)) {
      pushArc("visit", v.id, v.title, v.date, corridor, v.is_demo);
    }
  }

  const rings: BriefGlobeRing[] = [];
  if (!hideDemo) {
    for (const p of visitPipelines) {
      if (p.direction === "UZ to USA" || p.direction === "Bilateral") {
        const corridor: Corridor = p.title.includes("Washington") ? "dc" : "ny";
        pushArc("pipeline", p.id, p.title, p.date, corridor, p.is_demo);
      } else {
        // Inbound US→UZ pipeline: destination pulse at Tashkent — the US
        // origin city is not in the record, so no arc origin is invented.
        rings.push({ id: p.id, ...CITY_COORDS.tashkent, title: p.title, isDemo: p.is_demo });
      }
    }
  }

  return { points, arcs, rings, incomingVisits };
}
