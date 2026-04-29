import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { AgreementsTable } from "@/components/agreements/AgreementsTable";
import { AgreementsStats } from "@/components/agreements/AgreementsStats";
import { AgreementsTimeline } from "@/components/agreements/AgreementsTimeline";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

export default async function AgreementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agreements");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="text-right text-[11px] text-[var(--color-ink-muted)]">
          <div>Ministry of Foreign Affairs of the Republic of Uzbekistan</div>
          <div className="mono">Full texts on request · MFA registry</div>
        </div>
      </div>

      <Card>
        <CardHeader title="Aggregate" sub="By category and year" />
        <CardBody className="flex flex-col gap-8">
          <AgreementsStats />
          <AgreementsTimeline />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Registry" sub="Filter by category, sphere, search by title" />
        <CardBody>
          <AgreementsTable />
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">UZ-side legal anchors:</span>
        <SourceBadge sourceId="lex_uz" />
        <SourceBadge sourceId="lex_uz_visa_free_2025" />
        <SourceBadge sourceId="lex_uz_embassy_us_1993" />
        <SourceBadge sourceId="lex_uz_diplomatic_missions_1992" />
      </div>
    </div>
  );
}
