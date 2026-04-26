import { Info } from "lucide-react";
import { methodologyNotes } from "@/data/trade";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

/**
 * Static reference card explaining why UZ-side and US-side trade figures
 * disagree. Intended for /trade right rail or below the dual-methodology
 * chart. Server component — pure render, no interactivity.
 */
export function MethodologyNotesCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2.5 rounded-md border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] px-3 py-2.5 text-[12px] text-[var(--color-warn)]">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        <div className="leading-relaxed">
          <span className="font-semibold">Methodology matters.</span>{" "}
          UZ-reported and US-reported trade figures describe the same flows but
          use different valuation, timing, and partner-country rules. Always label
          which series you&apos;re quoting in a briefing.
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {methodologyNotes.map((m) => (
          <li
            key={m.id}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-semibold text-[var(--color-ink)]">{m.title}</span>
              <SourceBadge sourceId={m.sourceId} />
            </div>
            <dl className="mt-2 grid grid-cols-1 gap-1.5 text-[11.5px] leading-relaxed">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">Basis</dt>
                <dd className="text-[var(--color-ink)]">{m.basis}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">Use for</dt>
                <dd className="text-[var(--color-ink-muted)]">{m.useFor}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">Caveat</dt>
                <dd className="text-[var(--color-ink-muted)] italic">{m.caveat}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
