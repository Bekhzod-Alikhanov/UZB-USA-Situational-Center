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
import { Sparkline } from "@/components/brief/Sparkline";
import { StatTile } from "@/components/brief/StatTile";
import { CommitmentsBar } from "@/components/brief/CommitmentsBar";
import { AttentionList } from "@/components/brief/AttentionList";
import { HorizonTimeline } from "@/components/brief/HorizonTimeline";
import { GlobeSection } from "@/components/brief/GlobeSection";
import { UpdatedAt } from "@/components/brief/UpdatedAt";
import { PrintButton } from "@/components/exports/PrintButton";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "brief" });
}

/**
 * /brief — standalone exhibition dashboard for live projection to the
 * Advisor to the President and the U.S. Ambassador. Renders as a full-screen
 * fixed overlay above the standard Sidebar/Topbar shell (a route group cannot
 * shadow the [locale] layout, and the shell files stay untouched by design).
 * Server component: every number below is in the initial HTML; only the
 * intro, globe, count-ups and live timestamp hydrate.
 */
export default async function BriefPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("brief");

  const trade = tradeAnnualUz[tradeAnnualUz.length - 1];
  const yoy = yoyPct();
  const growthSince2017 = trade.turnover / tradeAnnualUz[0].turnover;
  const verified = investmentCredibilitySummary.verified;
  const pending = investmentCredibilitySummary.pending;
  const sectors = investmentHighlights(3);
  const maxSectorValue = sectors[0]?.valueMusd ?? 1;
  const avgProgress = commitmentsAvgProgress();
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
        {/* Header strip */}
        <div className="brief-reveal brief-reveal-1 flex h-[64px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span aria-hidden className="inline-block size-2 rotate-45 bg-[var(--brief-accent-bright)]" />
            <span className="text-[13px] font-semibold tracking-[0.08em] text-[var(--brief-ink)]">
              {t("header.title")}
            </span>
            <span className="hidden text-[12px] text-[var(--brief-ink-faint)] sm:inline">{t("header.sub")}</span>
          </div>
          <UpdatedAt className="text-[12px] text-[var(--brief-ink-faint)]" />
        </div>
        <div className="brief-rule" />

        {/* Hero: headline turnover + globe */}
        <section className="brief-reveal brief-reveal-2 grid items-center gap-x-12 gap-y-10 py-10 lg:min-h-[78vh] lg:grid-cols-12 lg:py-6">
          <div className="lg:col-span-5">
            <p className="brief-eyebrow">{t("hero.eyebrow", { year: trade.year })}</p>
            <p className="mt-5 text-[var(--brief-ink)]">
              <BriefNumber
                value={trade.turnover}
                decimals={1}
                prefix="$"
                durationMs={1400}
                className="brief-hero-value"
              />
              <span className="ml-3 text-[clamp(16px,1.4vw,22px)] font-medium text-[var(--brief-ink-muted)]">
                {t("hero.unit")}
              </span>
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span
                className="rounded-full px-3 py-1 text-[13px] font-semibold tabular-nums"
                style={{
                  color: yoy >= 0 ? "var(--brief-pos)" : "var(--brief-neg)",
                  background: "var(--brief-surface-2)",
                }}
              >
                {pctf.format(yoy)}% {t("hero.yoyLabel")}
              </span>
              <span className="text-[13px] text-[var(--brief-ink-muted)]">
                {t("hero.since2017", { times: nf.format(Math.round(growthSince2017 * 10) / 10) })}
              </span>
            </div>
            <div className="mt-6">
              <Sparkline
                data={tradeAnnualUz.map((y) => ({ year: y.year, value: y.turnover }))}
                label={t("hero.sparkAria")}
              />
              <p className="mt-1 text-[11px] tracking-wide text-[var(--brief-ink-faint)]">
                2017 — {trade.year} · {t("hero.methodology")}
              </p>
            </div>
            <p className="brief-voice mt-10">{t("hero.voice")}</p>
          </div>
          <div className="hidden md:block lg:col-span-7">
            <GlobeSection />
          </div>
        </section>

        {/* Stat band — hairline dividers, no card chrome */}
        <section className="brief-reveal brief-reveal-3 brief-band grid-cols-2 border-y border-[var(--brief-border)] xl:grid-cols-4">
          <StatTile
            label={t("stats.portfolioLabel")}
            sub={t("stats.portfolioSub", {
              pending: nf.format(pending.totalValueUsdM),
              projects: verified.totalProjects + pending.totalProjects,
            })}
          >
            <BriefNumber value={verified.totalValueUsdM} prefix="$" />
            <span className="ml-1.5 text-[15px] font-medium text-[var(--brief-ink-muted)]">{t("stats.mln")}</span>
          </StatTile>
          <StatTile label={t("stats.visitsLabel")} sub={t("stats.visitsSub")}>
            <BriefNumber value={visits.length} />
          </StatTile>
          <StatTile
            label={t("stats.documentsLabel")}
            sub={t("stats.documentsSub", { invest: agreementsAggregate.totalInvestAgreements })}
          >
            <BriefNumber value={agreementsAggregate.totalDocuments} />
          </StatTile>
          <StatTile
            label={t("stats.commitmentsLabel")}
            sub={
              <>
                {t("stats.commitmentsSub", { avg: avgProgress })} <DemoBadge className="align-middle" />
              </>
            }
          >
            <BriefNumber value={commitments.length} />
          </StatTile>
        </section>

        {/* Lower band: sectors + flagship document · execution · horizon */}
        <section className="brief-reveal brief-reveal-4 grid gap-x-12 gap-y-10 py-10 lg:grid-cols-3">
          <div className="brief-print-block">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brief-ink-faint)]">
              {t("invest.title")}
            </h2>
            <ul className="mt-4 space-y-4">
              {sectors.map((s) => (
                <li key={s.sector}>
                  <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                    <span className="text-[var(--brief-ink)]">{t(`invest.sector.${s.sector}`)}</span>
                    <span className="tabular-nums text-[var(--brief-ink-muted)]">
                      {t("invest.valueMln", { value: nf.format(s.valueMusd) })}
                    </span>
                  </div>
                  <div className="mt-1.5 h-[6px] w-full rounded-full bg-[var(--brief-surface-2)]">
                    <div
                      className="h-full rounded-full bg-[var(--brief-accent)]"
                      style={{ width: `${Math.max(6, (s.valueMusd / maxSectorValue) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11.5px] text-[var(--brief-ink-faint)]">
                    {t("invest.projects", { count: s.projects })}
                  </p>
                </li>
              ))}
            </ul>
            {flagship ? (
              <div className="mt-8 border-t border-[var(--brief-border)] pt-5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brief-ink-faint)]">
                  {t("docs.title")}
                </h3>
                <p className="mt-2 text-[14.5px] leading-snug text-[var(--brief-ink)]">{t("docs.flagshipTitle")}</p>
                <p className="mt-1 text-[12px] text-[var(--brief-ink-muted)]">
                  {t("docs.flagshipMeta", { date: df.format(parseDay(flagship.signedOn)) })}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <CommitmentsBar />
            <AttentionList locale={locale} />
          </div>

          <HorizonTimeline />
        </section>

        {/* Footer strip */}
        <div className="brief-rule" />
        <div className="brief-reveal brief-reveal-4 flex flex-wrap items-center justify-between gap-3 pt-4">
          <p className="text-[12px] text-[var(--brief-ink-faint)]">
            {t("footer.sources", { count: sourcesMeta.total })}
          </p>
          <PrintButton label={t("footer.print")} />
        </div>
      </div>
    </div>
  );
}
