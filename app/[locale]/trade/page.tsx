import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Table2,
  GitCompareArrows,
  TrendingUp,
  CalendarRange,
  ArrowUpFromLine,
  ArrowDownToLine,
  ListOrdered,
  ScrollText,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ChartNarration } from "@/components/ui/ChartNarration";
import { TradeTable } from "@/components/trade/TradeTable";
import { MethodologyNotesCard } from "@/components/trade/MethodologyNotesCard";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { TradeChartDisclosure } from "@/components/trade/TradeChartDisclosure";
import { AdvancedTradeAnalysis } from "@/components/trade/AdvancedTradeAnalysis";
// Below-the-fold charts are dynamic-loaded + IntersectionObserver-gated to
// drop the route's initial TBT/transfer. See components/trade/LazyCharts.tsx.
import { LazyMonthlyTrade, LazyExportStructure, LazyImportStructure } from "@/components/trade/LazyCharts";
import { topExportCategoriesUZ, topImportCategoriesUS, tradeMeta } from "@/data/trade";
import { getRouteSeo } from "@/lib/seo";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "trade" });
}

export default async function TradePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trade");
  const narrationLabels = {
    what: t("narrationLabels.what"),
    why: t("narrationLabels.why"),
    how: t("narrationLabels.how"),
    source: t("narrationLabels.source"),
  };
  const copy =
    locale === "ru"
      ? {
          quoteTitle: "Ð¡ÐµÑ€Ð¸Ñ Ð´Ð»Ñ Ñ†Ð¸Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ",
          quoteSub: "Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹Ñ‚Ðµ UZ Stat Ð´Ð»Ñ Ð¾Ñ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð³Ð¾Ð´Ð¾Ð²Ð¾Ð¹ ÐºÐ°Ñ€Ñ‚Ð¸Ð½Ñ‹ ÑÐ¾ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹ Ð£Ð·Ð±ÐµÐºÐ¸ÑÑ‚Ð°Ð½Ð°",
          quoteText:
            "Ð“Ð¾Ð´Ð¾Ð²Ð°Ñ Ñ‚Ð°Ð±Ð»Ð¸Ñ†Ð° Ð¸ Ð³Ñ€Ð°Ñ„Ð¸Ðº Ð¿Ð¾Ñ‚Ð¾ÐºÐ¾Ð² Ð´Ð°ÑŽÑ‚ ÑÐ°Ð¼Ñ‹Ð¹ ÑÑÐ½Ñ‹Ð¹ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ñ‡ÐµÑÐºÐ¸Ð¹ Ð²Ð·Ð³Ð»ÑÐ´ Ð½Ð° Ð¾Ð±Ð¾Ñ€Ð¾Ñ‚, ÑÐºÑÐ¿Ð¾Ñ€Ñ‚, Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚ Ð¸ Ð´Ð²ÑƒÑÑ‚Ð¾Ñ€Ð¾Ð½Ð½Ð¸Ð¹ Ð±Ð°Ð»Ð°Ð½Ñ. ÐŸÑ€Ð¸ ÑÑ€Ð°Ð²Ð½ÐµÐ½Ð¸Ð¸ Ñ U.S. Census Ð¸Ð»Ð¸ Comtrade ÑÐ¾Ñ…Ñ€Ð°Ð½ÑÐ¹Ñ‚Ðµ Ð¼ÐµÑ‚Ð¾Ð´Ð¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¿Ñ€Ð¸Ð¼ÐµÑ‡Ð°Ð½Ð¸Ñ.",
          changedTitle: "Ð§Ñ‚Ð¾ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ð»Ð¾ÑÑŒ",
          changedSub: "Ð’Ð¾Ð¿Ñ€Ð¾Ñ Ð±Ð°Ð»Ð°Ð½ÑÐ° Ð²Ð°Ð¶Ð½ÐµÐµ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²Ð¾Ñ‡Ð½Ð¾Ð¹ ÑÑƒÐ¼Ð¼Ñ‹",
          changedText:
            "Ð Ð¾ÑÑ‚ Ð¿Ð¾Ñ‚Ð¾ÐºÐ¾Ð² Ð¿Ð¾Ð»ÐµÐ·ÐµÐ½, Ð½Ð¾ Ð¿Ñ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚Ð½Ñ‹Ð¹ Ñ€Ð°Ð·Ð³Ð¾Ð²Ð¾Ñ€ - Ð´Ð¸Ð²ÐµÑ€ÑÐ¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚Ð°, Ð´Ð¾ÑÑ‚ÑƒÐ¿ Ð½Ð° Ñ€Ñ‹Ð½Ð¾Ðº Ð¸ Ð¿Ñ€ÐµÐ²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ðµ Ñ„Ð¾Ñ€ÑƒÐ¼Ð¾Ð² Ð² Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸ Ð½Ð° ÑƒÑ€Ð¾Ð²Ð½Ðµ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¾Ð².",
          advancedTitle: "Ð Ð°ÑÑˆÐ¸Ñ€ÐµÐ½Ð½Ñ‹Ð¹ Ð°Ð½Ð°Ð»Ð¸Ð· ÑÐ¾Ñ…Ñ€Ð°Ð½Ñ‘Ð½",
          advancedSub: "HS, Ð·ÐµÑ€ÐºÐ°Ð»ÑŒÐ½Ñ‹Ðµ, ITC Ð¸ ÑƒÑÐ»ÑƒÐ³Ð¸ Ð½Ð°Ñ…Ð¾Ð´ÑÑ‚ÑÑ Ð½Ð¸Ð¶Ðµ",
          advancedText:
            "Ð¢ÐµÑ…Ð½Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð³Ñ€Ð°Ñ„Ð¸ÐºÐ¸ ÑÐ¾Ñ…Ñ€Ð°Ð½ÐµÐ½Ñ‹ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ¾Ð² Ð¸ Ð¸ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ñ‚ÐµÐ»ÐµÐ¹ Ð² Ñ€Ð°Ð·Ð´ÐµÐ»Ðµ Ñ€Ð°ÑÑˆÐ¸Ñ€ÐµÐ½Ð½Ð¾Ð³Ð¾ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ñ‚Ð¾Ñ€Ð³Ð¾Ð²Ð»Ð¸, Ð° Ð½Ðµ ÑƒÐ´Ð°Ð»ÐµÐ½Ñ‹ Ð¸Ð· Ð¿Ð°Ð½ÐµÐ»Ð¸.",
          flowSummary:
            "Ð§Ñ‚Ð¾ ÑÑ‚Ð¾ Ð¾Ð·Ð½Ð°Ñ‡Ð°ÐµÑ‚: ÑÑ‚Ð¾Ñ‚ Ð³Ñ€Ð°Ñ„Ð¸Ðº Ð±Ñ‹ÑÑ‚Ñ€ÐµÐµ Ð²ÑÐµÐ³Ð¾ Ð¿Ð¾ÐºÐ°Ð·Ñ‹Ð²Ð°ÐµÑ‚ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ, Ð²Ð¾Ð»Ð°Ñ‚Ð¸Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð¸ Ñ‚Ð¾, ÑƒÑÐ¿ÐµÐ²Ð°ÐµÑ‚ Ð»Ð¸ ÑÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð£Ð·Ð±ÐµÐºÐ¸ÑÑ‚Ð°Ð½Ð° Ð·Ð° Ð¸Ð¼Ð¿Ð¾Ñ€Ñ‚Ð¾Ð¼ Ð¸Ð· Ð¡Ð¨Ð. ÐžÐ½ Ð·Ð°Ð³Ñ€ÑƒÐ¶Ð°ÐµÑ‚ÑÑ Ð¿Ð¾ Ð·Ð°Ð¿Ñ€Ð¾ÑÑƒ, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¾Ð±Ð»ÐµÐ³Ñ‡Ð¸Ñ‚ÑŒ Ð¿ÐµÑ€Ð²Ñ‹Ð¹ ÑÐºÑ€Ð°Ð½ Ð½Ð° Ð¼Ð¾Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ñ… ÑƒÑÑ‚Ñ€Ð¾Ð¹ÑÑ‚Ð²Ð°Ñ….",
        }
      : locale === "uz-latn"
        ? {
            quoteTitle: "Iqtibos uchun tayyor qator",
            quoteSub: "Oâ€˜zbekiston tomoni boâ€˜yicha rasmiy yillik hikoya uchun UZ Statdan foydalaning",
            quoteText:
              "Yillik jadval va oqim grafigi aylanma, eksport, import va ikki tomonlama balans boâ€˜yicha eng aniq ijro koâ€˜rinishini beradi. U.S. Census yoki Comtrade bilan solishtirganda metodologiya izohlarini koâ€˜rinadigan qoldiring.",
            changedTitle: "Nima oâ€˜zgardi",
            changedSub: "Balans masalasi sarlavha raqamidan muhimroq",
            changedText:
              "Oqimlarning oâ€˜sishi foydali, ammo ustuvor suhbat eksport diversifikatsiyasi, bozorga kirish va forumlarni mahsulot darajasidagi imkoniyatlarga aylantirish haqida boâ€˜lishi kerak.",
            advancedTitle: "Kengaytirilgan tahlil saqlandi",
            advancedSub: "HS, oynaviy tafovutlar, ITC va xizmatlar quyida",
            advancedText:
              "Texnik grafiklar oâ€˜chirilmadi; ular tahlilchilar va tadqiqotchilar uchun kengaytirilgan savdo tahlili boâ€˜limida saqlangan.",
            flowSummary:
              "Bu nimani anglatadi: ushbu grafik yoâ€˜nalish, volatillik va Oâ€˜zbekiston eksporti AQShdan import bilan hamqadamligini eng tez koâ€˜rsatadi. Mobil birinchi render yengil boâ€˜lishi uchun talab boâ€˜yicha yuklanadi.",
          }
        : {
            quoteTitle: "Quote-ready series",
            quoteSub: "Use UZ Stat for the official Uzbekistan-side annual story",
            quoteText:
              "The annual table and flow chart give the clearest executive view of turnover, exports, imports, and the bilateral balance. Keep methodology notes visible when comparing against U.S. Census or Comtrade.",
            changedTitle: "What changed",
            changedSub: "The balance question is more important than the headline total",
            changedText:
              "Growth in flows is useful, but the priority conversation is export diversification, market access, and converting forums into product-level opportunities.",
            advancedTitle: "Advanced analysis remains",
            advancedSub: "HS, mirror, ITC, and services exhibits are below",
            advancedText:
              "Technical charts are preserved for analysts and researchers in the Advanced Trade Analysis section rather than removed from the dashboard.",
            flowSummary:
              "What this means: this chart is the fastest visual view of direction, volatility, and whether UZ exports are keeping pace with imports from the United States. It is loaded on demand to keep the first mobile paint light.",
          };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="text-right text-[11px] text-[var(--color-ink-muted)]">
          <div>{tradeMeta.source}</div>
          <div className="mono">
            {t("updated")} {tradeMeta.last_updated}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card tone="trade">
          <CardHeader title={copy.quoteTitle} sub={copy.quoteSub} />
          <CardBody>
            <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{copy.quoteText}</p>
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader title={copy.changedTitle} sub={copy.changedSub} />
          <CardBody>
            <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{copy.changedText}</p>
          </CardBody>
        </Card>
        <Card tone="slate">
          <CardHeader title={copy.advancedTitle} sub={copy.advancedSub} />
          <CardBody>
            <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{copy.advancedText}</p>
          </CardBody>
        </Card>
      </div>

      <Card tone="trade">
        <CardHeader
          icon={<Table2 className="size-3.5" />}
          tone="trade"
          title={t("sections.annualTitle")}
          sub={t("sections.annualSub")}
          right={<SourceBadge sourceId="input_trade_stat_docx" />}
        />
        <CardBody>
          <TradeTable />
          <ChartNarration
            labels={narrationLabels}
            what={t("narration.annual.what")}
            why={t("narration.annual.why")}
            how={t("narration.annual.how")}
            source={t("narration.annual.source")}
          />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card tone="slate" className="lg:col-span-2">
          <CardHeader
            icon={<GitCompareArrows className="size-3.5" />}
            tone="slate"
            title={t("sections.methodologyTitle")}
            sub={t("sections.methodologySub")}
          />
          <CardBody>
            <TradeChartDisclosure
              kind="methodology"
              buttonLabel={t("sections.methodologyButton")}
              summary={t("sections.methodologySummary")}
            />
            <ChartNarration
              labels={narrationLabels}
              what={t("narration.methodology.what")}
              why={t("narration.methodology.why")}
              how={t("narration.methodology.how")}
            />
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader
            icon={<ScrollText className="size-3.5" />}
            tone="agree"
            title={t("sections.notesTitle")}
            sub={t("sections.notesSub")}
          />
          <CardBody>
            <MethodologyNotesCard />
          </CardBody>
        </Card>
      </div>

      <Card tone="trade">
        <CardHeader
          icon={<TrendingUp className="size-3.5" />}
          tone="trade"
          title={t("sections.flowTitle")}
          sub={t("sections.flowSub")}
          right={<SourceBadge sourceId="input_trade_stat_docx" />}
        />
        <CardBody>
          <TradeChartDisclosure
            kind="flow"
            buttonLabel={t("sections.flowButton")}
            height={340}
            summary={copy.flowSummary}
          />
          <ChartNarration
            labels={narrationLabels}
            what={t("narration.flow.what")}
            why={t("narration.flow.why")}
            how={t("narration.flow.how")}
          />
        </CardBody>
      </Card>

      <Card tone="trade">
        <CardHeader
          icon={<CalendarRange className="size-3.5" />}
          tone="trade"
          title={t("sections.monthlyTitle")}
          sub={t("sections.monthlySub")}
          right={<SourceBadge sourceId="census_goods_uz" />}
        />
        <CardBody>
          <LazyMonthlyTrade />
          <ChartNarration
            labels={narrationLabels}
            what={t("narration.monthly.what")}
            why={t("narration.monthly.why")}
            how={t("narration.monthly.how")}
            source={t("narration.monthly.source")}
          />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card tone="invest">
          <CardHeader
            icon={<ArrowUpFromLine className="size-3.5" />}
            tone="invest"
            title={t("structure.export")}
            sub={t("sections.structureSub")}
          />
          <CardBody>
            <LazyExportStructure />
            <ChartNarration
              labels={narrationLabels}
              what={t("narration.structure.what")}
              why={t("narration.structure.why")}
              how={t("narration.structure.how")}
            />
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader
            icon={<ArrowDownToLine className="size-3.5" />}
            tone="agree"
            title={t("structure.import")}
            sub={t("sections.structureSub")}
          />
          <CardBody>
            <LazyImportStructure />
            <ChartNarration
              labels={narrationLabels}
              what={t("narration.structure.what")}
              why={t("narration.structure.why")}
              how={t("narration.structure.how")}
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card tone="invest">
          <CardHeader
            icon={<ListOrdered className="size-3.5" />}
            tone="invest"
            title={t("sections.topExportTitle")}
            sub={t("sections.topExportSub")}
            right={<SourceBadge sourceId="input_trade_stat_docx" />}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10 text-right">{t("tableHeaders.rank")}</th>
                    <th>{t("tableHeaders.category")}</th>
                    <th>{t("tableHeaders.share")}</th>
                    <th className="text-right">{t("tableHeaders.value")}</th>
                  </tr>
                </thead>
                <tbody>
                  {topExportCategoriesUZ.map((r) => (
                    <tr key={r.rank}>
                      <td className="mono text-right text-[var(--color-ink-muted)]">{r.rank}</td>
                      <td className="font-medium">{r.name}</td>
                      <td className="text-[var(--color-ink-muted)]">{r.sector}</td>
                      <td className="mono text-right">{r.value.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ChartNarration
              className="mx-3 mb-3"
              labels={narrationLabels}
              what={t("narration.categories.what")}
              why={t("narration.categories.why")}
              how={t("narration.categories.how")}
            />
          </CardBody>
        </Card>

        <Card tone="agree">
          <CardHeader
            icon={<ListOrdered className="size-3.5" />}
            tone="agree"
            title={t("sections.topImportTitle")}
            sub={t("sections.topImportSub")}
            right={<SourceBadge sourceId="input_trade_stat_docx" />}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10 text-right">{t("tableHeaders.rank")}</th>
                    <th>{t("tableHeaders.category")}</th>
                    <th>{t("tableHeaders.share")}</th>
                    <th className="text-right">{t("tableHeaders.value")}</th>
                  </tr>
                </thead>
                <tbody>
                  {topImportCategoriesUS.map((r) => (
                    <tr key={r.rank}>
                      <td className="mono text-right text-[var(--color-ink-muted)]">{r.rank}</td>
                      <td className="font-medium">{r.name}</td>
                      <td className="text-[var(--color-ink-muted)]">{r.sector}</td>
                      <td className="mono text-right">{r.value.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ChartNarration
              className="mx-3 mb-3"
              labels={narrationLabels}
              what={t("narration.categories.what")}
              why={t("narration.categories.why")}
              how={t("narration.categories.how")}
            />
          </CardBody>
        </Card>
      </div>

      <AdvancedTradeAnalysis />

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
          {t("sections.supplementarySources")}
        </span>
        <SourceBadge sourceId="census_intl_trade_api" />
        <SourceBadge sourceId="cbu_statistics" />
        <SourceBadge sourceId="bea_developers" />
        <SourceBadge sourceId="comtrade_hs6" />
      </div>
    </div>
  );
}

