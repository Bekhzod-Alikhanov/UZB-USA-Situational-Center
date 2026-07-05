"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { roadmapStepCounts, roadmapDonePct, allRoadmapSteps } from "@/data/roadmaps";
import { useRoadmapOverrides } from "@/components/roadmaps/live";
import { BriefNumber } from "@/components/brief/BriefNumber";

/**
 * Aggregated roadmap execution for the landing brief: one segmented scale
 * over the TASKS of both regional roadmaps (done / in motion / overdue — the
 * three states leadership reads at a glance) plus an animated done-share
 * figure. Step health is date-derived, so it is computed client-side after
 * mount (the page is SSG; a server date would freeze at build time).
 */
export function RoadmapExecutionBar() {
  const t = useTranslations("brief.execution");
  const [now, setNow] = useState<Date | null>(null);
  const { overrides } = useRoadmapOverrides();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  if (!now) {
    return (
      <div className="space-y-3" aria-hidden>
        <div className="h-[30px] w-40 animate-pulse rounded bg-[var(--brief-surface-2)]" />
        <div className="h-[10px] w-full animate-pulse rounded-full bg-[var(--brief-surface-2)]" />
        <div className="h-[18px] w-56 animate-pulse rounded bg-[var(--brief-surface-2)]" />
      </div>
    );
  }

  const counts = roadmapStepCounts(now, overrides);
  const total = allRoadmapSteps().length;
  const inMotion = counts["on-track"] + counts["due-soon"];
  const donePct = roadmapDonePct(overrides);

  const segments = [
    { key: "done", value: counts.done, color: "var(--brief-pos)", label: t("done") },
    { key: "inMotion", value: inMotion, color: "var(--brief-accent)", label: t("inMotion") },
    { key: "overdue", value: counts.overdue, color: "var(--brief-neg)", label: t("overdue") },
  ].filter((s) => s.value > 0);

  return (
    <div className="brief-print-block">
      <div className="flex items-baseline gap-2">
        <span className="brief-kpi-value !mt-0">
          <BriefNumber value={donePct} decimals={0} suffix="%" />
        </span>
        <span className="text-[12.5px] text-[var(--brief-ink-muted)]">{t("completion", { total })}</span>
      </div>
      <div
        className="mt-4 flex h-[10px] w-full gap-px overflow-hidden rounded-full"
        role="img"
        aria-label={t("scaleAria", { done: counts.done, inMotion, overdue: counts.overdue })}
      >
        {segments.map((s) => (
          <span key={s.key} className="h-full" style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[var(--brief-ink-muted)]">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: s.color }} />
            {s.label} · {s.value}
          </li>
        ))}
      </ul>
      {counts["due-soon"] > 0 ? (
        <p className="mt-1.5 text-[11.5px] text-[var(--brief-ink-faint)]">
          {t("dueSoonNote", { count: counts["due-soon"] })}
        </p>
      ) : null}
    </div>
  );
}
