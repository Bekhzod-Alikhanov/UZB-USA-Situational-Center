"use client";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  deltaPct?: number;
  deltaLabel?: string;
  tone?: "pos" | "neg" | "neu";
  is_demo?: boolean;
  source?: string;
  className?: string;
}

export function KpiCard({ label, value, sub, deltaPct, deltaLabel, tone, is_demo, source, className }: KpiCardProps) {
  const t = tone ?? (deltaPct == null ? "neu" : deltaPct > 0 ? "pos" : deltaPct < 0 ? "neg" : "neu");
  const DeltaIcon = t === "pos" ? ArrowUpRight : t === "neg" ? ArrowDownRight : Minus;
  const deltaColor =
    t === "pos"
      ? "text-[var(--color-pos)]"
      : t === "neg"
        ? "text-[var(--color-neg)]"
        : "text-[var(--color-ink-muted)]";

  return (
    <div className={cn("kpi-card", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="stat-label">{label}</div>
        {is_demo ? <DemoBadge source={source} /> : null}
      </div>
      <div className="mt-3 stat-value">{value}</div>
      <div className="mt-2 flex items-center justify-between gap-2">
        {sub ? <div className="stat-sub truncate">{sub}</div> : <span />}
        {deltaPct != null ? (
          <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium tabular", deltaColor)}>
            <DeltaIcon className="size-3" />
            {(deltaPct > 0 ? "+" : "") + deltaPct.toFixed(1)}%
            {deltaLabel ? <span className="ml-1 text-[10px] text-[var(--color-ink-muted)]">{deltaLabel}</span> : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}
