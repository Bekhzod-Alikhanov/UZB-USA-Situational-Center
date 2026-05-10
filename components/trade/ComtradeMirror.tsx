"use client";
import { useMemo, useState } from "react";
import { mirror2024, comtradeMeta, type MirrorRow } from "@/data/comtrade";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type Flow = "exports" | "imports";

const RESIDUAL_CODES = new Set(["999999"]);

function shortenDesc(desc: string, max = 70): string {
  if (desc.length <= max) return desc;
  return desc.slice(0, max - 1) + "…";
}

function fmt(usd: number): string {
  if (usd === 0) return "—";
  if (usd >= 1_000_000) return `${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `${(usd / 1_000).toFixed(0)}K`;
  return `${usd}`;
}

interface EnrichedMirror {
  row: MirrorRow;
  uzSide: number;
  usSide: number;
  ratio: number;
  /** UZ minus US, normalized by max — for sort. */
  divergence: number;
}

export function ComtradeMirror() {
  const [flow, setFlow] = useState<Flow>("exports");

  const data: EnrichedMirror[] = useMemo(() => {
    return mirror2024
      .filter((r) => !RESIDUAL_CODES.has(r.hs6))
      .map((row) => {
        const uzSide = flow === "exports" ? row.uzExportsToUs : row.uzImportsFromUs;
        const usSide = flow === "exports" ? row.usImportsFromUz : row.usExportsToUz;
        const max = Math.max(uzSide, usSide);
        const min = Math.min(uzSide, usSide);
        const ratio = min > 0 ? max / min : Infinity;
        const divergence = max - min;
        return { row, uzSide, usSide, ratio, divergence };
      })
      .filter((d) => d.uzSide + d.usSide >= 500_000) // drop noise <$500K
      .sort((a, b) => b.divergence - a.divergence)
      .slice(0, 20);
  }, [flow]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Flow:</span>
        {(
          [
            ["exports", "UZ → US (UZ-X vs US-M)"],
            ["imports", "US → UZ (US-X vs UZ-M)"],
          ] as [Flow, string][]
        ).map(([f, label]) => (
          <button
            key={f}
            type="button"
            onClick={() => setFlow(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition",
              f === flow
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
            )}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-[11px]">
          <SourceBadge sourceId={comtradeMeta.sourceId} />
          <span className="text-[var(--color-ink-faint)]">2024 · top-20 by absolute gap</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="w-20">HS-6</th>
              <th scope="col">Commodity</th>
              <th scope="col" className="text-right">UZ-side, $</th>
              <th scope="col" className="text-right">US-side, $</th>
              <th scope="col" className="w-24 text-right">Gap, $</th>
              <th scope="col" className="w-16 text-right">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => {
              const uzBigger = d.uzSide > d.usSide;
              return (
                <tr key={d.row.hs6}>
                  <td className="mono font-semibold tabular text-[var(--color-primary)]">{d.row.hs6}</td>
                  <td className="text-[12.5px]" title={d.row.desc}>
                    {shortenDesc(d.row.desc)}
                  </td>
                  <td
                    className={cn(
                      "mono text-right tabular",
                      uzBigger ? "font-semibold text-[var(--color-pos)]" : "text-[var(--color-ink-muted)]",
                    )}
                  >
                    {fmt(d.uzSide)}
                  </td>
                  <td
                    className={cn(
                      "mono text-right tabular",
                      !uzBigger ? "font-semibold text-[var(--color-warn)]" : "text-[var(--color-ink-muted)]",
                    )}
                  >
                    {fmt(d.usSide)}
                  </td>
                  <td className="mono text-right tabular">{fmt(d.divergence)}</td>
                  <td className="mono text-right tabular text-[var(--color-ink-muted)]">
                    {Number.isFinite(d.ratio) ? `${d.ratio.toFixed(1)}×` : "∞"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">
        Mirror discrepancy = same flow reported by both sides. UZ-side numbers come from UZ as reporter (Comtrade code
        860); US-side from US as reporter (842). Common drivers: re-exports through third countries (UAE, Türkiye, KZ),
        valuation differences (CIF vs FOB), classification disagreements. Filtered to gaps ≥ $500K. Residual code 999999
        omitted.
      </p>
    </div>
  );
}
