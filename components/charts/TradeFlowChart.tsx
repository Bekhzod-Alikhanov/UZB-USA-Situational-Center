"use client";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { tradeAnnual } from "@/data/trade";
import { ChartFrame } from "./ChartFrame";

export function TradeFlowChart({ height = 300 }: { height?: number }) {
  const data = tradeAnnual.map((y) => ({
    year: y.year,
    Exports: y.exports,
    Imports: y.imports,
    Turnover: y.turnover,
  }));

  return (
    <ChartFrame height={height}>
      {({ width, height: h }) => (
        <ComposedChart width={width} height={h} data={data} margin={{ top: 10, right: 20, bottom: 6, left: -10 }}>
          <defs>
            <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-pos)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--color-pos)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gImp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
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
            width={56}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-border-strong)", strokeDasharray: "3 3" }}
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-ink-muted)", fontSize: 11 }}
            formatter={(v) => [`$${Number(v).toLocaleString("en-US")}M`, ""]}
          />
          <Legend iconType="plainline" wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
          <Area type="monotone" dataKey="Imports" fill="url(#gImp)" stroke="var(--color-primary)" strokeWidth={1.5} isAnimationActive={false} />
          <Area type="monotone" dataKey="Exports" fill="url(#gExp)" stroke="var(--color-pos)" strokeWidth={1.5} isAnimationActive={false} />
          <Line
            type="monotone"
            dataKey="Turnover"
            stroke="var(--color-ink)"
            strokeWidth={1.75}
            dot={{ r: 2.5, fill: "var(--color-ink)", stroke: "var(--color-surface)", strokeWidth: 1.5 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      )}
    </ChartFrame>
  );
}
