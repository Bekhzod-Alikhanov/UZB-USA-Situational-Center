import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, Building2, Compass, GraduationCap, Plane, Users } from "lucide-react";
import { MapLoadGate } from "@/components/map/MapLoadGate";
import { uzMissionsUs } from "@/data/uz-missions-us";
import { uzPlannedVisitsUs } from "@/data/uz-planned-visits-us";
import { totalFor, usStateMetricsMeta } from "@/data/us-state-metrics";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "map" });
}

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("map.strategic");
  const numberLocale = locale === "ru" ? "ru-RU" : locale === "uz-latn" ? "uz-Latn-UZ" : "en-US";

  const totalGdp = totalFor("gdp");
  const totalPop = totalFor("population");
  const totalStudents = totalFor("students");
  const activeMissions = uzMissionsUs.filter((m) => m.status === "active" || m.status === "opened-2026").length;
  const plannedMissions = uzMissionsUs.filter((m) => m.status.startsWith("planned")).length;
  const plannedVisits = uzPlannedVisitsUs.length;
  const cityCount = new Set(uzMissionsUs.map((m) => m.city)).size;

  return (
    <div className="strategic-page">
      <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
        {/* Hero — eyebrow + headline + executive-brief CTA */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="strategic-eyebrow">{t("eyebrow")}</span>
            <h1 className="strategic-headline">{t("title")}</h1>
            <p className="strategic-sub max-w-[64ch]">{t("sub")}</p>
          </div>
          <button type="button" className="strategic-button-primary">
            <Compass className="size-3.5" aria-hidden />
            {t("executiveBrief")}
          </button>
        </header>

        {/* Bento grid of 5 metrics, matching the current /map data */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Tile
            icon={<Building2 className="size-3.5" aria-hidden />}
            label={t("metrics.gdpLabel")}
            value={`$${(totalGdp / 1000).toFixed(1)}T`}
            sub={`${t("metrics.gdpSub")} · ${usStateMetricsMeta.gdp.year}`}
          />
          <Tile
            icon={<Users className="size-3.5" aria-hidden />}
            label={t("metrics.popLabel")}
            value={`${totalPop.toFixed(1)}M`}
            sub={`${t("metrics.popSub")} · ${usStateMetricsMeta.population.year}`}
          />
          <Tile
            icon={<GraduationCap className="size-3.5" aria-hidden />}
            label={t("metrics.studentsLabel")}
            value={totalStudents.toLocaleString(numberLocale)}
            sub={`${t("metrics.studentsSub")} · ${usStateMetricsMeta.students.year}`}
          />
          <Tile
            icon={<Building2 className="size-3.5" aria-hidden />}
            label={t("metrics.missionsLabel")}
            value={`${uzMissionsUs.length}`}
            sub={t("metrics.missionsSub", { active: activeMissions, planned: plannedMissions })}
          />
          <Tile
            icon={<Plane className="size-3.5" aria-hidden />}
            label={t("metrics.visitsLabel")}
            value={`${plannedVisits}`}
            sub={t("metrics.visitsSub", { count: plannedVisits })}
          />
        </div>

        {/* Main canvas: map on left, glassmorphic side panel on right */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_440px]">
          {/* Map canvas */}
          <div className="strategic-glass relative overflow-hidden p-0" style={{ minHeight: 560 }}>
            <div className="absolute inset-0 rounded-2xl bg-[var(--sv-surface-low)]">
              <MapLoadGate locale={locale} />
            </div>
            {/* Subtle grid overlay for the cockpit-instrument feel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.06] mix-blend-screen"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Side panel */}
          <aside className="strategic-glass flex flex-col gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-2 border-b border-[var(--sv-outline)]/40 pb-4">
              <span className="strategic-eyebrow">{t("panel.eyebrow")}</span>
              <h2 className="serif text-[22px] font-medium leading-tight tracking-tight text-[var(--sv-primary)]">
                {t("panel.title")}
              </h2>
              <p className="text-[12.5px] text-[var(--sv-on-surface-variant)]">
                {t("panel.sub", { cities: cityCount, active: activeMissions, visits: plannedVisits })}
              </p>
            </div>

            {/* Bento mini-grid */}
            <div>
              <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--sv-primary)]/80">
                {t("panel.metricsHeader")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="strategic-tile">
                  <div className="strategic-tile-label">{t("panel.engagementLabel")}</div>
                  <div className="strategic-tile-value">{t("panel.engagementValue")}</div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--sv-surface-low)]">
                    <div className="h-full w-4/5 rounded-full bg-[var(--sv-secondary)]" />
                  </div>
                </div>
                <div className="strategic-tile">
                  <div className="strategic-tile-label">{t("panel.coverageLabel")}</div>
                  <div className="strategic-tile-value">{t("panel.coverageValue")}</div>
                  <div className="strategic-tile-sub">{t("panel.coverageDelta")}</div>
                </div>
              </div>
            </div>

            {/* Missions list */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--sv-primary)]/80">
                  {t("panel.assetsHeader")}
                </div>
                <a
                  href={`/${locale}/contacts`}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--sv-secondary)] hover:underline"
                >
                  {t("panel.viewAll")}
                  <ArrowUpRight className="size-3" aria-hidden />
                </a>
              </div>
              <ul className="flex flex-col gap-2">
                {uzMissionsUs.slice(0, 6).map((m) => {
                  const statusKey =
                    m.status === "active"
                      ? "statusActive"
                      : m.status === "opened-2026"
                        ? "statusOpened"
                        : "statusPlanned";
                  const tone =
                    m.status === "active"
                      ? "text-[var(--sv-success)] bg-[var(--sv-success)]/10 border-[var(--sv-success)]/30"
                      : m.status === "opened-2026"
                        ? "text-[var(--sv-secondary)] bg-[var(--sv-secondary)]/10 border-[var(--sv-secondary)]/30"
                        : "text-[var(--sv-tertiary)] bg-[var(--sv-tertiary)]/10 border-[var(--sv-tertiary)]/30";
                  return (
                    <li
                      key={m.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-[var(--sv-outline)]/30 bg-[var(--sv-surface-low)]/60 p-3 transition-colors hover:border-[var(--sv-secondary)]/40"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-[12.5px] font-medium text-[var(--sv-on-surface)]">{m.name}</div>
                        <div className="mt-0.5 text-[10.5px] text-[var(--sv-on-surface-variant)]">
                          {m.city}, {m.state}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${tone}`}
                      >
                        {t(`panel.${statusKey}`)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Explanatory note */}
            <div className="rounded-lg border border-[var(--sv-outline)]/30 bg-[var(--sv-surface-low)]/40 p-3">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--sv-primary)]/80">
                {t("panel.noteHeader")}
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--sv-on-surface-variant)]">
                {t("panel.noteText")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="strategic-tile">
      <div className="strategic-tile-label">
        {icon}
        {label}
      </div>
      <div className="strategic-tile-value mono tabular">{value}</div>
      <div className="strategic-tile-sub">{sub}</div>
    </div>
  );
}
