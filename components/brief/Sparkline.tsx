/**
 * Zero-dependency inline-SVG sparkline (server-safe) for the hero trade
 * series. Deliberately not Recharts: 9 points don't justify a chart runtime,
 * and the hero must be in the initial HTML for LCP.
 */
interface SparklinePoint {
  year: number;
  value: number;
}

interface SparklineProps {
  data: SparklinePoint[];
  width?: number;
  height?: number;
  /** Accessible description of the series. */
  label: string;
}

export function Sparkline({ data, width = 240, height = 56, label }: SparklineProps) {
  if (data.length < 2) return null;
  const pad = 4;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => pad + (i / (data.length - 1)) * (width - pad * 2);
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);
  const points = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const last = data[data.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--brief-accent-bright)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={x(data.length - 1)} cy={y(last.value)} r="3" fill="var(--brief-accent-bright)" />
    </svg>
  );
}
