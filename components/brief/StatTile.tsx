import type { ReactNode } from "react";

/**
 * Stat tile for the /brief band. No card chrome by design — the parent
 * `.brief-band` grid draws 1px hairline dividers between tiles.
 */
interface StatTileProps {
  label: string;
  /** Big value node — typically a <BriefNumber> with a unit suffix. */
  children: ReactNode;
  sub?: ReactNode;
}

export function StatTile({ label, children, sub }: StatTileProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brief-ink-faint)]">{label}</div>
      <div className="brief-stat-value mt-2 text-[var(--brief-ink)]">{children}</div>
      {sub ? <div className="mt-1.5 text-[12.5px] leading-snug text-[var(--brief-ink-muted)]">{sub}</div> : null}
    </div>
  );
}
