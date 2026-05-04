"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { buildCounterparts } from "@/data/overview";
import { cn } from "@/lib/utils";

function signedPct(p: number): string {
  if (p === 0) return "—";
  return `${p > 0 ? "+" : ""}${p.toFixed(1)}%`;
}

/**
 * Top US partners by aggregated invested value across the investments
 * register. Pending (under registration) entries excluded.
 */
export function CounterpartsRank() {
  const items = buildCounterparts();
  const locale = useLocale();

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[12px] text-[var(--color-ink-muted)]">
        Partner roster will populate as investment register fills.
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {items.map((c, i) => (
        <li
          key={c.name}
          className="-mx-1.5 grid grid-cols-[24px_1fr_64px_64px] items-center gap-2 rounded border-b border-[var(--color-border)] px-1.5 py-1.5 transition last:border-0 hover:bg-[var(--color-surface-2)]"
        >
          <span className="mono text-[10px] text-[var(--color-ink-faint)]">{String(i + 1).padStart(2, "0")}</span>
          <Link href={`/${locale}/investments`} className="min-w-0 hover:text-[var(--color-primary)]">
            <div className="flex items-center gap-1.5 truncate text-[12.5px] text-[var(--color-ink)]">
              {c.name}
              {c.pending ? (
                <span className="size-1 rounded-full bg-[var(--color-warn)]" title="Volume pending verification" />
              ) : null}
            </div>
            <div className="mono text-[9.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">{c.sector}</div>
          </Link>
          <span className="mono text-right tabular text-[11.5px] text-[var(--color-ink)]">{c.vol}</span>
          <span
            className={cn("mono text-right tabular text-[10.5px] font-semibold")}
            style={{
              color:
                c.trendPct > 0 ? "var(--color-pos)" : c.trendPct < 0 ? "var(--color-neg)" : "var(--color-ink-faint)",
            }}
          >
            {signedPct(c.trendPct)}
          </span>
        </li>
      ))}
    </ul>
  );
}
