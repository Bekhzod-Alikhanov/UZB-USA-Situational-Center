"use client";
import { useMemo, useState } from "react";
import { Treemap, hierarchy, treemapBinary } from "@visx/hierarchy";
import {
  hs2_2024_usImports,
  hs2_2024_usExports,
  hs2_2025_usImports,
  hs2_2025_usExports,
  comtradeMeta,
  type Hs2Row,
} from "@/data/comtrade";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

type Direction = "uz-exports" | "us-exports";
type Year = 2024 | 2025;

const RESIDUAL_HS2 = new Set(["99"]);

// 12-step palette over the primary tone
const PALETTE = [
  "color-mix(in oklab, var(--color-primary) 90%, white)",
  "color-mix(in oklab, var(--color-primary) 78%, white)",
  "color-mix(in oklab, var(--color-primary) 67%, white)",
  "color-mix(in oklab, var(--color-primary) 57%, white)",
  "color-mix(in oklab, var(--color-primary) 48%, white)",
  "color-mix(in oklab, var(--color-primary) 40%, white)",
  "color-mix(in oklab, var(--color-primary) 33%, white)",
  "color-mix(in oklab, var(--color-primary) 27%, white)",
  "color-mix(in oklab, var(--color-primary) 22%, white)",
  "color-mix(in oklab, var(--color-primary) 18%, white)",
  "color-mix(in oklab, var(--color-primary) 15%, white)",
  "color-mix(in oklab, var(--color-primary) 12%, white)",
];

function fmt(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

interface NodeData {
  name: string;
  hs2: string;
  desc: string;
  size: number;
  share: number;
  color: string;
  children?: NodeData[];
}

export function Hs2ChapterTreemap() {
  const [direction, setDirection] = useState<Direction>("uz-exports");
  const [year, setYear] = useState<Year>(2024);

  const rows: Hs2Row[] = useMemo(() => {
    let src: Hs2Row[];
    if (direction === "uz-exports") {
      src = year === 2024 ? hs2_2024_usImports : hs2_2025_usImports;
    } else {
      src = year === 2024 ? hs2_2024_usExports : hs2_2025_usExports;
    }
    return src.filter((r) => !RESIDUAL_HS2.has(r.hs2));
  }, [direction, year]);

  const total = rows.reduce((a, r) => a + r.valueUsd, 0);

  const root = useMemo(() => {
    const children: NodeData[] = rows.slice(0, 18).map((r, i) => ({
      name: r.hs2,
      hs2: r.hs2,
      desc: r.desc,
      size: r.valueUsd,
      share: total > 0 ? (r.valueUsd / total) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
    }));
    const data: NodeData = { name: "root", hs2: "", desc: "", size: 0, share: 0, color: "transparent", children };
    return hierarchy<NodeData>(data)
      .sum((d) => d.size)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }, [rows, total]);

  const WIDTH = 960;
  const HEIGHT = 420;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Поток:</span>
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
        <span className="ml-3 text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">Год:</span>
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
          <span className="text-[var(--color-ink-faint)]">total {fmt(total)}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" role="img" aria-label="HS-2 chapter treemap">
          <Treemap<NodeData>
            top={0}
            root={root}
            size={[WIDTH, HEIGHT]}
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
                  const showLabel = w > 50 && h > 30;
                  const showSubLabel = w > 100 && h > 56;
                  return (
                    <g key={i} transform={`translate(${node.x0},${node.y0})`}>
                      <rect
                        width={w}
                        height={h}
                        fill={node.data.color}
                        stroke="var(--color-surface)"
                        strokeWidth={1}
                      >
                        <title>
                          {node.data.hs2} · {node.data.desc} — {fmt(node.data.size)} ({node.data.share.toFixed(1)}%)
                        </title>
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
                            {node.data.hs2}
                          </text>
                          {showSubLabel ? (
                            <foreignObject x={6} y={20} width={w - 12} height={h - 26}>
                              <div
                                style={{
                                  fontSize: 10.5,
                                  lineHeight: 1.25,
                                  color: "var(--color-ink)",
                                  display: "-webkit-box",
                                  WebkitLineClamp: Math.max(1, Math.floor((h - 30) / 14)),
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {node.data.desc}
                                <div style={{ marginTop: 2, fontSize: 10, color: "var(--color-ink-muted)" }}>
                                  {fmt(node.data.size)} · {node.data.share.toFixed(1)}%
                                </div>
                              </div>
                            </foreignObject>
                          ) : (
                            <text x={6} y={28} fill="var(--color-ink-muted)" fontSize={9.5}>
                              {fmt(node.data.size)}
                            </text>
                          )}
                        </>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            )}
          </Treemap>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
        {rows.slice(0, 4).map((r, i) => (
          <div
            key={r.hs2}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ background: PALETTE[i] }} />
              <span className="mono font-semibold tabular text-[var(--color-ink)]">HS-{r.hs2}</span>
            </div>
            <div className="mt-1 truncate text-[var(--color-ink-muted)]" title={r.desc}>
              {r.desc}
            </div>
            <div className="mono mt-1 text-[13px] font-semibold tabular text-[var(--color-ink)]">{fmt(r.valueUsd)}</div>
            <div className="text-[10.5px] text-[var(--color-ink-muted)]">
              {total > 0 ? ((r.valueUsd / total) * 100).toFixed(1) : 0}%
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">
        Treemap по главам ТНВЭД (HS-2). Размер прямоугольника пропорционален стоимости в долларах. Топ-18 глав
        показаны; residual chapter «99 — Commodities not specified» отфильтрован.
      </p>
    </div>
  );
}
