import { lastSixMonths } from "@/data/overview";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Paired vertical bars for the last 6 months — exports (invest tone) and
 * imports (agree tone). Hand-rolled SVG to match the editorial aesthetic.
 */
export function MonthlyBars({ height = 200 }: { height?: number }) {
  const data = lastSixMonths();
  const W = 360;
  const H = height;
  const P = { l: 30, r: 8, t: 10, b: 30 };
  const max = Math.max(...data.flatMap((d) => [d.exp, d.imp])) * 1.1;
  const slot = (W - P.l - P.r) / data.length;
  const y = (v: number) => P.t + (1 - v / max) * (H - P.t - P.b);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
      {[0, max / 2, max].map((t, i) => (
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
            fontSize="9"
            className="mono"
            fill="var(--color-ink-faint)"
          >
            {Math.round(t)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = P.l + slot * i + slot / 2;
        const bw = 9;
        const monthIdx = Number(d.m.slice(5, 7)) - 1;
        return (
          <g key={d.m}>
            <rect
              x={cx - bw - 1}
              y={y(d.exp)}
              width={bw}
              height={H - P.b - y(d.exp)}
              fill="var(--color-invest)"
              rx="1.5"
            />
            <rect
              x={cx + 1}
              y={y(d.imp)}
              width={bw}
              height={H - P.b - y(d.imp)}
              fill="var(--color-agree)"
              rx="1.5"
            />
            <text
              x={cx}
              y={H - 14}
              textAnchor="middle"
              fontSize="9"
              className="mono"
              fill="var(--color-ink-faint)"
            >
              {MONTH[monthIdx]}
            </text>
            <text
              x={cx}
              y={H - 4}
              textAnchor="middle"
              fontSize="8.5"
              className="mono"
              fill="var(--color-ink-faint)"
            >
              &apos;{d.m.slice(2, 4)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
