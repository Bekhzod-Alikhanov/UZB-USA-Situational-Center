"use client";
import { visits, type Visit } from "@/data/visits";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

const LEVEL_COLOR: Record<string, string> = {
  president: "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]",
  minister: "bg-[color-mix(in_oklab,var(--color-primary)_70%,white)] text-white",
  ambassador: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  congress: "bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  business: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  usaid: "bg-[var(--color-surface-2)] text-[var(--color-ink)]",
  governor: "bg-[var(--color-demo-bg)] text-[var(--color-ink)]",
};

const DIRECTION_LABEL: Record<string, string> = {
  "uz-us": "UZ → US",
  "us-uz": "US → UZ",
  "bilateral-3p": "bilateral",
};

export function VisitsTimeline({ filterDirection = "all" }: { filterDirection?: "all" | "uz-us" | "us-uz" }) {
  const [selected, setSelected] = useState<Visit | null>(null);

  const sorted = useMemo(
    () =>
      [...visits]
        .filter(
          (v) =>
            filterDirection === "all" ||
            v.direction === filterDirection ||
            (filterDirection === "uz-us" && v.direction === "bilateral-3p"),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [filterDirection],
  );

  const years = useMemo(
    () => Array.from(new Set(sorted.map((v) => Number(v.date.slice(0, 4))))).sort((a, b) => b - a),
    [sorted],
  );

  return (
    <>
      <div className="relative">
        <span className="absolute left-[109px] top-0 bottom-0 w-px bg-[var(--color-border)]" aria-hidden />
        {years.map((y) => {
          const inYear = sorted.filter((v) => Number(v.date.slice(0, 4)) === y);
          return (
            <section key={y} className="mb-6">
              <div className="sticky top-14 z-10 mb-3 flex items-center gap-3 bg-[var(--color-bg)]/90 py-1 pl-[100px] backdrop-blur">
                <h2 className="serif text-[20px] font-medium text-[var(--color-primary)]">{y}</h2>
                <div className="text-[11px] text-[var(--color-ink-muted)]">{inYear.length} events</div>
              </div>
              <ul className="flex flex-col gap-3">
                {inYear.map((v) => (
                  <li key={v.id} className="relative pl-[124px]">
                    <time className="absolute left-0 top-2 mono w-[92px] text-right text-[11.5px] text-[var(--color-ink-muted)]">
                      {v.date.slice(5)}
                    </time>
                    <span className="absolute left-[105px] top-[10px] flex size-[10px] items-center justify-center">
                      <span className="size-2.5 rounded-full border border-[var(--color-surface)] bg-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20" />
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelected(v)}
                      className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-left transition hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-hover)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-[var(--color-ink)]">{v.title}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-ink-muted)]">
                            <span>{v.location}</span>
                            <span>·</span>
                            <span>{DIRECTION_LABEL[v.direction]}</span>
                            <span>·</span>
                            <span className="capitalize">{v.format}</span>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider",
                            LEVEL_COLOR[v.level] ?? "bg-[var(--color-surface-2)] text-[var(--color-ink)]",
                          )}
                        >
                          {v.level}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <Dialog.Root open={!!selected} onOpenChange={(o) => (o ? null : setSelected(null))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed right-0 top-0 z-50 h-full w-[94vw] max-w-[520px] overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            aria-describedby={undefined}
          >
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] pb-3">
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="serif text-[18px] font-medium text-[var(--color-ink)]">
                      {selected.title}
                    </Dialog.Title>
                    <div className="mt-1.5 mono text-[12px] text-[var(--color-ink-muted)]">
                      {selected.date}
                      {selected.dateEnd ? ` — ${selected.dateEnd}` : ""} · {selected.location}
                    </div>
                  </div>
                  <Dialog.Close className="rounded p-1 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]">
                    <X className="size-4" />
                  </Dialog.Close>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-medium uppercase tracking-wider",
                      LEVEL_COLOR[selected.level],
                    )}
                  >
                    {selected.level}
                  </span>
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
                    {DIRECTION_LABEL[selected.direction]}
                  </span>
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
                    {selected.format}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="stat-label">Uzbek participants</div>
                  <ul className="mt-1 list-disc pl-5 text-[13px] text-[var(--color-ink)]">
                    {selected.participantsUz.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <div className="stat-label">U.S. participants</div>
                  <ul className="mt-1 list-disc pl-5 text-[13px] text-[var(--color-ink)]">
                    {selected.participantsUs.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <div className="stat-label">Outcomes</div>
                  <ul className="mt-1 list-disc pl-5 text-[13px] text-[var(--color-ink)]">
                    {selected.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>

                {selected.agreementsSigned && selected.agreementsSigned.length > 0 ? (
                  <div className="mt-4">
                    <div className="stat-label">Agreements signed</div>
                    <ul className="mt-1 list-disc pl-5 text-[13px] text-[var(--color-ink)]">
                      {selected.agreementsSigned.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selected.sourceId ? (
                  <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-3 text-[11px] text-[var(--color-ink-muted)]">
                    <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">Source:</span>
                    <SourceBadge sourceId={selected.sourceId} />
                  </div>
                ) : null}
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
