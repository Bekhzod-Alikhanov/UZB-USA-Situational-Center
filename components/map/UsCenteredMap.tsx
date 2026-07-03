"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { geoAlbersUsa, geoPath, type GeoProjection } from "d3-geo";
import {
  usStateMetrics,
  usStateMetricsMeta,
  metricValue,
  getMetric,
  maxFor,
  totalFor,
  type UsStatesMetric,
} from "@/data/us-state-metrics";
import { findStateByName, findStateByAbbr, type UsState } from "@/data/us-states";
import { uzMissionsUs, type UzMission, type UzMissionStatus } from "@/data/uz-missions-us";
import { uzPlannedVisitsUs, type UzPlannedVisit } from "@/data/uz-planned-visits-us";
import { cn } from "@/lib/utils";
import { Building2, Globe2, Landmark, MapPin, CalendarClock, X } from "lucide-react";

const VBW = 960;
const VBH = 560;

interface Feature {
  type: "Feature";
  properties: { name: string; [key: string]: unknown };
  geometry: { type: string; coordinates: unknown };
}
interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

// ----- i18n strings ----------------------------------------------------------
interface Strings {
  metric: string;
  gdp: string;
  pop: string;
  students: string;
  gdpDesc: string;
  popDesc: string;
  studentsDesc: string;
  pinsTitle: string;
  showMissions: string;
  showVisits: string;
  embassy: string;
  consulateGeneral: string;
  consulate: string;
  unMission: string;
  active: string;
  opened2026: string;
  planned2026: string;
  planned2027: string;
  status: string;
  visit: string;
  organization: string;
  purpose: string;
  date: string;
  total: string;
  top5: string;
  loading: string;
  failed: string;
  state: string;
  scale: string;
  legend: string;
  hint: string;
  noteGdp: string;
  notePop: string;
  noteStudents: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    metric: "Metric",
    gdp: "GDP 2025",
    pop: "Population 2025",
    students: "UZ students",
    gdpDesc: "Gross Domestic Product, 2025 — BEA SAGDP1, USD billions",
    popDesc: "Population, 2025 — U.S. Census, millions",
    studentsDesc: "Students from Uzbekistan in this state, 2024-25 — Open Doors / IIE",
    pinsTitle: "Pins",
    showMissions: "UZ missions",
    showVisits: "Planned visits",
    embassy: "Embassy",
    consulateGeneral: "Consulate General",
    consulate: "Consulate",
    unMission: "UN Mission",
    active: "Active",
    opened2026: "Opened 2026",
    planned2026: "Planned 2026",
    planned2027: "Planned 2027",
    status: "Status",
    visit: "Planned visit",
    organization: "Organization",
    purpose: "Purpose",
    date: "Date",
    total: "Total",
    top5: "Top 5",
    loading: "Loading map…",
    failed: "Could not load /us-states.geojson",
    state: "State",
    scale: "Scale",
    legend: "Legend",
    hint: "Hover a state to see details · click a pin for mission or visit info",
    noteGdp: `Source: ${usStateMetricsMeta.gdp.sourceShort}.`,
    notePop: `Source: ${usStateMetricsMeta.population.sourceShort}.`,
    noteStudents: `Source: ${usStateMetricsMeta.students.sourceShort}.`,
  },
  ru: {
    metric: "Показатель",
    gdp: "ВВП 2025",
    pop: "Население 2025",
    students: "Студенты из УЗ",
    gdpDesc: "Валовой внутренний продукт, 2025 — BEA SAGDP1, млрд $",
    popDesc: "Население, 2025 — U.S. Census, млн человек",
    studentsDesc: "Студенты из Узбекистана в штате, 2024-25 — Open Doors / IIE",
    pinsTitle: "Метки",
    showMissions: "Диппредставительства",
    showVisits: "Плановые визиты",
    embassy: "Посольство",
    consulateGeneral: "Генконсульство",
    consulate: "Консульство",
    unMission: "Постпредство при ООН",
    active: "Действует",
    opened2026: "Открыто в 2026",
    planned2026: "Планируется в 2026",
    planned2027: "Планируется в 2027",
    status: "Статус",
    visit: "Плановый визит",
    organization: "Организация",
    purpose: "Цель",
    date: "Дата",
    total: "Всего",
    top5: "Топ-5",
    loading: "Загрузка карты…",
    failed: "Не удалось загрузить /us-states.geojson",
    state: "Штат",
    scale: "Шкала",
    legend: "Легенда",
    hint: "Наведите курсор на штат для данных · нажмите на метку для деталей",
    noteGdp: `Источник: ${usStateMetricsMeta.gdp.sourceShort}.`,
    notePop: `Источник: ${usStateMetricsMeta.population.sourceShort}.`,
    noteStudents: `Источник: ${usStateMetricsMeta.students.sourceShort}.`,
  },
  "uz-latn": {
    metric: "Ko'rsatkich",
    gdp: "YaIM 2025",
    pop: "Aholi 2025",
    students: "UZ talabalari",
    gdpDesc: "Yalpi ichki mahsulot, 2025 — BEA SAGDP1, mlrd $",
    popDesc: "Aholi soni, 2025 — U.S. Census, mln",
    studentsDesc: "Shtatdagi O'zbekistondan kelgan talabalar, 2024-25 — Open Doors / IIE",
    pinsTitle: "Belgilar",
    showMissions: "Vakolatxonalar",
    showVisits: "Tashriflar",
    embassy: "Elchixona",
    consulateGeneral: "Bosh konsullik",
    consulate: "Konsullik",
    unMission: "BMTdagi vakolatxona",
    active: "Faol",
    opened2026: "2026-yilda ochilgan",
    planned2026: "2026-yilga rejalashtirilgan",
    planned2027: "2027-yilga rejalashtirilgan",
    status: "Holat",
    visit: "Rejalashtirilgan tashrif",
    organization: "Tashkilot",
    purpose: "Maqsad",
    date: "Sana",
    total: "Jami",
    top5: "Top-5",
    loading: "Karta yuklanmoqda…",
    failed: "/us-states.geojson yuklanmadi",
    state: "Shtat",
    scale: "Shkala",
    legend: "Belgilar",
    hint: "Ma'lumot uchun shtatga kursor olib boring · belgini bosing",
    noteGdp: `Manba: ${usStateMetricsMeta.gdp.sourceShort}.`,
    notePop: `Manba: ${usStateMetricsMeta.population.sourceShort}.`,
    noteStudents: `Manba: ${usStateMetricsMeta.students.sourceShort}.`,
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

function pickStateLabel(state: UsState | undefined, fallback: string, locale: string): string {
  if (!state) return fallback;
  if (locale === "ru") return state.nameRu;
  return state.name;
}

// ----- Color scale -----------------------------------------------------------
function colorScale(value: number, max: number): string {
  if (max === 0 || value === 0) return "var(--color-surface-2)";
  const t = Math.min(1, value / max);
  // 5-step quantile-ish ramp using color-mix on the primary tone
  if (t > 0.75) return "color-mix(in oklab, var(--color-primary) 92%, transparent)";
  if (t > 0.5) return "color-mix(in oklab, var(--color-primary) 70%, transparent)";
  if (t > 0.25) return "color-mix(in oklab, var(--color-primary) 45%, transparent)";
  if (t > 0.1) return "color-mix(in oklab, var(--color-primary) 25%, transparent)";
  if (t > 0) return "color-mix(in oklab, var(--color-primary) 12%, transparent)";
  return "var(--color-surface-2)";
}

// ----- Mission pin styling ---------------------------------------------------
const MISSION_STATUS_COLOR: Record<UzMissionStatus, string> = {
  active: "#0A7C5A", // pos green
  "opened-2026": "#1A3A6C", // primary navy
  "planned-2026": "#C88A12", // warn amber
  "planned-2027": "#C88A12",
};

// ----- Number formatting -----------------------------------------------------
function formatMetric(metric: UsStatesMetric, value: number, locale: string): string {
  const nf = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    maximumFractionDigits: metric === "students" ? 0 : 1,
  });
  if (metric === "gdp") return `$${nf.format(value)}B`;
  if (metric === "population") return `${nf.format(value)}M`;
  return nf.format(value);
}

