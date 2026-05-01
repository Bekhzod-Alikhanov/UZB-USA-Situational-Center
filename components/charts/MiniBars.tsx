/**
 * Tiny zero-deps SVG bar chart. Server-component compatible.
 *
 * Replaces a Recharts BarChart for simple categorical-bars cases (e.g.
 * fiscal-year obligations on /grants). Recharts adds ~80 KB minified+gz to
 * any page that imports it; this is ~2 KB and renders identically.
 *
 * Hover tooltip is a native <title> child (works in screen-readers and
 * standard mouse hover). For cases needing rich tooltips, keep Recharts.
 */
import type { CSSProperties } from "react";

export interface MiniBarItem {
  /** Label shown under the bar. */
  label: string;
  /** Numeric value (height). */
  value: number;
  /** Override fill colour (CSS string or var); default = `--color-primary`. */
  color?: string;
  /** Free-form text shown in the title tooltip; defaults to `label: value`. */
  tooltip?: string;
}

interface Props {
  data: MiniBarItem[];
  /** SVG height including the label row. */
  height?: number;
  /** Format function for the y-axis tick label and tooltips. */
  format?: (v: number) => string;
  /** Show a top numeric label on top of each bar. */
  showValue?: boolean;
  className?: string;
}

const MARGIN = { top: 14, right: 4, bottom: 22, left: 36 };

export function MiniBars({
  data,
  height = 200,
  format = (v) => v.toString(),
  showValue = false,
  className,
}: Props) {
  const inner = {
    w: 0,
    h: height - MARGIN.top - MARGIN.bottom,
  };
  const max = Math.max(0, ...data.map((d) => d.value));
  const niceMax = niceCeiling(max);

  // We render with viewBox so the SVG scales to its container width.
  const VBW = 600; // viewBox width
  inner.w = VBW - MARGIN.left - MARGIN.right;
  const slotW = data.length > 0 ? inner.w / data.length : 0;
  const barPadding = Math.max(2, Math.min(10, slotW * 0.18));
  const barW = Math.max(2, slotW - 2 * barPadding);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => niceMax * t);
  const yToPx = (v: number) => MARGIN.top + inner.h - (niceMax === 0 ? 0 : (v / niceMax) * inner.h);

  const style: CSSProperties = { display: "block", width: "100%", height };

  return (
    <svg
      viewBox={`0 0 ${VBW} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Bar chart"
      style={style}
      className={className}
    >
      {/* Y-axis grid + labels */}
      {yTicks.map((t, i) => {
        const y = yToPx(t);
        return (
          <g key={i}>
            <line
              x1={MARGIN.left}
              x2={VBW - MARGIN.right}
              y1={y}
              y2={y}
              stroke="var(--color-border)"
              strokeDasharray="3 3"
              strokeWidth={0.6}
            />
            <text
              x={MARGIN.left - 6}
              y={y + 3}
              textAnchor="end"
              fill="var(--color-ink-muted)"
              fontSize={10}
              fontFamily="var(--font-jetbrains-mono, ui-monospace, monospace)"
            >
              {format(t)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = MARGIN.left + i * slotW + barPadding;
        const y = yToPx(d.value);
        const h = MARGIN.top + inner.h - y;
        const fill = d.color ?? "var(--color-primary)";
        return (
          <g key={`${d.label}-${i}`}>
            <rect x={x} y={y} width={barW} height={h} rx={2} ry={2} fill={fill}>
              <title>{d.tooltip ?? `${d.label}: ${format(d.value)}`}</title>
            </rect>
            {showValue && d.value > 0 ? (
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fill="var(--color-ink-muted)"
                fontSize={9.5}
                fontFamily="var(--font-jetbrains-mono, ui-monospace, monospace)"
              >
                {format(d.value)}
              </text>
            ) : null}
            <text
              x={x + barW / 2}
              y={MARGIN.top + inner.h + 14}
              textAnchor="middle"
              fill="var(--color-ink-muted)"
              fontSize={10.5}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function niceCeiling(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const fr = v / base;
  if (fr <= 1) return base;
  if (fr <= 2) return 2 * base;
  if (fr <= 5) return 5 * base;
  return 10 * base;
}
