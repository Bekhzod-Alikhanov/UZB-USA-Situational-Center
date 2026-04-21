import { cn } from "@/lib/utils";

interface Entry {
  id: string;
  ts: string;
  actor: string;
  action: string;
  entity: string;
  tone: "info" | "ok" | "warn";
}

const LOG: Entry[] = [
  { id: "l-1", ts: "2026-04-20 14:12", actor: "b.umurzakov", action: "updated commitment status", entity: "cm-03 → in-progress 60%", tone: "info" },
  { id: "l-2", ts: "2026-04-20 12:45", actor: "system",       action: "imported CSV",            entity: "data/commitments (32 rows)", tone: "ok" },
  { id: "l-3", ts: "2026-04-20 10:02", actor: "k.abdukodirov", action: "created delegation",       entity: "d-1 MIIT roadshow",         tone: "info" },
  { id: "l-4", ts: "2026-04-19 18:31", actor: "b.umurzakov", action: "toggled hideDemo",         entity: "user setting",               tone: "warn" },
  { id: "l-5", ts: "2026-04-19 09:15", actor: "system",       action: "OFAC status refreshed",    entity: "data/compliance.ts",        tone: "ok" },
];

const TONE: Record<Entry["tone"], string> = {
  info: "text-[var(--color-primary)]",
  ok: "text-[var(--color-pos)]",
  warn: "text-[var(--color-warn)]",
};

export function AuditLogPreview() {
  return (
    <ul className="flex flex-col gap-1.5">
      {LOG.map((e) => (
        <li
          key={e.id}
          className="flex items-start gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-[12px]"
        >
          <span className="mono w-[120px] shrink-0 text-[10.5px] tabular text-[var(--color-ink-muted)]">
            {e.ts}
          </span>
          <span className="shrink-0 text-[11px] text-[var(--color-ink-muted)]">{e.actor}</span>
          <span className={cn("flex-1", TONE[e.tone])}>{e.action}</span>
          <span className="text-[11px] text-[var(--color-ink-muted)]">{e.entity}</span>
        </li>
      ))}
    </ul>
  );
}
