"use client";
import { useMemo, useState } from "react";
import { Check, Clock, Eye, Circle, AlertTriangle } from "lucide-react";
import {
  visitScorecards,
  visitPipelines,
  blockReadinessPct,
  type ScorecardBlock,
  type VisitScorecard,
} from "@/data/visit-prep";
import { cn } from "@/lib/utils";

/**
 * Each T-minus checkpoint maps to a subset of the 7 protocol blocks.
 * The timeline answers "are we on schedule?" rather than "what's done"
 * (which is the scorecard).
 */
interface TMinusCheckpoint {
  /** Days before visit. */
  tMinusDays: number;
  label: string;
  description: string;
  /** Which scorecard blocks this checkpoint covers. */
  blockNumbers: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6 | 7>;
}

const CHECKPOINTS: ReadonlyArray<TMinusCheckpoint> = [
  {
    tMinusDays: 30,
    label: "T-30",
    description: "Инициация: цели, делегация, финансирование",
    blockNumbers: [1, 2],
  },
  {
    tMinusDays: 14,
    label: "T-14",
    description: "Программа и договорной блок: повестка, MoU драфты, юридическое",
    blockNumbers: [3, 5],
  },
  {
    tMinusDays: 7,
    label: "T-7",
    description: "Материалы и логистика: брифы, talking points, билеты, отели",
    blockNumbers: [4, 6],
  },
  {
    tMinusDays: 1,
    label: "T-1",
    description: "Финальный ситуационный брифинг",
    blockNumbers: [4, 6],
  },
] as const;

type CheckpointStatus = "completed" | "on-track" | "at-risk" | "due" | "missed" | "future";

const STATUS_TONE: Record<CheckpointStatus, string> = {
  completed: "bg-[var(--color-pos)] text-white border-[var(--color-pos)]",
  "on-track":
    "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/40",
  "at-risk":
    "bg-[var(--color-warn-soft)] text-[var(--color-warn)] border-[var(--color-warn)]/40",
  due: "bg-[var(--color-neg-soft)] text-[var(--color-neg)] border-[var(--color-neg)]/40",
  missed: "bg-[var(--color-neg)] text-white border-[var(--color-neg)]",
  future: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border-[var(--color-border)]",
};

const STATUS_LABEL: Record<CheckpointStatus, string> = {
  completed: "Выполнено",
  "on-track": "По графику",
  "at-risk": "Под риском",
  due: "Срок",
  missed: "Пропущено",
  future: "Впереди",
};

const STATUS_ICON: Record<CheckpointStatus, React.ComponentType<{ className?: string }>> = {
  completed: Check,
  "on-track": Eye,
  "at-risk": Clock,
  due: AlertTriangle,
  missed: AlertTriangle,
  future: Circle,
};

function classifyCheckpoint(
  blocksCovered: ScorecardBlock[],
  daysToVisit: number,
  tMinusDays: number,
): { status: CheckpointStatus; pct: number } {
  const applicable = blocksCovered.filter((b) => b.applicable);
  if (applicable.length === 0) return { status: "future", pct: 0 };
  const pct = Math.round(
    applicable.reduce((sum, b) => sum + blockReadinessPct(b), 0) / applicable.length,
  );

  // The checkpoint "fires" when daysToVisit drops to tMinusDays
  const checkpointInPast = daysToVisit <= tMinusDays;
  const checkpointInFuture = daysToVisit > tMinusDays;

  if (pct >= 90) return { status: "completed", pct };

  if (checkpointInPast) {
    // Should already be done — judge by completion
    if (pct >= 70) return { status: "on-track", pct };
    if (pct >= 40) return { status: "at-risk", pct };
    return daysToVisit < 0 ? { status: "missed", pct } : { status: "due", pct };
  }

  if (checkpointInFuture) {
    // Not yet at this checkpoint; classify by how prepared we are early
    const slack = daysToVisit - tMinusDays;
    if (pct >= 60) return { status: "on-track", pct };
    if (pct >= 30 && slack > 14) return { status: "on-track", pct };
    if (pct >= 30) return { status: "at-risk", pct };
    return { status: "future", pct };
  }

  return { status: "due", pct };
}

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" });

