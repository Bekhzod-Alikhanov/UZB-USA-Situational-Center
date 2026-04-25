"use client";
import { staff } from "@/data/staff-kpi";
import { cn } from "@/lib/utils";

function scoreOf(s: (typeof staff)[number]) {
  const completion = s.tasksAssigned ? s.tasksCompleted / s.tasksAssigned : 0;
  const responsePenalty = Math.max(0, Math.min(1, s.avgResponseHrs / 12));
  const overduePenalty = Math.min(1, s.overdueTasks * 0.1);
  const raw = completion * 0.6 + (1 - responsePenalty) * 0.3 + (1 - overduePenalty) * 0.1;
  return Math.round(raw * 100);
}

export function StaffTable() {
  const withScore = staff
    .map((s) => ({ ...s, score: scoreOf(s) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="w-[30px]">#</th>
            <th>Analyst</th>
            <th className="w-[160px]">Role</th>
            <th className="w-[120px]">Direction</th>
            <th className="w-[90px] text-right">Assigned</th>
            <th className="w-[90px] text-right">Completed</th>
            <th className="w-[100px] text-right">Avg response</th>
            <th className="w-[80px] text-right">Overdue</th>
            <th className="w-[110px]">Score</th>
          </tr>
        </thead>
        <tbody>
          {withScore.map((s, idx) => {
            const scoreTone =
              s.score >= 85
                ? "bg-[var(--color-pos)]"
                : s.score >= 70
                  ? "bg-[var(--color-primary)]"
                  : s.score >= 55
                    ? "bg-[var(--color-warn)]"
                    : "bg-[var(--color-neg)]";
            return (
              <tr key={s.id}>
                <td className="mono tabular text-[var(--color-ink-faint)]">{idx + 1}</td>
                <td>
                  <span className={cn("demo-underline font-medium text-[var(--color-ink)]")}>{s.name}</span>
                </td>
                <td className="text-[12px] text-[var(--color-ink-muted)]">{s.role}</td>
                <td>
                  <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
                    {s.directionality}
                  </span>
                </td>
                <td className="mono text-right tabular">{s.tasksAssigned}</td>
                <td className="mono text-right tabular text-[var(--color-pos)]">{s.tasksCompleted}</td>
                <td className="mono text-right tabular">{s.avgResponseHrs.toFixed(1)}h</td>
                <td
                  className={cn(
                    "mono text-right tabular",
                    s.overdueTasks > 0 ? "text-[var(--color-neg)]" : "text-[var(--color-ink-muted)]",
                  )}
                >
                  {s.overdueTasks}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                      <div
                        className={cn("h-full rounded-full", scoreTone)}
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <span className="mono w-8 text-right tabular text-[12px] font-semibold text-[var(--color-ink)]">
                      {s.score}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
