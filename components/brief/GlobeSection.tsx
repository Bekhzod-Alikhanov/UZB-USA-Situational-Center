"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { LazyMount } from "@/components/util/LazyMount";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import { useSettings } from "@/lib/store/settings";
import { buildBriefGlobeData, type Corridor } from "@/components/brief/geo";
import { intlLocale, parseDay } from "@/components/brief/brief-data";
import type { BriefHoverPayload } from "@/components/brief/BriefGlobe";

/**
 * Client boundary for the globe hero: owns the corridor-highlight state
 * (delegation chips ⇄ arcs), assembles globe data honoring the hideDemo
 * setting, and renders the hover tooltip card. The heavy globe.gl chunk
 * (three.js) loads lazily behind LazyMount + next/dynamic(ssr:false), so it
 * fetches during the intro animation and never blocks the hero LCP.
 */
const BriefGlobeDynamic = dynamic(() => import("./BriefGlobe").then((m) => ({ default: m.BriefGlobe })), {
  ssr: false,
  loading: () => <GlobeSkeleton />,
});

function GlobeSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="brief-globe-skeleton aspect-square h-[82%] w-auto" />
    </div>
  );
}

export function GlobeSection() {
  const t = useTranslations("brief.globe");
  const locale = useLocale();
  const hideDemo = useSettings((s) => s.hideDemo);
  const data = useMemo(() => buildBriefGlobeData(hideDemo), [hideDemo]);
  const [highlight, setHighlight] = useState<Corridor | null>(null);
  const [hover, setHover] = useState<BriefHoverPayload | null>(null);

  const numberFormat = useMemo(() => new Intl.NumberFormat(intlLocale(locale)), [locale]);
  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );

  const corridorCounts = useMemo(
    () => ({
      dc: data.arcs.filter((a) => a.corridor === "dc").length,
      ny: data.arcs.filter((a) => a.corridor === "ny").length,
    }),
    [data],
  );

  const toggleCorridor = (c: Corridor) => setHighlight((cur) => (cur === c ? null : c));

  return (
    <div className="brief-globe-region relative h-[520px] xl:h-[600px]">
      <div role="img" aria-label={t("ariaLabel")} className="absolute inset-0">
        <LazyMount minHeight="100%" className="h-full" fallback={<GlobeSkeleton />}>
          <BriefGlobeDynamic
            points={data.points}
            arcs={data.arcs}
            rings={data.rings}
            highlightCorridor={highlight}
            onHover={setHover}
          />
        </LazyMount>
      </div>

      {/* Delegation corridors — clicking a count highlights its arcs. */}
      <div className="absolute right-0 top-1 z-[2] flex flex-col items-end gap-2">
        <button
          type="button"
          className="brief-chip"
          aria-pressed={highlight === "dc"}
          onClick={() => toggleCorridor("dc")}
        >
          {t("corridorDc", { count: corridorCounts.dc })}
        </button>
        <button
          type="button"
          className="brief-chip"
          aria-pressed={highlight === "ny"}
          onClick={() => toggleCorridor("ny")}
        >
          {t("corridorNy", { count: corridorCounts.ny })}
        </button>
      </div>

      {/* Legend */}
      <ul className="absolute bottom-1 left-0 z-[2] flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-[var(--brief-ink-faint)]">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block size-2 rounded-full bg-[var(--brief-accent)]" />
          {t("legendInvestments")}
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block size-2 rounded-full bg-[var(--brief-ink-faint)]" />
          {t("legendMissions")}
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-px w-4 bg-[var(--brief-accent-bright)]" />
          {t("legendVisits")}
        </li>
      </ul>

      {hover ? (
        <div className="brief-tooltip" aria-hidden>
          {hover.kind === "point" ? (
            <>
              <p className="text-[13px] font-semibold leading-snug text-[var(--brief-ink)]">
                {hover.point.kind === "hub" ? t("hubTitle") : hover.point.titles[0]}
              </p>
              {hover.point.kind === "investment" && hover.point.titles.length > 1 ? (
                <p className="mt-0.5 text-[12px] leading-snug text-[var(--brief-ink-muted)]">
                  {hover.point.titles[1]}
                  {hover.point.titles.length > 2
                    ? ` · ${t("moreProjects", { count: hover.point.titles.length - 2 })}`
                    : ""}
                </p>
              ) : null}
              <p className="mt-1 text-[12px] text-[var(--brief-ink-muted)]">
                {hover.point.kind === "hub"
                  ? t("incoming", { count: data.incomingVisits })
                  : hover.point.kind === "investment"
                    ? hover.point.valueMusd
                      ? t("valueMln", { value: numberFormat.format(hover.point.valueMusd) })
                      : t("undisclosed")
                    : t(`missionStatus.${hover.point.detail ?? "active"}`)}
              </p>
              {hover.point.isDemo ? <DemoBadge className="mt-1.5" /> : null}
            </>
          ) : (
            <>
              <p className="text-[13px] font-semibold leading-snug text-[var(--brief-ink)]">{hover.arc.title}</p>
              <p className="mt-1 text-[12px] text-[var(--brief-ink-muted)]">
                {hover.arc.kind === "pipeline" ? `${t("pipelineLabel")} · ` : ""}
                {dateFormat.format(parseDay(hover.arc.date))}
              </p>
              {hover.arc.isDemo ? <DemoBadge className="mt-1.5" /> : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
