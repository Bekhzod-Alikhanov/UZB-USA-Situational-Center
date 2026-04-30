"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, ArrowRight, Minus } from "lucide-react";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import type { ReactNode, CSSProperties } from "react";

export type KpiTone = "trade" | "visits" | "invest" | "agree" | "people" | "rose" | "slate" | "primary";

const TONE_VAR: Record<KpiTone, string> = {
  trade: "var(--color-trade)",
  visits: "var(--color-visits)",
  invest: "var(--color-invest)",
  agree: "var(--color-agree)",
  people: "var(--color-people)",
  rose: "var(--color-rose)",
  slate: "var(--color-slate)",
  primary: "var(--color-primary)",
};

interface KpiCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  deltaPct?: number;
  deltaLabel?: string;
  /** Force pos/neg/neu coloring (default: derived from deltaPct sign). */
  delta?: "pos" | "neg" | "neu";
  /** Domain tone — drives icon-chip color, top accent strip, ambient gradient. */
  tone?: KpiTone;
  /** Pre-rendered icon JSX (e.g. <TrendingUp className="size-4" />). */
  icon?: ReactNode;
  is_demo?: boolean;
  source?: string;
  className?: string;
  /** When provided, the card becomes a clickable drill-down link. */
  href?: string;
}

export function KpiCard({
  label,
  value,
  sub,
  deltaPct,
  deltaLabel,
  delta,
  tone = "primary",
  icon,
  is_demo,
  source,
  className,
  href,
}: KpiCardProps) {
  const t = delta ?? (deltaPct == null ? "neu" : deltaPct > 0 ? "pos" : deltaPct < 0 ? "neg" : "neu");
  const DeltaIcon = t === "pos" ? ArrowUpRight : t === "neg" ? ArrowDownRight : Minus;

  const style = { "--kpi-tone": TONE_VAR[tone], "--chip-tone": TONE_VAR[tone] } as CSSProperties;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <span className="icon-chip" aria-hidden>
              {icon}
            </span>
          ) : null}
          <div className="stat-label">{label}</div>
        </div>
        <div className="flex items-center gap-1.5">
          {is_demo ? <DemoBadge source={source} /> : null}
          {href ? (
            <ArrowRight className="size-3.5 shrink-0 translate-x-0 text-[var(--color-ink-faint)] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          ) : null}
        </div>
      </div>
      <div className="mt-3 stat-value">{value}</div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        {sub ? <div className="stat-sub truncate">{sub}</div> : <span />}
        {deltaPct != null ? (
          <span
            className={cn(
              "delta-pill",
              t === "pos" ? "delta-pill-pos" : t === "neg" ? "delta-pill-neg" : "delta-pill-neu",
            )}
          >
            <DeltaIcon className="size-3" />
            {(deltaPct > 0 ? "+" : "") + deltaPct.toFixed(1)}%
            {deltaLabel ? <span className="opacity-70">· {deltaLabel}</span> : null}
          </span>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} style={style} className={cn("kpi-card group block", className)}>
        {inner}
      </Link>
    );
  }

  return (
    <div style={style} className={cn("kpi-card", className)}>
      {inner}
    </div>
  );
}
