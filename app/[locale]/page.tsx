import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRouteSeo } from "@/lib/seo";
import { tradeAnnualUz } from "@/data/trade";
import { investmentCredibilitySummary } from "@/data/investments";
import { agreements, agreementsAggregate } from "@/data/agreements";
import { visits } from "@/data/visits";
import { roadmapProjects, roadmapDonePct, regionRoadmaps } from "@/data/roadmaps";
import { sourcesMeta } from "@/data/sources";
import { yoyPct, investmentHighlights, intlLocale, parseDay } from "@/components/brief/brief-data";
import { briefVoice } from "@/components/brief/fonts";
import { BriefNumber } from "@/components/brief/BriefNumber";
import { BriefClocks } from "@/components/brief/BriefClocks";
import { BriefTradeChart } from "@/components/brief/BriefTradeChart";
import { BriefAgreementsDonut } from "@/components/brief/BriefAgreementsDonut";
import { VisitPanel } from "@/components/brief/VisitPanel";
import { Sparkline } from "@/components/brief/Sparkline";
import { StatTile } from "@/components/brief/StatTile";
import { RoadmapExecutionBar } from "@/components/brief/RoadmapExecutionBar";
import { AttentionList } from "@/components/brief/AttentionList";
import { GlobeSection } from "@/components/brief/GlobeSection";
import { UpdatedAt } from "@/components/brief/UpdatedAt";
import { FullscreenButton } from "@/components/brief/FullscreenButton";
import { PrintButton } from "@/components/exports/PrintButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "brief" });
}

/** Compact deep-link arrow for a brief panel head. */
function PanelLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--brief-border)] text-[var(--brief-ink-faint)] transition hover:border-[var(--brief-border-strong)] hover:text-[var(--brief-ink)]"
    >
      <ArrowUpRight className="size-3.5" />
    </Link>
  );
}

/**
 * "/" — the executive brief is the site landing page (brief-home pass).
 * Same situational-videowall composition as before, but rendered as a
 * bounded panel INSIDE the normal shell (sidebar + topbar visible) instead
 * of a fixed overlay; every KPI tile and panel deep-links into its detail
 * section, and a fullscreen button restores the projector presentation
 * mode. Secondary analysis stays available through progressive disclosure.
 */
