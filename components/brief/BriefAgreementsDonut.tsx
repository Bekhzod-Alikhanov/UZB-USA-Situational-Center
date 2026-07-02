"use client";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { agreementsAggregate } from "@/data/agreements";
import { ChartFrame } from "@/components/charts/ChartFrame";
import { BriefNumber } from "@/components/brief/BriefNumber";
import { intlLocale } from "@/components/brief/brief-data";

const CATEGORY_COLORS: Record<string, string> = {
  interstate: "var(--brief-accent-bright)",
  intergov: "var(--brief-accent)",
  interagency: "var(--brief-accent-2)",
  other: "var(--brief-ink-faint)",
};

/**
 * Structure of the 138-document legal base (MFA aggregate, real) as a donut
 * with the total counting up in the center; investment agreements called out
 * separately below, prototype-style.
 */
export function BriefAgreementsDonut() {
  const t = useTranslations("brief.agreementsChart");
  const locale = useLocale();
  const nf = useMemo(() => new Intl.NumberFormat(intlLocale(locale)), [locale]);

  const data = useMemo(
    () =>
      (Object.entries(agreementsAggregate.byCategory) as [string, number][]).map(([key, value]) => ({
        key,
        name: t(key),
        value,
      })),
    [t],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="relative">
        <ChartFrame height={182} className="h-[182px]">
          {({ width, height }) => (
            <PieChart width={width} height={height}>
              <Tooltip
                contentStyle={{
                  background: "var(--brief-surface)",
                  border: "1px solid var(--brief-border-strong)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "var(--brief-ink)",
                }}
                formatter={(v, name) => [nf.format(Number(v)), name]}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="68%"
                outerRadius="94%"
                paddingAngle={2}
                strokeWidth={0}
                isAnimationActive={false}
              >
                {data.map((d) => (
                  <Cell key={d.key} fill={CATEGORY_COLORS[d.key] ?? "var(--brief-ink-faint)"} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ChartFrame>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="brief-kpi-value !mt-0">
              <BriefNumber value={agreementsAggregate.totalDocuments} />
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--brief-ink-faint)]">
              {t("total")}
            </div>
          </div>
        </div>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11.5px] text-[var(--brief-ink-muted)]">
        {data.map((d) => (
          <li key={d.key} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block size-2 shrink-0 rounded-full"
                style={{ background: CATEGORY_COLORS[d.key] ?? "var(--brief-ink-faint)" }}
              />
              <span className="truncate">{d.name}</span>
            </span>
            <span className="tabular-nums text-[var(--brief-ink)]">{nf.format(d.value)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 border-t border-[var(--brief-border)] pt-2 text-[11.5px] text-[var(--brief-ink-muted)]">
        {t("investLine", { count: agreementsAggregate.totalInvestAgreements })}
      </p>
    </div>
  );
}
