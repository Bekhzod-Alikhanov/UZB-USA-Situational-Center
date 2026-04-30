import { buildGrantsByType } from "@/data/overview";

const COLORS = [
  "var(--color-rose)",
  "var(--color-trade)",
  "var(--color-visits)",
  "var(--color-people)",
  "var(--color-agree)",
  "var(--color-slate)",
  "var(--color-invest)",
];

/**
 * 6-segment donut for grants by sector + side legend with values.
 * Hand-rolled SVG arcs for the editorial look.
 */
export function GrantsDonut({ size = 132 }: { size?: number }) {
  const { total, count, byType } = buildGrantsByType();

  const sum = byType.reduce((s, d) => s + d.val, 0);
  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;

  // Pre-compute cumulative angles purely (no mutation during render).
  const angles = byType.reduce<{ a0: number; a1: number }[]>((acc, d) => {
    const start = acc.length === 0 ? -Math.PI / 2 : acc[acc.length - 1].a1;
    const span = (d.val / sum) * Math.PI * 2;
    acc.push({ a0: start, a1: start + span });
    return acc;
  }, []);

  const arcs = byType.map((d, i) => {
    const { a0, a1 } = angles[i];
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return (
      <path
        key={d.name}
        d={`M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`}
        fill={COLORS[i % COLORS.length]}
        stroke="var(--color-surface)"
        strokeWidth="2"
      />
    );
  });

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} className="shrink-0" role="img" aria-label="Grants by type donut">
        {arcs}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--color-surface)" />
        <text
          x={cx}
          y={cy - 1}
          textAnchor="middle"
          className="serif tabular"
          fontSize="17"
          fontWeight="500"
          fill="var(--color-ink)"
        >
          ${total.toFixed(1)}M
        </text>
        <text
          x={cx}
          y={cy + 11}
          textAnchor="middle"
          className="mono"
          fontSize="8.5"
          fill="var(--color-ink-faint)"
        >
          {count} grants
        </text>
      </svg>

      <div className="grid min-w-0 flex-1 grid-cols-1 gap-1">
        {byType.map((g, i) => (
          <div
            key={g.name}
            className="grid grid-cols-[10px_1fr_56px] items-center gap-2 text-[11px]"
          >
            <span
              className="size-2 shrink-0 rounded-sm"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="truncate text-[var(--color-ink-muted)]">{g.name}</span>
            <span className="mono text-right tabular text-[var(--color-ink)]">${g.val.toFixed(2)}M</span>
          </div>
        ))}
      </div>
    </div>
  );
}
