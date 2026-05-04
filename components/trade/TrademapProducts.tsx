"use client";
import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  uzExportsToUs2024Top,
  usExportsToUz2024Top,
  trademap2024Meta,
  type TrademapProduct2024,
} from "@/data/trademap-products";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type Direction = "uz-exports" | "us-exports";
type SortKey = "value" | "share" | "growth5y";

function shortenLabel(s: string, max = 60): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function fmtUsd(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

function GrowthBadge({ pct }: { pct: number | null }) {
  if (pct == null) {
    return <span className="mono text-[10.5px] text-[var(--color-ink-faint)]">n/a</span>;
  }
  const Icon = pct > 5 ? TrendingUp : pct < -5 ? TrendingDown : Minus;
  const tone =
    pct > 25
      ? "text-[var(--color-pos)]"
      : pct > 0
        ? "text-[color-mix(in_oklab,var(--color-pos)_60%,var(--color-ink-muted))]"
        : pct < -10
          ? "text-[var(--color-neg)]"
          : "text-[var(--color-ink-muted)]";
  return (
    <span className={cn("mono inline-flex items-center gap-1 text-[11px] tabular", tone)}>
      <Icon className="size-3" />
      {pct > 0 ? "+" : ""}
      {pct.toFixed(0)}%
    </span>
  );
}

/**
 * ITC Trade Map's pre-computed deep view for 2024 — Share % and 5Y growth
 * are calculated by ITC itself and merged in. Useful complement to the
 * Comtrade raw view: the same flows but with momentum indicators baked in.
 */
export function TrademapProducts() {
  const [direction, setDirection] = useState<Direction>("uz-exports");
  const [sortBy, setSortBy] = useState<SortKey>("value");

  const rows: TrademapProduct2024[] = useMemo(() => {
    const src = direction === "uz-exports" ? uzExportsToUs2024Top : usExportsToUz2024Top;
    const cmp =
      sortBy === "value"
        ? (a: TrademapProduct2024, b: TrademapProduct2024) => b.valueUsd - a.valueUsd
        : sortBy === "share"
          ? (a: TrademapProduct2024, b: TrademapProduct2024) => b.sharePct - a.sharePct
          : (a: TrademapProduct2024, b: TrademapProduct2024) =>
              (b.growth5yValuePct ?? -Infinity) - (a.growth5yValuePct ?? -Infinity);
    return [...src].sort(cmp);
  }, [direction, sortBy]);

  const totalUsd =
    direction === "uz-exports" ? trademap2024Meta.uzExportsToUsTotalUsd : trademap2024Meta.usExportsToUzTotalUsd;
  const visibleSum = rows.reduce((a, r) => a + r.valueUsd, 0);
  const coveragePct = totalUsd > 0 ? (visibleSum / totalUsd) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Direction:</span>
        {(
          [
            ["uz-exports", "UZ exports → US"],
            ["us-exports", "US exports → UZ"],
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

        <span className="ml-3 text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Sort:</span>
        {(
          [
            ["value", "Value"],
            ["share", "Share"],
            ["growth5y", "5Y growth"],
          ] as [SortKey, string][]
        ).map(([s, label]) => (
          <button
            key={s}
            type="button"
            onClick={() => setSortBy(s)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[12px] font-medium transition",
              s === sortBy
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
            )}
          >
            {label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2 text-[11px]">
          <SourceBadge sourceId={trademap2024Meta.sourceId} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">2024 total</div>
          <div className="mono text-[15px] font-semibold tabular text-[var(--color-ink)]">{fmtUsd(totalUsd)}</div>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">Visible sum</div>
          <div className="mono text-[15px] font-semibold tabular text-[var(--color-ink)]">{fmtUsd(visibleSum)}</div>
        </div>
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
          <div className="stat-label">Coverage</div>
          <div className="mono text-[15px] font-semibold tabular text-[var(--color-pos)]">
            {coveragePct.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="table">
          <thead>
            <tr>
              <th className="w-20">HS-6</th>
              <th>Commodity</th>
              <th className="text-right">Value</th>
              <th className="w-16 text-right">Share</th>
              <th className="w-20 text-right">5Y growth</th>
              <th className="w-20 text-right">5Y qty</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.hs}>
                <td className="mono font-semibold tabular text-[var(--color-primary)]">{r.hs}</td>
                <td className="text-[12.5px]" title={r.labelRu}>
                  {shortenLabel(r.labelRu)}
                </td>
                <td className="mono text-right tabular">{fmtUsd(r.valueUsd)}</td>
                <td className="mono text-right tabular text-[var(--color-ink-muted)]">{r.sharePct.toFixed(2)}%</td>
                <td className="text-right">
                  <GrowthBadge pct={r.growth5yValuePct} />
                </td>
                <td className="text-right">
                  <GrowthBadge pct={r.growth5yQuantityPct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">
        Source: ITC Trade Map · 2024 deep-view export. Russian product labels are Trade Map&apos;s defaults. 5-year
        growth is compound, calculated by ITC. UZ→US shows top-40 codes (~99% coverage); US→UZ shows top-60 codes from a
        longer tail of diversified flows. Residual code 999999 filtered.
      </p>
    </div>
  );
}
