"use client";
import { agreements, type Agreement, type AgreementCategory, type AgreementSphere } from "@/data/agreements";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

const STATUS_TONE: Record<Agreement["status"], string> = {
  "in-force": "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  signed: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  "signed-not-in-force": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  pending: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  expired: "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

const SPHERES: AgreementSphere[] = [
  "political",
  "economy-trade",
  "investment",
  "finance",
  "energy",
  "minerals",
  "agriculture",
  "education",
  "healthcare",
  "it-digital",
  "transport",
  "defense",
  "humanitarian",
  "other",
];

const CATEGORIES = ["all", "interstate", "intergov", "interagency", "other", "invest"] as const;

export function AgreementsTable() {
  const [category, setCategory] = useState<AgreementCategory | "all">("all");
  const [sphere, setSphere] = useState<AgreementSphere | "all">("all");
  const [search, setSearch] = useState("");
  const t = useTranslations("agreements");

  const filtered = useMemo(() => {
    return agreements.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (sphere !== "all" && a.sphere !== sphere) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, sphere, search]);

  const sortedDesc = useMemo(() => [...filtered].sort((a, b) => b.signedOn.localeCompare(a.signedOn)), [filtered]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[11.5px] font-medium transition",
                category === c
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
              )}
            >
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
        <select
          aria-label={t("table.filterSphereAria")}
          value={sphere}
          onChange={(e) => setSphere(e.target.value as AgreementSphere | "all")}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[12px]"
        >
          <option value="all">{t("spheres.all")}</option>
          {SPHERES.map((s) => (
            <option key={s} value={s}>
              {t(`spheres.${s}`)}
            </option>
          ))}
        </select>
        <label className="ml-auto flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" aria-hidden />
          <input
            type="search"
            aria-label={t("table.filterTitleAria")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("table.filterTitlePlaceholder")}
            className="w-56 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="w-[92px]">
                {t("table.headers.signed")}
              </th>
              <th scope="col">{t("table.headers.title")}</th>
              <th scope="col" className="w-[140px]">
                {t("table.headers.category")}
              </th>
              <th scope="col" className="w-[120px]">
                {t("table.headers.sphere")}
              </th>
              <th scope="col" className="w-[92px]">
                {t("table.headers.status")}
              </th>
              <th scope="col" className="w-[120px]">
                {t("table.headers.source")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDesc.map((a) => (
              <tr key={a.id}>
                <td className="mono text-[11.5px] text-[var(--color-ink-muted)] tabular">{a.signedOn}</td>
                <td>
                  <div className="text-[13px] font-medium text-[var(--color-ink)]">{a.title}</div>
                  <div className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">
                    {a.signedBy.uz} ↔ {a.signedBy.us}
                  </div>
                  {a.note ? (
                    <div className="mt-0.5 text-[10.5px] italic text-[var(--color-ink-faint)]">{a.note}</div>
                  ) : null}
                </td>
                <td className="text-[11.5px] text-[var(--color-ink-muted)]">{t(`categories.${a.category}`)}</td>
                <td className="text-[11.5px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                  {t(`spheres.${a.sphere}`)}
                </td>
                <td>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                      STATUS_TONE[a.status],
                    )}
                  >
                    {t(`statuses.${a.status}`)}
                  </span>
                </td>
                <td>{a.sourceId ? <SourceBadge sourceId={a.sourceId} /> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedDesc.length === 0 ? (
          <div className="py-12 text-center text-[13px] text-[var(--color-ink-muted)]">{t("table.empty")}</div>
        ) : null}
      </div>
    </div>
  );
}