export default async function BriefHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("brief");

  const trade = tradeAnnualUz[tradeAnnualUz.length - 1];
  const yoy = yoyPct();
  const verified = investmentCredibilitySummary.verified;
  const pending = investmentCredibilitySummary.pending;
  const sectors = investmentHighlights(3);
  const maxSectorValue = sectors[0]?.valueMusd ?? 1;
  const roadmapValueMusd = regionRoadmaps.reduce((sum, r) => sum + r.totalValueMusd, 0);
  const roadmapPct = roadmapDonePct();
  const incoming = visits.filter((v) => v.direction === "us-uz").length;
  const flagship = agreements.find((a) => a.id === "a-2026-dfc-framework");

  const nf = new Intl.NumberFormat(intlLocale(locale));
  const pctf = new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: "always",
  });
  const df = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", year: "numeric" });
  const openDetail = t("openDetail");

  return (
    <div id="brief-stage" className={`brief-stage ${briefVoice.variable}`}>
      <div className="brief-frame">
        {/* Header strip: wordmark · live clocks · fullscreen · print */}
        <div className="brief-reveal brief-reveal-1 flex min-h-[64px] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-9 place-items-center rounded-lg bg-[var(--brief-accent)] text-[11px] font-extrabold text-white"
            >
              UZ·US
            </span>
            <div>
              <div className="text-[14px] font-bold tracking-[0.02em] text-[var(--brief-ink)]">{t("header.title")}</div>
              <div className="text-[11px] text-[var(--brief-ink-faint)]">
                {t("header.sub")} · <UpdatedAt className="text-[var(--brief-ink-faint)]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <BriefClocks />
            <div className="flex items-center gap-2">
              <FullscreenButton targetId="brief-stage" />
              <PrintButton
                label={t("footer.print")}
                className="!border-[var(--brief-border)] !bg-[var(--brief-surface)] !text-[var(--brief-ink)] hover:!bg-[var(--brief-surface-2)]"
              />
            </div>
          </div>
        </div>
        <div className="brief-rule mb-4" />

        {/* KPI strip — 6 tiles, accent strips, count-ups, deep links */}
        <section className="brief-reveal brief-reveal-2 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatTile
            label={t("kpi.turnover", { year: trade.year })}
            accent="var(--brief-accent-bright)"
            href={`/${locale}/trade`}
            sub={
              <>
                <span
                  className="font-semibold tabular-nums"
                  style={{ color: yoy >= 0 ? "var(--brief-pos)" : "var(--brief-neg)" }}
                >
                  {pctf.format(yoy)}%
                </span>{" "}
                {t("kpi.yoy")}
              </>
            }
          >
            <BriefNumber value={trade.turnover} decimals={1} prefix="$" />
            <span className="ml-1 text-[13px] font-medium text-[var(--brief-ink-muted)]">{t("kpi.mln")}</span>
          </StatTile>
          <StatTile
            label={t("kpi.invest")}
            accent="var(--brief-accent-2)"
            href={`/${locale}/investments`}
            sub={t("kpi.investSub", { pending: nf.format(pending.totalValueUsdM) })}
          >
            <BriefNumber value={verified.totalValueUsdM} prefix="$" />
            <span className="ml-1 text-[13px] font-medium text-[var(--brief-ink-muted)]">{t("kpi.mln")}</span>
          </StatTile>
          <StatTile
            label={t("kpi.projects")}
            accent="var(--brief-pos)"
            href={`/${locale}/investments`}
            sub={t("kpi.projectsSub", { verified: verified.totalProjects, pending: pending.totalProjects })}
          >
            <BriefNumber value={verified.totalProjects + pending.totalProjects} />
          </StatTile>
          <StatTile
            label={t("kpi.documents")}
            accent="var(--brief-accent)"
            href={`/${locale}/agreements`}
            sub={t("kpi.documentsSub", { invest: agreementsAggregate.totalInvestAgreements })}
          >
            <BriefNumber value={agreementsAggregate.totalDocuments} />
          </StatTile>
          <StatTile
            label={t("kpi.visits")}
            accent="var(--brief-accent)"
            href={`/${locale}/visits`}
            sub={t("kpi.visitsSub", { incoming })}
          >
            <BriefNumber value={visits.length} />
          </StatTile>
          <StatTile
            label={t("kpi.roadmaps")}
            accent="var(--brief-warn)"
            href={`/${locale}/roadmaps`}
            sub={t("kpi.roadmapsSub", { value: nf.format(roadmapValueMusd / 1000), done: roadmapPct })}
          >
            <BriefNumber value={roadmapProjects.length} />
          </StatTile>
        </section>

        {/* Main row: trade dynamics · globe · nearest visit */}
        <section className="brief-reveal brief-reveal-3 mt-4 grid gap-4 xl:grid-cols-12">
          <div className="brief-panel xl:col-span-5">
            <div className="brief-panel-head">
              <span className="brief-panel-title">{t("trade.title")}</span>
              <span className="flex items-center gap-3">
                <span className="hidden text-[11px] tabular-nums text-[var(--brief-ink-faint)] sm:inline">
                  2017 — {trade.year} ·{" "}
                  <Sparkline
                    data={tradeAnnualUz.map((y) => ({ year: y.year, value: y.turnover }))}
                    width={92}
                    height={20}
                    label={t("trade.sparkAria")}
                  />
                </span>
                <PanelLink href={`/${locale}/trade`} label={`${openDetail}: ${t("trade.title")}`} />
              </span>
            </div>
            <div className="brief-panel-body">
              <BriefTradeChart />
            </div>
          </div>

          <div className="brief-panel hidden md:flex xl:col-span-4">
            <div className="brief-panel-head">
              <span className="brief-panel-title">{t("globe.title")}</span>
              <span className="flex items-center gap-3">
                <span className="text-[11px] text-[var(--brief-ink-faint)]">{t("globe.sub")}</span>
                <PanelLink href={`/${locale}/map`} label={`${openDetail}: ${t("globe.title")}`} />
              </span>
            </div>
            <div className="brief-panel-body">
              <GlobeSection />
            </div>
          </div>

          <div className="brief-panel xl:col-span-3">
            <div className="brief-panel-head">
              <span className="brief-panel-title">{t("visit.title")}</span>
              <PanelLink href={`/${locale}/visits`} label={`${openDetail}: ${t("visit.title")}`} />
            </div>
            <div className="brief-panel-body">
              <VisitPanel />
            </div>
          </div>
        </section>

        {/* Secondary analysis remains intact but no longer competes with the
            three principal decision panels in the initial executive scan. */}
        <details className="brief-analysis brief-reveal brief-reveal-4 mt-4">
          <summary className="brief-analysis-summary">
            <span>
              <span className="brief-analysis-title">{t("analysis.title")}</span>
              <span className="brief-analysis-sub">{t("analysis.summary")}</span>
            </span>
            <ChevronDown aria-hidden className="brief-analysis-chevron size-5 shrink-0" />
          </summary>
          <section className="mt-4 grid gap-4 xl:grid-cols-12">
            <div className="brief-panel xl:col-span-4">
              <div className="brief-panel-head">
                <span className="brief-panel-title">{t("invest.title")}</span>
                <PanelLink href={`/${locale}/investments`} label={`${openDetail}: ${t("invest.title")}`} />
              </div>
              <div className="brief-panel-body brief-print-block">
                <ul className="space-y-3.5">
                  {sectors.map((s) => (
                    <li key={s.sector}>
                      <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
                        <span className="text-[var(--brief-ink)]">{t(`invest.sector.${s.sector}`)}</span>
                        <span className="tabular-nums text-[var(--brief-ink-muted)]">
                          {t("invest.valueMln", { value: nf.format(s.valueMusd) })} ·{" "}
                          {t("invest.projects", { count: s.projects })}
                        </span>
                      </div>
                      <div className="mt-1.5 h-[6px] w-full rounded-full bg-[var(--brief-surface-2)]">
                        <div
                          className="h-full rounded-full bg-[var(--brief-accent)]"
                          style={{ width: `${Math.max(6, (s.valueMusd / maxSectorValue) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                {flagship ? (
                  <div className="mt-5 border-t border-[var(--brief-border)] pt-3.5">
                    <div className="brief-eyebrow">{t("docs.title")}</div>
                    <p className="mt-1.5 text-[13px] font-semibold leading-snug text-[var(--brief-ink)]">
                      {t("docs.flagshipTitle")}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-[var(--brief-ink-muted)]">
                      {t("docs.flagshipMeta", { date: df.format(parseDay(flagship.signedOn)) })}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="brief-panel xl:col-span-4">
              <div className="brief-panel-head">
                <span className="brief-panel-title">{t("execution.title")}</span>
                <PanelLink href={`/${locale}/roadmaps`} label={`${openDetail}: ${t("execution.title")}`} />
              </div>
              <div className="brief-panel-body">
                <RoadmapExecutionBar />
                <AttentionList />
              </div>
            </div>

            <div className="brief-panel xl:col-span-4">
              <div className="brief-panel-head">
                <span className="brief-panel-title">{t("agreementsChart.title")}</span>
                <PanelLink href={`/${locale}/agreements`} label={`${openDetail}: ${t("agreementsChart.title")}`} />
              </div>
              <div className="brief-panel-body">
                <BriefAgreementsDonut />
              </div>
            </div>
          </section>
        </details>

        {/* Footer strip */}
        <div className="brief-reveal brief-reveal-4 mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--brief-border)] pt-3">
          <p className="text-[11px] text-[var(--brief-ink-faint)]">
            {t("footer.sources", { count: sourcesMeta.total })} · {t("footer.methodologies")}
          </p>
        </div>
      </div>
    </div>
  );
}
