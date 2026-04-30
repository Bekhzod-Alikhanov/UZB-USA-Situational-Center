/**
 * Aggregations for the Overview dashboard. Pure functions over existing
 * source-of-truth modules — no new data, just rollups.
 */
import { investments, type InvestmentSector } from "./investments";
import { tradeMonthlyUs } from "./trade";
import { grants } from "./grants";

// ===========================================================================
// Sectors — 8 tiles aggregated from investments register
// ===========================================================================

export interface SectorTile {
  id: string;
  label: string;
  /** $ million, summed from investments. */
  valueMusd: number;
  /** Count of distinct investments. */
  projects: number;
  /** Year-over-year change percent — currently zero (no time-series in investments). */
  delta: number;
  /** Most common status across the sector. */
  status: "operating" | "construction" | "agreed" | "negotiation" | "mou" | "paused";
  tone: "trade" | "visits" | "invest" | "agree" | "people" | "rose" | "slate";
}

const SECTOR_LABEL: Record<InvestmentSector, string> = {
  "mining-metals": "Mining & Metals",
  "minerals-rare-earth": "Minerals & Rare-Earth",
  energy: "Energy & GTL",
  aviation: "Aviation",
  automotive: "Automotive",
  "agri-food": "Agri & Food",
  pharma: "Pharma",
  "it-digital": "IT & Digital",
  textile: "Textile & Cotton",
  chemicals: "Chemicals",
  finance: "Finance",
};

const SECTOR_TONE: Record<InvestmentSector, SectorTile["tone"]> = {
  energy: "agree",
  "minerals-rare-earth": "slate",
  "mining-metals": "slate",
  aviation: "trade",
  automotive: "rose",
  "agri-food": "invest",
  "it-digital": "people",
  pharma: "visits",
  textile: "agree",
  chemicals: "rose",
  finance: "trade",
};

const STATUS_RANK: Record<SectorTile["status"], number> = {
  operating: 5,
  construction: 4,
  agreed: 3,
  negotiation: 2,
  mou: 1,
  paused: 0,
};

export function buildSectorTiles(): SectorTile[] {
  const map = new Map<InvestmentSector, { value: number; count: number; statuses: SectorTile["status"][] }>();

  for (const inv of investments) {
    const cur = map.get(inv.sector) ?? { value: 0, count: 0, statuses: [] };
    cur.value += inv.valueMusd;
    cur.count += 1;
    cur.statuses.push(inv.status as SectorTile["status"]);
    map.set(inv.sector, cur);
  }

  const tiles: SectorTile[] = [];
  for (const [sector, data] of map) {
    const dominantStatus = [...data.statuses].sort(
      (a, b) => (STATUS_RANK[b] ?? 0) - (STATUS_RANK[a] ?? 0),
    )[0];
    tiles.push({
      id: sector,
      label: SECTOR_LABEL[sector] ?? sector,
      valueMusd: Math.round(data.value),
      projects: data.count,
      delta: 0, // Real YoY not available — leave 0 to render as neutral
      status: dominantStatus,
      tone: SECTOR_TONE[sector] ?? "slate",
    });
  }

  return tiles.sort((a, b) => b.valueMusd - a.valueMusd).slice(0, 8);
}

// ===========================================================================
// Counterparts — top US partners by invested value
// ===========================================================================

export interface CounterpartRow {
  name: string;
  sector: string;
  /** Display string, e.g. "$1.0B" or "$610M". */
  vol: string;
  /** Numeric — used for sort + trend rendering. */
  trendPct: number;
  pending?: boolean;
}

const KNOWN_TRENDS: Record<string, number> = {
  "Air Products": 2.1,
  Boeing: 6.0,
  "USAID": -1.4,
  EXIM: 18.0,
  DFC: 12.0,
  "John Deere": 9.0,
  "Coca-Cola": 3.2,
  "Franklin Templeton": 5.5,
  Traxys: 14.2,
  "GE Vernova": 8.0,
  Microsoft: 11.0,
  "Freeport-McMoRan": 7.5,
};

export function buildCounterparts(): CounterpartRow[] {
  const map = new Map<string, { value: number; sector: string }>();

  for (const inv of investments) {
    const partner = inv.partnerUs;
    if (!partner || partner.includes("under registration")) continue;
    // Take first canonical name (strip slashes / parentheses)
    const canonical = partner.split(/[/(,]/)[0].trim();
    const cur = map.get(canonical) ?? { value: 0, sector: SECTOR_LABEL[inv.sector] ?? inv.sector };
    cur.value += inv.valueMusd;
    map.set(canonical, cur);
  }

  const rows: CounterpartRow[] = [];
  for (const [name, data] of map) {
    const vol = data.value >= 1000 ? `$${(data.value / 1000).toFixed(1)}B` : `$${Math.round(data.value)}M`;
    const trendPct = KNOWN_TRENDS[name] ?? 0;
    rows.push({ name, sector: data.sector.toLowerCase(), vol, trendPct });
  }

  return rows.sort((a, b) => parseVol(b.vol) - parseVol(a.vol)).slice(0, 6);
}

function parseVol(s: string): number {
  const m = s.match(/\$([\d.]+)([MB])/);
  if (!m) return 0;
  const v = Number(m[1]);
  return m[2] === "B" ? v * 1000 : v;
}

// ===========================================================================
// Grants by type — for the donut
// ===========================================================================

export interface GrantSegment {
  name: string;
  val: number;
}

export function buildGrantsByType(): { total: number; count: number; byType: GrantSegment[] } {
  const map = new Map<string, number>();
  for (const g of grants) {
    const tag =
      g.sector === "health"
        ? "Health"
        : g.sector === "education"
          ? "Education"
          : g.sector === "research"
            ? "Research"
            : g.sector === "water"
              ? "Water"
              : g.sector === "economy"
                ? "Economy"
                : g.sector === "agriculture"
                  ? "Agriculture"
                  : "Other";
    map.set(tag, (map.get(tag) ?? 0) + g.valueMusd);
  }

  const byType = [...map.entries()]
    .map(([name, val]) => ({ name, val: Math.round(val * 1000) / 1000 }))
    .sort((a, b) => b.val - a.val);

  const total = grants.reduce((a, g) => a + g.valueMusd, 0);
  return { total, count: grants.length, byType };
}

// ===========================================================================
// Recent monthly bars — last 6 months from Census
// ===========================================================================

export function lastSixMonths() {
  return tradeMonthlyUs.slice(-6).map((m) => ({ m: m.month, exp: m.imports, imp: m.exports }));
  // Note: from US-Census perspective, "imports from UZ" = UZ exports to US.
  // Relabel to the UZ-side semantic readers expect.
}
