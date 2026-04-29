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
    <div className="flex flex-col items-end">
      <span className="mono text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      <span className={`mono text-[15px] font-medium tabular ${TONE_CLASS[tone]}`}>{value}</span>
    </div>
  );
}
