import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TodayCommandCenter } from "@/components/control-room/TodayCommandCenter";
import { yoyPct } from "@/components/brief/brief-data";
import { investmentCredibilitySummary } from "@/data/investments";
import { allRoadmapSteps, roadmapProjects, roadmapStepCounts } from "@/data/roadmaps";
import { tradeAnnualUz } from "@/data/trade";
import { upcomingVisits } from "@/data/visit-prep";

const PUBLICATION_AS_OF = "2026-07-04";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "today.meta" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function TodayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const publicationDate = new Date(`${PUBLICATION_AS_OF}T12:00:00Z`);
  const trade = tradeAnnualUz.at(-1);
  if (!trade) throw new Error("The verified annual trade series is empty.");

  const counts = roadmapStepCounts(publicationDate);
  const relevantVisits = upcomingVisits.filter(
    (visit) => visit.id === "uv-samarkand-usa-2026-05" || visit.id === "uv-khorezm-usa-2026-05",
  );
  const visitAgendaEntries = relevantVisits.reduce((sum, visit) => sum + visit.meetings.length, 0);
  const visitSourceArtifacts = relevantVisits.reduce(
    (sum, visit) =>
      sum + visit.materials.filter((material) => material.status === "received" && !material.is_demo).length,
    0,
  );

  return (
    <TodayCommandCenter
      locale={locale}
      metrics={{
        asOf: PUBLICATION_AS_OF,
        today: new Date().toISOString().slice(0, 10),
        tradeYear: trade.year,
        tradeTurnoverMusd: trade.turnover,
        tradeYoyPct: yoyPct(),
        verifiedInvestmentMusd: investmentCredibilitySummary.verified.totalValueUsdM,
        pendingInvestmentMusd: investmentCredibilitySummary.pending.totalValueUsdM,
        roadmapProjects: roadmapProjects.length,
        roadmapDoneSteps: counts.done,
        roadmapTotalSteps: allRoadmapSteps().length,
        roadmapOverdueSteps: counts.overdue,
        roadmapDueSoonSteps: counts["due-soon"],
        visitAgendaEntries,
        visitSourceArtifacts,
      }}
    />
  );
}
