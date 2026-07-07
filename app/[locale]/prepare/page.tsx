import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck } from "lucide-react";
import { VisitCard } from "@/components/visit-prep/VisitCard";
import { upcomingVisits } from "@/data/visit-prep";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "prepare" });
}

/**
 * Visit preparation, v2 (roadmaps-monitoring pass) — PASSWORD-GATED via
 * proxy.ts (same signed cookie as /admin). One dossier card per visit:
 * delegation composition, day-by-day meeting program, and the hokimiyat
 * material package. Delegation names are permitted ONLY because this route
 * is behind the gate (CLAUDE.md hard rule #8). Plan-vs-actual outcomes for
 * past visits close the loop below.
 */
export default async function PreparePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("prepare");

  // Active/upcoming first (nearest start date), completed after (latest first).
  const active = upcomingVisits
    .filter((v) => v.status !== "completed")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const completed = upcomingVisits
    .filter((v) => v.status === "completed")
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
          <ShieldCheck className="size-3.5" /> {t("gatedNote")}
        </span>
      </div>

      <section className="flex flex-col gap-4" aria-label={t("upcomingTitle")}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
          {t("upcomingTitle")} · {active.length}
        </h2>
        {active.map((visit) => (
          <VisitCard key={visit.id} visit={visit} locale={locale} />
        ))}
        {active.length === 0 ? (
          <p className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-4 text-[12.5px] text-[var(--color-ink-muted)]">
            {t("noUpcoming")}
          </p>
        ) : null}
      </section>

      <section className="flex flex-col gap-4" aria-label={t("completedTitle")}>
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
          {t("completedTitle")} · {completed.length}
        </h2>
        {completed.map((visit) => (
          <VisitCard key={visit.id} visit={visit} locale={locale} />
        ))}
      </section>
    </div>
  );
}
