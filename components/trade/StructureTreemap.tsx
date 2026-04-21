"use client";
import { Group } from "@visx/group";
import { Treemap, hierarchy, treemapSquarify } from "@visx/hierarchy";
import { scaleOrdinal } from "@visx/scale";
import { useMemo } from "react";
import type { CommodityItem } from "@/data/trade";

const PALETTE = [
  "#1A3A6C",
  "#2A4F8A",
  "#486DAD",
  "#6B8BC3",
  "#0A7C5A",
  "#2DA383",
  "#5CBFA5",
  "#C88A12",
  "#D9A644",
  "#A5342A",
  "#C35B50",
  "#D9847A",
  "#8B8B8B",
  "#B0B0B0",
];

export function StructureTreemap({
  items,
  width = 520,
  height = 320,
}: {
  items: CommodityItem[];
  width?: number;
  height?: number;
}) {
  const color = useMemo(
    () => scaleOrdinal<string, string>({ domain: items.map((i) => i.name), range: PALETTE }),
    [items],
  );

  const root = useMemo(
    () =>
      hierarchy({
        name: "root",
        children: items.map((i) => ({ ...i, size: i.value })),
      } as Record<string, unknown>)
        .sum((d) => ((d as unknown as { size?: number }).size ?? 0))
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0)),
    [items],
  );

  return (
    <svg width={width} height={height} style={{ maxWidth: "100%" }}>
      <Treemap
        top={0}
        root={root}
        size={[width, height]}
        tile={treemapSquarify}
        round
        paddingInner={2}
      >
        {(treemap) => (
          <Group>
            {treemap.descendants().map((node, i) => {
              if (!node.depth) return null;
              const w = Math.max(0, node.x1 - node.x0);
              const h = Math.max(0, node.y1 - node.y0);
              const nd = node.data as unknown as { name: string; sharePct: number };
              return (
                <Group key={`node-${i}`} left={node.x0} top={node.y0}>
                  <rect width={w} height={h} fill={color(nd.name)} opacity={0.88} stroke="white" strokeWidth={1} />
                  {w > 48 && h > 30 ? (
                    <>
                      <text x={6} y={14} fill="white" fontSize={11} fontWeight={600}>
                        {nd.name.length > 22 ? nd.name.slice(0, 20) + "…" : nd.name}
                      </text>
                      <text x={6} y={28} fill="white" fontSize={10} opacity={0.85} className="mono">
                        {nd.sharePct.toFixed(1)}%
                      </text>
                    </>
                  ) : null}
                </Group>
              );
            })}
          </Group>
        )}
      </Treemap>
    </svg>
  );
}
