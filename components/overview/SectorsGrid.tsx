"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { buildSectorTiles, type SectorTile } from "@/data/overview";

const TONE_VAR: Record<SectorTile["tone"], string> = {
  trade: "var(--color-trade)",
  visits: "var(--color-visits)",
  invest: "var(--color-invest)",
  agree: "var(--color-agree)",
  people: "var(--color-people)",
  rose: "var(--color-rose)",
  slate: "var(--color-slate)",
};

const STATUS_LABEL: Record<SectorTile["status"], string> = {
  operating: "operating",
  construction: "construction",
  agreed: "agreed",
  negotiation: "negotiation",
  mou: "mou",
  paused: "paused",
};

function fmtUsd(usdM: number): string {
  if (usdM >= 1000) return `$${(usdM / 1000).toFixed(1)}B`;
  return `$${Math.round(usdM)}M`;
}

/**
 * 8-tile sector grid — aggregated from `data/investments.ts` by sector.
 * Each tile has a tone-coloured label, status tag, big serif value,
 * project count, delta pill, and a tone-gradient progress bar.
 */
export function SectorsGrid() {
  const tiles = buildSectorTiles();
  const max = Math.max(...tiles.map((t) => t.valueMusd));
  const locale = useLocale();

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {tiles.map((s) => {
        const c = TONE_VAR[s.tone];
        const pct = (s.valueMusd / max) * 100;
        const DeltaIcon = s.delta > 0 ? ArrowUpRight : s.delta < 0 ? ArrowDownRight : Minus;
        return (
          <Link
            key={s.id}
            href={`/${locale}/investments`}
            prefetch={false}
            className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:-translate-y-px hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-hover)]"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink)]">
                {s.label}
              </div>
              <span className="mono shrink-0 text-[9px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                {STATUS_LABEL[s.status]}
              </span>
            </div>
            <div className="serif tabular text-[22px] font-medium leading-none text-[var(--color-ink)]">
              {fmtUsd(s.valueMusd)}
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <span className="mono text-[10px] text-[var(--color-ink-muted)]">{s.projects} proj.</span>
              <span
                className="mono inline-flex items-center gap-0.5 tabular text-[10.5px] font-semibold"
                style={{
                  color: s.delta > 0 ? "var(--color-pos)" : s.delta < 0 ? "var(--color-neg)" : "var(--color-ink-faint)",
                }}
              >
                <DeltaIcon className="size-3" />
                {s.delta === 0 ? "—" : `${s.delta > 0 ? "+" : ""}${s.delta.toFixed(1)}%`}
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${c}, color-mix(in oklab, ${c} 45%, white))`,
                }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
