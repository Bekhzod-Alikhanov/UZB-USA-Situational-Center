"use client";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { tradeMonthlyUs, tradeMonthlyMeta } from "@/data/trade";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type Window = "12m" | "24m" | "all";

const WINDOW_LABEL: Record<Window, string> = {
  "12m": "Last 12 months",
  "24m": "Last 24 months",
  all: "All",
};

function formatMonth(iso: string): string {
  const [y, m] = iso.split("-");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[Number(m) - 1]} ${y.slice(2)}`;
}

/**
 * Monthly U.S. Census goods-trade with Uzbekistan. Bars show exports and
 * imports, the line shows the running balance. Useful for monitoring
 * tactical shocks (the Jan-Mar 2025 import spike from a one-off shipment
 * batch is the canonical example) that aggregate annual figures hide.
 */
export function MonthlyTradeChart() {
  const [window, setWindow] = useState<Window>("24m");

  const data = useMemo(() => {
    const slice =
      window === "all"
        ? tradeMonthlyUs
        : tradeMonthlyUs.slice(-(window === "12m" ? 12 : 24));
    return slice.map((m) => ({
      label: formatMonth(m.month),
      iso: m.month,
      Exports: m.exports,
      Imports: m.imports,
      Balance: m.balance,
    }));
  }, [window]);

  const totals = useMemo(() => {
    const exp = data.reduce((a, d) => a + d.Exports, 0);
    const imp = data.reduce((a, d) => a + d.Imports, 0);
    return { exports: exp, imports: imp, balance: exp - imp };
  }, [data]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Window:</span>
        {(["12m", "24m", "all"] as Window[]).map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWindow(w)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition",
              w === window
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
            )}
          >
            {WINDOW_LABEL[w]}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[11px]">
          <SourceBadge sourceId={tradeMonthlyMeta.sourceId} />
          <span className="text-[var(--color-ink-faint)]">refreshed {tradeMonthlyMeta.fetched_at}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">Exports (window)</div>
          <div className="mono text-[15px] font-semibold tabular text-[var(--color-pos)]">${totals.exports.toFixed(1)}M</div>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">Imports (window)</div>
          <div className="mono text-[15px] font-semibold tabular text-[var(--color-warn)]">${totals.imports.toFixed(1)}M</div>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">Net balance</div>
          <div
            className={cn(
              "mono text-[15px] font-semibold tabular",
              totals.balance >= 0 ? "text-[var(--color-pos)]" : "text-[var(--color-neg)]",
            )}
          >
            {totals.balance >= 0 ? "+" : ""}${totals.balance.toFixed(1)}M
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
              tick={{ fill: "var(--color-ink-muted)", fontSize: 10 }}
              interval={data.length > 18 ? 2 : 0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
              tickFormatter={(v) => `$${v}M`}
              width={60}
            />
            <Tooltip
              cursor={{ fill: "var(--color-surface-2)" }}
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 6,
                fontSize: 12,
              }}
              formatter={(v, name) => [`$${Number(v).toLocaleString("en-US")}M`, name]}
            />
            <Legend iconType="square" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            <ReferenceLine y={0} stroke="var(--color-border-strong)" strokeWidth={1} />
            <Bar dataKey="Exports" fill="var(--color-pos)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Imports" fill="var(--color-warn)" radius={[2, 2, 0, 0]} />
            <Line
              type="monotone"
              dataKey="Balance"
              stroke="var(--color-primary)"
              strokeWidth={1.75}
              dot={{ r: 2.5, fill: "var(--color-primary)", stroke: "var(--color-surface)", strokeWidth: 1.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
