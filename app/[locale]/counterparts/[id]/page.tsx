import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarClock, MessageSquare, Check } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { counterparts, PARTY_TONE, STANCE_CHIP } from "@/data/counterparts";
import { PrintButton } from "@/components/exports/PrintButton";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return counterparts.map((c) => ({ id: c.id }));
}

export default async function CounterpartPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("counterparts");
  const c = counterparts.find((x) => x.id === id);
  if (!c) notFound();

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={`/${locale}/counterparts`}
        className="inline-flex w-fit items-center gap-1.5 text-[12px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
      >
        <ArrowLeft className="size-3.5" />
        Back to counterparts
      </Link>

      <div className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:flex-row md:items-center">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[24px] font-bold text-white">
          {c.name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <h1 className="serif text-[26px] font-medium tracking-tight text-[var(--color-ink)]">{c.name}</h1>
          <p className="text-[14px] text-[var(--color-ink-muted)]">{c.position}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11.5px]">
            {c.party ? (
              <span className={cn("mono rounded px-2 py-0.5 font-semibold tabular", PARTY_TONE[c.party])}>
                {c.party}{c.state ? ` · ${c.state}` : ""}
              </span>
            ) : null}
            <span className={cn("rounded-full border px-2 py-0.5 font-medium uppercase tracking-wider", STANCE_CHIP[c.stanceOnUz])}>
              {c.stanceOnUz}
            </span>
            {c.sourceId ? <SourceBadge sourceId={c.sourceId} variant="chip" /> : null}
            {c.source_url && !c.sourceId ? (
              <a
                href={c.source_url}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-primary)] hover:underline"
              >
                Source
              </a>
            ) : null}
          </div>
        </div>
        <PrintButton label={t("generatePdf")} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title={t("uzHistory")}
            sub={`${c.priorEngagements.length} recorded engagements`}
            right={<CalendarClock className="size-4 text-[var(--color-ink-faint)]" />}
          />
          <CardBody>
            <ol className="flex flex-col gap-2.5">
              {c.priorEngagements.map((e, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 border-b border-[var(--color-border)] pb-2 last:border-0 last:pb-0"
                >
                  <span className="mono mt-0.5 size-5 shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] text-center text-[10px] font-semibold leading-5 tabular text-[var(--color-ink-muted)]">
                    {idx + 1}
                  </span>
                  <span className="text-[13px] leading-relaxed text-[var(--color-ink)]">{e}</span>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader title="Key topics" right={<MessageSquare className="size-4 text-[var(--color-ink-faint)]" />} />
            <CardBody>
              <ul className="flex flex-col gap-1.5">
                {c.keyTopics.map((tp) => (
                  <li key={tp} className="flex items-center gap-2 text-[12.5px] text-[var(--color-ink)]">
                    <Check className="size-3.5 text-[var(--color-pos)]" />
                    {tp}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {c.committees?.length ? (
            <Card>
              <CardHeader title="Committees" />
              <CardBody>
                <ul className="flex flex-col gap-1 text-[12.5px] text-[var(--color-ink)]">
                  {c.committees.map((cm) => (
                    <li key={cm}>· {cm}</li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardHeader title="Profile summary" />
            <CardBody>
              <dl className="flex flex-col gap-1.5 text-[12.5px]">
                <Row label="Role" value={c.role.replace("-", " · ")} />
                {c.party ? <Row label={t("party")} value={c.party} /> : null}
                {c.state ? <Row label="State" value={c.state} /> : null}
                <Row label="UZ stance" value={c.stanceOnUz} />
              </dl>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] py-1 last:border-0">
      <dt className="text-[var(--color-ink-muted)]">{label}</dt>
      <dd className="mono text-right tabular text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}
