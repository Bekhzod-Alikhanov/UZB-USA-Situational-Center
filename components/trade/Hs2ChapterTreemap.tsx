"use client";
import { useId, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Treemap, hierarchy, treemapBinary } from "@visx/hierarchy";
import { ParentSize } from "@visx/responsive";
import { hs2_2024_usImports, hs2_2024_usExports, hs2_2025_usImports, hs2_2025_usExports } from "@/data/comtrade-hs2";
import { comtradeMeta } from "@/data/comtrade-meta";
import type { Hs2Row } from "@/data/comtrade-types";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type Direction = "uz-exports" | "us-exports";
type Year = 2024 | 2025;

const RESIDUAL_HS2 = new Set(["99"]);

// 12-step palette over the primary tone (token-driven, no hex literals)
const PALETTE = Array.from({ length: 12 }, (_, i) => `color-mix(in oklab, var(--color-primary) ${90 - i * 7}%, white)`);

interface NodeData {
  hs2: string;
  desc: string;
  size: number;
  share: number;
  color: string;
}

interface Strings {
  flow: string;
  year: string;
  flowUz: string;
  flowUs: string;
  total: string;
  footnote: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    flow: "Flow",
    year: "Year",
    flowUz: "UZ exports → US",
    flowUs: "US exports → UZ",
    total: "total",
    footnote:
      "Treemap by HS-2 chapter (Harmonized System). Tile area is proportional to USD value. Top-18 chapters; chapter 99 (commodities not specified) filtered out.",
  },
  ru: {
    flow: "Поток",
    year: "Год",
    flowUz: "Экспорт UZ → US",
    flowUs: "Экспорт US → UZ",
    total: "всего",
    footnote:
      "Тримап по главам ТНВЭД (HS-2). Размер плитки пропорционален стоимости в USD. Топ-18 глав; residual chapter 99 («товары, не указанные иначе») отфильтрован.",
  },
  "uz-latn": {
    flow: "Oqim",
    year: "Yil",
    flowUz: "UZ eksporti → US",
    flowUs: "US eksporti → UZ",
    total: "jami",
    footnote:
      "HS-2 boblari bo'yicha treemap. Plitka maydoni USD qiymatga proportsional. Top-18 bob; chapter 99 («ko'rsatilmagan tovarlar») chetlatilgan.",
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

function fmt(usd: number): string {
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(2)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

export function Hs2ChapterTreemap() {
  const locale = useLocale();
  const T = pickStr(locale);
  const [direction, setDirection] = useState<Direction>("uz-exports");
  const [year, setYear] = useState<Year>(2024);

  const rows: Hs2Row[] = useMemo(() => {
    const src =
      direction === "uz-exports"
        ? year === 2024
          ? hs2_2024_usImports
          : hs2_2025_usImports
        : year === 2024
          ? hs2_2024_usExports
          : hs2_2025_usExports;
    return src.filter((r) => !RESIDUAL_HS2.has(r.hs2));
  }, [direction, year]);

  const total = rows.reduce((a, r) => a + r.valueUsd, 0);

  const root = useMemo(() => {
    const children: NodeData[] = rows.slice(0, 18).map((r, i) => ({
      hs2: r.hs2,
      desc: r.desc,
      size: r.valueUsd,
      share: total > 0 ? (r.valueUsd / total) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
    }));
    return hierarchy<{ children?: NodeData[]; size?: number }>({ children })
      .sum((d) => (d as NodeData).size ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }, [rows, total]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.flow}:</span>
        {(
          [
            ["uz-exports", T.flowUz],
            ["us-exports", T.flowUs],
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
        <span className="ml-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.year}:</span>
        {([2024, 2025] as Year[]).map((y) => (
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
          <span className="text-[var(--color-ink-faint)]">
            {T.total} {fmt(total)}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="chart-shell h-[320px] sm:h-[380px] lg:h-[420px]">
          <ParentSize debounceTime={50}>
            {({ width, height }) => {
              if (width < 1 || height < 1) return null;
              return (
                <svg width={width} height={height} role="img" aria-label="HS-2 chapter treemap">
                  <Treemap<{ children?: NodeData[]; size?: number }>
                    top={0}
                    root={root}
                    size={[width, height]}
                    tile={treemapBinary}
                    round
                    paddingInner={2}
                  >
                    {(treemap) => (
                      <g>
                        {treemap.descendants().map((node, i) => {
                          if (node.depth === 0) return null;
                          const w = node.x1 - node.x0;
                          const h = node.y1 - node.y0;
                          if (w < 1 || h < 1) return null;
                          const data = node.data as unknown as NodeData;
                          return <ChapterTile key={i} x={node.x0} y={node.y0} w={w} h={h} data={data} />;
                        })}
                      </g>
                    )}
                  </Treemap>
                </svg>
              );
            }}
          </ParentSize>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
        {rows.slice(0, 4).map((r, i) => (
          <div
            key={r.hs2}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: PALETTE[i] }} aria-hidden />
              <span className="mono font-semibold tabular text-[var(--color-ink)]">HS-{r.hs2}</span>
            </div>
            <div className="mt-1 line-clamp-2 text-[var(--color-ink-muted)]" title={r.desc}>
              {r.desc}
            </div>
            <div className="mono mt-1 text-[13px] font-semibold tabular text-[var(--color-ink)]">{fmt(r.valueUsd)}</div>
            <div className="text-[10.5px] text-[var(--color-ink-muted)]">
              {total > 0 ? ((r.valueUsd / total) * 100).toFixed(1) : 0}%
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">{T.footnote}</p>
    </div>
  );
}

function ChapterTile({ x, y, w, h, data }: { x: number; y: number; w: number; h: number; data: NodeData }) {
  const clipId = useId();
  const showLabel = w > 50 && h > 30;
  const showSubLabel = w > 100 && h > 56;
  const tooltip = `HS-${data.hs2} · ${data.desc} — ${fmt(data.size)} (${data.share.toFixed(1)}%)`;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={h} fill={data.color} stroke="var(--color-surface)" strokeWidth={1}>
        <title>{tooltip}</title>
      </rect>
      {showLabel ? (
        <>
          <text
            x={6}
            y={14}
            fill="var(--color-ink)"
            fontFamily="var(--font-mono, monospace)"
            fontSize={11}
            fontWeight={700}
          >
            {data.hs2}
          </text>
          {showSubLabel ? (
            <>
              <defs>
                <clipPath id={clipId}>
                  <rect x={6} y={20} width={Math.max(0, w - 12)} height={Math.max(0, h - 26)} />
                </clipPath>
              </defs>
              <foreignObject
                x={6}
                y={20}
                width={Math.max(0, w - 12)}
                height={Math.max(0, h - 26)}
                clipPath={`url(#${clipId})`}
              >
                <div
                  style={{
                    fontSize: 10.5,
                    lineHeight: 1.25,
                    color: "var(--color-ink)",
                    display: "-webkit-box",
                    WebkitLineClamp: Math.max(1, Math.floor((h - 30) / 14)),
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}
                >
                  {data.desc}
                  <div style={{ marginTop: 2, fontSize: 10, color: "var(--color-ink-muted)" }}>
                    {fmt(data.size)} · {data.share.toFixed(1)}%
                  </div>
                </div>
              </foreignObject>
            </>
          ) : (
            <text x={6} y={28} fill="var(--color-ink-muted)" fontSize={9.5}>
              {fmt(data.size)}
            </text>
          )}
        </>
      ) : null}
    </g>
  );
}
