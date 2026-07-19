import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BarChart3, Library, ScrollText } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { AgreementsTable } from "@/components/agreements/AgreementsTable";
import { AgreementsStats } from "@/components/agreements/AgreementsStats";
import { AgreementsTimeline } from "@/components/agreements/AgreementsTimeline";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { getRouteSeo } from "@/lib/seo";
import { PublicPageIntro } from "@/components/layout/PublicPageIntro";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "agreements" });
}

export default async function AgreementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agreements");
  const tPublic = await getTranslations("publicPage");

  return (
    <div className="flex flex-col gap-6">
      <PublicPageIntro
        eyebrow={tPublic("intelligenceBrief")}
        title={t("title")}
        subtitle={t("subtitle")}
        tone="agree"
        icon={<ScrollText className="size-6 sm:size-7" />}
        meta={
          <>
            <span>{t("overview.sourceOwner")}</span>
            <span aria-hidden>·</span>
            <span>{t("overview.sourceAvailability")}</span>
          </>
        }
      />

      <Card tone="agree">
        <CardHeader
          icon={<BarChart3 className="size-3.5" />}
          tone="agree"
          title={t("overview.aggregateTitle")}
          sub={t("overview.aggregateSub")}
        />
        <CardBody className="flex flex-col gap-8">
          <AgreementsStats />
          <AgreementsTimeline />
        </CardBody>
      </Card>

      <Card tone="agree">
        <CardHeader
          icon={<Library className="size-3.5" />}
          tone="agree"
          title={t("overview.registryTitle")}
          sub={t("overview.registrySub")}
        />
        <CardBody>
          <AgreementsTable />
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
          {t("overview.sourceAnchors")}:
        </span>
        <SourceBadge sourceId="lex_uz" />
        <SourceBadge sourceId="lex_uz_visa_free_2025" />
        <SourceBadge sourceId="lex_uz_embassy_us_1993" />
        <SourceBadge sourceId="lex_uz_diplomatic_missions_1992" />
      </div>
    </div>
  );
}
