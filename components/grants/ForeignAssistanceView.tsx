// Server component — the FY-by-year bars used to be a Recharts BarChart;
// replaced with a zero-dep SVG <MiniBars /> to remove ~80 KB of Recharts
// from this page's bundle (per Wave 2.2 of the perf plan).
import { MiniBars, type MiniBarItem } from "@/components/charts/MiniBars";
import {
  foreignAssistanceYears,
  foreignAssistanceFy2024Agencies,
  foreignAssistanceFy2024Categories,
  foreignAssistanceMeta,
} from "@/data/foreign-assistance";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { getLocale, getTranslations } from "next-intl/server";

const AGENCY_COLOR: Record<string, string> = {
  USAID: "var(--color-primary)",
  "Department of Defense": "var(--color-ink-muted)",
  "Department of State": "var(--color-warn)",
  "Department of Agriculture": "var(--color-pos)",
  "Department of Energy": "var(--color-neg)",
};

export async function ForeignAssistanceView() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "grants.foreignAssistance" });
  const yearsData: MiniBarItem[] = foreignAssistanceYears.map((y) => ({
    label: `FY${y.fiscalYear}`,
    value: y.totalUsdM,
    color: y.preliminary ? "var(--color-ink-faint)" : "var(--color-primary)",
    tooltip: `FY${y.fiscalYear}: $${y.totalUsdM.toFixed(2)}M${y.preliminary ? ` (${t("preliminaryTooltip")})` : ""}`,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <SourceBadge sourceId={foreignAssistanceMeta.sourceId} />
          <span className="text-[var(--color-ink-faint)]">
            {t("refreshed", { date: foreignAssistanceMeta.fetched_at })}
          </span>
        </div>
        <div className="text-right text-[11px] text-[var(--color-ink-muted)]">
          <div className="mono text-[18px] font-semibold tabular text-[var(--color-ink)]">
            ${foreignAssistanceMeta.fyMostRecentTotalUsdM.toFixed(1)}M
          </div>
          <div>{t("mostRecent", { year: foreignAssistanceMeta.fyMostRecent })}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="serif text-[13px] font-medium text-[var(--color-ink)]">{t("totalTitle")}</h2>
          <MiniBars data={yearsData} height={220} format={(v) => `$${v}M`} />

          <p className="text-[10.5px] text-[var(--color-ink-faint)]">{t("preliminaryNote")}</p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="serif text-[13px] font-medium text-[var(--color-ink)]">{t("agencyTitle")}</h2>
          <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">{t("agency")}</th>
                  <th scope="col" className="text-right">
                    {t("amount")}
                  </th>
                  <th scope="col" className="text-right">
                    {t("share")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {foreignAssistanceFy2024Agencies.map((a) => (
                  <tr key={a.agency}>
                    <td className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: AGENCY_COLOR[a.agency] ?? "var(--color-border)" }}
                        />
                        {a.agency}
                      </span>
                    </td>
                    <td className="mono text-right tabular">{a.amountUsdM.toFixed(2)}</td>
                    <td className="mono text-right tabular text-[var(--color-ink-muted)]">{a.sharePct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="serif mt-2 text-[13px] font-medium text-[var(--color-ink)]">{t("splitTitle")}</h2>
          <div className="grid grid-cols-2 gap-2">
            {foreignAssistanceFy2024Categories.map((c) => (
              <div
                key={c.category}
                className="flex flex-col gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
              >
                <div className="stat-label">{c.category}</div>
                <div className="mono text-[16px] font-semibold tabular text-[var(--color-ink)]">
                  ${c.amountUsdM.toFixed(1)}M
                </div>
                <div className="text-[10.5px] text-[var(--color-ink-muted)]">
                  {t("ofFy2024", { share: c.sharePct.toFixed(1) })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">{t("methodology")}</p>
    </div>
  );
}
