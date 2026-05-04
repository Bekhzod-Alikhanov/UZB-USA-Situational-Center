"use client";
import { visits } from "@/data/visits";
import { cn } from "@/lib/utils";
import { Target } from "lucide-react";

export function ActivityTimeline({ limit = 6 }: { limit?: number }) {
  const now = new Date();
  const recent = visits
    .filter((v) => new Date(v.date).getTime() <= now.getTime())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  return (
    <ol className="flex flex-col">
      {recent.map((v, idx) => {
        const last = idx === recent.length - 1;
        return (
          <li key={v.id} className="relative pl-7 pb-4">
            {!last ? (
              <span className="absolute left-[11px] top-5 bottom-0 w-px bg-[var(--color-border)]" aria-hidden />
            ) : null}
            <span
              className={cn(
                "absolute left-0 top-1 flex size-6 items-center justify-center rounded-full border bg-[var(--color-surface)]",
                v.level === "president"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] text-[var(--color-ink-muted)]",
              )}
            >
              <Target className="size-3" />
            </span>
            <div className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
              <time className="mono text-[11px] text-[var(--color-ink-muted)]">{v.date}</time>
              <span
                className={cn(
                  "rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider",
                  v.level === "president"
                    ? "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-ink-muted)]",
                )}
              >
                {v.level}
              </span>
              <span className="truncate font-medium text-[var(--color-ink)]">{v.title}</span>
            </div>
            <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
              {v.location}
              {v.outcomes.length > 0 ? ` — ${v.outcomes[0]}` : ""}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
