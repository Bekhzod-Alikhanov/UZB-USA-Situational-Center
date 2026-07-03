import { getTranslations } from "next-intl/server";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { tradeAnnual } from "@/data/trade";
import { cn } from "@/lib/utils";

type Tone = "trade" | "invest" | "agree" | "rose";

const TONE_VAR: Record<Tone, string> = {
  trade: "var(--color-trade)",
  invest: "var(--color-invest)",
  agree: "var(--color-agree)",
  rose: "var(--color-rose)",
};

/** Tiny zero-dependency line sparkline (no axes), scaled to its container. */
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 100;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const pts = values.map((v, i) => [i * step, h - ((v - min) / range) * h] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-hidden className="h-7 w-full">
      <path d={area} fill={color} opacity={0.1} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={1.8} fill={color} />
    </svg>
  );
}

/**
 * Compact annual-trend briefing strip shown above the quote-safe annual table.
 * Four headline series (turnover / exports / imports / balance) each with the
 * 2025 value, a YoY delta, and a 2017→2025 sparkline — so the section reads as
 * an executive briefing first, with the full table as the source of truth below.
 * All figures come straight from `tradeAnnual` (UZ Stat); nothing synthetic.
 */
export async function TradeAnnualSummary({ locale }: { locale: string }) {
  const ti = await getTranslations({ locale, namespace: "trade.indicators" });
  const numberLocale = locale === "ru" ? "ru-RU" : locale === "uz-latn" ? "uz-Latn-UZ" : "en-US";

  const y2025 = tradeAnnual.find((y) => y.year === 2025)!;
  const y2024 = tradeAnnual.find((y) => y.year === 2024)!;

  const tiles: { key: Tone; label: string; series: number[]; latest: number; prev: number; signed?: boolean }[] = [
    {
      key: "trade",
      label: ti("turnover"),
      series: tradeAnnual.map((y) => y.turnover),
      latest: y2025.turnover,
      prev: y2024.turnover,
    },
    {
      key: "invest",
      label: ti("exports"),
      series: tradeAnnual.map((y) => y.exports),
      latest: y2025.exports,
      prev: y2024.exports,
    },
    {
      key: "agree",
      label: ti("imports"),
      series: tradeAnnual.map((y) => y.imports),
      latest: y2025.imports,
      prev: y2024.imports,
    },
    {
      key: "rose",
      label: ti("balance"),
      series: tradeAnnual.map((y) => Math.abs(y.balance)),
      latest: y2025.balance,
      prev: y2024.balance,
      signed: true,
    },
  ];

  const fmt = (v: number) =>
    `${v < 0 ? "−" : ""}$${Math.abs(v).toLocaleString(numberLocale, { maximumFractionDigits: 1 })}M`;

  return (
    <div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {tiles.map((tile) => {
        const color = TONE_VAR[tile.key];
        const deltaPct = tile.prev !== 0 ? ((tile.latest - tile.prev) / Math.abs(tile.prev)) * 100 : 0;
        const up = deltaPct >= 0;
        // For the deficit (negative balance), a more-negative value is worse.
        const deltaTone = tile.signed ? (tile.latest >= tile.prev ? "pos" : "neg") : up ? "pos" : "neg";
        const DeltaIcon = up ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={tile.key}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
            style={{ ["--spark" as string]: color }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-muted)]">
                {tile.label}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular",
                  deltaTone === "pos" ? "delta-pill-pos" : "delta-pill-neg",
                )}
              >
                <DeltaIcon className="size-2.5" />
                {(deltaPct > 0 ? "+" : "") + deltaPct.toFixed(1)}%
              </span>
            </div>
            <div className="mono mt-1 text-[16px] font-semibold tabular text-[var(--color-ink)]">
              {fmt(tile.latest)}
            </div>
            <div className="mt-1.5">
              <Sparkline values={tile.series} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
