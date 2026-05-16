"use client";
import { useMemo, useState } from "react";
import { topUsImportsFromUzByYear, topUsExportsToUzByYear } from "@/data/comtrade-hs6";
import { comtradeAnnualUsReporter, comtradeMeta } from "@/data/comtrade-meta";
import type { Hs6Row } from "@/data/comtrade-types";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type Direction = "uz-exports" | "uz-imports";
type Year = 2021 | 2022 | 2023 | 2024 | 2025;
const YEARS: Year[] = [2021, 2022, 2023, 2024, 2025];

const RESIDUAL_CODES = new Set(["999999"]);

function shortenDesc(desc: string, max = 80): string {
  if (desc.length <= max) return desc;
  return desc.slice(0, max - 1) + "…";
}

function formatValue(usd: number): string {
  if (usd >= 1_000_000) return `${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `${(usd / 1_000).toFixed(0)}K`;
  return `${usd}`;
}

/**
 * Top HS-6 commodity codes for UZ↔US bilateral trade, sourced from
 * UN Comtrade. Uses the US-reported flows (US imports = UZ exports,
 * US exports = UZ imports) because the US side reports more
 * consistently — UZ has a publication lag (no 2025 yet).
 */
export function ComtradeHs6Top() {
  const [direction, setDirection] = useState<Direction>("uz-exports");
  const [year, setYear] = useState<Year>(2024);

  const rows: Hs6Row[] = useMemo(() => {
    const src = direction === "uz-exports" ? topUsImportsFromUzByYear : topUsExportsToUzByYear;
    return (src[year] ?? []).filter((r) => !RESIDUAL_CODES.has(r.hs6)).slice(0, 25);
  }, [direction, year]);

  const annualTotal =
    direction === "uz-exports"
      ? (comtradeAnnualUsReporter[year]?.importsFromUz ?? 0)
      : (comtradeAnnualUsReporter[year]?.exportsToUz ?? 0);
  const visibleSum = rows.reduce((a, r) => a + r.valueUsd, 0);
  const visibleSharePct = annualTotal > 0 ? (visibleSum / annualTotal) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Direction:</span>
        {(
          [
            ["uz-exports", "UZ exports → US"],
            ["uz-imports", "UZ imports ← US"],
          ] as [Direction, string][]
        ).map(([d, label]) => (
          <button
            key={d}
            type="button"
            onClick={() => setDirection(d)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition",
              d === direction
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
            )}
          >
            {label}
          </button>
        ))}
        <span className="ml-3 text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Year:</span>
        {YEARS.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => setYear(y)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[12px] font-medium transition",
              y === year
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
            )}
          >
            {y}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[11px]">
          <SourceBadge sourceId={comtradeMeta.sourceId} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">Annual total ({year})</div>
          <div className="mono text-[15px] font-semibold tabular text-[var(--color-ink)]">
            ${(annualTotal / 1_000_000).toFixed(1)}M
          </div>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">Top-25 sum</div>
          <div className="mono text-[15px] font-semibold tabular text-[var(--color-ink)]">
            ${(visibleSum / 1_000_000).toFixed(1)}M
          </div>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">Coverage</div>
          <div className="mono text-[15px] font-semibold tabular text-[var(--color-pos)]">
            {visibleSharePct.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="w-10 text-right">
                #
              </th>
              <th scope="col" className="w-20">
                HS-6
              </th>
              <th scope="col">Commodity</th>
              <th scope="col" className="text-right">
                Value, $
              </th>
              <th scope="col" className="w-20 text-right">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const sharePct = annualTotal > 0 ? (r.valueUsd / annualTotal) * 100 : 0;
              return (
                <tr key={r.hs6}>
                  <td className="mono text-right text-[var(--color-ink-muted)]">{idx + 1}</td>
                  <td className="mono font-semibold tabular text-[var(--color-primary)]">{r.hs6}</td>
                  <td className="text-[12.5px]" title={r.desc}>
                    {shortenDesc(r.desc)}
                  </td>
                  <td className="mono text-right tabular">{formatValue(r.valueUsd)}</td>
                  <td className="mono text-right tabular text-[var(--color-ink-muted)]">{sharePct.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">
        Source: UN Comtrade preview API · classification {comtradeMeta.classificationCode} · refreshed{" "}
        {comtradeMeta.fetched_at}. US-reporter view used because UZ has not yet published 2025 (typical lag in UZ
        Comtrade reporting). Residual code 999999 (&ldquo;not specified&rdquo;) filtered.
      </p>
    </div>
  );
}
