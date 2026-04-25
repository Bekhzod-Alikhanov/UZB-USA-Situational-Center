"use client";
import { grants, type Grant } from "@/data/grants";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Heart, GraduationCap, Shield, Droplet, Wheat, FlaskConical, MapPin } from "lucide-react";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

const SECTOR_ICON: Record<Grant["sector"], React.ComponentType<{ className?: string }>> = {
  health: Heart,
  education: GraduationCap,
  military: Shield,
  water: Droplet,
  agriculture: Wheat,
  research: FlaskConical,
};

const SECTOR_TONE: Record<Grant["sector"], string> = {
  health: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  education: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  military: "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  water: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  agriculture: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  research: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
};

const STATUS_TONE: Record<Grant["status"], string> = {
  active: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  completed: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  planned: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
};

export function GrantsView() {
  const [sector, setSector] = useState<Grant["sector"] | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      grants
        .filter((g) => (sector === "all" ? true : g.sector === sector))
        .filter((g) =>
          search
            ? g.title.toLowerCase().includes(search.toLowerCase()) ||
              g.donor.toLowerCase().includes(search.toLowerCase())
            : true,
        )
        .sort((a, b) => b.valueMusd - a.valueMusd),
    [sector, search],
  );

  const SECTORS: (Grant["sector"] | "all")[] = [
    "all", "health", "education", "research", "water", "agriculture", "military",
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {SECTORS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSector(s)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
              sector === s
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)]",
            )}
          >
            {s === "all" ? "All sectors" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or donor…"
          className="ml-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => {
          const Icon = SECTOR_ICON[g.sector];
          return (
            <article
              key={g.id}
              className="flex flex-col gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    SECTOR_TONE[g.sector],
                  )}
                >
                  <Icon className="size-3" />
                  {g.sector}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    STATUS_TONE[g.status],
                  )}
                >
                  {g.status}
                </span>
              </div>
              <h3 className="serif text-[15px] font-medium leading-snug text-[var(--color-ink)]">{g.title}</h3>
              <div className="text-[11.5px] text-[var(--color-ink-muted)]">
                <div>
                  <span className="font-medium text-[var(--color-ink)]">Donor:</span> {g.donor}
                </div>
                <div>
                  <span className="font-medium text-[var(--color-ink)]">Initiator:</span> {g.initiator}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-2.5">
                <div>
                  <div className="stat-label">Value</div>
                  <div className="mono text-[18px] font-semibold tabular text-[var(--color-ink)]">
                    ${g.valueMusd < 1 ? g.valueMusd.toFixed(3) : g.valueMusd.toFixed(1)}M
                  </div>
                </div>
                {g.region ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-ink-muted)]">
                    <MapPin className="size-3" />
                    {g.region}
                  </span>
                ) : null}
                {g.startYear ? (
                  <span className="mono text-[11px] tabular text-[var(--color-ink-muted)]">Since {g.startYear}</span>
                ) : null}
              </div>
              {g.sourceId ? (
                <div className="pt-1">
                  <SourceBadge sourceId={g.sourceId} />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
