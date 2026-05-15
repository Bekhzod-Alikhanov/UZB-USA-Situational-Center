import { CheckCircle2, AlertTriangle, Circle, Clock } from "lucide-react";
import { visitOutcomes, type OutcomeScore, type OutcomeStatus } from "@/data/visit-prep";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

const SCORE_TONE: Record<OutcomeScore, string> = {
  High: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  "Medium-high": "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  Medium: "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  "Below plan": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  Low: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
};

const STATUS_ICON: Record<OutcomeStatus, React.ComponentType<{ className?: string }>> = {
  Verified: CheckCircle2,
  "Needs verification": Clock,
  "On track": CheckCircle2,
  "At risk": AlertTriangle,
  Pending: Circle,
};

const STATUS_TONE: Record<OutcomeStatus, string> = {
  Verified: "text-[var(--color-pos)]",
  "Needs verification": "text-[var(--color-warn)]",
  "On track": "text-[var(--color-primary)]",
  "At risk": "text-[var(--color-neg)]",
  Pending: "text-[var(--color-ink-muted)]",
};

/**
 * Plan-vs-actual outcome tracker. Closes the visit-prep loop: every visit
 * eventually shows up here with a planned-output statement, an actual-output
 * statement, a leadership-readable score, and a verification reference.
 */
export function OutcomesTable() {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="w-[88px]">Date</th>
            <th scope="col">Visit</th>
            <th scope="col">Plan</th>
            <th scope="col">Actual</th>
            <th scope="col" className="w-[110px]">Score</th>
            <th scope="col" className="w-[160px]">Verification</th>
            <th scope="col" className="w-[112px]">Status</th>
            <th scope="col" className="w-[120px]">Source</th>
          </tr>
        </thead>
        <tbody>
          {visitOutcomes.map((o) => {
            const Icon = STATUS_ICON[o.status];
            return (
              <tr key={o.id}>
                <td className="mono text-[11.5px] tabular text-[var(--color-ink-muted)]">{o.date}</td>
                <td className="text-[12.5px] font-medium text-[var(--color-ink)]">{o.visit}</td>
                <td className="text-[11.5px] text-[var(--color-ink-muted)]">{o.plan}</td>
                <td className="text-[11.5px] text-[var(--color-ink)]">{o.actual}</td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                      SCORE_TONE[o.score],
                    )}
                  >
                    {o.score}
                  </span>
                </td>
                <td className="text-[11px] italic text-[var(--color-ink-muted)]">{o.verification}</td>
                <td>
                  <span
                    className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-medium", STATUS_TONE[o.status])}
                  >
                    <Icon className="size-3.5" />
                    {o.status}
                  </span>
                </td>
                <td>{o.sourceId ? <SourceBadge sourceId={o.sourceId} /> : null}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
