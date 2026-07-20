import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SourcesRegistry, type PublicSourceEntry } from "@/components/sources/SourcesRegistry";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { sources, sourcesMeta } from "@/data/sources";
import { localeAlternates } from "@/lib/seo";

type SourcesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SourcesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sourcesPage.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: localeAlternates(locale, "/sources"),
  };
}

export default async function SourcesPage({ params }: SourcesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sourcesPage" });

  const latestFetch = sources.reduce(
    (latest, source) => (source.fetched_at > latest ? source.fetched_at : latest),
    sources[0]?.fetched_at ?? sourcesMeta.fetched_at,
  );

  const entries: PublicSourceEntry[] = sources
    .map((source) => ({
      id: source.id,
      name: source.name,
      level: source.level,
      fetchedAt: source.fetched_at,
      dataType: t(`registry.metadata.${source.id}.dataType`),
      note: source.note ? t(`registry.metadata.${source.id}.note`) : undefined,
      url: source.level === "B" ? source.url : undefined,
    }))
    .sort((a, b) => {
      if (a.level !== b.level) return a.level === "B" ? -1 : 1;
      return a.name.localeCompare(b.name, "en");
    });
  const provenanceExample = sources.find((source) => source.id === "census_goods_uz");
  const provenanceBadge =
    locale === "en" || !provenanceExample?.url ? (
      <SourceBadge
        sourceId="census_goods_uz"
        variant="compact"
        className="min-h-7 border-white/30 bg-white/10 text-white hover:!bg-white hover:!text-[var(--color-primary)]"
      />
    ) : (
      <a
        href={provenanceExample.url}
        target="_blank"
        rel="noreferrer"
        aria-label={t("registry.openSource", { source: provenanceExample.name })}
        className="mono inline-flex min-h-7 items-center gap-1 rounded border border-white/30 bg-white/10 px-2 text-[9.5px] uppercase tracking-wider text-white transition hover:bg-white hover:text-[var(--color-primary)]"
      >
        <ExternalLink className="size-2.5" aria-hidden />
        [B] {provenanceExample.id}
      </a>
    );

  return (
    <SourcesRegistry
      entries={entries}
      locale={locale}
      provenanceBadge={provenanceBadge}
      summary={{
        total: sourcesMeta.total,
        levelA: sourcesMeta.levelA,
        levelB: sourcesMeta.levelB,
        latestFetch,
      }}
    />
  );
}
