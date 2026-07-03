"use client";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { tradeAnnualUz, tradeMonthlyUs } from "@/data/trade";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { intlLocale } from "@/components/brief/brief-data";

type View = "annual" | "monthly";

/**
 * Trade dynamics panel: annual UZ-stat series 2017–2025 (turnover area +
 * export/import lines) with a toggle to monthly U.S. Census bars (last 18
 * months). Each view carries its own methodology caption — hard data rule.
 */
export function BriefTradeChart() {
  const t = useTranslations("brief.trade");
  const locale = useLocale();
  const [view, setView] = useState<View>("annual");

  const monthFormat = useMemo(
    () => new Intl.DateTimeFormat(intlLocale(locale), { month: "short", year: "2-digit" }),
    [locale],
  );

  const annualData = useMemo(
    () =>
      tradeAnnualUz.map((y) => ({
        label: String(y.year),
        [t("turnover")]: y.turnover,
        [t("exports")]: y.exports,
        [t("imports")]: y.imports,
      })),
    [t],
  );

  const monthlyData = useMemo(
    () =>
      tradeMonthlyUs.slice(-18).map((m) => {
        const [y, mm] = m.month.split("-").map(Number);
        return {
          label: monthFormat.format(new Date(y, mm - 1, 1)),
          [t("exportsUs")]: m.exports,
          [t("importsUs")]: m.imports,
        };
      }),
    [monthFormat, t],
  );

  const data = view === "annual" ? annualData : monthlyData;
  const turnoverKey = t("turnover");
  const exportsKey = view === "annual" ? t("exports") : t("exportsUs");
  const importsKey = view === "annual" ? t("imports") : t("importsUs");

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        {(["annual", "monthly"] as View[]).map((v) => (
          <button key={v} type="button" className="brief-chip" aria-pressed={view === v} onClick={() => setView(v)}>
            {v === "annual" ? t("viewAnnual") : t("viewMonthly")}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-[var(--brief-ink-faint)]">
          {view === "annual" ? t("methodologyUz") : t("methodologyUs")}
        </span>
      </div>
      <div className="mt-2 flex-1">
        <ChartFrame height={252} className="h-[252px]">
          {({ width, height }) => (
            <ComposedChart width={width} height={height} data={data} margin={{ top: 8, right: 8, bottom: 0, left: -6 }}>
              <CartesianGrid stroke="var(--brief-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "var(--brief-border)" }}
                tick={{ fill: "var(--brief-ink-faint)", fontSize: 10 }}
                interval={view === "monthly" ? 2 : 0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--brief-ink-faint)", fontSize: 10 }}
                tickFormatter={(v) => `$${v}M`}
                width={52}
              />
              <Tooltip
                cursor={{ fill: "var(--brief-accent-soft)" }}
                contentStyle={{
                  background: "var(--brief-surface)",
                  border: "1px solid var(--brief-border-strong)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--brief-ink)",
                }}
                formatter={(v, name) => [`$${Number(v).toLocaleString(intlLocale(locale))}M`, name]}
              />
              {view === "annual" ? (
                <>
                  <Area
                    type="monotone"
                    dataKey={turnoverKey}
                    stroke="var(--brief-accent-bright)"
                    strokeWidth={2}
                    fill="var(--brief-accent-soft)"
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={exportsKey}
                    stroke="var(--brief-accent-2)"
                    strokeWidth={1.6}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={importsKey}
                    stroke="var(--brief-ink-faint)"
                    strokeWidth={1.4}
                    strokeDasharray="4 3"
                    dot={false}
                    isAnimationActive={false}
                  />
                </>
              ) : (
                <>
                  <Bar
                    dataKey={exportsKey}
                    fill="var(--brief-accent)"
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey={importsKey}
                    fill="var(--brief-accent-2)"
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={false}
                  />
                </>
              )}
            </ComposedChart>
          )}
        </ChartFrame>
      </div>
      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--brief-ink-muted)]">
        {view === "annual" ? (
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-[3px] w-4 rounded-full bg-[var(--brief-accent-bright)]" />
            {turnoverKey}
          </li>
        ) : null}
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-[3px] w-4 rounded-full"
            style={{ background: view === "annual" ? "var(--brief-accent-2)" : "var(--brief-accent)" }}
          />
          {exportsKey}
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-[3px] w-4 rounded-full"
            style={{ background: view === "annual" ? "var(--brief-ink-faint)" : "var(--brief-accent-2)" }}
          />
          {importsKey}
        </li>
      </ul>
    </div>
  );
}
