"use client";

import dynamic from "next/dynamic";
import { BarChart3, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Skeleton = ({ h }: { h: number }) => (
  <div className="w-full animate-pulse rounded-md bg-[var(--color-surface-2)]" style={{ height: h }} aria-busy />
);

const TradeFlowChartImpl = dynamic(
  () => import("@/components/charts/TradeFlowChart").then((m) => ({ default: m.TradeFlowChart })),
  { ssr: false, loading: () => <Skeleton h={340} /> },
);

const DualMethodologyChartImpl = dynamic(
  () => import("./DualMethodologyChart").then((m) => ({ default: m.DualMethodologyChart })),
  { ssr: false, loading: () => <Skeleton h={300} /> },
);

interface TradeChartDisclosureProps {
  kind: "flow" | "methodology";
  buttonLabel: string;
  summary: string;
  height?: number;
}

export function TradeChartDisclosure({ kind, buttonLabel, summary, height = 340 }: TradeChartDisclosureProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
        <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{summary}</p>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
        >
          <BarChart3 className="size-3.5" aria-hidden />
          {open ? "Hide chart" : buttonLabel}
          <ChevronDown className={cn("size-3.5 transition", open && "rotate-180")} aria-hidden />
        </button>
      </div>

      {open ? (
        <div className="mt-4">
          {kind === "flow" ? <TradeFlowChartImpl height={height} /> : <DualMethodologyChartImpl />}
        </div>
      ) : null}
    </div>
  );
}
