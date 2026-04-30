import { cn } from "@/lib/utils";
import type { ReactNode, CSSProperties } from "react";

export type SectionTone = "trade" | "visits" | "invest" | "agree" | "people" | "rose" | "slate" | "primary";

const TONE_VAR: Record<SectionTone, string> = {
  trade: "var(--color-trade)",
  visits: "var(--color-visits)",
  invest: "var(--color-invest)",
  agree: "var(--color-agree)",
  people: "var(--color-people)",
  rose: "var(--color-rose)",
  slate: "var(--color-slate)",
  primary: "var(--color-primary)",
};

export function Card({ className, children, tone }: { className?: string; children: ReactNode; tone?: SectionTone }) {
  const style = tone ? ({ "--chip-tone": TONE_VAR[tone] } as CSSProperties) : undefined;
  return (
    <div style={style} className={cn("card", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  sub,
  right,
  icon,
  tone,
  className,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  /** Pre-rendered icon JSX (e.g. <TrendingUp className="size-3.5" />). */
  icon?: ReactNode;
  /** Domain accent for the icon chip. */
  tone?: SectionTone;
  className?: string;
}) {
  const style = tone ? ({ "--chip-tone": TONE_VAR[tone] } as CSSProperties) : undefined;
  return (
    <div className={cn("card-header", className)}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {icon ? (
          <span style={style} className="icon-chip-sm shrink-0" aria-hidden>
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <div className="truncate text-[13.5px] font-semibold tracking-tight text-[var(--color-ink)]">{title}</div>
          {sub ? <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">{sub}</div> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card-body", className)}>{children}</div>;
}
