"use client";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, X } from "lucide-react";
import { useState } from "react";

interface Member {
  id: string;
  name: string;
  role: string;
  keep: boolean;
  reason?: string;
}

const INITIAL: Member[] = [
  { id: "m-01", name: "President (head of delegation)", role: "Leadership", keep: true, reason: "anchor" },
  { id: "m-02", name: "Minister of Foreign Affairs", role: "Foreign policy", keep: true, reason: "signing MoU" },
  {
    id: "m-03",
    name: "Minister of Investments & Foreign Trade",
    role: "Economic track",
    keep: true,
    reason: "AUCC + Business Council",
  },
  { id: "m-04", name: "Minister of Energy", role: "Minerals track", keep: true, reason: "critical minerals MoU lead" },
  {
    id: "m-05",
    name: "Chief of Staff, Presidential Administration",
    role: "Coordination",
    keep: true,
    reason: "anchor",
  },
  {
    id: "m-06",
    name: "Head, Situational Center (US-UZ)",
    role: "Monitoring + follow-up",
    keep: true,
    reason: "commitment registry",
  },
  { id: "m-07", name: "Ambassador to the USA", role: "Host delegation", keep: true },
  { id: "m-08", name: "Head, AUCC Tashkent office", role: "Business", keep: true, reason: "round-table" },
  { id: "m-09", name: "Deputy Minister of Defense", role: "Defense", keep: true, reason: "Mississippi NG follow-up" },
  { id: "m-10", name: "Deputy Minister of Finance", role: "EXIM / DFC / DTA", keep: true },
  { id: "m-11", name: "Spokesperson / Press Secretary", role: "Press", keep: true },
  {
    id: "m-12",
    name: "Deputy Minister of Digital Development",
    role: "IT / AWS track",
    keep: false,
    reason: "digital track can be handled by Ambassador for this visit",
  },
  {
    id: "m-13",
    name: "Deputy Minister of Higher Education",
    role: "Education",
    keep: false,
    reason: "no education outcome slated — next visit",
  },
  {
    id: "m-14",
    name: "Deputy Minister of Health",
    role: "Health / C.U.R.E.",
    keep: false,
    reason: "already covered by earlier Samarkand ceremony",
  },
  {
    id: "m-15",
    name: "Assistant — protocol support (duplicate)",
    role: "Protocol",
    keep: false,
    reason: "protocol already staffed",
  },
];

export function OptimizationPanel() {
  const [members, setMembers] = useState<Member[]>(INITIAL);
  const kept = members.filter((m) => m.keep).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
            Algorithmic recommendation
          </div>
          <div className="mt-1 flex items-center gap-3 text-[18px] font-medium text-[var(--color-ink)]">
            <span className="mono tabular text-[var(--color-ink-faint)] line-through">15</span>
            <ArrowRight className="size-4 text-[var(--color-ink-muted)]" />
            <span className="mono tabular text-[var(--color-primary)]">{kept}</span>
            <span className="text-[12px] text-[var(--color-ink-muted)]">delegates</span>
          </div>
        </div>
        <div className="text-right text-[11px] text-[var(--color-ink-muted)]">
          <div>Heuristic: ROI of presence × track coverage ÷ overlap</div>
          <div>Source: Situational Center methodology v1</div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {members.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-[12.5px]",
              m.keep
                ? "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)]/40"
                : "border-[var(--color-border)] bg-[var(--color-surface)] opacity-70",
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  m.keep
                    ? "bg-[var(--color-pos)] text-white"
                    : "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
                )}
              >
                {m.keep ? <Check className="size-3" /> : <X className="size-3" />}
              </span>
              <div className="min-w-0">
                <div className="truncate font-medium text-[var(--color-ink)]">{m.name}</div>
                <div className="text-[10.5px] text-[var(--color-ink-muted)]">{m.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {m.reason ? (
                <span className="hidden text-right text-[10.5px] italic text-[var(--color-ink-muted)] md:inline">
                  {m.reason}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => setMembers((list) => list.map((x) => (x.id === m.id ? { ...x, keep: !x.keep } : x)))}
                className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[10.5px] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]"
              >
                {m.keep ? "Drop" : "Restore"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
