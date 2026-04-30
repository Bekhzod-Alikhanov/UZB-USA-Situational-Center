"use client";
import { useState } from "react";
import { tradeAnnualUz } from "@/data/trade";

/**
 * Editorial-financial-print trade-flow chart. Hand-rolled SVG — thin lines,
 * gradient fills, dashed turnover line, vertical crosshair on hover.
 * Replaces the Recharts default which felt too "generic dashboard".
 */
export function TradeFlowEditorial({ height = 250 }: { height?: number }) {
  const data = tradeAnnualUz;
  const W = 720;
  const H = height;
  const P = { l: 44, r: 14, t: 16, b: 26 };
  const ys = data.flatMap((d) => [d.exports, d.imports, d.turnover]);
  const yMax = Math.ceil(Math.max(...ys) / 200) * 200;
  const x = (i: number) => P.l + (i / (data.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - v / yMax) * (H - P.t - P.b);
  const path = (k: "exports" | "imports" | "turnover") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[k])}`).join(" ");
  const area = (k: "exports" | "imports") =>
    `${path(k)} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const ticks = [0, yMax / 4, yMax / 2, (3 * yMax) / 4, yMax];

  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        style={{ overflow: "visible" }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - P.l) / (W - P.l - P.r)) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, i)));
        }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="grad-imp" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-agree)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-agree)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-exp" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-invest)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-invest)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={P.l}
              x2={W - P.r}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--color-border)"
              strokeDasharray={i === 0 ? "" : "2 4"}
            />
            <text
              x={P.l - 6}
              y={y(t) + 3}
              textAnchor="end"
              fontSize="9.5"
              className="mono"
              fill="var(--color-ink-faint)"
            >
              {t === 0 ? "0" : `${t}M`}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize="9.5"
            className="mono"
            fill="var(--color-ink-faint)"
          >
            {d.year}
          </text>
        ))}
        <path d={area("imports")} fill="url(#grad-imp)" />
        <path d={area("exports")} fill="url(#grad-exp)" />
        <path d={path("imports")} stroke="var(--color-agree)" strokeWidth="1.7" fill="none" />
        <path d={path("exports")} stroke="var(--color-invest)" strokeWidth="1.7" fill="none" />
        <path
          d={path("turnover")}
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          fill="none"
        />
        {data.map((d, i) => (
          <g key={`pt-${i}`}>
            <circle
              cx={x(i)}
              cy={y(d.exports)}
              r={hover === i ? 4 : 2.4}
              fill="var(--color-invest)"
              stroke="var(--color-surface)"
              strokeWidth="1.3"
            />
            <circle
              cx={x(i)}
              cy={y(d.imports)}
              r={hover === i ? 4 : 2.4}
              fill="var(--color-agree)"
              stroke="var(--color-surface)"
              strokeWidth="1.3"
            />
          </g>
        ))}
        {hover !== null ? (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={P.t}
            y2={H - P.b}
            stroke="var(--color-border-strong)"
            strokeDasharray="2 3"
          />
        ) : null}
      </svg>

      <div className="mono mt-1 flex flex-wrap items-center justify-between gap-4 px-2 text-[10.5px] text-[var(--color-ink-muted)]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[var(--color-invest)]" />
            UZ exports
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[var(--color-agree)]" />
            UZ imports
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-px w-3 bg-[var(--color-primary)]" style={{ borderTop: "1px dashed" }} />
            turnover
          </span>
        </div>
        {hover !== null ? (
          <span className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5">
            {data[hover].year} · exp ${data[hover].exports.toFixed(0)}M · imp ${data[hover].imports.toFixed(0)}M ·
            bal ${data[hover].balance.toFixed(0)}M
          </span>
        ) : null}
      </div>
    </div>
  );
}
