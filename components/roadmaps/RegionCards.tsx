"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  regionRoadmaps,
  regionRollup,
  regionLabel,
  regionVisitDates,
  roadmapStepTitle,
  roadmapProjectTitle,
  type RegionRollup,
} from "@/data/roadmaps";
import { intlLocale } from "@/components/brief/brief-data";

/**
 * Region rollup cards for /roadmaps: project/step counters with derived
 * health dots and the nearest milestone. Health depends on "today", so it is
 * computed client-side after mount (the page is SSG; a server date would
 * freeze at build time).
 */
export function RegionCards() {
  const t = useTranslations("roadmaps");
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat(intlLocale(locale), { month: "long", year: "numeric" }),
    [locale],
  );
  const nf = useMemo(() => new Intl.NumberFormat(intlLocale(locale)), [locale]);

  const formatDueMonth = (due: string) => {
    const [y, m] = due.split("-").map(Number);
    return monthFmt.format(new Date(y, m - 1, 1));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {regionRoadmaps.map((meta) => {
        const rollup: RegionRollup | null = now ? regionRollup(meta.region, now) : null;
        return (
          <div
            key={meta.region}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="serif text-[20px] font-medium text-[var(--color-ink)]">{regionLabel(meta, locale)}</h2>
              <span className="text-[11.5px] text-[var(--color-ink-faint)]">
                {t("region.visitNote", { dates: regionVisitDates(meta, locale) })}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <div className="mono text-[26px] font-semibold tabular leading-none text-[var(--color-ink)]">
                  {meta.declaredProjects}
                </div>
                <div className="mt-1 text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                  {t("region.projects")}
                </div>
              </div>
              <div>
                <div className="mono text-[26px] font-semibold tabular leading-none text-[var(--color-ink)]">
                  ${nf.format(meta.totalValueMusd / 1000)}
                  <span className="text-[15px] font-medium text-[var(--color-ink-muted)]"> {t("region.bln")}</span>
                </div>
                <div className="mt-1 text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                  {t("region.declaredValue")}
                </div>
              </div>
              {rollup ? (
                <div>
                  <div className="mono text-[26px] font-semibold tabular leading-none text-[var(--color-ink)]">
                    {rollup.doneSteps}/{rollup.totalSteps}
                  </div>
                  <div className="mt-1 text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                    {t("region.stepsDone")}
                  </div>
                </div>
              ) : (
                <div className="h-[38px] w-[72px] animate-pulse rounded bg-[var(--color-surface-2)]" aria-hidden />
              )}
            </div>

            {rollup ? (
              <>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[var(--color-ink-muted)]">
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="size-2 rounded-full bg-[var(--color-pos)]" />
                    {t("health.onTrack")} · {rollup.onTrack + rollup.done}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="size-2 rounded-full bg-[var(--color-warn)]" />
                    {t("health.attention")} · {rollup.attention}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="size-2 rounded-full bg-[var(--color-neg)]" />
                    {t("health.offTrack")} · {rollup.offTrack}
                  </span>
                </div>
                {rollup.nextMilestone ? (
                  <p className="mt-3 border-t border-[var(--color-border)] pt-2.5 text-[12px] leading-snug text-[var(--color-ink-muted)]">
                    <span className="font-semibold text-[var(--color-ink)]">
                      {t("region.nextMilestone", { month: formatDueMonth(rollup.nextMilestone.step.due) })}:
                    </span>{" "}
                    {roadmapStepTitle(rollup.nextMilestone.step, locale)}{" "}
                    <span className="text-[var(--color-ink-faint)]">
                      — {roadmapProjectTitle(rollup.nextMilestone.project, locale)}
                    </span>
                  </p>
                ) : null}
              </>
            ) : (
              <div className="mt-4 h-[52px] animate-pulse rounded bg-[var(--color-surface-2)]" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}
