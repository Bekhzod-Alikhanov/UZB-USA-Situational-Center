"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { commitments } from "@/data/commitments";
import { AlertTriangle, Clock } from "lucide-react";

export function AlertsPanel({ limit = 5 }: { limit?: number }) {
  const locale = useLocale();
  const overdue = commitments.filter((c) => c.status === "overdue");
  const watching = commitments.filter((c) => c.status === "watch");
  const combined = [...overdue, ...watching].slice(0, limit);

  if (combined.length === 0) {
    return <div className="text-sm text-[var(--color-ink-muted)]">All commitments tracking green</div>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {combined.map((c) => {
        const Icon = c.status === "overdue" ? AlertTriangle : Clock;
        return (
          <li key={c.id}>
            <Link
              href={`/${locale}/commitments?status=${c.status}&q=${encodeURIComponent(c.title.slice(0, 28))}`}
              prefetch={false}
              className="flex items-start gap-2.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 transition hover:border-[var(--color-border-strong)]"
            >
              <Icon
                className={
                  c.status === "overdue"
                    ? "size-4 shrink-0 text-[var(--color-neg)]"
                    : "size-4 shrink-0 text-[var(--color-warn)]"
                }
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">{c.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[10.5px] text-[var(--color-ink-muted)]">
                  <span className="mono">{c.dueDate}</span>
                  <span>·</span>
                  <span className="truncate">{c.owner}</span>
                </div>
              </div>
              <span
                className={
                  "rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider " +
                  (c.status === "overdue"
                    ? "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]"
                    : "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]")
                }
              >
                {c.status}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