export function TMinusTimeline() {
  const [activeRef, setActiveRef] = useState<string>(visitScorecards[0]?.pipelineRef ?? "");

  const active = useMemo(() => visitScorecards.find((s) => s.pipelineRef === activeRef), [activeRef]);
  const pipeline = useMemo(() => visitPipelines.find((p) => p.id === activeRef), [activeRef]);

  if (!active || !pipeline) return null;

  const today = new Date();
  const visitDate = new Date(pipeline.date + "T00:00:00Z");
  const daysToVisit = Math.round((visitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const enriched = CHECKPOINTS.map((cp) => {
    const blocks = (cp.blockNumbers as ReadonlyArray<number>)
      .map((bn) => active.blocks.find((b) => b.blockNumber === bn))
      .filter((b): b is ScorecardBlock => !!b);
    const { status, pct } = classifyCheckpoint(blocks, daysToVisit, cp.tMinusDays);
    const checkpointDate = new Date(visitDate);
    checkpointDate.setUTCDate(checkpointDate.getUTCDate() - cp.tMinusDays);
    return { cp, status, pct, checkpointDate };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {visitScorecards.map((sc) => {
          const p = visitPipelines.find((x) => x.id === sc.pipelineRef);
          const isActive = sc.pipelineRef === activeRef;
          return (
            <button
              key={sc.pipelineRef}
              type="button"
              onClick={() => setActiveRef(sc.pipelineRef ?? "")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-left text-[12px] transition",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)]",
              )}
            >
              <span className="serif font-medium">{p?.title ?? sc.pipelineRef}</span>
              <span className="ml-2 mono text-[10.5px] tabular text-[var(--color-ink-muted)]">{p?.dateRange}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">Дата визита</div>
          <div className="mono text-[14px] font-semibold tabular text-[var(--color-ink)]">
            {DATE_FMT.format(visitDate)}, {visitDate.getUTCFullYear()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">До визита</div>
          <div
            className={cn(
              "mono text-[18px] font-semibold tabular",
              daysToVisit < 0
                ? "text-[var(--color-ink-muted)]"
                : daysToVisit <= 7
                  ? "text-[var(--color-neg)]"
                  : daysToVisit <= 30
                    ? "text-[var(--color-warn)]"
                    : "text-[var(--color-ink)]",
            )}
          >
            {daysToVisit >= 0 ? `T-${daysToVisit}` : `T+${Math.abs(daysToVisit)}`}
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-3 top-3 bottom-3 w-px bg-[var(--color-border)]" aria-hidden />

        <ol className="flex flex-col gap-3">
          {enriched.map(({ cp, status, pct, checkpointDate }) => {
            const Icon = STATUS_ICON[status];
            const checkpointHasPassed = daysToVisit <= cp.tMinusDays;
            return (
              <li key={cp.label} className="relative flex gap-3">
                <span
                  className={cn(
                    "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                    STATUS_TONE[status],
                  )}
                  aria-hidden
                >
                  <Icon className="size-3" />
                </span>
                <div className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="mono font-semibold tabular text-[var(--color-ink)]">{cp.label}</span>
                      <span className="mono text-[10.5px] tabular text-[var(--color-ink-muted)]">
                        ({DATE_FMT.format(checkpointDate)})
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider",
                          STATUS_TONE[status],
                        )}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-20 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background:
                              pct >= 70
                                ? "var(--color-pos)"
                                : pct >= 40
                                  ? "var(--color-primary)"
                                  : "var(--color-warn)",
                          }}
                        />
                      </div>
                      <span className="mono w-10 text-right text-[11px] font-semibold tabular text-[var(--color-ink)]">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-[11.5px] text-[var(--color-ink-muted)]">{cp.description}</p>
                  <div className="mt-1 text-[10px] text-[var(--color-ink-faint)]">
                    Покрывает блоки скоркарта: {cp.blockNumbers.map((b) => `B${b}`).join(", ")}
                    {checkpointHasPassed ? " · контрольная точка пройдена" : ""}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">
        T-minus считается автоматически из даты визита. Статус каждого чекпойнта — функция от средней готовности
        блоков скоркарта, которые он покрывает, и от того, прошла ли уже контрольная дата. Связка с 7-block
        scorecard выше: T-30→B1+B2 · T-14→B3+B5 · T-7→B4+B6 · T-1→финальный брифинг.
      </p>
    </div>
  );
}
