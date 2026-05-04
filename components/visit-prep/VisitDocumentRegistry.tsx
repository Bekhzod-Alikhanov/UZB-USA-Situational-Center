"use client";
import { useMemo, useState } from "react";
import { FileText, MessageSquare, Mic, Presentation, BookOpen, FileCheck2, Plane, CalendarDays } from "lucide-react";
import {
  visitDocumentRegistries,
  visitPipelines,
  type DocumentType,
  type ItemStatus,
  type DocumentRegistryItem,
} from "@/data/visit-prep";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<DocumentType, React.ComponentType<{ className?: string }>> = {
  brief: FileText,
  "talking-points": MessageSquare,
  speech: Mic,
  presentation: Presentation,
  "analytical-note": BookOpen,
  "service-memo": FileCheck2,
  "travel-order": Plane,
  agenda: CalendarDays,
};

const TYPE_LABEL: Record<DocumentType, string> = {
  brief: "Brief",
  "talking-points": "Talking points",
  speech: "Speech",
  presentation: "Presentation",
  "analytical-note": "Analytical note",
  "service-memo": "Service memo",
  "travel-order": "Travel order",
  agenda: "Agenda",
};

const STATUS_TONE: Record<ItemStatus, string> = {
  approved: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  review: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  "in-progress": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "not-started": "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  blocked: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  "n/a": "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-faint)]",
};

const DATE_FMT = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function VisitDocumentRegistry() {
  const [activeRef, setActiveRef] = useState<string>(visitDocumentRegistries[0]?.pipelineRef ?? "");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all");

  const active = useMemo(() => visitDocumentRegistries.find((d) => d.pipelineRef === activeRef), [activeRef]);
  const activePipeline = useMemo(() => visitPipelines.find((p) => p.id === activeRef), [activeRef]);

  const filtered: DocumentRegistryItem[] = useMemo(() => {
    if (!active) return [];
    if (typeFilter === "all") return active.documents;
    return active.documents.filter((d) => d.type === typeFilter);
  }, [active, typeFilter]);

  // Status counts
  const counts: Record<ItemStatus, number> = {
    approved: 0,
    review: 0,
    "in-progress": 0,
    "not-started": 0,
    blocked: 0,
    "n/a": 0,
  };
  for (const d of active?.documents ?? []) counts[d.status] += 1;
  const total = active?.documents.length ?? 0;
  const completionPct = total > 0 ? Math.round((counts.approved / total) * 100) : 0;

  const types = (Object.keys(TYPE_LABEL) as DocumentType[]).filter((t) =>
    (active?.documents ?? []).some((d) => d.type === t),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {visitDocumentRegistries.map((reg) => {
          const pipeline = visitPipelines.find((p) => p.id === reg.pipelineRef);
          const isActive = reg.pipelineRef === activeRef;
          return (
            <button
              key={reg.pipelineRef}
              type="button"
              onClick={() => {
                setActiveRef(reg.pipelineRef ?? "");
                setTypeFilter("all");
              }}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-[12.5px] transition",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)]",
              )}
            >
              <span className="serif font-medium">{pipeline?.title ?? reg.pipelineRef}</span>
              <span className="ml-2 mono text-[11px] tabular">{reg.documents.length} docs</span>
            </button>
          );
        })}
      </div>

      {active && activePipeline ? (
        <>
          <div className="grid grid-cols-3 gap-2 text-[11px] sm:grid-cols-5">
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
              <div className="stat-label">Total</div>
              <div className="mono text-[15px] font-semibold tabular text-[var(--color-ink)]">{total}</div>
            </div>
            <div className="rounded-md border border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] px-3 py-2">
              <div className="stat-label">Approved</div>
              <div className="mono text-[15px] font-semibold tabular text-[var(--color-pos)]">{counts.approved}</div>
            </div>
            <div className="rounded-md border border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] px-3 py-2">
              <div className="stat-label">Review</div>
              <div className="mono text-[15px] font-semibold tabular text-[var(--color-primary)]">{counts.review}</div>
            </div>
            <div className="rounded-md border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] px-3 py-2">
              <div className="stat-label">In progress</div>
              <div className="mono text-[15px] font-semibold tabular text-[var(--color-warn)]">
                {counts["in-progress"]}
              </div>
            </div>
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
              <div className="stat-label">Not started</div>
              <div className="mono text-[15px] font-semibold tabular text-[var(--color-ink-muted)]">
                {counts["not-started"]}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Type:</span>
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11.5px] transition",
                typeFilter === "all"
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)]",
              )}
            >
              All
            </button>
            {types.map((t) => {
              const Icon = TYPE_ICON[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] transition",
                    typeFilter === t
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)]",
                  )}
                >
                  <Icon className="size-3" />
                  {TYPE_LABEL[t]}
                </button>
              );
            })}
            <span className="ml-auto text-[11px] text-[var(--color-ink-muted)]">
              Approval rate:{" "}
              <span className="mono font-semibold tabular text-[var(--color-ink)]">{completionPct}%</span>
            </span>
          </div>

          <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-12"></th>
                  <th>Document title</th>
                  <th className="w-32">Type</th>
                  <th className="w-40">Owner</th>
                  <th className="w-28">Due</th>
                  <th className="w-20">Size</th>
                  <th className="w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const Icon = TYPE_ICON[d.type];
                  return (
                    <tr key={i}>
                      <td>
                        <Icon className="size-4 text-[var(--color-ink-muted)]" />
                      </td>
                      <td className="text-[12.5px] font-medium text-[var(--color-ink)]">{d.title}</td>
                      <td className="text-[11px] text-[var(--color-ink-muted)]">{TYPE_LABEL[d.type]}</td>
                      <td className="text-[11px] text-[var(--color-ink-muted)]">{d.owner}</td>
                      <td className="mono text-[11px] tabular text-[var(--color-ink-muted)]">
                        {d.dueDate ? DATE_FMT.format(new Date(d.dueDate + "T00:00:00Z")) : "—"}
                      </td>
                      <td className="mono text-[11px] tabular text-[var(--color-ink-muted)]">{d.size ?? "—"}</td>
                      <td>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                            STATUS_TONE[d.status],
                          )}
                        >
                          {d.status.replace("-", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[10.5px] text-[var(--color-ink-faint)]">
            Document <strong>titles, owners, statuses, and due dates only</strong>. Document <em>content</em>
            (talking-point text, draft MoU bodies, briefing prose) is never stored here — those live in the operational
            document system with proper access control.
          </p>
        </>
      ) : null}
    </div>
  );
}
