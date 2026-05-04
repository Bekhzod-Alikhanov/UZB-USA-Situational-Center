"use client";
import { tradeAnnual } from "@/data/trade";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function TradeTable() {
  const ti = useTranslations("trade.indicators");
  const tc = useTranslations("trade.columns");

  const rows = [
    { key: "turnover", label: ti("turnover"), get: (y: (typeof tradeAnnual)[number]) => y.turnover },
    { key: "exports", label: ti("exports"), get: (y: (typeof tradeAnnual)[number]) => y.exports },
    { key: "imports", label: ti("imports"), get: (y: (typeof tradeAnnual)[number]) => y.imports },
    { key: "balance", label: ti("balance"), get: (y: (typeof tradeAnnual)[number]) => y.balance, negative: true },
  ];

  const years = tradeAnnual.map((y) => y.year);
  const y2025 = tradeAnnual.find((y) => y.year === 2025)!;
  const y2024 = tradeAnnual.find((y) => y.year === 2024)!;
  const y2017 = tradeAnnual.find((y) => y.year === 2017)!;

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="sticky left-0 bg-[var(--color-surface-2)]">{tc("indicator")}</th>
            {years.map((y) => (
              <th key={y} className="text-right">
                {y}
              </th>
            ))}
            <th className="text-right">{tc("growth2017")}</th>
            <th className="text-right">{tc("growth2024")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const last = r.get(y2025);
            const v2017 = r.get(y2017);
            const v2024 = r.get(y2024);
            const growth2017 = v2017 !== 0 ? last / v2017 : 0;
            const growth2024 = v2024 !== 0 ? ((last - v2024) / Math.abs(v2024)) * 100 : 0;
            return (
              <tr key={r.key}>
                <td className="sticky left-0 bg-[var(--color-surface)] font-medium">{r.label}</td>
                {years.map((y) => {
                  const v = r.get(tradeAnnual.find((a) => a.year === y)!);
                  return (
                    <td key={y} className="mono text-right">
                      {r.negative
                        ? v < 0
                          ? `−${Math.abs(v).toLocaleString("en-US")}`
                          : v.toLocaleString("en-US")
                        : v.toLocaleString("en-US")}
                    </td>
                  );
                })}
                <td
                  className={cn(
                    "mono text-right font-medium",
                    growth2017 >= 1 ? "text-[var(--color-pos)]" : "text-[var(--color-ink)]",
                  )}
                >
                  {r.negative ? `${growth2017.toFixed(1)}×` : `${growth2017.toFixed(1)}×`}
                </td>
                <td
                  className={cn(
                    "mono text-right font-medium",
                    growth2024 > 0 ? "text-[var(--color-pos)]" : "text-[var(--color-neg)]",
                  )}
                >
                  {(growth2024 > 0 ? "+" : "") + growth2024.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
