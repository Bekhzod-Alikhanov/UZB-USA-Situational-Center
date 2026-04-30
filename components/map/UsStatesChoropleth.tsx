"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { geoAlbersUsa, geoPath } from "d3-geo";
import {
  usStates,
  findStateByName,
  valueFor,
  maxFor,
  usStatesMeta,
  visitsByState,
  investmentsByState,
  councilMembersByState,
  type UsState,
  type UsStatesMode,
} from "@/data/us-states";
import { cn } from "@/lib/utils";

interface Feature {
  type: "Feature";
  properties: { name: string; [key: string]: unknown };
  geometry: { type: string; coordinates: unknown };
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

const WIDTH = 960;
const HEIGHT = 540;

interface Strings {
  mode: string;
  visits: string;
  investments: string;
  council: string;
  visitsDesc: string;
  investmentsDesc: string;
  councilDesc: string;
  total: string;
  states: string;
  state: string;
  scale: string;
  top5: string;
  loading: string;
  failed: string;
  note: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    mode: "Mode",
    visits: "Visits",
    investments: "Investments",
    council: "US-UZ Council",
    visitsDesc: "Confirmed visits with the meeting venue in this state (data/visits.ts)",
    investmentsDesc: "Number of US partners headquartered here (data/investments.ts + curated HQ map)",
    councilDesc: "US-UZ Business & Investment Council members HQ'd here (us_uz_council)",
    total: "Total",
    states: "states with activity",
    state: "state with activity",
    scale: "Scale",
    top5: "Top 5",
    loading: "Loading map…",
    failed: "Could not load /us-states.geojson",
    note: `Refreshed ${usStatesMeta.fetched_at} · derived from real dashboard data — visits (${Object.keys(visitsByState).length} states), investments HQ (${Object.keys(investmentsByState).length} states), council members (${Object.keys(councilMembersByState).length} states). Per-state UZ-trade volume not shown — Census reports U.S. exports by state-of-origin, not state-of-destination for foreign trade.`,
  },
  ru: {
    mode: "Режим",
    visits: "Визиты",
    investments: "Инвестиции",
    council: "US-UZ Council",
    visitsDesc: "Количество подтверждённых визитов с местом проведения в этом штате (data/visits.ts)",
    investmentsDesc: "Количество US-партнёров с HQ в этом штате (data/investments.ts + curated HQ map)",
    councilDesc: "Количество членов US-UZ Business & Investment Council с HQ в этом штате (us_uz_council)",
    total: "Всего",
    states: "штатов с активностью",
    state: "штат с активностью",
    scale: "Шкала",
    top5: "Топ-5",
    loading: "Загрузка карты…",
    failed: "Не удалось загрузить /us-states.geojson",
    note: `Обновлено ${usStatesMeta.fetched_at} · построено на реальных данных дашборда — визиты (${Object.keys(visitsByState).length} штатов), инвестиции HQ (${Object.keys(investmentsByState).length} штатов), члены Council (${Object.keys(councilMembersByState).length} штатов). Объёмы торговли по штатам не показаны — Census публикует экспорт США по штату-отправителю, а не по штату-получателю иностранной торговли.`,
  },
  "uz-latn": {
    mode: "Rejim",
    visits: "Tashriflar",
    investments: "Investitsiyalar",
    council: "US-UZ Council",
    visitsDesc: "Ushbu shtatda o'tgan tashriflar soni (data/visits.ts)",
    investmentsDesc: "Ushbu shtatda HQ joylashgan US hamkorlari soni (data/investments.ts)",
    councilDesc: "Ushbu shtatda HQ joylashgan US-UZ Business & Investment Council a'zolari soni",
    total: "Jami",
    states: "ta shtat faol",
    state: "ta shtat faol",
    scale: "Shkala",
    top5: "Top-5",
    loading: "Karta yuklanmoqda…",
    failed: "/us-states.geojson yuklanmadi",
    note: `${usStatesMeta.fetched_at} da yangilangan · haqiqiy data dan olingan — tashriflar (${Object.keys(visitsByState).length}), investitsiya HQ (${Object.keys(investmentsByState).length}), kengash a'zolari (${Object.keys(councilMembersByState).length}).`,
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

function colorScale(value: number, max: number): string {
  if (max === 0 || value === 0) return "var(--color-surface-2)";
  const t = Math.min(1, value / max);
  if (t > 0.75) return "color-mix(in oklab, var(--color-primary) 95%, transparent)";
  if (t > 0.5) return "color-mix(in oklab, var(--color-primary) 70%, transparent)";
  if (t > 0.25) return "color-mix(in oklab, var(--color-primary) 45%, transparent)";
  if (t > 0) return "color-mix(in oklab, var(--color-primary) 22%, transparent)";
  return "var(--color-surface-2)";
}

export function UsStatesChoropleth() {
  const locale = useLocale();
  const T = pickStr(locale);
  const MODE_LABEL: Record<UsStatesMode, string> = {
    visits: T.visits,
    investments: T.investments,
    council: T.council,
  };
  const MODE_DESC: Record<UsStatesMode, string> = {
    visits: T.visitsDesc,
    investments: T.investmentsDesc,
    council: T.councilDesc,
  };

  const [mode, setMode] = useState<UsStatesMode>("visits");
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [hover, setHover] = useState<{
    name: string;
    abbr: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

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

  const path = useMemo(() => {
    if (!features || features.length === 0) return null;
    const proj = geoAlbersUsa().fitSize([WIDTH, HEIGHT], {
      type: "FeatureCollection",
      features,
    } as never);
    return geoPath(proj);
  }, [features]);

  const max = maxFor(mode);
  const total = usStates.reduce((acc, s) => acc + valueFor(mode, s.abbr), 0);

  const top5 = useMemo(() => {
    return [...usStates]
      .map((s) => ({ ...s, v: valueFor(mode, s.abbr) }))
      .filter((s) => s.v > 0)
      .sort((a, b) => b.v - a.v)
      .slice(0, 5);
  }, [mode]);

  const coverageText = (() => {
    const coveredCount = usStates.filter((s) => valueFor(mode, s.abbr) > 0).length;
    return `${coveredCount} ${coveredCount === 1 ? T.state : T.states}`;
  })();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">
          {T.mode}:
        </span>
        {(Object.keys(MODE_LABEL) as UsStatesMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition",
              m === mode
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
            )}
          >
            {MODE_LABEL[m]}
          </button>
        ))}
        <span className="ml-auto text-[10.5px] text-[var(--color-ink-muted)]">
          {T.total}:{" "}
          <span className="mono font-semibold tabular text-[var(--color-ink)]">{total}</span> · {coverageText}
        </span>
      </div>

      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[11.5px] text-[var(--color-ink-muted)]">
        {MODE_DESC[mode]}
      </div>

