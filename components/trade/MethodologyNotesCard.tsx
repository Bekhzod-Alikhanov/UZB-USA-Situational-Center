import { Info } from "lucide-react";
import { methodologyNotes } from "@/data/trade";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

/**
 * Compact methodology reminder for /trade. Renders a single warning line +
 * a collapsible <details> with the per-series breakdown. Designed to live
 * in the right rail next to the Dual-Methodology chart without dominating
 * the column.
 *
 * Server component — pure render, no interactivity beyond the native
 * <details> disclosure.
 */
export function MethodologyNotesCard() {
  return (
    <div className="flex flex-col gap-2 text-[12px]">
      <div className="flex items-start gap-2 rounded-md border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] px-3 py-2 leading-snug text-[var(--color-warn)]">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        <p>
          <span className="font-semibold">Methodology matters.</span> UZ-side and US-side trade
          figures describe the same flows but use different valuation, timing, and partner-country
          rules. Always label which series you&apos;re quoting in a briefing.
        </p>
      </div>

      <details className="group rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-[11.5px] font-medium text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)]">
          <span>
            Per-series breakdown · {methodologyNotes.length} sources
          </span>
          <span aria-hidden className="text-[var(--color-ink-faint)] transition group-open:rotate-180">
            ▾
          </span>
        </summary>
        <ul className="flex flex-col gap-2 border-t border-[var(--color-border)] p-3">
          {methodologyNotes.map((m) => (
            <li
              key={m.id}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold text-[var(--color-ink)]">{m.title}</span>
                <SourceBadge sourceId={m.sourceId} />
              </div>
              <dl className="mt-1.5 grid grid-cols-1 gap-1 text-[11px] leading-snug">
                <div className="flex gap-2">
                  <dt className="w-14 shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                    Basis
                  </dt>
                  <dd className="text-[var(--color-ink)]">{m.basis}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-14 shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                    Use for
                  </dt>
                  <dd className="text-[var(--color-ink-muted)]">{m.useFor}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-14 shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                    Caveat
                  </dt>
                  <dd className="italic text-[var(--color-ink-muted)]">{m.caveat}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
