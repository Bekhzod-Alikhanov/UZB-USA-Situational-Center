"use client";
import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  text: string;
  done: boolean;
  agency?: string;
}

const INITIAL: Item[] = [
  { id: "c-01", text: "Mandate reporting form filed", done: true, agency: "Center" },
  { id: "c-02", text: "Diplomatic notes exchanged (DC ↔ Tashkent)", done: true, agency: "MFA" },
  { id: "c-03", text: "Delegation composition signed", done: true, agency: "Center" },
  { id: "c-04", text: "Visas + clearances", done: true, agency: "MFA + Consular" },
  { id: "c-05", text: "Air transport + VIP slots", done: true, agency: "Uzbekistan Airways" },
  { id: "c-06", text: "Protocol briefing complete", done: false, agency: "Protocol Dept." },
  { id: "c-07", text: "Press pool list finalized", done: false, agency: "Press service" },
  { id: "c-08", text: "All 14 counterpart briefing cards issued", done: false, agency: "MFA Americas" },
  { id: "c-09", text: "Gifts + anthems rehearsal", done: false, agency: "Protocol Dept." },
  { id: "c-10", text: "Contingency plan (weather / schedule slippage)", done: false, agency: "SSO" },
];

export function ChecklistBlock() {
  const [items, setItems] = useState<Item[]>(INITIAL);
  const done = items.filter((i) => i.done).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
          Pre-visit checklist
        </span>
        <span className="mono text-[11px] text-[var(--color-ink-muted)] tabular">
          {done} / {items.length}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)]"
          style={{ width: `${(done / items.length) * 100}%` }}
        />
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((i) => (
          <li key={i.id}>
            <button
              type="button"
              onClick={() => setItems((l) => l.map((x) => (x.id === i.id ? { ...x, done: !x.done } : x)))}
              className="flex w-full items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-left transition hover:bg-[var(--color-surface-2)]"
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded border",
                  i.done
                    ? "border-[var(--color-pos)] bg-[var(--color-pos)] text-white"
                    : "border-[var(--color-border-strong)] bg-transparent",
                )}
              >
                {i.done ? <Check className="size-2.5" /> : null}
              </span>
              <span
                className={cn(
                  "flex-1 text-[12.5px]",
                  i.done ? "text-[var(--color-ink-muted)] line-through" : "text-[var(--color-ink)]",
                )}
              >
                {i.text}
              </span>
              {i.agency ? <span className="text-[10.5px] text-[var(--color-ink-muted)]">{i.agency}</span> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
