"use client";
import { ParentSize } from "@visx/responsive";
import type { ReactNode } from "react";

/**
 * A "measure-then-render" wrapper for Recharts charts. Recharts'
 * ResponsiveContainer can fire `width(-1)` / `height(-1)` warnings during
 * the first paint cycle in React 19 + Next 16 when the parent is briefly
 * unmeasured. Using @visx/responsive's ParentSize gates the chart on
 * actual measured dimensions and side-steps that warning entirely.
 *
 * Pass an explicit `height` (px). The width is always 100% of the parent.
 *
 * Children receive `{ width, height }` and must return a fully sized
 * chart, e.g. `<LineChart width={width} height={height}>...`.
 */
export function ChartFrame({
  height,
  className,
  children,
}: {
  height: number | string;
  className?: string;
  children: (dims: { width: number; height: number }) => ReactNode;
}) {
  return (
    <div
      className={"chart-shell " + (className ?? "")}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <ParentSize debounceTime={50}>
        {({ width, height: h }) => {
          // Skip render until parent has been measured. Returning null avoids
          // any sub-component receiving 0 / -1 dimensions.
          if (!Number.isFinite(width) || width < 1 || !Number.isFinite(h) || h < 1) {
            return null;
          }
          return children({ width, height: h });
        }}
      </ParentSize>
    </div>
  );
}
