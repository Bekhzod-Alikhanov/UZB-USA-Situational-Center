import { cn } from "@/lib/utils";

interface ChartNarrationProps {
  labels: {
    what: string;
    why: string;
    how: string;
    source: string;
  };
  what: string;
  why: string;
  how?: string;
  source?: string;
  className?: string;
}

export function ChartNarration({ labels, what, why, how, source, className }: ChartNarrationProps) {
  const items = [
    { label: labels.what, value: what },
    { label: labels.why, value: why },
    how ? { label: labels.how, value: how } : null,
    source ? { label: labels.source, value: source } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div
      className={cn(
        "mt-3 grid grid-cols-1 gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 md:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
            {item.label}
          </div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
