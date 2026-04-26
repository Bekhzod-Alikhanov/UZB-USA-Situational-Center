import { ArrowRight, CalendarClock, Target } from "lucide-react";
import {
  visitPipelines,
  visitRoadmaps,
  type ReadinessState,
  type VisitPipeline,
} from "@/data/visit-prep";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

const READINESS_TONE: Record<ReadinessState, string> = {
  Done: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  "In progress": "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  Risk: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "Not started": "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

const PRIORITY_TONE: Record<VisitPipeline["priority"], string> = {
  High: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  "Medium-high": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "Follow-up": "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  Routine: "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

function readinessColor(score: number): string {
  if (score >= 75) return "var(--color-pos)";
  if (score >= 50) return "var(--color-primary)";
  if (score >= 25) return "var(--color-warn)";
  return "var(--color-neg)";
}

/**
 * Visit pipelines panel — three upcoming visits with readiness scores 0-100,
 * drag-free overview of delegation, program, projects, checklist, KPI, and
 * follow-up tasks. Server component; pure render of the data module.
 */
export function PipelinePanel() {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {visitPipelines.map((p) => {
          const color = readinessColor(p.readiness);
          return (
            <li
              key={p.id}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="serif text-[15px] font-medium leading-snug text-[var(--color-ink)]">
                      {p.title}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        PRIORITY_TONE[p.priority],
                      )}
                    >
                      {p.priority}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[11.5px] text-[var(--color-ink-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="size-3" />
                      <span className="mono tabular">{p.dateRange}</span>
                    </span>
                    <span>·</span>
                    <span>{p.direction}</span>
                    <span>·</span>
                    <span>{p.theme}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Readiness donut */}
                  <div className="relative size-[52px]">
                    <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray={`${p.readiness} 100`}
                        strokeLinecap="round"
                        pathLength={100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="mono text-[12px] font-semibold tabular text-[var(--color-ink)]">
                        {p.readiness}
                      </span>
                    </div>
                  </div>
                  {p.sourceId ? <SourceBadge sourceId={p.sourceId} /> : null}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 text-[11.5px] md:grid-cols-3">
                <div>
                  <div className="stat-label mb-1">Delegation</div>
                  <ul className="flex flex-col gap-0.5 text-[var(--color-ink-muted)]">
                    {p.delegation.map((d) => (
                      <li key={d}>· {d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="stat-label mb-1">Program</div>
                  <ul className="flex flex-col gap-0.5 text-[var(--color-ink-muted)]">
                    {p.program.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="stat-label mb-1">Projects</div>
                  <ul className="flex flex-col gap-0.5 text-[var(--color-ink-muted)]">
                    {p.projects.map((pr) => (
                      <li key={pr}>· {pr}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3">
                <div className="stat-label mb-1">Readiness checklist</div>
                <ul className="flex flex-wrap gap-1.5">
                  {p.checklist.map((c) => (
                    <li
                      key={c.label}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px]",
                        READINESS_TONE[c.state],
                      )}
                    >
                      <span className="font-medium">{c.label}</span>
                      <span className="opacity-70">· {c.state}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 border-t border-[var(--color-border)] pt-3 text-[11.5px] md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Target className="mt-0.5 size-3.5 shrink-0 text-[var(--color-primary)]" />
                  <div>
                    <div className="stat-label mb-0.5">KPI target</div>
                    <div className="text-[var(--color-ink)]">{p.kpi}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-[var(--color-warn)]" />
                  <div>
                    <div className="stat-label mb-0.5">Follow-up</div>
                    <div className="text-[var(--color-ink-muted)]">{p.followUp}</div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Roadmap progress */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <div className="text-[12.5px] font-semibold text-[var(--color-ink)]">Linked roadmaps</div>
            <div className="text-[11px] text-[var(--color-ink-muted)]">
              How visits roll up into multi-stage cooperation tracks
            </div>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {visitRoadmaps.map((r) => (
            <li
              key={r.id}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12.5px] font-medium text-[var(--color-ink)]">{r.title}</span>
                <span className="mono text-[11px] tabular text-[var(--color-ink-muted)]">{r.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${r.progress}%` }}
                />
              </div>
              <div className="mt-1.5 flex flex-wrap gap-3 text-[10.5px] text-[var(--color-ink-muted)]">
                <span><span className="font-semibold text-[var(--color-ink)]">Stages:</span> {r.stages}</span>
                <span><span className="font-semibold text-[var(--color-ink)]">Linked:</span> {r.linkedVisit}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
