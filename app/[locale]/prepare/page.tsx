import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { KanbanBoard } from "@/components/visit-prep/KanbanBoard";
import { OptimizationPanel } from "@/components/visit-prep/OptimizationPanel";
import { ChecklistBlock } from "@/components/visit-prep/ChecklistBlock";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import { nextAnchorVisit } from "@/data/visits";

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
                {next.participantsUz[0] ?? "Presidential Administration"}
              </div>
            </div>
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader title="Workflow" sub="Drag cards between stages — plan → coordination → briefing → execution → follow-up" />
        <CardBody>
          <KanbanBoard />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title={t("optimize.title")} sub={t("optimize.sub")} />
          <CardBody>
            <OptimizationPanel />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Checklist" sub="Pre-visit status tracking" />
          <CardBody>
            <ChecklistBlock />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
