"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  foreignAssistanceYears,
  foreignAssistanceFy2024Agencies,
  foreignAssistanceFy2024Categories,
  foreignAssistanceMeta,
} from "@/data/foreign-assistance";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

const AGENCY_COLOR: Record<string, string> = {
  USAID: "var(--color-primary)",
  "Department of Defense": "var(--color-ink-muted)",
  "Department of State": "var(--color-warn)",
  "Department of Agriculture": "var(--color-pos)",
  "Department of Energy": "var(--color-neg)",
};

export function ForeignAssistanceView() {
  const yearsData = foreignAssistanceYears.map((y) => ({
    label: `FY${y.fiscalYear}`,
    value: y.totalUsdM,
    preliminary: y.preliminary ?? false,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <SourceBadge sourceId={foreignAssistanceMeta.sourceId} />
          <span className="text-[var(--color-ink-faint)]">refreshed {foreignAssistanceMeta.fetched_at}</span>
        </div>
        <div className="text-right text-[11px] text-[var(--color-ink-muted)]">
          <div className="mono text-[18px] font-semibold tabular text-[var(--color-ink)]">
            ${foreignAssistanceMeta.fyMostRecentTotalUsdM.toFixed(1)}M
          </div>
          <div>FY{foreignAssistanceMeta.fyMostRecent} · most recent fully reported</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h4 className="serif text-[13px] font-medium text-[var(--color-ink)]">
            Total obligations by fiscal year
          </h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={yearsData} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
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
                  tickFormatter={(v) => `$${v}M`}
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
                  formatter={(v) => [`$${Number(v).toFixed(2)}M`, "Obligations"]}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {yearsData.map((d) => (
                    <Cell
                      key={d.label}
                      fill={d.preliminary ? "var(--color-ink-faint)" : "var(--color-primary)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10.5px] text-[var(--color-ink-faint)]">
            FY2025 bar is preliminary (partial reporting per ForeignAssistance.gov).
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="serif text-[13px] font-medium text-[var(--color-ink)]">FY2024 by appropriating agency</h4>
          <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
            <table className="table">
              <thead>
                <tr>
                  <th>Agency</th>
                  <th className="text-right">Amount, $M</th>
                  <th className="text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {foreignAssistanceFy2024Agencies.map((a) => (
                  <tr key={a.agency}>
                    <td className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: AGENCY_COLOR[a.agency] ?? "var(--color-border)" }}
                        />
                        {a.agency}
                      </span>
                    </td>
                    <td className="mono text-right tabular">{a.amountUsdM.toFixed(2)}</td>
                    <td className="mono text-right tabular text-[var(--color-ink-muted)]">
                      {a.sharePct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="serif mt-2 text-[13px] font-medium text-[var(--color-ink)]">FY2024 economic / military split</h4>
          <div className="grid grid-cols-2 gap-2">
            {foreignAssistanceFy2024Categories.map((c) => (
              <div
                key={c.category}
                className="flex flex-col gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
              >
                <div className="stat-label">{c.category}</div>
                <div className="mono text-[16px] font-semibold tabular text-[var(--color-ink)]">
                  ${c.amountUsdM.toFixed(1)}M
                </div>
                <div className="text-[10.5px] text-[var(--color-ink-muted)]">{c.sharePct.toFixed(1)}% of FY2024</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">
        Methodology: total obligations basis (not net disbursements). Source: ForeignAssistance.gov country-page
        figures, cross-checked with the USAFacts aggregation. Yearly totals can shift by 5–10% as agencies revise
        prior-year reporting.
      </p>
    </div>
  );
}
