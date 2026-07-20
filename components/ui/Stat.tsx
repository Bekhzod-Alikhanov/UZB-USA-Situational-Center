import type { ReactNode } from "react";

export type StatTone = "ink" | "primary" | "pos" | "warn" | "neg";

const TONE_CLASS: Record<StatTone, string> = {
  ink: "text-[var(--color-ink)]",
  primary: "text-[var(--color-primary)]",
  pos: "text-[var(--color-pos)]",
  warn: "text-[var(--color-warn)]",
  neg: "text-[var(--color-neg)]",
};

interface StatProps {
  label: string;
  value: ReactNode;
  tone?: StatTone;
}

/**
 * Right-rail stat block used in section headers across the dashboard.
 * Tone defaults to neutral ink; override with `pos` / `warn` / `neg` /
 * `primary` for status callouts.
 */
export function Stat({ label, value, tone = "ink" }: StatProps) {
  return (
    <div className="flex min-w-[82px] flex-col items-start rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 sm:items-end">
      <span className="mono text-[10.5px] uppercase tracking-wider text-[var(--color-ink-muted)]">{label}</span>
      <span className={`mono mt-0.5 text-[18px] font-semibold tabular ${TONE_CLASS[tone]}`}>{value}</span>
    </div>
  );
}
