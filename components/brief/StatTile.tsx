import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/**
 * KPI tile for the /brief videowall: colored accent strip on the left
 * (prototype-style), big tabular value, one short sub-line. The accent is a
 * CSS value (pass a var(--brief-*) token, never raw hex). With `href` the
 * whole tile becomes a deep link into its detail section.
 */
interface StatTileProps {
  label: string;
  /** Big value node — typically a <BriefNumber> with a unit suffix. */
  children: ReactNode;
  sub?: ReactNode;
  /** CSS color for the left strip, e.g. "var(--brief-accent-2)". */
  accent?: string;
  /** Localized destination, e.g. `/${locale}/trade`. */
  href?: string;
}

export function StatTile({ label, children, sub, accent, href }: StatTileProps) {
  const style = accent ? ({ "--kpi-accent": accent } as CSSProperties) : undefined;
  const body = (
    <>
      <div className="brief-eyebrow">{label}</div>
      <div className="brief-kpi-value">{children}</div>
      {sub ? <div className="brief-kpi-sub">{sub}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        prefetch={false}
        style={style}
        className="brief-kpi block transition hover:border-[var(--brief-border-strong)]"
      >
        {body}
      </Link>
    );
  }
  return (
    <div className="brief-kpi" style={style}>
      {body}
    </div>
  );
}
