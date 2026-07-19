import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarDays } from "lucide-react";
import { VisitsTabs } from "@/components/visits/VisitsTabs";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { getRouteSeo } from "@/lib/seo";
import { PublicPageIntro } from "@/components/layout/PublicPageIntro";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "visits" });
}

export default async function VisitsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("visits");
  const tPublic = await getTranslations("publicPage");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-5">
      <PublicPageIntro
        eyebrow={tPublic("intelligenceBrief")}
        title={t("title")}
        subtitle={t("subtitle")}
        tone="visits"
        icon={<CalendarDays className="size-6 sm:size-7" />}
        meta={
          <>
            <SourceBadge sourceId="state_history_uz" />
            <SourceBadge sourceId="whitehouse_c5_2025" />
          </>
        }
      />

      <div className="card p-0">
        <div className="px-4 pt-3">
          <VisitsTabs locale={locale} todayIso={todayIso} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
          State Dept / White House anchors:
        </span>
        <SourceBadge sourceId="state_history_uz" />
        <SourceBadge sourceId="state_c5_1_2015" />
        <SourceBadge sourceId="state_pompeo_c5_2020" />
        <SourceBadge sourceId="state_spd_2_joint" />
        <SourceBadge sourceId="state_blinken_c5_2023" />
        <SourceBadge sourceId="state_c5_summit_2023" />
        <SourceBadge sourceId="state_spd_3_joint" />
        <SourceBadge sourceId="whitehouse_us_uz_2018" />
        <SourceBadge sourceId="whitehouse_c5_2025" />
        <SourceBadge sourceId="usaid_power_visit_2023" />
      </div>
    </div>
  );
}
