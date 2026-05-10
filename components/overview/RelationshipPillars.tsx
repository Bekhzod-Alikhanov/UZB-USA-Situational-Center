import Link from "next/link";
import type { ComponentType } from "react";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Landmark,
  Plane,
  Shield,
  TrendingUp,
} from "lucide-react";
import { relationshipPillars, type RelationshipPillarTone } from "@/data/relationship-pillars";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

const TONE: Record<RelationshipPillarTone, string> = {
  trade: "border-[var(--color-trade)]/25 bg-[var(--color-trade-soft)]",
  visits: "border-[var(--color-visits)]/25 bg-[var(--color-visits-soft)]",
  invest: "border-[var(--color-invest)]/25 bg-[var(--color-invest-soft)]",
  agree: "border-[var(--color-agree)]/25 bg-[var(--color-agree-soft)]",
  people: "border-[var(--color-people)]/25 bg-[var(--color-people-soft)]",
  rose: "border-[var(--color-rose)]/25 bg-[var(--color-rose-soft)]",
  slate: "border-[var(--color-slate)]/25 bg-[var(--color-slate-soft)]",
  primary: "border-[var(--color-primary)]/25 bg-[var(--color-primary-soft)]",
};

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  diplomacy: Handshake,
  trade: TrendingUp,
  investment: BriefcaseBusiness,
  "security-minerals": Shield,
  "education-aid": GraduationCap,
  "people-mobility": Plane,
  "regional-strategy": Landmark,
};

function leadingValue(value: string) {
  return value.match(/^\$?[\d.]+[BM]?/)?.[0];
}

export async function RelationshipPillars({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "overview.relationshipPillars" });

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {relationshipPillars.map((pillar) => {
        const Icon = ICONS[pillar.id] ?? BookOpen;
        const signalValue = leadingValue(pillar.signal);
        const metricValue = leadingValue(pillar.metric);
        const signal = signalValue ? `${signalValue} · ${t(`items.${pillar.id}.signal`)}` : t(`items.${pillar.id}.signal`);
        const metric = metricValue ? `${metricValue} · ${t(`items.${pillar.id}.metric`)}` : t(`items.${pillar.id}.metric`);

        return (
          <article
            key={pillar.id}
            className={cn("flex min-h-[210px] flex-col rounded-lg border p-4", TONE[pillar.tone])}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)]">
                  <Icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">{t(`items.${pillar.id}.title`)}</h3>
                  <div className="mono mt-0.5 text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                    {signal}
                  </div>
                </div>
              </div>
              <SourceBadge sourceId={pillar.sourceId} />
            </div>
            <div className="mt-3 text-[19px] font-semibold tracking-tight text-[var(--color-ink)]">{metric}</div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
              {t(`items.${pillar.id}.narrative`)}
            </p>
            <div className="mt-auto border-t border-[var(--color-border)] pt-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                {t("nextMove")}
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
                {t(`items.${pillar.id}.action`)}
              </p>
              <Link
                href={`/${locale}${pillar.href}`}
                prefetch={false}
                className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-[var(--color-primary)] hover:underline"
              >
                {t("openSection")} <ArrowRight className="size-3" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
