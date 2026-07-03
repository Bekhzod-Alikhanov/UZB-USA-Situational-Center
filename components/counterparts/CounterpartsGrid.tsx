"use client";
import { useTranslations } from "next-intl";
import { counterparts, PARTY_TONE, STANCE_TEXT, type CounterpartRole } from "@/data/counterparts";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

/**
 * Key U.S. figures grid, hosted on /contacts since the portal-slim pass.
 * The per-person briefing dossiers (63 SSG pages) were retired as the main
 * manual-upkeep burden, so cards are informational, not links.
 */
export function CounterpartsGrid() {
  const t = useTranslations("counterparts");
  const [role, setRole] = useState<CounterpartRole | "all">("all");
  const [search, setSearch] = useState("");

  const ROLES: (CounterpartRole | "all")[] = [
    "all",
    "executive",
    "council",
    "state",
    "congress-senate",
    "congress-house",
    "diplomat",
  ];

  const filtered = useMemo(
    () =>
      counterparts
        .filter((c) => (role === "all" ? true : c.role === role))
        .filter((c) =>
          search
            ? c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.position.toLowerCase().includes(search.toLowerCase())
            : true,
        ),
    [role, search],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "rounded-full border px-3 py-1 text-[11.5px] font-medium transition",
              role === r
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)]",
            )}
          >
            {r === "all" ? t("grid.all") : t(`grid.roles.${r}`)}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" aria-hidden />
          <input
            type="search"
            aria-label={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="w-56 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-[var(--color-primary-contrast)]">
                  {initials(c.name)}
                </div>
                {c.party ? (
                  <span
                    className={cn("mono rounded px-1.5 py-0.5 text-[10px] font-semibold tabular", PARTY_TONE[c.party])}
                  >
                    {c.party}
                    {c.state ? `-${c.state}` : ""}
                  </span>
                ) : null}
              </div>
              <span className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                {t(`grid.roles.${c.role}`)}
              </span>
            </div>
            <h2 className="serif text-[15px] font-medium leading-snug text-[var(--color-ink)]">{c.name}</h2>
            <p className="text-[12px] text-[var(--color-ink-muted)]">{c.position}</p>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-2 text-[11px]">
              <span className={cn("font-medium", STANCE_TEXT[c.stanceOnUz])}>{c.stanceOnUz}</span>
              <span className="mono tabular text-[var(--color-ink-muted)]">
                {t(c.priorEngagements.length === 1 ? "grid.engagement" : "grid.engagements", {
                  count: c.priorEngagements.length,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}
