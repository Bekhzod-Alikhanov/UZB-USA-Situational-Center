import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode, CSSProperties } from "react";

export type MicroTone = "trade" | "visits" | "invest" | "agree" | "people" | "rose" | "slate" | "primary";

const TONE_VAR: Record<MicroTone, string> = {
  trade: "var(--color-trade)",
  visits: "var(--color-visits)",
  invest: "var(--color-invest)",
  agree: "var(--color-agree)",
  people: "var(--color-people)",
  rose: "var(--color-rose)",
  slate: "var(--color-slate)",
  primary: "var(--color-primary)",
};

interface MicroKpiProps {
  tone: MicroTone;
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  href?: string;
  className?: string;
}

/**
 * Compact KPI tile with a 2px tone-coloured left bar. Used in a 5-up strip
 * below the hero KPIs to surface secondary metrics without competing with
 * the headline numbers.
 */
export function MicroKpi({ tone, label, value, sub, href, className }: MicroKpiProps) {
  const c = TONE_VAR[tone];
  const style = { "--micro-tone": c } as CSSProperties;
  const inner = (
    <>
      <span
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r"
        style={{ background: "var(--micro-tone)" }}
      />
      <div className="pl-3">
        <div className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-faint)]">
          {label}
        </div>
        <div className="serif tabular mt-0.5 text-[19px] font-medium leading-tight text-[var(--color-ink)]">
          {value}
        </div>
        {sub ? (
          <div className="mono mt-0.5 truncate text-[10px] text-[var(--color-ink-muted)]">{sub}</div>
        ) : null}
      </div>
    </>
  );

  const wrapClass = cn(
    "relative block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 transition hover:bg-[var(--color-surface-2)]",
    className,
  );

  if (href) {
    return (
      <Link href={href} style={style} className={wrapClass}>
        {inner}
      </Link>
    );
  }
  return (
    <div style={style} className={wrapClass}>
      {inner}
    </div>
  );
}
