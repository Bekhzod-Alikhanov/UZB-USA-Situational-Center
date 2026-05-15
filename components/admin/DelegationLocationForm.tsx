"use client";
import { useState } from "react";
import { MapPin, Save } from "lucide-react";
import { cn } from "@/lib/utils";

export function DelegationLocationForm() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState("");
  const [status, setStatus] = useState<"traveling" | "in-program" | "returning">("in-program");
  const [saved, setSaved] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    // Stub: would POST to /api/delegations; we only persist to local state for now.
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <Field label="Delegation title">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. MIIT investment roadshow — Q2 2026"
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] outline-none focus:border-[var(--color-primary)]"
        />
      </Field>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Current city">
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="New York"
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] outline-none focus:border-[var(--color-primary)]"
          />
        </Field>
        <Field label="Coordinates (lat, lng)">
          <input
            required
            value={coords}
            onChange={(e) => setCoords(e.target.value)}
            placeholder="40.7128, -74.006"
            className="mono w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12.5px] outline-none focus:border-[var(--color-primary)]"
          />
        </Field>
      </div>
      <Field label="Status">
        <div className="flex items-center gap-1">
          {(["traveling", "in-program", "returning"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11.5px] font-medium transition",
                status === s
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-ink-muted)]">
          <MapPin className="size-3.5" />
          Feeds Map → Layer 3 (Delegations)
        </span>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-primary-contrast)] transition hover:bg-[var(--color-primary-2)]"
        >
          <Save className="size-3.5" />
          {saved ? "Saved" : "Save location"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">{label}</span>
      {children}
    </label>
  );
}
