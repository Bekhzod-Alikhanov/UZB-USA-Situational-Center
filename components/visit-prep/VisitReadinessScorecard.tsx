"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Eye, Circle, AlertTriangle, MinusCircle } from "lucide-react";
import {
  visitScorecards,
  visitPipelines,
  scorecardReadinessPct,
  blockReadinessPct,
  type ItemStatus,
  type ScorecardBlock,
} from "@/data/visit-prep";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<ItemStatus, string> = {
  approved: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  review: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  "in-progress": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "not-started": "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  blocked: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  "n/a": "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-faint)]",
};

const STATUS_ICON: Record<ItemStatus, React.ComponentType<{ className?: string }>> = {
  approved: CheckCircle2,
  review: Eye,
  "in-progress": Clock,
  "not-started": Circle,
  blocked: AlertTriangle,
  "n/a": MinusCircle,
};

const STATUS_LABEL: Record<ItemStatus, string> = {
  approved: "Approved",
  review: "In review",
  "in-progress": "In progress",
  "not-started": "Not started",
  blocked: "Blocked",
  "n/a": "N/A",
};

const DATE_FMT = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function StatusBadge({ status }: { status: ItemStatus }) {
  const Icon = STATUS_ICON[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        STATUS_TONE[status],
      )}
    >
      <Icon className="size-3" />
      {STATUS_LABEL[status]}
    </span>
  );
}

function ProgressBar({ pct, tone = "primary" }: { pct: number; tone?: "primary" | "pos" | "warn" }) {
  const colorVar = tone === "pos" ? "--color-pos" : tone === "warn" ? "--color-warn" : "--color-primary";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: `var(${colorVar})` }}
      />
    </div>
  );
}

export function VisitReadinessScorecard() {
  const [activeRef, setActiveRef] = useState<string>(visitScorecards[0]?.pipelineRef ?? "");

  const active = useMemo(() => visitScorecards.find((s) => s.pipelineRef === activeRef), [activeRef]);
  const activePipeline = useMemo(() => visitPipelines.find((p) => p.id === activeRef), [activeRef]);
  const compositePct = active ? scorecardReadinessPct(active) : 0;

  // Block-by-block summary (always 7 columns)
  const blockBars = active?.blocks ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {visitScorecards.map((sc) => {
          const pipeline = visitPipelines.find((p) => p.id === sc.pipelineRef);
          const pct = scorecardReadinessPct(sc);
          const isActive = sc.pipelineRef === activeRef;
          return (
            <button
              key={sc.pipelineRef}
              type="button"
              onClick={() => setActiveRef(sc.pipelineRef ?? "")}
              className={cn(
                "flex flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left transition",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]",
              )}
            >
              <span className="serif text-[12.5px] font-medium text-[var(--color-ink)]">
                {pipeline?.title ?? sc.pipelineRef}
              </span>
              <span className="flex items-center gap-2 text-[10.5px] text-[var(--color-ink-muted)]">
                {pipeline?.dateRange ?? ""}
                <span className="mono font-semibold tabular text-[var(--color-ink)]">{pct}%</span>
              </span>
            </button>
          );
        })}
      </div>

      {active && activePipeline ? (
        <>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_3fr]">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                Composite readiness
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="mono text-[34px] font-semibold tabular text-[var(--color-ink)]">{compositePct}</span>
                <span className="text-[var(--color-ink-muted)]">%</span>
              </div>
              <ProgressBar
                pct={compositePct}
                tone={compositePct > 75 ? "pos" : compositePct > 50 ? "primary" : "warn"}
              />
              <p className="mt-2 text-[11px] text-[var(--color-ink-muted)]">
                Weighted by status: approved 100% · review 70% · in-progress 40% · not-started 0%. N/A items excluded.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="mb-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                7-block readiness profile
              </div>
              <div className="grid grid-cols-7 gap-2">
                {blockBars.map((block) => {
                  const pct = blockReadinessPct(block);
                  return (
                    <div key={block.blockNumber} className="flex flex-col items-center gap-1.5" title={block.title}>
                      <div className="mono text-[10px] tabular text-[var(--color-ink-faint)]">B{block.blockNumber}</div>
                      <div className="relative h-16 w-3 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                        <div
                          className="absolute bottom-0 left-0 right-0 transition-all"
                          style={{
                            height: `${block.applicable ? pct : 0}%`,
                            background: block.applicable
                              ? `var(--color-${pct > 75 ? "pos" : pct > 50 ? "primary" : "warn"})`
                              : "var(--color-border)",
                          }}
                        />
                      </div>
                      <div className="mono text-[10px] font-semibold tabular text-[var(--color-ink)]">
                        {block.applicable ? `${pct}%` : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-2 text-[9px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                {blockBars.map((b) => (
                  <div key={b.blockNumber} className="text-center" title={b.title}>
                    {b.title.split(" ")[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {blockBars.map((block) => (
              <BlockPanel key={block.blockNumber} block={block} />
            ))}
          </div>

          <p className="text-[10.5px] text-[var(--color-ink-faint)]">
            Status tracking only. Document content, talking-point text, draft agreement bodies, passport / visa numbers,
            and booking codes do not live in this dashboard — they belong to a separate operational system with auth and
            audit.
          </p>
        </>
      ) : null}
    </div>
  );
}

function BlockPanel({ block }: { block: ScorecardBlock }) {
  const [expanded, setExpanded] = useState(block.applicable);
  const pct = blockReadinessPct(block);
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--color-surface-2)]"
      >
        <span className="mono w-9 text-[11px] font-semibold tabular text-[var(--color-ink-muted)]">
          BLOCK {block.blockNumber}
        </span>
        <span className="serif flex-1 text-[14px] font-medium text-[var(--color-ink)]">{block.title}</span>
        {block.applicable ? (
          <>
            <div className="hidden w-32 sm:block">
              <ProgressBar pct={pct} tone={pct > 75 ? "pos" : pct > 50 ? "primary" : "warn"} />
            </div>
            <span className="mono w-12 text-right text-[12px] font-semibold tabular text-[var(--color-ink)]">
              {pct}%
            </span>
          </>
        ) : (
          <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Not applicable</span>
        )}
      </button>
      {expanded && block.applicable ? (
        <div className="overflow-x-auto border-t border-[var(--color-border)]">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="w-32">Status</th>
                <th className="w-44">Owner</th>
                <th className="w-32">Due</th>
              </tr>
            </thead>
            <tbody>
              {block.items.map((it, i) => (
                <tr key={i}>
                  <td className="text-[12.5px]">{it.label}</td>
                  <td>
                    <StatusBadge status={it.status} />
                  </td>
                  <td className="text-[12px] text-[var(--color-ink-muted)]">{it.owner ?? "—"}</td>
                  <td className="mono text-[11px] tabular text-[var(--color-ink-muted)]">
                    {it.dueDate ? DATE_FMT.format(new Date(it.dueDate + "T00:00:00Z")) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
