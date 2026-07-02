import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getRouteSeo } from "@/lib/seo";
import { tradeAnnualUz } from "@/data/trade";
import { investmentCredibilitySummary } from "@/data/investments";
import { agreements, agreementsAggregate } from "@/data/agreements";
import { visits } from "@/data/visits";
import { commitments } from "@/data/commitments";
import { sourcesMeta } from "@/data/sources";
import {
  yoyPct,
  investmentHighlights,
  commitmentsAvgProgress,
  intlLocale,
  parseDay,
} from "@/components/brief/brief-data";
import { briefVoice } from "@/components/brief/fonts";
import { BriefIntro } from "@/components/brief/BriefIntro";
import { BriefNumber } from "@/components/brief/BriefNumber";
import { BriefClocks } from "@/components/brief/BriefClocks";
import { BriefTradeChart } from "@/components/brief/BriefTradeChart";
import { BriefAgreementsDonut } from "@/components/brief/BriefAgreementsDonut";
import { VisitPanel } from "@/components/brief/VisitPanel";
import { Sparkline } from "@/components/brief/Sparkline";
import { StatTile } from "@/components/brief/StatTile";
import { CommitmentsBar } from "@/components/brief/CommitmentsBar";
import { AttentionList } from "@/components/brief/AttentionList";
import { GlobeSection } from "@/components/brief/GlobeSection";
import { UpdatedAt } from "@/components/brief/UpdatedAt";
import { PrintButton } from "@/components/exports/PrintButton";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "brief" });
}

/**
 * /brief — situational "videowall" screen for live projection to the Advisor
 * to the President and the U.S. Ambassador. Data-dense by design: a KPI
 * strip, trade dynamics chart, globe, nearest-visit gauge, execution scale,
 * agreements donut — minimal prose. Renders as a full-screen fixed overlay
 * above the standard shell (see globals.css notes); every number is real and
 * sourced, demo workflow records carry gated DemoBadge chips.
 */
export default async function BriefPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("brief");

  const trade = tradeAnnualUz[tradeAnnualUz.length - 1];
  const yoy = yoyPct();
  const verified = investmentCredibilitySummary.verified;
  const pending = investmentCredibilitySummary.pending;
  const sectors = investmentHighlights(3);
  const maxSectorValue = sectors[0]?.valueMusd ?? 1;
  const avgProgress = commitmentsAvgProgress();
  const incoming = visits.filter((v) => v.direction === "us-uz").length;
  const flagship = agreements.find((a) => a.id === "a-2026-dfc-framework");

  const nf = new Intl.NumberFormat(intlLocale(locale));
  const pctf = new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: "always",
  });
  const df = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className={`brief-overlay ${briefVoice.variable}`}>
      {/* Synchronous pre-paint gate: returning visitors this session skip the
          intro with zero flash (see BriefIntro for the full replay matrix). */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("uzus-brief-intro"))document.documentElement.setAttribute("data-brief-intro-done","")}catch(e){}`,
        }}
      />
      <BriefIntro title={t("intro.title")} subtitle={t("intro.subtitle")} />

      <div className="brief-frame">
        {/* Header strip: wordmark · live clocks · updated · print */}
        <div className="brief-reveal brief-reveal-1 flex min-h-[72px] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
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
          <div className="flex items-center gap-5">
            <BriefClocks />
            <PrintButton
              label={t("footer.print")}
              className="!border-[var(--brief-border)] !bg-[var(--brief-surface)] !text-[var(--brief-ink)] hover:!bg-[var(--brief-surface-2)]"
            />
          </div>
        </div>
        <div className="brief-rule mb-4" />

        {/* KPI strip — 6 tiles, accent strips, count-ups */}
        <section className="brief-reveal brief-reveal-2 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatTile
            label={t("kpi.turnover", { year: trade.year })}
            accent="var(--brief-accent-bright)"
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
            sub={t("kpi.investSub", { pending: nf.format(pending.totalValueUsdM) })}
          >
            <BriefNumber value={verified.totalValueUsdM} prefix="$" />
            <span className="ml-1 text-[13px] font-medium text-[var(--brief-ink-muted)]">{t("kpi.mln")}</span>
          </StatTile>
          <StatTile
            label={t("kpi.projects")}
            accent="var(--brief-pos)"
            sub={t("kpi.projectsSub", { verified: verified.totalProjects, pending: pending.totalProjects })}
          >
            <BriefNumber value={verified.totalProjects + pending.totalProjects} />
          </StatTile>
          <StatTile
            label={t("kpi.documents")}
            accent="var(--brief-accent)"
            sub={t("kpi.documentsSub", { invest: agreementsAggregate.totalInvestAgreements })}
          >
            <BriefNumber value={agreementsAggregate.totalDocuments} />
          </StatTile>
          <StatTile label={t("kpi.visits")} accent="var(--brief-accent)" sub={t("kpi.visitsSub", { incoming })}>
            <BriefNumber value={visits.length} />
          </StatTile>
          <StatTile
            label={t("kpi.commitments")}
            accent="var(--brief-warn)"
            sub={
              <>
                {t("kpi.commitmentsSub", { avg: avgProgress })} <DemoBadge className="align-middle" />
              </>
            }
          >
            <BriefNumber value={commitments.length} />
          </StatTile>
        </section>

        {/* Main row: trade dynamics · globe · nearest visit */}
        <section className="brief-reveal brief-reveal-3 mt-4 grid gap-4 xl:grid-cols-12">
          <div className="brief-panel xl:col-span-5">
            <div className="brief-panel-head">
              <span className="brief-panel-title">{t("trade.title")}</span>
              <span className="hidden text-[11px] tabular-nums text-[var(--brief-ink-faint)] sm:inline">
                2017 — {trade.year} ·{" "}
                <Sparkline
                  data={tradeAnnualUz.map((y) => ({ year: y.year, value: y.turnover }))}
                  width={92}
                  height={20}
                  label={t("trade.sparkAria")}
                />
              </span>
            </div>
            <div className="brief-panel-body">
              <BriefTradeChart />
            </div>
          </div>

          <div className="brief-panel hidden md:flex xl:col-span-4">
            <div className="brief-panel-head">
              <span className="brief-panel-title">{t("globe.title")}</span>
              <span className="text-[11px] text-[var(--brief-ink-faint)]">{t("globe.sub")}</span>
            </div>
            <div className="brief-panel-body">
              <GlobeSection />
            </div>
          </div>

          <div className="brief-panel xl:col-span-3">
            <div className="brief-panel-head">
              <span className="brief-panel-title">{t("visit.title")}</span>
            </div>
            <div className="brief-panel-body">
              <VisitPanel />
            </div>
          </div>
        </section>

        {/* Bottom row: sectors + flagship · execution + attention · agreements */}
        <section className="brief-reveal brief-reveal-4 mt-4 grid gap-4 xl:grid-cols-12">
          <div className="brief-panel xl:col-span-4">
            <div className="brief-panel-head">
              <span className="brief-panel-title">{t("invest.title")}</span>
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
              <span className="brief-panel-title">{t("commitments.title")}</span>
              <DemoBadge />
            </div>
            <div className="brief-panel-body">
              <CommitmentsBar />
              <AttentionList locale={locale} />
            </div>
          </div>

          <div className="brief-panel xl:col-span-4">
            <div className="brief-panel-head">
              <span className="brief-panel-title">{t("agreementsChart.title")}</span>
            </div>
            <div className="brief-panel-body">
              <BriefAgreementsDonut />
            </div>
          </div>
        </section>

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
