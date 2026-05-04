"use client";
import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { trendTopUsImports, trendTopUsExports, comtradeMeta, type Hs6Trend } from "@/data/comtrade";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type Direction = "uz-exports" | "us-exports";

const RESIDUAL = new Set(["999999"]);

interface Strings {
  flow: string;
  uzToUs: string;
  usToUz: string;
  hs6: string;
  commodity: string;
  trend: string;
  cagr: string;
  latest: string;
  note: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    flow: "Flow",
    uzToUs: "UZ exports → US",
    usToUz: "US exports → UZ",
    hs6: "HS-6",
    commodity: "Commodity",
    trend: "5Y trend",
    cagr: "CAGR",
    latest: "Latest",
    note: "Sparklines cover the years shown. The right-most marker is the latest available year. CAGR is computed from the first non-zero year to the latest; “new” = previously zero shipments. Source: UN Comtrade preview API, US-reporter.",
  },
  ru: {
    flow: "Поток",
    uzToUs: "Экспорт UZ → US",
    usToUz: "Экспорт US → UZ",
    hs6: "HS-6",
    commodity: "Товар",
    trend: "5-летняя динамика",
    cagr: "CAGR",
    latest: "Последний",
    note: "Спарклайны охватывают указанные годы. Крайняя правая точка — последний доступный год. CAGR считается от первого ненулевого года; «new» — ранее нулевые отгрузки. Источник: UN Comtrade preview API, US-репортёр.",
  },
  "uz-latn": {
    flow: "Oqim",
    uzToUs: "UZ eksporti → US",
    usToUz: "US eksporti → UZ",
    hs6: "HS-6",
    commodity: "Tovar",
    trend: "5-yillik dinamika",
    cagr: "CAGR",
    latest: "Oxirgi",
    note: "Sparkline-lar ko'rsatilgan yillarni qamraydi. O'ng tomondagi nuqta — oxirgi mavjud yil. CAGR birinchi nolga teng bo'lmagan yildan boshlab hisoblanadi; «new» = avval nolinchi yetkazib berishlar.",
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

function shortDesc(s: string, max = 50): string {
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}

function formatValue(usd: number): string {
  if (usd === 0) return "—";
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

interface SparklineDatum {
  year: number;
  value: number;
}

function Sparkline({ data, width = 110, height = 28 }: { data: SparklineDatum[]; width?: number; height?: number }) {
  if (data.length < 2) return <div style={{ width, height }} />;
  const min = Math.min(...data.map((d) => d.value));
  const max = Math.max(...data.map((d) => d.value));
  const span = max - min || 1;
  const padding = 2;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * w;
    const y = padding + h - ((d.value - min) / span) * h;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath =
    `M${points[0].x},${padding + h} ` +
    points.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
    ` L${points[points.length - 1].x},${padding + h} Z`;

  const last = points[points.length - 1];
  const first = points[0];
  const isUp = last.value >= first.value;
  const stroke = isUp ? "var(--color-pos)" : "var(--color-warn)";
  const fill = isUp
    ? "color-mix(in oklab, var(--color-pos) 14%, transparent)"
    : "color-mix(in oklab, var(--color-warn) 14%, transparent)";

  return (
    <svg width={width} height={height} role="img" aria-label="5-year sparkline" className="block">
      <path d={areaPath} fill={fill} />
      <path d={linePath} stroke={stroke} strokeWidth={1.4} fill="none" />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 2 : 1.2}
          fill={i === points.length - 1 ? stroke : "var(--color-surface)"}
          stroke={stroke}
          strokeWidth={1}
        >
          <title>{`${p.year}: ${formatValue(p.value)}`}</title>
        </circle>
      ))}
    </svg>
  );
}

function Cagr({ trend }: { trend: Hs6Trend }) {
  const years = Object.keys(trend.series).map(Number).sort();
  const first = trend.series[years[0]];
  const last = trend.series[years[years.length - 1]];
  if (!first || first === 0) {
    if (last > 0)
      return (
        <span className="mono inline-flex items-center gap-1 text-[11px] tabular text-[var(--color-pos)]">
          <TrendingUp className="size-3" />
          new
        </span>
      );
    return <span className="text-[10.5px] text-[var(--color-ink-faint)]">n/a</span>;
  }
  const yearsCount = years.length - 1;
  const cagr = (Math.pow(last / first, 1 / yearsCount) - 1) * 100;
  const Icon = cagr > 5 ? TrendingUp : cagr < -5 ? TrendingDown : Minus;
  const tone =
    cagr > 25
      ? "text-[var(--color-pos)]"
      : cagr > 0
        ? "text-[var(--color-ink)]"
        : cagr < -10
          ? "text-[var(--color-neg)]"
          : "text-[var(--color-ink-muted)]";
  return (
    <span className={cn("mono inline-flex items-center gap-1 text-[11px] tabular", tone)}>
      <Icon className="size-3" />
      {cagr > 0 ? "+" : ""}
      {cagr.toFixed(0)}%
    </span>
  );
}

export function ComtradeTrendSparklines() {
  const locale = useLocale();
  const T = pickStr(locale);
  const [direction, setDirection] = useState<Direction>("uz-exports");
  const trends = useMemo(() => {
    const src = direction === "uz-exports" ? trendTopUsImports : trendTopUsExports;
    return src.filter((t) => !RESIDUAL.has(t.hs6));
  }, [direction]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.flow}:</span>
        {(
          [
            ["uz-exports", T.uzToUs],
            ["us-exports", T.usToUz],
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
        <div className="ml-auto flex items-center gap-2 text-[11px]">
          <SourceBadge sourceId={comtradeMeta.sourceId} />
          <span className="text-[var(--color-ink-faint)]">{comtradeMeta.yearsCovered.join("–")}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="table">
          <thead>
            <tr>
              <th className="w-20">{T.hs6}</th>
              <th>{T.commodity}</th>
              <th className="w-32 text-center">{T.trend}</th>
              <th className="w-20 text-right">{T.cagr}</th>
              <th className="w-24 text-right">{T.latest}</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((t) => {
              const years = Object.keys(t.series).map(Number).sort();
              const last = t.series[years[years.length - 1]] ?? 0;
              const data: SparklineDatum[] = years.map((y) => ({ year: y, value: t.series[y] ?? 0 }));
              return (
                <tr key={t.hs6}>
                  <td className="mono font-semibold tabular text-[var(--color-primary)]">{t.hs6}</td>
                  <td className="text-[12px]" title={t.desc}>
                    {shortDesc(t.desc)}
                  </td>
                  <td>
                    <div className="flex items-center justify-center">
                      <Sparkline data={data} />
                    </div>
                  </td>
                  <td className="text-right">
                    <Cagr trend={t} />
                  </td>
                  <td className="mono text-right tabular">{formatValue(last)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">
        {T.note} {comtradeMeta.yearsCovered.join(", ")}.
      </p>
    </div>
  );
}
