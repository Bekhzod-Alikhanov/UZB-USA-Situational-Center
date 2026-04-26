"use client";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { tradeAnnualUz, tradeAnnualUs } from "@/data/trade";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type Series = "turnover" | "exports" | "imports" | "balance";

const SERIES_LABEL: Record<Series, string> = {
  turnover: "Turnover",
  exports: "Exports",
  imports: "Imports",
  balance: "Balance",
};

const SERIES_NOTE: Record<Series, { uz: string; us: string }> = {
  turnover: { uz: "UZ-side total turnover", us: "US-side total turnover" },
  exports: { uz: "UZ exports to US", us: "US exports to UZ" },
  imports: { uz: "UZ imports from US", us: "US imports from UZ" },
  balance: { uz: "UZ-reported balance", us: "US-reported balance" },
};

/**
 * Side-by-side rendering of UZ State Statistics Committee and U.S. Census
 * Bureau goods-trade series. The two views describe the same trade flow but
 * use different methodologies, and their numbers do not match — that
 * mirror-discrepancy is itself a useful insight for analysts.
 */
export function DualMethodologyChart() {
  const [series, setSeries] = useState<Series>("turnover");

  const data = useMemo(() => {
    const years = tradeAnnualUz.map((y) => y.year);
    return years.map((y) => {
      const uz = tradeAnnualUz.find((x) => x.year === y);
      const us = tradeAnnualUs.find((x) => x.year === y);
      return {
        year: y,
        UZ: uz ? uz[series] : null,
        US: us ? us[series] : null,
      };
    });
  }, [series]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Series:</span>
        {(["turnover", "exports", "imports", "balance"] as Series[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSeries(s)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition",
              s === series
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
            )}
          >
            {SERIES_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 text-[11px] md:grid-cols-2">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--color-primary)]">UZ National Statistics</span>
            <SourceBadge sourceId="input_trade_stat_docx" />
          </div>
          <div className="mt-0.5 text-[var(--color-ink-muted)]">{SERIES_NOTE[series].uz}</div>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--color-warn)]">U.S. Census goods-only</span>
            <SourceBadge sourceId="census_goods_uz" />
          </div>
          <div className="mt-0.5 text-[var(--color-ink-muted)]">{SERIES_NOTE[series].us}</div>
        </div>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
              tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
              tickFormatter={(v) => `$${v}M`}
              width={60}
            />
            <Tooltip
              cursor={{ stroke: "var(--color-border-strong)", strokeDasharray: "3 3" }}
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 6,
                fontSize: 12,
              }}
              formatter={(v, name) => [`$${Number(v).toLocaleString("en-US")}M`, name]}
            />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
            <Line
              type="monotone"
              name="UZ Stat"
              dataKey="UZ"
              stroke="var(--color-primary)"
              strokeWidth={1.75}
              dot={{ r: 2.5, fill: "var(--color-primary)", stroke: "var(--color-surface)", strokeWidth: 1.5 }}
            />
            <Line
              type="monotone"
              name="US Census"
              dataKey="US"
              stroke="var(--color-warn)"
              strokeWidth={1.75}
              strokeDasharray="4 3"
              dot={{ r: 2.5, fill: "var(--color-warn)", stroke: "var(--color-surface)", strokeWidth: 1.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
