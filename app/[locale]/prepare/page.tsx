import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plane, Target, Repeat } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { PipelinePanel } from "@/components/visit-prep/PipelinePanel";
import { OutcomesTable } from "@/components/visit-prep/OutcomesTable";
import { PostVisitReconciliation } from "@/components/visit-prep/PostVisitReconciliation";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import { nextAnchorVisit } from "@/data/visits";
import { visitPipelines, visitOutcomes } from "@/data/visit-prep";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "prepare" });
}

/**
 * Visit lifecycle monitoring, slimmed to the Center's mission (portal-slim
 * pass): the upcoming-visit pipeline, plan-vs-actual outcomes, and post-visit
 * reconciliation with linked roadmaps. The operational blocks that demanded
 * constant manual upkeep (kanban, checklists, 7-block scorecards, logistics
 * matrix, document registry, T-minus timeline) were retired — that content
 * belongs to the operational system, not the monitoring portal.
 */
export default async function PreparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("prepare");
  const next = nextAnchorVisit(new Date());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <DemoBadge source="Situational Center workflow v1" />
      </div>

      {next ? (
        <Card>
          <CardHeader
            title="Active preparation"
            sub={`Anchor visit: ${next.title} — ${next.date}${next.dateEnd ? ` → ${next.dateEnd}` : ""}`}
          />
          <CardBody className="flex flex-wrap items-start gap-6">
            <div>
              <div className="stat-label">Location</div>
              <div className="mt-1 text-[14px] text-[var(--color-ink)]">{next.location}</div>
            </div>
            <div>
              <div className="stat-label">Level</div>
              <div className="mt-1 text-[14px] uppercase tracking-wider text-[var(--color-ink)]">{next.level}</div>
            </div>
            <div>
              <div className="stat-label">Format</div>
              <div className="mt-1 text-[14px] capitalize text-[var(--color-ink)]">{next.format}</div>
            </div>
            <div className="flex-1">
              <div className="stat-label">Delegation head</div>
              <div className="mt-1 text-[14px] text-[var(--color-ink)]">
                {next.participantsUz[0] ?? "Delegation lead"}
              </div>
            </div>
          </CardBody>
        </Card>
      ) : null}

      <Card tone="visits">
        <CardHeader
          icon={<Plane className="size-3.5" />}
          tone="visits"
          title="Pipeline"
          sub={`${visitPipelines.length} upcoming visits with readiness scores · linked roadmaps below`}
        />
        <CardBody>
          <PipelinePanel />
        </CardBody>
      </Card>

      <Card tone="visits">
        <CardHeader
          icon={<Target className="size-3.5" />}
          tone="visits"
          title="Outcomes · plan vs actual"
          sub={`${visitOutcomes.length} verified or pending readouts — closes the loop on every visit`}
        />
        <CardBody className="p-0">
          <OutcomesTable />
        </CardBody>
      </Card>

      <Card tone="invest">
        <CardHeader
          icon={<Repeat className="size-3.5" />}
          tone="invest"
          title="Post-visit reconciliation"
          sub="По каждому визиту — связанные outcomes, подписанные соглашения, action plan и его реализация"
        />
        <CardBody>
          <PostVisitReconciliation />
        </CardBody>
      </Card>
    </div>
  );
}
