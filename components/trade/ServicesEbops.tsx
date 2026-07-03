"use client";
import { useMemo } from "react";
import { servicesUzToUs, servicesUzToUsYearTotals, servicesMeta } from "@/data/trade-services";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

function shortenLabel(s: string, max = 70): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function fmt(usd: number): string {
  if (usd === 0) return "—";
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

// EBOPS family colors: transport (blue), travel (orange), other business / IT (green), other (muted)
function familyTone(code: string): string {
  if (code.startsWith("S03"))
    return "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]";
  if (code.startsWith("S04"))
    return "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]";
  if (code.startsWith("S09") || code.startsWith("S10"))
    return "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]";
  return "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]";
}

function familyLabel(code: string): string {
  if (code.startsWith("S02")) return "Maintenance";
  if (code.startsWith("S03")) return "Transport";
  if (code.startsWith("S04")) return "Travel";
  if (code.startsWith("S06")) return "Insurance";
  if (code.startsWith("S08")) return "IP / Licenses";
  if (code.startsWith("S09")) return "Telecom / IT";
  if (code.startsWith("S10")) return "Business";
  if (code.startsWith("S12")) return "Government";
  return "Other";
}

/**
 * UZ-reported services exports to the United States in EBOPS 2010
 * classification. Detailed data exists only for 2021 (the only year UZ
 * fully reported services to US partner level — see registry note).
 */
export function ServicesEbops() {
  const baseYear = 2021;
  const baseTotal = servicesUzToUsYearTotals[baseYear] ?? 0;

  const sorted = useMemo(
    () => [...servicesUzToUs].sort((a, b) => (b.series[baseYear] ?? 0) - (a.series[baseYear] ?? 0)),
    [],
  );

  // Family rollup
  const byFamily = new Map<string, number>();
  for (const s of servicesUzToUs) {
    const fam = familyLabel(s.code);
    byFamily.set(fam, (byFamily.get(fam) ?? 0) + (s.series[baseYear] ?? 0));
  }
  const families = [...byFamily.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-[11px]">
        <SourceBadge sourceId={servicesMeta.sourceId} />
        <span className="text-[var(--color-ink-faint)]">
          UZ-reported · {servicesMeta.classificationCode} · refreshed {servicesMeta.fetched_at}
        </span>
        <div className="ml-auto text-right">
          <div className="mono text-[16px] font-semibold tabular text-[var(--color-ink)]">{fmt(baseTotal)}</div>
          <div className="text-[10.5px] text-[var(--color-ink-muted)]">Total UZ→US services {baseYear}</div>
        </div>
      </div>

      <div className="rounded-md border border-dashed border-[var(--color-warn)]/40 bg-[var(--color-warn-soft)] px-3 py-2 text-[11px] text-[var(--color-ink)]">
        <strong>Coverage limitation.</strong> UZ reported full EBOPS detail to ITC only for 2021. Years 2022-2024 are
        zeros in UZ partner-level reporting (visible in the raw export). For aggregate annual services trade (incl.
        US-side), quote BEA / USTR (~$603M for 2024) — those use BEA methodology, not UZ partner reporting.
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {families.map(([fam, total]) => {
          const sharePct = baseTotal > 0 ? (total / baseTotal) * 100 : 0;
          return (
            <div
              key={fam}
              className="flex flex-col gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
            >
              <div className="stat-label">{fam}</div>
              <div className="mono text-[14px] font-semibold tabular text-[var(--color-ink)]">{fmt(total)}</div>
              <div className="text-[10.5px] text-[var(--color-ink-muted)]">{sharePct.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="w-28">
                EBOPS
              </th>
              <th scope="col">Category</th>
              <th scope="col" className="w-32">
                Family
              </th>
              <th scope="col" className="text-right">
                Value, {baseYear}
              </th>
              <th scope="col" className="w-16 text-right">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const v = s.series[baseYear] ?? 0;
              const sharePct = baseTotal > 0 ? (v / baseTotal) * 100 : 0;
              return (
                <tr key={s.code}>
                  <td className="mono text-[11.5px] font-semibold tabular text-[var(--color-primary)]">{s.code}</td>
                  <td className="text-[12.5px]" title={s.labelRu}>
                    {shortenLabel(s.labelRu)}
                  </td>
                  <td>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        familyTone(s.code),
                      )}
                    >
                      {familyLabel(s.code)}
                    </span>
                  </td>
                  <td className="mono text-right tabular">{fmt(v)}</td>
                  <td className="mono text-right tabular text-[var(--color-ink-muted)]">{sharePct.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
