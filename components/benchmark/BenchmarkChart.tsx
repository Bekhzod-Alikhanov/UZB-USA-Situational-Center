"use client";
/**
 * Recharts BarChart extracted out of BenchmarkView so it can be lazy-loaded.
 * Saves ~80 KB of Recharts bundle from the initial /benchmark route until
 * the user actually scrolls the chart into view.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { ChartFrame } from "@/components/charts/ChartFrame";

interface ChartRow {
  name: string;
  label: string;
  value: number;
  is_demo: boolean;
}

interface Props {
  data: ChartRow[];
  format: (n: number) => string;
  metricLabel: string;
}

export function BenchmarkChart({ data, format, metricLabel }: Props) {
  return (
    <ChartFrame height={280} className="h-[260px] sm:h-[280px]">
      {({ width, height }) => (
        <BarChart width={width} height={height} data={data} margin={{ top: 22, right: 16, bottom: 4, left: -8 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
            width={56}
          />
          <Tooltip
            cursor={{ fill: "var(--color-surface-2)" }}
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              fontSize: 12,
            }}
            formatter={(v) => [format(Number(v)), metricLabel]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell
                key={d.name}
                fill={d.name === "UZ" ? "var(--color-primary)" : "var(--color-border-strong)"}
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => format(Number(v))}
              style={{ fill: "var(--color-ink-muted)", fontSize: 10 }}
            />
          </Bar>
        </BarChart>
      )}
    </ChartFrame>
  );
}
