import type { CSSProperties, ReactNode } from "react";

/**
 * KPI tile for the /brief videowall: colored accent strip on the left
 * (prototype-style), big tabular value, one short sub-line. The accent is a
 * CSS value (pass a var(--brief-*) token, never raw hex).
 */
interface StatTileProps {
  label: string;
  /** Big value node — typically a <BriefNumber> with a unit suffix. */
  children: ReactNode;
  sub?: ReactNode;
  /** CSS color for the left strip, e.g. "var(--brief-accent-2)". */
  accent?: string;
}

export function StatTile({ label, children, sub, accent }: StatTileProps) {
  return (
    <div className="brief-kpi" style={accent ? ({ "--kpi-accent": accent } as CSSProperties) : undefined}>
      <div className="brief-eyebrow">{label}</div>
      <div className="brief-kpi-value">{children}</div>
      {sub ? <div className="brief-kpi-sub">{sub}</div> : null}
    </div>
  );
}
