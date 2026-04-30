"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, Eye, FileSignature, ListChecks, Target, ArrowUpRight } from "lucide-react";
import { visits, type Visit } from "@/data/visits";
import { commitments, type Commitment } from "@/data/commitments";
import { agreements, type Agreement } from "@/data/agreements";
import { visitOutcomes, type VisitOutcome } from "@/data/visit-prep";
import { cn } from "@/lib/utils";

interface Strings {
  visit: string;
  completion: string;
  outcomes: string;
  plan: string;
  actual: string;
  signedAgreements: string;
  actionPlan: string;
  commitment: string;
  owner: string;
  progress: string;
  deadline: string;
  statusCol: string;
  noLinks: string;
  noLinkedRecords: string;
  verification: string;
  status: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    visit: "Visit",
    completion: "Commitment delivery",
    outcomes: "Outcomes (plan / actual)",
    plan: "Plan",
    actual: "Actual",
    signedAgreements: "Signed agreements",
    actionPlan: "Action plan · commitments",
    commitment: "Commitment",
    owner: "Owner",
    progress: "Progress",
    deadline: "Deadline",
    statusCol: "Status",
    noLinks: "No visits with linked outcomes / commitments / agreements.",
    noLinkedRecords:
      "No linked records. After the visit, the Project Office should add the outcome, action plan and signed-document registry.",
    verification: "Verification",
    status: "status",
  },
  ru: {
    visit: "Визит",
    completion: "Реализация обязательств",
    outcomes: "Outcomes (план / факт)",
    plan: "План",
    actual: "Факт",
    signedAgreements: "Подписанные соглашения",
    actionPlan: "Action plan · обязательства",
    commitment: "Обязательство",
    owner: "Owner",
    progress: "Прогресс",
    deadline: "Срок",
    statusCol: "Статус",
    noLinks: "Нет визитов с привязанными outcomes / commitments / agreements.",
    noLinkedRecords:
      "Нет связанных записей. После визита Project Office должен внести outcome, action plan и реестр подписанных документов.",
    verification: "Verification",
    status: "статус",
  },
  "uz-latn": {
    visit: "Tashrif",
    completion: "Majburiyatlarni amalga oshirish",
    outcomes: "Natijalar (reja / haqiqat)",
    plan: "Reja",
    actual: "Haqiqat",
    signedAgreements: "Imzolangan bitimlar",
    actionPlan: "Action plan · majburiyatlar",
    commitment: "Majburiyat",
    owner: "Mas'ul",
    progress: "Progress",
    deadline: "Muddat",
    statusCol: "Holat",
    noLinks: "Bog'langan outcomes / commitments / agreements bilan tashriflar yo'q.",
    noLinkedRecords:
      "Bog'langan yozuvlar yo'q. Tashrifdan keyin Project Office natija va action plan'ni kiritishi kerak.",
    verification: "Verification",
    status: "holat",
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

const COMMITMENT_TONE: Record<Commitment["status"], string> = {
  done: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  progress: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  watch: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  overdue: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
};

const COMMITMENT_ICON: Record<Commitment["status"], React.ComponentType<{ className?: string }>> = {
  done: CheckCircle2,
  progress: Eye,
  watch: Clock,
  overdue: AlertTriangle,
};

const OUTCOME_TONE: Record<VisitOutcome["score"], string> = {
  High: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  "Medium-high": "border-[var(--color-pos)]/20 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  Medium: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  "Below plan": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  Low: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
};

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" });

interface ReconciledVisit {
  visit: Visit;
  outcomes: VisitOutcome[];
  commitments: Commitment[];
  signedAgreements: Agreement[];
}

function buildReconciliations(): ReconciledVisit[] {
  // Visits that have at least one of: outcome / commitment / agreement reference
  const eligibleVisitIds = new Set<string>();
  for (const o of visitOutcomes) if (o.visitId) eligibleVisitIds.add(o.visitId);
  for (const c of commitments) if (c.linkedVisitId) eligibleVisitIds.add(c.linkedVisitId);

  const out: ReconciledVisit[] = [];
  for (const v of visits) {
    if (!eligibleVisitIds.has(v.id)) continue;
    const linkedOutcomes = visitOutcomes.filter((o) => o.visitId === v.id);
    const linkedCommitments = commitments.filter((c) => c.linkedVisitId === v.id);
    // Match agreements by `agreementsSigned[]` titles (free-text match) AND by date proximity
    const visitDate = new Date(v.date);
    const linkedAgreements = agreements.filter((a) => {
      if (!v.agreementsSigned?.length) return false;
      const titleMatch = v.agreementsSigned.some(
        (signed) =>
          a.title.toLowerCase().includes(signed.toLowerCase()) ||
          signed.toLowerCase().includes(a.title.toLowerCase()),
      );
      if (!titleMatch) return false;
      // Sanity: agreement signedOn within ±60 days of visit
      const signedDate = new Date(a.signedOn);
      const diffDays = Math.abs((signedDate.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 60;
    });
    out.push({ visit: v, outcomes: linkedOutcomes, commitments: linkedCommitments, signedAgreements: linkedAgreements });
  }

  // Sort by visit date desc (most recent first)
  out.sort((a, b) => b.visit.date.localeCompare(a.visit.date));
  return out;
}

export function PostVisitReconciliation() {
  const locale = useLocale();
  const reconciliations = useMemo(() => buildReconciliations(), []);
  const [activeId, setActiveId] = useState<string>(reconciliations[0]?.visit.id ?? "");

  const active = useMemo(
    () => reconciliations.find((r) => r.visit.id === activeId),
    [reconciliations, activeId],
  );

  const T = pickStr(locale);
  if (reconciliations.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-[12px] text-[var(--color-ink-muted)]">
        {T.noLinks}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {reconciliations.map((r) => {
          const isActive = r.visit.id === activeId;
          return (
            <button
              key={r.visit.id}
              type="button"
              onClick={() => setActiveId(r.visit.id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-[12px] transition",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)]",
              )}
            >
              <div className="serif font-medium">{r.visit.title}</div>
              <div className="mt-0.5 flex items-center gap-2 text-[10.5px] text-[var(--color-ink-muted)]">
                <span className="mono tabular">{DATE_FMT.format(new Date(r.visit.date))}</span>
                <span>· {r.outcomes.length}+{r.commitments.length}+{r.signedAgreements.length}</span>
              </div>
            </button>
          );
        })}
      </div>

      {active ? <ReconciliationDetail r={active} locale={locale} /> : null}
    </div>
  );
}

function ReconciliationDetail({ r, locale }: { r: ReconciledVisit; locale: string }) {
  const T = pickStr(locale);
  const doneCount = r.commitments.filter((c) => c.status === "done").length;
  const overdueCount = r.commitments.filter((c) => c.status === "overdue").length;
  const watchCount = r.commitments.filter((c) => c.status === "watch").length;
  const progressCount = r.commitments.filter((c) => c.status === "progress").length;
  const completionPct =
    r.commitments.length > 0 ? Math.round((doneCount / r.commitments.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.visit}</div>
            <div className="serif text-[15px] font-medium text-[var(--color-ink)]">{r.visit.title}</div>
            <div className="mt-0.5 mono text-[11px] tabular text-[var(--color-ink-muted)]">
              {DATE_FMT.format(new Date(r.visit.date))} · {r.visit.location} ·{" "}
              <span className="uppercase">{r.visit.format}</span>
            </div>
          </div>
          <div className="text-right text-[11px]">
            <div className="text-[var(--color-ink-muted)]">{T.completion}</div>
            <div className="mono text-[20px] font-semibold tabular text-[var(--color-pos)]">{completionPct}%</div>
            <div className="text-[10.5px] text-[var(--color-ink-muted)]">
              {doneCount} done · {progressCount} progress · {watchCount} watch · {overdueCount} overdue
            </div>
          </div>
        </div>
      </div>

      {/* Outcomes */}
      {r.outcomes.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">
            <Target className="size-3.5" />
            {T.outcomes}
          </div>
          <div className="flex flex-col gap-2">
            {r.outcomes.map((o) => (
              <div
                key={o.id}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 gap-2 text-[12px] sm:grid-cols-2">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                          {T.plan}
                        </div>
                        <div className="text-[var(--color-ink)]">{o.plan}</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                          {T.actual}
                        </div>
                        <div className="text-[var(--color-ink)]">{o.actual}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-[var(--color-ink-muted)]">
                      Verification: {o.verification} · status: {o.status}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                      OUTCOME_TONE[o.score],
                    )}
                  >
                    {o.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Signed agreements */}
      {r.signedAgreements.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">
            <FileSignature className="size-3.5" />
            {T.signedAgreements} · {r.signedAgreements.length}
          </div>
          <div className="flex flex-col gap-1.5">
            {r.signedAgreements.map((a) => (
              <Link
                key={a.id}
                href={`/${locale}/agreements`}
                className="group flex items-center justify-between gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 transition hover:border-[var(--color-border-strong)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">{a.title}</div>
                  <div className="mono mt-0.5 text-[10.5px] tabular text-[var(--color-ink-muted)]">
                    {a.signedOn} · {a.sphere} · {a.category}
                  </div>
                </div>
                <span className="rounded-full border border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-pos)]">
                  {a.status}
                </span>
                <ArrowUpRight className="size-3.5 text-[var(--color-ink-faint)] transition group-hover:text-[var(--color-ink-muted)]" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Commitments */}
      {r.commitments.length > 0 ? (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-faint)]">
            <ListChecks className="size-3.5" />
            {T.actionPlan} · {r.commitments.length}
          </div>
          <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
            <table className="table">
              <thead>
                <tr>
                  <th>{T.commitment}</th>
                  <th className="w-44">{T.owner}</th>
                  <th className="w-24 text-right">{T.progress}</th>
                  <th className="w-28">{T.deadline}</th>
                  <th className="w-28">{T.statusCol}</th>
                </tr>
              </thead>
              <tbody>
                {r.commitments.map((c) => {
                  const Icon = COMMITMENT_ICON[c.status];
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link
                          href={`/${locale}/commitments?status=${c.status}&q=${encodeURIComponent(
                            c.title.slice(0, 24),
                          )}`}
                          className="text-[12.5px] font-medium text-[var(--color-ink)] underline-offset-4 hover:underline"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="text-[11px] text-[var(--color-ink-muted)]">{c.owner}</td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1 w-12 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${c.progressPct}%`,
                                background:
                                  c.progressPct >= 70
                                    ? "var(--color-pos)"
                                    : c.progressPct >= 40
                                      ? "var(--color-primary)"
                                      : "var(--color-warn)",
                              }}
                            />
                          </div>
                          <span className="mono text-[11px] tabular text-[var(--color-ink)]">{c.progressPct}%</span>
                        </div>
                      </td>
                      <td className="mono text-[11px] tabular text-[var(--color-ink-muted)]">{c.dueDate}</td>
                      <td>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                            COMMITMENT_TONE[c.status],
                          )}
                        >
                          <Icon className="size-3" />
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {r.outcomes.length === 0 && r.signedAgreements.length === 0 && r.commitments.length === 0 ? (
        <div className="rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[11.5px] text-[var(--color-ink-muted)]">
          {T.noLinkedRecords}
        </div>
      ) : null}
    </div>
  );
}
