import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Route } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { RegionCards } from "@/components/roadmaps/RegionCards";
import { RoadmapsExplorer } from "@/components/roadmaps/RoadmapsExplorer";
import { PrintButton } from "@/components/exports/PrintButton";
import { roadmapProjects } from "@/data/roadmaps";
import { getRouteSeo } from "@/lib/seo";
import { PublicPageIntro } from "@/components/layout/PublicPageIntro";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "roadmaps" });
}

export default async function RoadmapsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("roadmaps");
  const tPublic = await getTranslations("publicPage");

  return (
    <div className="flex flex-col gap-5">
      <PublicPageIntro
        eyebrow={tPublic("intelligenceBrief")}
        title={t("title")}
        subtitle={t("subtitle")}
        tone="rose"
        icon={<Route className="size-6 sm:size-7" />}
        actions={<PrintButton />}
      />

      <RegionCards />

      <Card>
        <CardHeader title={t("explorer.title")} sub={t("explorer.sub", { count: roadmapProjects.length })} />
        <CardBody>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-[var(--color-surface-2)]" />}>
            <RoadmapsExplorer />
          </Suspense>
        </CardBody>
      </Card>
    </div>
  );
}