// ----- Tooltip / selection state --------------------------------------------
interface StateTip {
  abbr: string;
  name: string;
  /** Cursor position relative to the map container. */
  x: number;
  y: number;
  containerHeight: number;
  containerWidth: number;
}

type Selection =
  | { kind: "state"; abbr: string }
  | { kind: "mission"; mission: UzMission }
  | { kind: "visit"; visit: UzPlannedVisit }
  | null;

// =============================================================================
// Component
// =============================================================================
export function UsCenteredMap() {
  const locale = useLocale();
  const T = pickStr(locale);

  const [metric, setMetric] = useState<UsStatesMetric>("gdp");
  const [showMissions, setShowMissions] = useState(true);
  const [showVisits, setShowVisits] = useState(true);
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [tip, setTip] = useState<StateTip | null>(null);
  const [selection, setSelection] = useState<Selection>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load geojson
  useEffect(() => {
    let cancelled = false;
    fetch("/us-states.geojson")
      .then((r) => r.json())
      .then((data: FeatureCollection) => {
        if (!cancelled) setFeatures(data.features);
      })
      .catch(() => {
        if (!cancelled) setFeatures([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Single shared projection — used for both choropleth paths and pin coords.
  const projection = useMemo<GeoProjection | null>(() => {
    if (!features || features.length === 0) return null;
    return geoAlbersUsa().fitSize([VBW, VBH], {
      type: "FeatureCollection",
      features,
    } as never);
  }, [features]);

  const path = useMemo(() => (projection ? geoPath(projection) : null), [projection]);

  const max = maxFor(metric);
  const total = totalFor(metric);

  const top5 = useMemo(
    () =>
      [...usStateMetrics]
        .map((s) => ({ abbr: s.abbr, v: metricValue(s.abbr, metric) }))
        .sort((a, b) => b.v - a.v)
        .slice(0, 5),
    [metric],
  );

  const METRIC_LABEL: Record<UsStatesMetric, string> = {
    gdp: T.gdp,
    population: T.pop,
    students: T.students,
  };
  const METRIC_DESC: Record<UsStatesMetric, string> = {
    gdp: T.gdpDesc,
    population: T.popDesc,
    students: T.studentsDesc,
  };
  const METRIC_NOTE: Record<UsStatesMetric, string> = {
    gdp: T.noteGdp,
    population: T.notePop,
    students: T.noteStudents,
  };
  const STATUS_LABEL: Record<UzMissionStatus, string> = {
    active: T.active,
    "opened-2026": T.opened2026,
    "planned-2026": T.planned2026,
    "planned-2027": T.planned2027,
  };
  const TYPE_LABEL: Record<UzMission["type"], string> = {
    embassy: T.embassy,
    "consulate-general": T.consulateGeneral,
    consulate: T.consulate,
    "un-mission": T.unMission,
  };

  function projectPin(lng: number, lat: number): [number, number] | null {
    if (!projection) return null;
    return projection([lng, lat]) as [number, number] | null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.metric}:</span>
          {(["gdp", "population", "students"] as UsStatesMetric[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-medium transition",
                m === metric
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
              )}
            >
              {METRIC_LABEL[m]}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.pinsTitle}:</span>
          <PinToggle
            active={showMissions}
            onClick={() => setShowMissions((v) => !v)}
            tone="pos"
            icon={<Building2 className="size-3" />}
          >
            {T.showMissions}
          </PinToggle>
          <PinToggle
            active={showVisits}
            onClick={() => setShowVisits((v) => !v)}
            tone="warn"
            icon={<CalendarClock className="size-3" />}
          >
            {T.showVisits}
          </PinToggle>
        </div>
      </div>

      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[11.5px] text-[var(--color-ink-muted)]">
        {METRIC_DESC[metric]} · <span className="text-[var(--color-ink-faint)]">{T.hint}</span>
      </div>

      {/* Map container — overflow:visible so the hover tooltip can extend
          beyond the SVG bounds without being clipped (was a regression). */}
      <div ref={containerRef} className="relative rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]">
        {!features ? (
          <div className="flex h-[420px] items-center justify-center text-[12px] text-[var(--color-ink-muted)] sm:h-[560px]">
            {T.loading}
          </div>
        ) : features.length === 0 || !path ? (
          <div className="flex h-[420px] items-center justify-center text-[12px] text-[var(--color-ink-muted)] sm:h-[560px]">
            {T.failed}
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${VBW} ${VBH}`}
            preserveAspectRatio="xMidYMid meet"
            className="block h-auto w-full"
            role="img"
            aria-label="United States map — UZ engagement footprint"
            onMouseLeave={() => setTip(null)}
          >
            {/* States */}
            <g>
              {features.map((f, i) => {
                const stateName = String(f.properties.name);
                const meta = findStateByName(stateName);
                const value = meta ? metricValue(meta.abbr, metric) : 0;
                const fill = colorScale(value, max);
                const d = path(f as never);
                if (!d) return null;
                const isSelected = selection?.kind === "state" && meta && selection.abbr === meta.abbr;
                return (
                  <path
                    key={i}
                    d={d}
                    fill={fill}
                    stroke={isSelected ? "#1A3A6C" : "rgba(0,0,0,0.35)"}
                    strokeWidth={isSelected ? 2 : 0.7}
                    style={{
                      cursor: meta ? "pointer" : "default",
                      transition: "stroke var(--duration-fast) var(--ease-out)",
                    }}
                    onMouseMove={(e) => {
                      if (!meta) return;
                      const rect = containerRef.current?.getBoundingClientRect();
                      if (!rect) return;
                      setTip({
                        abbr: meta.abbr,
                        name: stateName,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        containerHeight: rect.height,
                        containerWidth: rect.width,
                      });
                    }}
                    onClick={() => {
                      if (!meta) return;
                      setSelection({ kind: "state", abbr: meta.abbr });
                      // Dismiss the floating hover tooltip so it doesn't
                      // overlay the freshly-opened detail panel.
                      setTip(null);
                    }}
                  >
                    <title>{`${pickStateLabel(meta, stateName, locale)}${
                      meta ? ` — ${formatMetric(metric, value, locale)}` : ""
                    }`}</title>
                  </path>
                );
              })}
            </g>

            {/* Mission pins */}
            {showMissions ? (
              <g>
                {uzMissionsUs.map((m) => {
                  const p = projectPin(m.lng, m.lat);
                  if (!p) return null;
                  const [cx, cy] = p;
                  const color = MISSION_STATUS_COLOR[m.status];
                  const isPlanned = m.status.startsWith("planned");
                  return (
                    <g
                      key={m.id}
                      transform={`translate(${cx},${cy})`}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelection({ kind: "mission", mission: m });
                      }}
                    >
                      {/* outer halo */}
                      <circle r={9} fill={color} fillOpacity={0.18} />
                      <circle
                        r={6}
                        fill={color}
                        stroke="white"
                        strokeWidth={2}
                        strokeDasharray={isPlanned ? "2 2" : undefined}
                      />
                      {m.type === "un-mission" ? <circle r={2} fill="white" /> : null}
                      <title>{`${m.name} — ${TYPE_LABEL[m.type]} · ${STATUS_LABEL[m.status]}`}</title>
                    </g>
                  );
                })}
              </g>
            ) : null}

            {/* Visit pins (diamond) */}
            {showVisits ? (
              <g>
                {uzPlannedVisitsUs.map((v) => {
                  const p = projectPin(v.lng, v.lat);
                  if (!p) return null;
                  const [cx, cy] = p;
                  return (
                    <g
                      key={v.id}
                      transform={`translate(${cx},${cy})`}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelection({ kind: "visit", visit: v });
                      }}
                    >
                      <g transform="rotate(45)">
                        <rect
                          x={-5}
                          y={-5}
                          width={10}
                          height={10}
                          fill="#C88A12"
                          stroke="white"
                          strokeWidth={1.5}
                          opacity={v.is_demo ? 0.78 : 1}
                        />
                      </g>
                      <title>{`${v.organization} — ${v.date} (${v.city})`}</title>
                    </g>
                  );
                })}
              </g>
            ) : null}
          </svg>
        )}

        {/* Hover tooltip — anchored to cursor coords relative to the map container. */}
        {tip ? <StateHoverTooltip tip={tip} locale={locale} T={T} /> : null}
      </div>

      {/* Selection details panel */}
      {selection ? (
        <SelectionPanel
          selection={selection}
          onClose={() => setSelection(null)}
          T={T}
          STATUS_LABEL={STATUS_LABEL}
          TYPE_LABEL={TYPE_LABEL}
          locale={locale}
        />
      ) : null}

      {/* Legend + Top-5 */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
            {T.scale} · {METRIC_LABEL[metric]}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            {[0.12, 0.25, 0.45, 0.7, 0.92].map((t) => (
              <span
                key={t}
                className="h-3 flex-1 rounded-sm"
                style={{
                  background: `color-mix(in oklab, var(--color-primary) ${t * 100}%, transparent)`,
                }}
                aria-hidden
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-[var(--color-ink-muted)]">
            <span>0</span>
            <span className="mono tabular">{formatMetric(metric, max, locale)}</span>
          </div>
          <div className="mt-1.5 text-[10.5px] text-[var(--color-ink-muted)]">
            {T.total}:{" "}
            <span className="mono font-semibold tabular text-[var(--color-ink)]">
              {formatMetric(metric, total, locale)}
            </span>
          </div>
        </div>

        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
            {T.legend}
          </div>
          <div className="mt-1.5 flex flex-col gap-1 text-[11px] text-[var(--color-ink)]">
            <LegendDot color="#0A7C5A">
              {T.embassy} / {T.consulateGeneral} — {T.active}
            </LegendDot>
            <LegendDot color="#0A7C5A" inner="white">
              {T.unMission}
            </LegendDot>
            <LegendDot color="#1A3A6C">{T.opened2026}</LegendDot>
            <LegendDot color="#C88A12" dashed>
              {T.planned2026} / {T.planned2027}
            </LegendDot>
            <LegendDiamond>{T.visit}</LegendDiamond>
          </div>
        </div>

        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
            {T.top5} · {METRIC_LABEL[metric]}
          </div>
          <ol className="mt-1.5 flex flex-col gap-1 text-[11.5px]">
            {top5.map((s, i) => {
              const meta = findStateByAbbr(s.abbr);
              return (
                <li key={s.abbr} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 truncate">
                    <span className="mono inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-[var(--color-surface-2)] text-[9px] font-semibold tabular text-[var(--color-ink-muted)]">
                      {i + 1}
                    </span>
                    <span className="truncate text-[var(--color-ink)]">{pickStateLabel(meta, s.abbr, locale)}</span>
                  </span>
                  <span className="mono shrink-0 tabular text-[var(--color-ink)]">
                    {formatMetric(metric, s.v, locale)}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">{METRIC_NOTE[metric]}</p>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================
function StateHoverTooltip({ tip, locale, T }: { tip: StateTip; locale: string; T: Strings }) {
  const meta = findStateByAbbr(tip.abbr);
  const label = pickStateLabel(meta, tip.name, locale);
  const rec = getMetric(tip.abbr);
  // Position relative to the container so the tooltip travels with the SVG.
  // If the cursor is past the right half of the container, flip the tooltip
  // to the left side of the cursor so it doesn't get clipped.
  const flipX = tip.x > tip.containerWidth * 0.6;
  const flipY = tip.y > tip.containerHeight - 140;
  const TOOLTIP_W = 200;
  const left = flipX ? tip.x - TOOLTIP_W - 14 : tip.x + 14;
  const top = flipY ? tip.y - 110 : tip.y + 14;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none absolute z-30 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[11px] shadow-lg"
      style={{
        left: Math.max(8, left),
        top: Math.max(8, top),
        width: TOOLTIP_W,
      }}
    >
      <div className="text-[12px] font-semibold text-[var(--color-ink)]">{label}</div>
      <div className="mono mt-0.5 text-[10.5px] tabular text-[var(--color-ink-muted)]">{tip.abbr}</div>
      <dl className="mt-1.5 grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 text-[11px] tabular">
        <dt className="text-[var(--color-ink-muted)]">{T.gdp}:</dt>
        <dd className="mono text-right text-[var(--color-ink)]">{rec ? `$${rec.gdpBusd.toFixed(1)}B` : "—"}</dd>
        <dt className="text-[var(--color-ink-muted)]">{T.pop}:</dt>
        <dd className="mono text-right text-[var(--color-ink)]">{rec ? `${rec.popMillions.toFixed(2)}M` : "—"}</dd>
        <dt className="text-[var(--color-ink-muted)]">{T.students}:</dt>
        <dd className="mono text-right text-[var(--color-ink)]">{rec ? rec.uzStudents : "—"}</dd>
      </dl>
    </div>
  );
}

function SelectionPanel({
  selection,
  onClose,
  T,
  STATUS_LABEL,
  TYPE_LABEL,
  locale,
}: {
  selection: Exclude<Selection, null>;
  onClose: () => void;
  T: Strings;
  STATUS_LABEL: Record<UzMissionStatus, string>;
  TYPE_LABEL: Record<UzMission["type"], string>;
  locale: string;
}) {
  if (selection.kind === "state") {
    const meta = findStateByAbbr(selection.abbr);
    const rec = getMetric(selection.abbr);
    const label = pickStateLabel(meta, selection.abbr, locale);
    const missionsHere = uzMissionsUs.filter((m) => m.state === selection.abbr);
    const visitsHere = uzPlannedVisitsUs.filter((v) => v.state === selection.abbr);
    return (
      <div className="rounded-md border-2 border-[var(--color-primary)]/40 bg-[var(--color-surface)] p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="serif text-[18px] font-semibold leading-tight text-[var(--color-ink)]">{label}</div>
            <div className="mono mt-0.5 text-[11px] text-[var(--color-ink-muted)]">
              {selection.abbr}
              {meta?.capital ? ` · ${meta.capital}` : ""}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Defensive: if rec is missing for some reason, render dashes instead
            of returning null — the user always sees feedback that the click
            registered. */}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricCard label={T.gdp} value={rec ? `$${rec.gdpBusd.toFixed(1)}B` : "—"} />
          <MetricCard label={T.pop} value={rec ? `${rec.popMillions.toFixed(2)}M` : "—"} />
          <MetricCard
            label={T.students}
            value={rec ? rec.uzStudents.toLocaleString(locale === "ru" ? "ru-RU" : "en-US") : "—"}
            highlight
          />
        </div>

        {missionsHere.length > 0 ? (
          <div className="mt-3">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
              {T.showMissions}
            </div>
            <ul className="mt-1.5 flex flex-col gap-1 text-[12px]">
              {missionsHere.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <span className="text-[var(--color-ink)]">{m.name}</span>
                  <span className="mono text-[10.5px] text-[var(--color-ink-muted)]">{STATUS_LABEL[m.status]}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {visitsHere.length > 0 ? (
          <div className="mt-3">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
              {T.showVisits}
            </div>
            <ul className="mt-1.5 flex flex-col gap-1 text-[12px]">
              {visitsHere.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-[var(--color-ink)]">{v.organization}</span>
                  <span className="mono shrink-0 text-[10.5px] text-[var(--color-ink-muted)]">{v.date}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  if (selection.kind === "mission") {
    const m = selection.mission;
    return (
      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-pos-soft)] text-[var(--color-pos)]">
            {m.type === "embassy" ? (
              <Landmark className="size-4" />
            ) : m.type === "un-mission" ? (
              <Globe2 className="size-4" />
            ) : (
              <Building2 className="size-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-[var(--color-ink)]">{m.name}</div>
            <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
              {TYPE_LABEL[m.type]} · {m.city} ·{" "}
              <span className="font-medium text-[var(--color-ink)]">{STATUS_LABEL[m.status]}</span>
            </div>
            {m.address ? (
              <div className="mt-1 flex items-start gap-1 text-[11.5px] text-[var(--color-ink-muted)]">
                <MapPin className="mt-0.5 size-3 shrink-0" />
                <span>{m.address}</span>
              </div>
            ) : null}
            {m.web ? (
              <div className="mt-1 text-[11.5px]">
                <a
                  href={m.web}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                >
                  {m.web.replace(/^https?:\/\//, "")}
                </a>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  // visit
  const v = selection.visit;
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-warn-soft)] text-[var(--color-warn)]">
          <CalendarClock className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-[var(--color-ink)]">{v.organization}</div>
          <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
            {T.visit} · {T.date}:{" "}
            <span className="mono font-medium tabular text-[var(--color-ink)]">
              {v.date}
              {v.dateEnd ? ` – ${v.dateEnd}` : ""}
            </span>{" "}
            · {v.city}
          </div>
          <div className="mt-1.5 text-[12px] text-[var(--color-ink)]">
            <span className="text-[var(--color-ink-muted)]">{T.purpose}:</span> {v.purpose}
          </div>
          {v.is_demo && v.source_note ? (
            <div className="mt-1.5 rounded-sm bg-[var(--color-demo-bg)] px-2 py-1 text-[10.5px] text-[var(--color-demo-ink)]">
              {v.source_note}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

function MetricCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md border p-3",
        highlight
          ? "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)]"
          : "border-[var(--color-border)] bg-[var(--color-surface-2)]",
      )}
    >
      <div
        className={cn(
          "text-[10px] font-semibold uppercase tracking-wider",
          highlight ? "text-[var(--color-primary)]" : "text-[var(--color-ink-faint)]",
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "mono mt-1.5 text-[20px] font-semibold leading-none tabular",
          highlight ? "text-[var(--color-primary)]" : "text-[var(--color-ink)]",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function PinToggle({
  active,
  onClick,
  tone,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone: "pos" | "warn";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition",
        active
          ? tone === "pos"
            ? "border-[var(--color-pos)]/40 bg-[var(--color-pos-soft)] text-[var(--color-pos)]"
            : "border-[var(--color-warn)]/40 bg-[var(--color-warn-soft)] text-[var(--color-warn)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
      )}
      aria-pressed={active}
    >
      {icon}
      {children}
    </button>
  );
}

function LegendDot({
  color,
  inner,
  dashed,
  children,
}: {
  color: string;
  inner?: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={14} height={14} aria-hidden viewBox="-7 -7 14 14">
        <circle r={5} fill={color} stroke="white" strokeWidth={1.5} strokeDasharray={dashed ? "2 2" : undefined} />
        {inner ? <circle r={1.6} fill={inner} /> : null}
      </svg>
      <span>{children}</span>
    </span>
  );
}

function LegendDiamond({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={14} height={14} aria-hidden viewBox="-7 -7 14 14">
        <g transform="rotate(45)">
          <rect x={-4.5} y={-4.5} width={9} height={9} fill="#C88A12" stroke="white" strokeWidth={1.2} />
        </g>
      </svg>
      <span>{children}</span>
    </span>
  );
}
