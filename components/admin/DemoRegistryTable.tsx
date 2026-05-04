"use client";
import { demoRegistry, type DemoEntry } from "@/data/demo-registry";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Search } from "lucide-react";

const STATUS_TONE: Record<DemoEntry["status"], string> = {
  "pending": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "requested": "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  "confirmed-demo": "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

export function DemoRegistryTable() {
  const [q, setQ] = useState("");

  const filtered = demoRegistry.filter((e) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      e.where.toLowerCase().includes(s) ||
      e.what.toLowerCase().includes(s) ||
      e.agency.toLowerCase().includes(s) ||
      e.file.toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" aria-hidden />
          <input
            type="search"
            aria-label="Search demo registry"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search where / what / agency"
            className="w-64 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>
        <div className="text-[11px] text-[var(--color-ink-muted)]">
          {filtered.length} / {demoRegistry.length} entries
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Where</th>
              <th>What</th>
              <th>Agency</th>
              <th className="w-[200px]">File</th>
              <th className="w-[120px]">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, idx) => (
              <tr key={`${e.file}-${idx}`}>
                <td className="text-[12px] text-[var(--color-ink)]">{e.where}</td>
                <td className="text-[12px] text-[var(--color-ink-muted)]">{e.what}</td>
                <td className="text-[11.5px] text-[var(--color-ink-muted)]">{e.agency}</td>
                <td className="mono text-[11px] text-[var(--color-ink-muted)]">{e.file}</td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                      STATUS_TONE[e.status],
                    )}
                  >
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
