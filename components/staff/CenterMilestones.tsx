"use client";
import { useMemo } from "react";
import { CheckCircle2, Clock, AlertTriangle, Circle } from "lucide-react";
import { centerMilestones, deriveMilestoneStatus, type MilestoneStatus } from "@/data/center-milestones";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<MilestoneStatus, string> = {
  completed: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  "in-progress": "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  upcoming: "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  overdue: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
};

const STATUS_ICON: Record<MilestoneStatus, React.ComponentType<{ className?: string }>> = {
  completed: CheckCircle2,
  "in-progress": Clock,
  upcoming: Circle,
  overdue: AlertTriangle,
};

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  upcoming: "Upcoming",
  overdue: "Overdue",
};

const TRACK_LABEL: Record<string, string> = {
  governance: "Governance",
  visits: "Visits",
  dashboard: "Dashboard",
  expertise: "Expertise",
  strategy: "Strategy",
  reporting: "Reporting",
  investments: "Investments",
  reforms: "Reforms",
  training: "Training",
  documents: "Documents",
};

const DATE_FMT = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function CenterMilestones() {
  const today = useMemo(() => new Date(), []);

  const enriched = centerMilestones.map((m) => ({
    ...m,
    status: deriveMilestoneStatus(m.dueDate, today),
    daysUntil: Math.round(
      (new Date(m.dueDate + "T00:00:00Z").getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    ),
  }));

  const counts = enriched.reduce<Record<MilestoneStatus, number>>(
    (acc, m) => {
      acc[m.status] += 1;
      return acc;
    },
    { completed: 0, "in-progress": 0, upcoming: 0, overdue: 0 },
  );

  const completionPct = (counts.completed / enriched.length) * 100;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-[11.5px]">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--color-pos)]" />
          <span className="text-[var(--color-ink-muted)]">Completed</span>
          <span className="mono font-semibold tabular text-[var(--color-ink)]">{counts.completed}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--color-primary)]" />
          <span className="text-[var(--color-ink-muted)]">In progress</span>
          <span className="mono font-semibold tabular text-[var(--color-ink)]">{counts["in-progress"]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--color-ink-faint)]" />
          <span className="text-[var(--color-ink-muted)]">Upcoming</span>
          <span className="mono font-semibold tabular text-[var(--color-ink)]">{counts.upcoming}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--color-neg)]" />
          <span className="text-[var(--color-ink-muted)]">Overdue</span>
          <span className="mono font-semibold tabular text-[var(--color-ink)]">{counts.overdue}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[var(--color-ink-muted)]">12-month progress</span>
          <span className="mono font-semibold tabular text-[var(--color-ink)]">{completionPct.toFixed(0)}%</span>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--color-pos)] transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      <ol className="relative ml-3 flex flex-col gap-3 border-l border-dashed border-[var(--color-border)] pl-5">
        {enriched.map((m) => {
          const Icon = STATUS_ICON[m.status];
          return (
            <li key={m.stage} className="relative">
              <span
                className={cn(
                  "absolute -left-[26px] top-1 inline-flex size-4 items-center justify-center rounded-full border-2 bg-[var(--color-surface)]",
                  m.status === "completed" && "border-[var(--color-pos)]",
                  m.status === "in-progress" && "border-[var(--color-primary)]",
                  m.status === "upcoming" && "border-[var(--color-border)]",
                  m.status === "overdue" && "border-[var(--color-neg)]",
                )}
                aria-hidden
              />
              <div className="flex flex-col gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mono text-[11px] font-semibold tabular text-[var(--color-ink-muted)]">
                    Stage {m.stage.toString().padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                      STATUS_TONE[m.status],
                    )}
                  >
                    <Icon className="size-3" />
                    {STATUS_LABEL[m.status]}
                  </span>
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                    {TRACK_LABEL[m.track] ?? m.track}
                  </span>
                  <span className="ml-auto flex items-center gap-2 text-[11px]">
                    <span className="mono tabular text-[var(--color-ink)]">
                      {DATE_FMT.format(new Date(m.dueDate + "T00:00:00Z"))}
                    </span>
                    <span
                      className={cn(
                        "mono text-[10.5px] tabular",
                        m.status === "overdue"
                          ? "text-[var(--color-neg)]"
                          : m.status === "in-progress"
                            ? "text-[var(--color-primary)]"
                            : "text-[var(--color-ink-faint)]",
                      )}
                    >
                      {m.daysUntil >= 0 ? `T-${m.daysUntil}d` : `T+${Math.abs(m.daysUntil)}d`}
                    </span>
                  </span>
                </div>
                <h4 className="serif text-[14px] font-medium leading-snug text-[var(--color-ink)]">{m.title}</h4>
                <p className="text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">{m.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
