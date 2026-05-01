"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { geoAlbersUsa, geoPath, type GeoProjection } from "d3-geo";
import {
  usStateMetrics,
  usStateMetricsMeta,
  metricValue,
  maxFor,
  totalFor,
  type UsStatesMetric,
} from "@/data/us-state-metrics";
import { findStateByName, findStateByAbbr, type UsState } from "@/data/us-states";
import { uzMissionsUs, type UzMission, type UzMissionStatus } from "@/data/uz-missions-us";
import { uzPlannedVisitsUs, type UzPlannedVisit } from "@/data/uz-planned-visits-us";
import { cn } from "@/lib/utils";
import { Building2, Globe2, Landmark, MapPin, CalendarClock } from "lucide-react";

const WIDTH = 960;
const HEIGHT = 560;

interface Feature {
  type: "Feature";
  properties: { name: string; [key: string]: unknown };
  geometry: { type: string; coordinates: unknown };
}
interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

// ---------------------------------------------------------------------------
// i18n strings
// ---------------------------------------------------------------------------
interface Strings {
  metric: string;
  gdp: string;
  pop: string;
  diaspora: string;
  gdpDesc: string;
  popDesc: string;
  diasporaDesc: string;
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
  noteGdp: string;
  notePop: string;
  noteDiaspora: string;
  diasporaEstimate: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    metric: "Metric",
    gdp: "GDP 2024",
    pop: "Population",
    diaspora: "UZ diaspora",
    gdpDesc: "Gross Domestic Product, 2024 — BEA SAGDP1, USD billions",
    popDesc: "Population estimate (Census Vintage 2024, July 1, 2024) — thousands",
    diasporaDesc: "Estimated Uzbek-American population, 2025 — ACS 2022 + community estimates",
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
    noteGdp: `Source: ${usStateMetricsMeta.gdp.sourceShort}, year ${usStateMetricsMeta.gdp.year}.`,
    notePop: `Source: ${usStateMetricsMeta.population.sourceShort}, ${usStateMetricsMeta.population.note}`,
    noteDiaspora: `Source: ${usStateMetricsMeta.diaspora.sourceShort}. ${usStateMetricsMeta.diaspora.note}`,
    diasporaEstimate: "Estimate",
  },
  ru: {
    metric: "Показатель",
    gdp: "ВВП 2024",
    pop: "Население",
    diaspora: "Диаспора УЗ",
    gdpDesc: "Валовой внутренний продукт, 2024 — BEA SAGDP1, млрд $",
    popDesc: "Оценка населения (Census Vintage 2024, 1 июля 2024) — в тыс. человек",
    diasporaDesc: "Оценка узбекской диаспоры, 2025 — ACS 2022 + общинные оценки",
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
    noteGdp: `Источник: ${usStateMetricsMeta.gdp.sourceShort}, ${usStateMetricsMeta.gdp.year}.`,
    notePop: `Источник: ${usStateMetricsMeta.population.sourceShort}. ${usStateMetricsMeta.population.note}`,
    noteDiaspora: `Источник: ${usStateMetricsMeta.diaspora.sourceShort}. ${usStateMetricsMeta.diaspora.note}`,
    diasporaEstimate: "Оценка",
  },
  "uz-latn": {
    metric: "Ko'rsatkich",
    gdp: "YaIM 2024",
    pop: "Aholi",
    diaspora: "UZ diasporasi",
    gdpDesc: "Yalpi ichki mahsulot, 2024 — BEA SAGDP1, mlrd $",
    popDesc: "Aholi soni (Census V2024, 1-iyul 2024) — ming kishi",
    diasporaDesc: "O'zbek diasporasi taxminiy soni, 2025 — ACS 2022 + jamoatchilik baholashlari",
    pinsTitle: "Belgilar",
    showMissions: "Diplomatik vakolatxonalar",
    showVisits: "Rejalashtirilgan tashriflar",
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
    noteGdp: `Manba: ${usStateMetricsMeta.gdp.sourceShort}, ${usStateMetricsMeta.gdp.year}.`,
    notePop: `Manba: ${usStateMetricsMeta.population.sourceShort}.`,
    noteDiaspora: `Manba: ${usStateMetricsMeta.diaspora.sourceShort}. ${usStateMetricsMeta.diaspora.note}`,
    diasporaEstimate: "Taxmin",
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

// ---------------------------------------------------------------------------
// Color scale
// ---------------------------------------------------------------------------
function colorScale(value: number, max: number): string {
  if (max === 0 || value === 0) return "var(--color-surface-2)";
  const t = Math.min(1, value / max);
  if (t > 0.75) return "color-mix(in oklab, var(--color-primary) 95%, transparent)";
  if (t > 0.5) return "color-mix(in oklab, var(--color-primary) 70%, transparent)";
  if (t > 0.25) return "color-mix(in oklab, var(--color-primary) 45%, transparent)";
  if (t > 0) return "color-mix(in oklab, var(--color-primary) 22%, transparent)";
  return "var(--color-surface-2)";
}

// ---------------------------------------------------------------------------
// Mission / visit styling
// ---------------------------------------------------------------------------
const MISSION_STATUS_COLOR: Record<UzMissionStatus, string> = {
  active: "var(--color-pos)",
  "opened-2026": "var(--color-primary)",
  "planned-2026": "var(--color-warn)",
  "planned-2027": "var(--color-warn)",
};

function formatNumber(v: number, metric: UsStatesMetric, locale: string): string {
  const nf = new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US");
  if (metric === "gdp") return `$${nf.format(v)} bn`;
  if (metric === "population") return `${nf.format(v)} k`;
  return nf.format(v);
}

interface PinSelection {
  kind: "mission" | "visit";
  mission?: UzMission;
  visit?: UzPlannedVisit;
  x: number;
  y: number;
}

interface StateHover {
  abbr: string;
  name: string;
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function UsCenteredMap() {
  const locale = useLocale();
  const T = pickStr(locale);

  const [metric, setMetric] = useState<UsStatesMetric>("gdp");
  const [showMissions, setShowMissions] = useState(true);
  const [showVisits, setShowVisits] = useState(true);
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [hover, setHover] = useState<StateHover | null>(null);
  const [pin, setPin] = useState<PinSelection | null>(null);

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
    return geoAlbersUsa().fitSize([WIDTH, HEIGHT], {
      type: "FeatureCollection",
      features,
    } as never);
  }, [features]);

  const path = useMemo(() => (projection ? geoPath(projection) : null), [projection]);

  const max = maxFor(metric);
  const total = totalFor(metric);

  const top5 = useMemo(() => {
    return [...usStateMetrics]
      .map((s) => ({ abbr: s.abbr, v: metricValue(s.abbr, metric) }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 5);
  }, [metric]);

  const METRIC_LABEL: Record<UsStatesMetric, string> = {
    gdp: T.gdp,
    population: T.pop,
    diaspora: T.diaspora,
  };
  const METRIC_DESC: Record<UsStatesMetric, string> = {
    gdp: T.gdpDesc,
    population: T.popDesc,
    diaspora: T.diasporaDesc,
  };
  const METRIC_NOTE: Record<UsStatesMetric, string> = {
    gdp: T.noteGdp,
    population: T.notePop,
    diaspora: T.noteDiaspora,
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

  function project(lng: number, lat: number): [number, number] | null {
    if (!projection) return null;
    return projection([lng, lat]) as [number, number] | null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">
            {T.metric}:
          </span>
          {(["gdp", "population", "diaspora"] as UsStatesMetric[]).map((m) => (
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
          <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">
            {T.pinsTitle}:
          </span>
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
        {METRIC_DESC[metric]}
      </div>

      {/* Map */}
      <div className="relative overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]">
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
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="block h-auto w-full"
            role="img"
            aria-label="United States map — UZ engagement footprint"
            onMouseLeave={() => setHover(null)}
          >
            {/* Choropleth */}
            <g>
              {features.map((f, i) => {
                const stateName = String(f.properties.name);
                const meta = findStateByName(stateName);
                const value = meta ? metricValue(meta.abbr, metric) : 0;
                const fill = colorScale(value, max);
                const d = path(f as never);
                if (!d) return null;
                return (
                  <path
                    key={i}
                    d={d}
                    fill={fill}
                    stroke="var(--color-border-strong)"
                    strokeWidth={0.6}
                    onMouseMove={(e) => {
                      if (!meta) return;
                      const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                      const scaleX = WIDTH / rect.width;
                      const scaleY = HEIGHT / rect.height;
                      setHover({
                        abbr: meta.abbr,
                        name: stateName,
                        x: (e.clientX - rect.left) * scaleX,
                        y: (e.clientY - rect.top) * scaleY,
                      });
                    }}
                    style={{ cursor: meta ? "pointer" : "default" }}
                  >
                    <title>
                      {`${pickStateLabel(meta, stateName, locale)} — ${formatNumber(value, metric, locale)}`}
                    </title>
                  </path>
                );
              })}
            </g>

            {/* Mission pins */}
            {showMissions ? (
              <g>
                {uzMissionsUs.map((m) => {
                  const p = project(m.lng, m.lat);
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
                        const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                        setPin({
                          kind: "mission",
                          mission: m,
                          x: rect.left + (cx / WIDTH) * rect.width,
                          y: rect.top + (cy / HEIGHT) * rect.height,
                        });
                      }}
                    >
                      <circle
                        r={6}
                        fill={color}
                        stroke="white"
                        strokeWidth={2}
                        strokeDasharray={isPlanned ? "2 2" : undefined}
                      />
                      {/* Inner dot signals UN-mission specifically */}
                      {m.type === "un-mission" ? (
                        <circle r={2} fill="white" />
                      ) : null}
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
                  const p = project(v.lng, v.lat);
                  if (!p) return null;
                  const [cx, cy] = p;
                  return (
                    <g
                      key={v.id}
                      transform={`translate(${cx},${cy}) rotate(45)`}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                        setPin({
                          kind: "visit",
                          visit: v,
                          x: rect.left + (cx / WIDTH) * rect.width,
                          y: rect.top + (cy / HEIGHT) * rect.height,
                        });
                      }}
                    >
                      <rect
                        x={-5}
                        y={-5}
                        width={10}
                        height={10}
                        fill="var(--color-warn)"
                        stroke="white"
                        strokeWidth={1.5}
                        opacity={v.is_demo ? 0.7 : 1}
                      />
                      <title>{`${v.organization} — ${v.date}`}</title>
                    </g>
                  );
                })}
              </g>
            ) : null}
          </svg>
        )}

        {/* State hover tooltip (positioned in viewport-coords) */}
        {hover ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[11px] shadow-md"
            style={{
              // The SVG uses viewBox; convert SVG coords back to container ratio.
              left: `${(hover.x / WIDTH) * 100}%`,
              top: `${(hover.y / HEIGHT) * 100}%`,
            }}
          >
            <StateTooltip abbr={hover.abbr} name={hover.name} locale={locale} T={T} />
          </div>
        ) : null}
      </div>

      {/* Pin detail card */}
      {pin ? (
        <PinDetail
          pin={pin}
          onClose={() => setPin(null)}
          T={T}
          STATUS_LABEL={STATUS_LABEL}
          TYPE_LABEL={TYPE_LABEL}
          locale={locale}
        />
      ) : null}

      {/* Legend + Top-5 */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Choropleth scale */}
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
            {T.scale} · {METRIC_LABEL[metric]}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            {[0.05, 0.25, 0.5, 0.75, 1].map((t) => (
              <span
                key={t}
                className="h-3 flex-1 rounded-sm"
                style={{
                  background: `color-mix(in oklab, var(--color-primary) ${t * 95}%, transparent)`,
                }}
                aria-hidden
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-[var(--color-ink-muted)]">
            <span>0</span>
            <span className="mono tabular">{formatNumber(max, metric, locale)}</span>
          </div>
          <div className="mt-1.5 text-[10.5px] text-[var(--color-ink-muted)]">
            {T.total}:{" "}
            <span className="mono font-semibold tabular text-[var(--color-ink)]">
              {formatNumber(total, metric, locale)}
            </span>
          </div>
        </div>

        {/* Pin legend */}
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
          <div className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
            {T.legend}
          </div>
          <div className="mt-1.5 flex flex-col gap-1 text-[11px] text-[var(--color-ink)]">
            <LegendDot color="var(--color-pos)">
              {T.embassy} / {T.consulateGeneral} — {T.active}
            </LegendDot>
            <LegendDot color="var(--color-pos)" inner="white">
              {T.unMission}
            </LegendDot>
            <LegendDot color="var(--color-primary)">{T.opened2026}</LegendDot>
            <LegendDot color="var(--color-warn)" dashed>
              {T.planned2026} / {T.planned2027}
            </LegendDot>
            <LegendDiamond>{T.visit}</LegendDiamond>
          </div>
        </div>

        {/* Top-5 */}
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
                    <span className="truncate text-[var(--color-ink)]">
                      {pickStateLabel(meta, s.abbr, locale)}
                    </span>
                  </span>
                  <span className="mono shrink-0 tabular text-[var(--color-ink)]">
                    {formatNumber(s.v, metric, locale)}
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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function StateTooltip({
  abbr,
  name,
  locale,
  T,
}: {
  abbr: string;
  name: string;
  locale: string;
  T: Strings;
}) {
  const meta = findStateByAbbr(abbr);
  const label = pickStateLabel(meta, name, locale);
  const gdp = metricValue(abbr, "gdp");
  const pop = metricValue(abbr, "population");
  const dia = metricValue(abbr, "diaspora");
  return (
    <div className="flex flex-col gap-0.5 whitespace-nowrap">
      <div className="font-medium text-[var(--color-ink)]">{label}</div>
      <div className="mono tabular text-[var(--color-ink-muted)]">
        {T.gdp}: <span className="text-[var(--color-ink)]">${gdp.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")} bn</span>
      </div>
      <div className="mono tabular text-[var(--color-ink-muted)]">
        {T.pop}:{" "}
        <span className="text-[var(--color-ink)]">{pop.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")} k</span>
      </div>
      <div className="mono tabular text-[var(--color-ink-muted)]">
        {T.diaspora}:{" "}
        <span className="text-[var(--color-ink)]">{dia.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")}</span>
      </div>
    </div>
  );
}

function PinDetail({
  pin,
  onClose,
  T,
  STATUS_LABEL,
  TYPE_LABEL,
  locale,
}: {
  pin: PinSelection;
  onClose: () => void;
  T: Strings;
  STATUS_LABEL: Record<UzMissionStatus, string>;
  TYPE_LABEL: Record<UzMission["type"], string>;
  locale: string;
}) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      {pin.kind === "mission" && pin.mission ? (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-pos-soft)] text-[var(--color-pos)]">
            {pin.mission.type === "embassy" ? (
              <Landmark className="size-4" />
            ) : pin.mission.type === "un-mission" ? (
              <Globe2 className="size-4" />
            ) : (
              <Building2 className="size-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-[var(--color-ink)]">{pin.mission.name}</div>
            <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
              <span className="mono">{TYPE_LABEL[pin.mission.type]}</span> ·{" "}
              <span>{pin.mission.city}</span> · {T.status}:{" "}
              <span className="font-medium text-[var(--color-ink)]">
                {STATUS_LABEL[pin.mission.status]}
              </span>
            </div>
            {pin.mission.address ? (
              <div className="mt-1 flex items-start gap-1 text-[11px] text-[var(--color-ink-muted)]">
                <MapPin className="mt-0.5 size-3 shrink-0" />
                <span>{pin.mission.address}</span>
              </div>
            ) : null}
            {pin.mission.web ? (
              <div className="mt-1 text-[11px]">
                <a
                  href={pin.mission.web}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                >
                  {pin.mission.web.replace(/^https?:\/\//, "")}
                </a>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-[11px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            ✕
          </button>
        </div>
      ) : null}

      {pin.kind === "visit" && pin.visit ? (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-warn-soft)] text-[var(--color-warn)]">
            <CalendarClock className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-[var(--color-ink)]">
              {pin.visit.organization}
            </div>
            <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
              <span>{T.visit}</span> · {T.date}:{" "}
              <span className="mono font-medium tabular text-[var(--color-ink)]">
                {pin.visit.date}
                {pin.visit.dateEnd ? ` – ${pin.visit.dateEnd}` : ""}
              </span>{" "}
              · {pin.visit.city}
            </div>
            <div className="mt-1 text-[11.5px] text-[var(--color-ink)]">
              <span className="text-[var(--color-ink-muted)]">{T.purpose}:</span> {pin.visit.purpose}
            </div>
            {pin.visit.is_demo && pin.visit.source_note ? (
              <div className="mt-1.5 rounded-sm bg-[var(--color-demo-bg)] px-2 py-1 text-[10.5px] text-[var(--color-demo-ink)]">
                {pin.visit.source_note}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-[11px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      ) : null}
      {/* locale used to satisfy unused-var lint when no number formatting reaches here */}
      <span hidden aria-hidden>
        {locale}
      </span>
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
        <circle
          r={5}
          fill={color}
          stroke="white"
          strokeWidth={1.5}
          strokeDasharray={dashed ? "2 2" : undefined}
        />
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
          <rect x={-4.5} y={-4.5} width={9} height={9} fill="var(--color-warn)" stroke="white" strokeWidth={1.2} />
        </g>
      </svg>
      <span>{children}</span>
    </span>
  );
}