      <div className="relative overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]">
        {!features ? (
          <div className="flex h-[260px] items-center justify-center text-[12px] text-[var(--color-ink-muted)] sm:h-[420px]">
            {T.loading}
          </div>
        ) : features.length === 0 || !path ? (
          <div className="flex h-[260px] items-center justify-center text-[12px] text-[var(--color-ink-muted)] sm:h-[420px]">
            {T.failed}
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="block h-auto w-full"
            role="img"
            aria-label="US states choropleth"
          >
            <g>
              {features.map((f, i) => {
                const stateName = String(f.properties.name);
                const meta = findStateByName(stateName);
                const value = meta ? valueFor(mode, meta.abbr) : 0;
                const fill = colorScale(value, max);
                const d = path(f as never);
                if (!d) return null;
                const label = pickStateLabel(meta, stateName, locale);
                return (
                  <path
                    key={i}
                    d={d}
                    fill={fill}
                    stroke="var(--color-border-strong)"
                    strokeWidth={0.6}
                    className="transition-opacity"
                    onMouseMove={(e) => {
                      if (!meta) return;
                      const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                      setHover({
                        name: stateName,
                        abbr: meta.abbr,
                        value,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: meta ? "pointer" : "default" }}
                  >
                    <title>{`${label}: ${value} (${MODE_LABEL[mode]})`}</title>
                  </path>
                );
              })}
            </g>
          </svg>
        )}

        {hover ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[11px] shadow-md"
            style={{ left: hover.x, top: hover.y - 8 }}
          >
            <div className="font-medium text-[var(--color-ink)]">
              {pickStateLabel(findStateByName(hover.name), hover.name, locale)}
            </div>
            <div className="mono tabular text-[var(--color-ink-muted)]">
              {hover.abbr} · {MODE_LABEL[mode]}: {hover.value}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10.5px] text-[var(--color-ink-muted)]">
          <span>{T.scale}:</span>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <span
              key={t}
              className="size-3 rounded-sm"
              style={{
                background:
                  t === 0
                    ? "var(--color-surface-2)"
                    : `color-mix(in oklab, var(--color-primary) ${t * 95}%, transparent)`,
              }}
              aria-hidden
            />
          ))}
          <span>0 → {max}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
          <span className="text-[var(--color-ink-muted)]">{T.top5}:</span>
          {top5.map((s) => (
            <span
              key={s.abbr}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5"
            >
              <span className="mono font-semibold tabular text-[var(--color-ink)]">{s.abbr}</span>{" "}
              <span className="text-[var(--color-ink-muted)]">{s.v}</span>
            </span>
          ))}
        </div>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">{T.note}</p>
    </div>
  );
}
