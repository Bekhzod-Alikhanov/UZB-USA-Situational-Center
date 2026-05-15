"use client";
import { useState, useMemo } from "react";
import { Plane, Hotel, Bus, FileBadge, ShieldCheck, Headphones } from "lucide-react";
import { visitLogistics, visitPipelines, type LogisticsRow, type ItemStatus } from "@/data/visit-prep";
import { cn } from "@/lib/utils";

const ROW_LABEL: Record<LogisticsRow, string> = {
  avia: "Air travel",
  hotel: "Hotel block",
  transfer: "Ground transfer",
  visa: "Visa / entry",
  insurance: "Travel insurance",
  coordination: "Coordination roster",
};

const ROW_ICON: Record<LogisticsRow, React.ComponentType<{ className?: string }>> = {
  avia: Plane,
  hotel: Hotel,
  transfer: Bus,
  visa: FileBadge,
  insurance: ShieldCheck,
  coordination: Headphones,
};

const STATUS_TONE: Record<ItemStatus, string> = {
  approved: "bg-[var(--color-pos)]",
  review: "bg-[color-mix(in_oklab,var(--color-primary)_85%,white)]",
  "in-progress": "bg-[var(--color-warn)]",
  "not-started": "bg-[var(--color-border)]",
  blocked: "bg-[var(--color-neg)]",
  "n/a": "bg-[var(--color-ink-faint)]/40",
};

const STATUS_LABEL: Record<ItemStatus, string> = {
  approved: "Confirmed",
  review: "Under review",
  "in-progress": "In progress",
  "not-started": "Not started",
  blocked: "Blocked",
  "n/a": "N/A",
};

export function VisitLogisticsMatrix() {
  const [activeRef, setActiveRef] = useState<string>(visitLogistics[0]?.pipelineRef ?? "");

  const active = useMemo(() => visitLogistics.find((l) => l.pipelineRef === activeRef), [activeRef]);
  const activePipeline = useMemo(() => visitPipelines.find((p) => p.id === activeRef), [activeRef]);

  const overallPct = useMemo(() => {
    if (!active) return 0;
    const weights: Record<ItemStatus, number> = {
      "not-started": 0,
      "in-progress": 0.5,
      review: 0.75,
      approved: 1,
      blocked: 0,
      "n/a": 1,
    };
    const applicable = active.rows.filter((r) => r.status !== "n/a");
    if (applicable.length === 0) return 0;
    const sum = active.rows.reduce((a, r) => a + (weights[r.status] ?? 0), 0);
    return Math.round((sum / active.rows.length) * 100);
  }, [active]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {visitLogistics.map((l) => {
          const pipeline = visitPipelines.find((p) => p.id === l.pipelineRef);
          const isActive = l.pipelineRef === activeRef;
          return (
            <button
              key={l.pipelineRef}
              type="button"
              onClick={() => setActiveRef(l.pipelineRef ?? "")}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-[12.5px] transition",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)]",
              )}
            >
              <span className="serif font-medium">{pipeline?.title ?? l.pipelineRef}</span>
              <span className="ml-2 mono text-[11px] tabular">· {l.delegationSize} pax</span>
            </button>
          );
        })}
      </div>

      {active && activePipeline ? (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
            <div>
              <div className="stat-label">Delegation size</div>
              <div className="mono text-[18px] font-semibold tabular text-[var(--color-ink)]">
                {active.delegationSize}
              </div>
            </div>
            <div>
              <div className="stat-label">Overall logistics readiness</div>
              <div className="mono text-[18px] font-semibold tabular text-[var(--color-pos)]">{overallPct}%</div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2 text-[10.5px] text-[var(--color-ink-muted)]">
              {(["approved", "review", "in-progress", "not-started", "n/a", "blocked"] as ItemStatus[]).map((s) => (
                <span key={s} className="inline-flex items-center gap-1">
                  <span className={cn("size-2.5 rounded-sm", STATUS_TONE[s])} />
                  {STATUS_LABEL[s]}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="w-44">Workstream</th>
                  <th scope="col" className="w-32">Status</th>
                  <th scope="col" className="w-28">Coverage</th>
                  <th scope="col" className="w-44">Lead</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {active.rows.map((r) => {
                  const Icon = ROW_ICON[r.row];
                  const coveragePct = r.coveredOf
                    ? r.coveredOf.of > 0
                      ? Math.round((r.coveredOf.covered / r.coveredOf.of) * 100)
                      : 0
                    : null;
                  return (
                    <tr key={r.row}>
                      <td>
                        <span className="inline-flex items-center gap-2">
                          <Icon className="size-4 text-[var(--color-ink-muted)]" />
                          <span className="font-medium">{ROW_LABEL[r.row]}</span>
                        </span>
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-2">
                          <span className={cn("size-2.5 rounded-sm", STATUS_TONE[r.status])} />
                          <span className="text-[11.5px] uppercase tracking-wider">{STATUS_LABEL[r.status]}</span>
                        </span>
                      </td>
                      <td>
                        {r.coveredOf ? (
                          <div className="flex flex-col gap-1">
                            <div className="mono text-[12px] tabular text-[var(--color-ink)]">
                              {r.coveredOf.covered}/{r.coveredOf.of}
                            </div>
                            <div className="h-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                              <div
                                className="h-full rounded-full bg-[var(--color-pos)] transition-all"
                                style={{ width: `${coveragePct ?? 0}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[var(--color-ink-faint)]">—</span>
                        )}
                      </td>
                      <td className="text-[11.5px] text-[var(--color-ink-muted)]">{r.responsible ?? "—"}</td>
                      <td className="text-[11.5px] text-[var(--color-ink-muted)]">{r.note ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[10.5px] text-[var(--color-ink-faint)]">
            Booking <strong>statuses and counts only</strong>. PNR codes, hotel reservation numbers, individual passport
            / visa numbers, flight times, and per-person itineraries are never stored here. Operational details belong
            to the protocol system with restricted access.
          </p>
        </>
      ) : null}
    </div>
  );
}
