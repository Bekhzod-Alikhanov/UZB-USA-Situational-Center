"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  roadmapProjects,
  projectHealth,
  stepHealth,
  roadmapProjectTitle,
  roadmapStepTitle,
  type RoadmapRegionId,
  type RoadmapStepHealth,
  type RoadmapProjectHealth,
} from "@/data/roadmaps";
import { intlLocale } from "@/components/brief/brief-data";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type RegionFilter = "all" | RoadmapRegionId;

const PROJECT_DOT: Record<RoadmapProjectHealth, string> = {
  done: "bg-[var(--color-pos)]",
  "on-track": "bg-[var(--color-pos)]",
  attention: "bg-[var(--color-warn)]",
  "off-track": "bg-[var(--color-neg)]",
};

const STEP_DOT: Record<RoadmapStepHealth, string> = {
  done: "bg-[var(--color-pos)]",
  "on-track": "bg-[var(--color-primary)]",
  "due-soon": "bg-[var(--color-warn)]",
  overdue: "bg-[var(--color-neg)]",
};

/**
 * The roadmap project explorer: URL-synced region/search filters (pattern of
 * the former CommitmentsTable), one row per project, native <details> opens
 * the task list — a vertical step list with derived-health dots, deadlines,
 * responsible officials and Center notes. Deliberately NOT a gantt/tracker:
 * the top level shows counts and one health dot per project only.
 */
export function RoadmapsExplorer() {
  const t = useTranslations("roadmaps");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const region = ((): RegionFilter => {
    const v = searchParams.get("region");
    return v === "samarkand" || v === "khorezm" ? v : "all";
  })();
  const q = searchParams.get("q") ?? "";

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

  const setParam = (key: "region" | "q", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return roadmapProjects.filter((p) => {
      if (region !== "all" && p.region !== region) return false;
      if (!needle) return true;
      return (
        p.title.toLowerCase().includes(needle) ||
        p.titleRu.toLowerCase().includes(needle) ||
        p.initiator.toLowerCase().includes(needle)
      );
    });
  }, [region, q]);

  const formatDueMonth = (due: string) => {
    const [y, m] = due.split("-").map(Number);
    return monthFmt.format(new Date(y, m - 1, 1));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "samarkand", "khorezm"] as RegionFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setParam("region", value)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition",
              region === value
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
            )}
          >
            {t(`filters.${value}`)}
          </button>
        ))}
        <label className="relative ml-auto block w-full max-w-[260px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            aria-label={t("filters.searchLabel")}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-8 pr-3 text-[12.5px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </label>
      </div>

      <p className="text-[11.5px] text-[var(--color-ink-faint)]">{t("list.showing", { count: filtered.length })}</p>

      <ul className="flex flex-col gap-2">
        {filtered.map((project) => {
          const health = now ? projectHealth(project, now) : null;
          const doneSteps = project.steps.filter((s) => s.state === "done").length;
          return (
            <li key={project.id}>
              <details className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3 transition hover:bg-[var(--color-surface-2)] [&::-webkit-details-marker]:hidden">
                  <span className="mono mt-0.5 w-8 shrink-0 text-[11px] tabular text-[var(--color-ink-faint)]">
                    {String(project.num).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium leading-snug text-[var(--color-ink)]">
                      {roadmapProjectTitle(project, locale)}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-[var(--color-ink-muted)]">
                      {project.initiator}
                      {project.valueMusd !== null ? (
                        <>
                          {" · "}
                          <span className="mono tabular">
                            ${nf.format(project.valueMusd)} {t("list.mln")}
                          </span>
                        </>
                      ) : null}
                      {" · "}
                      {t("list.steps", { done: doneSteps, total: project.steps.length })}
                    </span>
                  </span>
                  {health ? (
                    <span
                      title={t(`projectHealth.${health}`)}
                      className={cn("mt-1.5 inline-block size-2.5 shrink-0 rounded-full", PROJECT_DOT[health])}
                    >
                      <span className="sr-only">{t(`projectHealth.${health}`)}</span>
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="mt-1.5 inline-block size-2.5 shrink-0 rounded-full bg-[var(--color-surface-2)]"
                    />
                  )}
                  <span className="mt-0.5 shrink-0 text-[11px] text-[var(--color-ink-faint)] transition group-open:rotate-90">
                    ›
                  </span>
                </summary>

                <ol className="border-t border-[var(--color-border)] px-4 py-3">
                  {project.steps.map((step, index) => {
                    const sh = now ? stepHealth(step, now) : "on-track";
                    return (
                      <li
                        key={step.id}
                        className="flex gap-3 py-2 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[var(--color-border)]"
                      >
                        <span
                          title={t(`stepHealth.${sh}`)}
                          className={cn("mt-1 inline-block size-2 shrink-0 rounded-full", STEP_DOT[sh])}
                        >
                          <span className="sr-only">{t(`stepHealth.${sh}`)}</span>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-[12.5px] leading-snug",
                              step.state === "done"
                                ? "text-[var(--color-ink-faint)] line-through decoration-[var(--color-border-strong)]"
                                : "text-[var(--color-ink)]",
                            )}
                          >
                            <span className="mono mr-1 text-[10.5px] text-[var(--color-ink-faint)]">{index + 1}.</span>
                            {roadmapStepTitle(step, locale)}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-[var(--color-ink-faint)]">
                            {t("list.due", { month: formatDueMonth(step.due) })} · {step.owners.join(" · ")}
                          </p>
                          {step.note ? (
                            <p className="mt-1 rounded bg-[var(--color-surface-2)] px-2 py-1 text-[11px] text-[var(--color-ink-muted)]">
                              {t("list.note")}: {step.note}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <div className="border-t border-[var(--color-border)] px-4 py-2 text-[10.5px]">
                  <SourceBadge sourceId={project.sourceId} />
                </div>
              </details>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 ? (
        <p className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-4 text-center text-[12.5px] text-[var(--color-ink-muted)]">
          {t("list.empty")}
        </p>
      ) : null}
    </div>
  );
}
