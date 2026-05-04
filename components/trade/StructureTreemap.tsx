"use client";
import { useId, useMemo } from "react";
import { Group } from "@visx/group";
import { Treemap, hierarchy, treemapSquarify } from "@visx/hierarchy";
import { ParentSize } from "@visx/responsive";
import type { CommodityItem } from "@/data/trade";

/**
 * Tile palette — driven entirely by design tokens. We rotate through six
 * domain accents (trade / invest / agree / visits / people / slate) at
 * three luminance steps so adjacent tiles stay distinguishable without
 * clashing with the rest of the dashboard.
 */
const TONE_VARS = [
  "var(--color-trade)",
  "var(--color-invest)",
  "var(--color-agree)",
  "var(--color-visits)",
  "var(--color-people)",
  "var(--color-slate)",
] as const;
const STEPS = ["88%", "70%", "52%"] as const;
const PALETTE: string[] = [];
for (const step of STEPS) for (const tone of TONE_VARS) PALETTE.push(`color-mix(in oklab, ${tone} ${step}, white)`);

function fmt(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}B`;
  if (v >= 1) return `${v.toFixed(1)}M`;
  if (v >= 0.1) return `${v.toFixed(2)}M`;
  return `$${(v * 1000).toFixed(0)}K`;
}

/**
 * Responsive treemap of an annual trade-structure breakdown. Use as the
 * canonical tile chart for export/import structure on /trade. The chart is
 * accompanied by a list-style legend that doubles as a fallback on very
 * narrow viewports where the tiles can't carry text.
 */
export function StructureTreemap({ items, height = 320 }: { items: CommodityItem[]; height?: number }) {
  const sorted = useMemo(() => [...items].sort((a, b) => b.value - a.value), [items]);
  const total = useMemo(() => sorted.reduce((acc, i) => acc + i.value, 0), [sorted]);

  const root = useMemo(
    () =>
      hierarchy({
        name: "root",
        children: sorted.map((i, idx) => ({ ...i, size: i.value, idx })),
      } as Record<string, unknown>)
        .sum((d) => (d as unknown as { size?: number }).size ?? 0)
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)),
    [sorted],
  );

  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-4">
      <div className="chart-shell" style={{ height }}>
        <ParentSize debounceTime={50}>
          {({ width, height: h }) => {
            if (width < 1 || h < 1) return null;
            return (
              <svg width={width} height={h} role="img" aria-label="Trade structure treemap">
                <Treemap top={0} root={root} size={[width, h]} tile={treemapSquarify} round paddingInner={2}>
                  {(treemap) => (
                    <Group>
                      {treemap.descendants().map((node, i) => {
                        if (!node.depth) return null;
                        const w = Math.max(0, node.x1 - node.x0);
                        const hh = Math.max(0, node.y1 - node.y0);
                        const nd = node.data as unknown as {
                          name: string;
                          sharePct: number;
                          value: number;
                          idx: number;
                        };
                        const fill = PALETTE[nd.idx % PALETTE.length];
                        const showName = w > 70 && hh > 38;
                        const showShare = w > 50 && hh > 24;
                        const fontSize = w < 90 || hh < 50 ? 10 : 11.5;
                        return (
                          <TreemapTile
                            key={`node-${i}`}
                            x={node.x0}
                            y={node.y0}
                            w={w}
                            h={hh}
                            fill={fill}
                            name={nd.name}
                            value={nd.value}
                            sharePct={nd.sharePct}
                            showName={showName}
                            showShare={showShare}
                            fontSize={fontSize}
                          />
                        );
                      })}
                    </Group>
                  )}
                </Treemap>
              </svg>
            );
          }}
        </ParentSize>
      </div>

      {/* Legend / list fallback — always visible on lg+, also covers mobile readability */}
      <ol className="flex max-h-[320px] flex-col gap-1 overflow-y-auto pr-1 text-[11.5px] lg:max-h-none">
        {sorted.map((item, idx) => {
          const sharePct = total > 0 ? (item.value / total) * 100 : 0;
          const swatch = PALETTE[idx % PALETTE.length];
          return (
            <li
              key={item.name}
              className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-[var(--color-surface-2)]"
            >
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: swatch }} aria-hidden />
              <span
                className="flex-1 truncate text-[var(--color-ink)]"
                title={`${item.name} · $${fmt(item.value)} · ${sharePct.toFixed(1)}%`}
              >
                {item.name}
              </span>
              <span className="mono shrink-0 tabular text-[var(--color-ink-muted)]">${fmt(item.value)}</span>
              <span className="mono w-9 shrink-0 text-right tabular text-[var(--color-ink-faint)]">
                {sharePct.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Single treemap tile with native SVG <title> tooltip (single-string child to
 * avoid React's array-children warning) and clipped foreign-object label so
 * long names wrap instead of getting cropped.
 */
function TreemapTile({
  x,
  y,
  w,
  h,
  fill,
  name,
  value,
  sharePct,
  showName,
  showShare,
  fontSize,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  name: string;
  value: number;
  sharePct: number;
  showName: boolean;
  showShare: boolean;
  fontSize: number;
}) {
  const clipId = useId();
  const tooltip = `${name} · $${fmt(value)} · ${sharePct.toFixed(1)}%`;
  return (
    <Group left={x} top={y}>
      <rect width={w} height={h} fill={fill} stroke="var(--color-surface)" strokeWidth={1} rx={2}>
        <title>{tooltip}</title>
      </rect>
      {showName ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect width={Math.max(0, w - 12)} height={Math.max(0, h - 16)} x={6} y={6} />
            </clipPath>
          </defs>
          <foreignObject x={0} y={0} width={w} height={h} clipPath={`url(#${clipId})`}>
            <div
              style={{
                padding: "6px 8px",
                color: "color-mix(in oklab, var(--color-ink) 92%, transparent)",
                fontSize,
                lineHeight: 1.2,
                fontWeight: 600,
                pointerEvents: "none",
              }}
            >
              {name}
            </div>
          </foreignObject>
          {showShare ? (
            <text
              x={6}
              y={h - 8}
              fill="color-mix(in oklab, var(--color-ink) 80%, transparent)"
              fontSize={Math.max(9, fontSize - 1.5)}
              fontFamily="var(--font-mono, monospace)"
              style={{ pointerEvents: "none" }}
            >
              {`${sharePct.toFixed(1)}% · $${fmt(value)}`}
            </text>
          ) : null}
        </>
      ) : showShare ? (
        <text
          x={4}
          y={12}
          fill="color-mix(in oklab, var(--color-ink) 80%, transparent)"
          fontSize={9}
          fontFamily="var(--font-mono, monospace)"
        >
          {`${sharePct.toFixed(1)}%`}
        </text>
      ) : null}
    </Group>
  );
}
