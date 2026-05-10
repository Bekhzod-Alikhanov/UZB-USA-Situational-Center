"use client";
import {
  investmentConfidence,
  investmentActionProfile,
  investments,
  privatizationOpportunities,
  type Investment,
  type InvestmentSector,
  type InvestmentSourceConfidence,
  type InvestmentStatus,
} from "@/data/investments";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  Search,
  X,
  Briefcase,
  Factory,
  Plane,
  Wheat,
  Zap,
  Pill,
  Cpu,
  Shirt,
  FlaskConical,
  Banknote,
  Gem,
  Info,
} from "lucide-react";
import dynamic from "next/dynamic";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { useSettings } from "@/lib/store/settings";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLocale, useTranslations } from "next-intl";

const FlatMap = dynamic(() => import("@/components/map/FlatMap").then((m) => m.FlatMap), { ssr: false });

const SECTOR_ICON: Record<InvestmentSector, React.ComponentType<{ className?: string }>> = {
  "mining-metals": Factory,
  automotive: Briefcase,
  aviation: Plane,
  "agri-food": Wheat,
  energy: Zap,
  pharma: Pill,
  "it-digital": Cpu,
  textile: Shirt,
  chemicals: FlaskConical,
  finance: Banknote,
  "minerals-rare-earth": Gem,
};

const STATUS_TONE: Record<InvestmentStatus, string> = {
  mou: "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  negotiation: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  agreed: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  construction: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  operating: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  paused: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
};

const STATUS_ORDER: InvestmentStatus[] = ["mou", "negotiation", "agreed", "construction", "operating", "paused"];
const CONFIDENCE_ORDER: InvestmentSourceConfidence[] = [
  "verified_official",
  "company_confirmed",
  "media_reported",
  "internal_unverified",
  "source_needed",
  "illustrative_demo",
];

const CONFIDENCE_TONE: Record<InvestmentSourceConfidence, string> = {
  verified_official: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  company_confirmed: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  media_reported: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  internal_unverified: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  source_needed: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  illustrative_demo: "border-[var(--color-demo-border)] bg-[var(--color-demo-bg)] text-[var(--color-demo-ink)]",
};

const SECTORS: InvestmentSector[] = [
  "mining-metals",
  "automotive",
  "aviation",
  "agri-food",
  "energy",
  "pharma",
  "it-digital",
  "textile",
  "chemicals",
  "finance",
  "minerals-rare-earth",
];

export function InvestmentsView() {
  const t = useTranslations("investments.workspace");
  const locale = useLocale();
  const numberLocale = locale === "ru" ? "ru-RU" : locale === "uz-latn" ? "uz-Latn-UZ" : "en-US";
  const [sector, setSector] = useState<InvestmentSector | "all">("all");
  const [confidence, setConfidence] = useState<InvestmentSourceConfidence | "all">("all");
  const [minValue, setMinValue] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Investment | null>(null);
  const hideDemo = useSettings((s) => s.hideDemo);
  const presentation = useSettings((s) => s.presentationMode);

  const filtered = useMemo(() => {
    return investments.filter((i) => {
      if (sector !== "all" && i.sector !== sector) return false;
      if (confidence !== "all" && investmentConfidence(i) !== confidence) return false;
      if (i.valueMusd < minValue) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !i.title.toLowerCase().includes(s) &&
          !i.partnerUs.toLowerCase().includes(s) &&
          !i.partnerUz.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [sector, confidence, minValue, search]);

  const grouped = useMemo(() => {
    const m: Record<InvestmentStatus, Investment[]> = {
      mou: [],
      negotiation: [],
      agreed: [],
      construction: [],
      operating: [],
      paused: [],
    };
    for (const i of filtered) m[i.status].push(i);
    return m;
  }, [filtered]);

  const totalValue = filtered.reduce((a, i) => a + i.valueMusd, 0);
  const totalJobs = filtered.reduce((a, i) => a + (i.jobs ?? 0), 0);
  const verifiedFiltered = filtered.filter((i) =>
    ["verified_official", "company_confirmed"].includes(investmentConfidence(i)),
  );
  const demoFiltered = filtered.filter((i) => investmentConfidence(i) === "illustrative_demo");
  const actionProfileFor = (investment: Investment) => localizedActionProfile(investment, t, locale);
  const selectedAction = selected ? actionProfileFor(selected) : null;

  return (
    <Tabs.Root defaultValue="board" className="flex flex-col gap-4">
      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 size-3.5 shrink-0 text-[var(--color-primary)]" aria-hidden />
          <p>
            <span className="font-semibold text-[var(--color-ink)]">{t("credibility.label")}</span>{" "}
            {t("credibility.text")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs.List className="flex items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
          {[
            { v: "board", l: t("tabs.board") },
            { v: "table", l: t("tabs.table") },
            { v: "map", l: t("tabs.map") },
            { v: "privatization", l: t("tabs.privatization") },
          ].map((t) => (
            <Tabs.Trigger
              key={t.v}
              value={t.v}
              className="rounded px-2.5 py-1 text-[12px] font-medium text-[var(--color-ink-muted)] data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white"
            >
              {t.l}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <select
          aria-label={t("filters.sectorAria")}
          value={sector}
          onChange={(e) => setSector(e.target.value as InvestmentSector | "all")}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[12px]"
        >
          <option value="all">{t("filters.allSectors")}</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {t(`sectors.${s}`)}
            </option>
          ))}
        </select>

        <select
          aria-label={t("filters.confidenceAria")}
          value={confidence}
          onChange={(e) => setConfidence(e.target.value as InvestmentSourceConfidence | "all")}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[12px]"
        >
          <option value="all">{t("filters.allConfidence")}</option>
          {CONFIDENCE_ORDER.map((status) => (
            <option key={status} value={status}>
              {t(`confidence.${status}`)}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11.5px]">
          <span className="text-[var(--color-ink-muted)]">{t("filters.minValue")}</span>
          <input
            type="number"
            aria-label={t("filters.minValueAria")}
            min={0}
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value) || 0)}
            className="mono w-14 bg-transparent text-right outline-none tabular"
          />
        </div>

        <label className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" aria-hidden />
          <input
            type="search"
            aria-label={t("filters.searchAria")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            className="w-56 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>

        <div className="ml-auto flex items-center gap-4 text-[11px] text-[var(--color-ink-muted)]">
          <ToolbarStat label={t("toolbar.projects")} value={filtered.length.toString()} />
          <ToolbarStat label={t("toolbar.total")} value={`$${(totalValue / 1000).toFixed(2)}B`} />
          <ToolbarStat label={t("toolbar.verified")} value={verifiedFiltered.length.toString()} />
          <ToolbarStat label={t("toolbar.demo")} value={demoFiltered.length.toString()} />
          <ToolbarStat label={t("toolbar.jobs")} value={totalJobs.toLocaleString(numberLocale)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5" aria-label={t("table.confidence")}>
        {CONFIDENCE_ORDER.map((status) => (
          <ConfidenceBadge key={status} confidence={status} label={t(`confidence.${status}`)} />
        ))}
      </div>

      <Tabs.Content value="board">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STATUS_ORDER.map((s) => (
            <Column
              key={s}
              statusLabel={t(`statuses.${s}`)}
              items={grouped[s]}
              onOpen={setSelected}
              emptyTitle={t("empty.title")}
              emptyDescription={t("empty.description")}
              confidenceLabel={(confidenceKey) => t(`confidence.${confidenceKey}`)}
              nextActionLabel={t("table.nextAction")}
              actionProfileFor={actionProfileFor}
            />
          ))}
        </div>
      </Tabs.Content>

      <Tabs.Content value="table">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{t("table.project")}</th>
                <th scope="col" className="w-[160px]">{t("table.sector")}</th>
                <th scope="col" className="w-[140px]">{t("table.region")}</th>
                <th scope="col" className="w-[200px]">{t("table.partners")}</th>
                <th scope="col" className="w-[84px] text-right">{t("table.value")}</th>
                <th scope="col" className="w-[72px] text-right">{t("table.jobs")}</th>
                <th scope="col" className="w-[108px]">{t("table.status")}</th>
                <th scope="col" className="w-[150px]">{t("table.confidence")}</th>
                <th scope="col" className="w-[260px]">{t("table.nextAction")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const Icon = SECTOR_ICON[i.sector];
                const actionProfile = actionProfileFor(i);
                return (
                  <tr key={i.id}>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        className="text-left font-medium text-[var(--color-ink)] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      >
                        {i.title}
                      </button>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-muted)]">
                        <Icon className="size-3.5 text-[var(--color-ink-faint)]" />
                        {t(`sectors.${i.sector}`)}
                      </span>
                    </td>
                    <td className="text-[11.5px] text-[var(--color-ink-muted)]">{i.region}</td>
                    <td className="text-[11.5px] text-[var(--color-ink-muted)]">
                      <div className="text-[var(--color-ink)]">{i.partnerUs}</div>
                      <div>× {i.partnerUz}</div>
                    </td>
                    <td className="mono text-right tabular">{i.valueMusd.toFixed(0)}</td>
                    <td className="mono text-right tabular text-[var(--color-ink-muted)]">{i.jobs ?? "—"}</td>
                    <td>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                          STATUS_TONE[i.status],
                        )}
                      >
                        {t(`statuses.${i.status}`)}
                      </span>
                    </td>
                    <td>
                      <ConfidenceBadge confidence={investmentConfidence(i)} label={t(`confidence.${investmentConfidence(i)}`)} />
                    </td>
                    <td className="max-w-[260px] text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
                      {actionProfile.nextAction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Tabs.Content>

      <Tabs.Content value="map">
        <FlatMap activeLayers={{ invest: true, trade: false, delegations: false }} />
      </Tabs.Content>

      <Tabs.Content value="privatization">
        {privatizationOpportunities.length ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {privatizationOpportunities.map((item) => (
              <article key={item.id} className="rounded-md border border-[var(--color-border)] p-4">
                <h3 className="font-medium text-[var(--color-ink)]">{item.assetName}</h3>
                <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">{item.nextStep}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
            <EmptyState
              className="px-4 py-10"
              title={t("privatization.emptyTitle")}
              description={t("privatization.emptyDescription")}
            />
            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              <div className="stat-label">{t("privatization.schemaTitle")}</div>
              <p className="mt-2 text-[var(--color-ink)]">{t("privatization.schemaFields")}</p>
              <p className="mt-3">{t("privatization.safeState")}</p>
            </div>
          </div>
        )}
      </Tabs.Content>

      {/* Detail drawer */}
      <Dialog.Root open={!!selected} onOpenChange={(o) => (o ? null : setSelected(null))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed right-0 top-0 z-50 h-full w-[94vw] max-w-[520px] overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            aria-describedby={undefined}
          >
            {selected && selectedAction ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] pb-3">
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="serif text-[18px] font-medium text-[var(--color-ink)]">
                      {selected.title}
                    </Dialog.Title>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-ink-muted)]">
                      <span className="uppercase tracking-wider">{t(`sectors.${selected.sector}`)}</span>
                      <span>·</span>
                      <span>{selected.region}</span>
                      <span>·</span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider",
                          STATUS_TONE[selected.status],
                        )}
                      >
                        {t(`statuses.${selected.status}`)}
                      </span>
                      <ConfidenceBadge
                        confidence={investmentConfidence(selected)}
                        label={t(`confidence.${investmentConfidence(selected)}`)}
                      />
                    </div>
                  </div>
                  <Dialog.Close
                    aria-label={t("drawer.close")}
                    className="rounded p-1 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]"
                  >
                    <X className="size-4" />
                  </Dialog.Close>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4">
                  <KV label={t("drawer.value")} value={`$${selected.valueMusd}M`} mono />
                  <KV
                    label={t("drawer.jobs")}
                    value={selected.jobs ? selected.jobs.toLocaleString(numberLocale) : "-"}
                    mono
                  />
                  <KV
                    label={t("drawer.timeline")}
                    value={`${selected.startYear}${selected.expectedCompletion ? ` -> ${selected.expectedCompletion}` : ""}`}
                    mono
                  />
                </div>

                <div className="mt-5">
                  <div className="stat-label">{t("drawer.usPartner")}</div>
                  <div className="mt-1 text-[14px] text-[var(--color-ink)]">{selected.partnerUs}</div>
                </div>
                <div className="mt-4">
                  <div className="stat-label">{t("drawer.uzPartner")}</div>
                  <div className="mt-1 text-[14px] text-[var(--color-ink)]">{selected.partnerUz}</div>
                </div>

                {selected.sourceId ? (
                  <div className="mt-5">
                    <div className="stat-label mb-1.5">{t("drawer.source")}</div>
                    <SourceBadge sourceId={selected.sourceId} variant="chip" />
                  </div>
                ) : null}

                <div className="mt-5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                  <span className="font-semibold text-[var(--color-ink)]">{t("drawer.whatThisMeans")} </span>
                  {investmentConfidence(selected) === "illustrative_demo"
                    ? t("drawer.meaningDemo")
                    : investmentConfidence(selected) === "verified_official"
                      ? t("drawer.meaningVerified")
                      : t("drawer.meaningInternal")}
                </div>

                <section className="mt-5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[13px] font-semibold text-[var(--color-ink)]">{t("drawer.actionTitle")}</h3>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        selectedAction.quoteSafe
                          ? "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]"
                          : "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
                      )}
                    >
                      {selectedAction.quoteSafe ? t("drawer.quoteSafe") : t("drawer.notQuoteSafe")}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <KV label={t("drawer.projectOwner")} value={selectedAction.projectOwner} />
                    <KV label={t("drawer.counterpart")} value={selectedAction.counterpart} />
                    <KV label={t("drawer.stage")} value={selectedAction.stage} />
                  </div>

                  <div className="mt-4 space-y-3 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                    <ActionBlock label={t("drawer.nextAction")} value={selectedAction.nextAction} />
                    <ActionBlock label={t("drawer.usRelevance")} value={selectedAction.usCompanyRelevance} />
                    <ActionBlock label={t("drawer.publication")} value={selectedAction.publicationGuidance} />
                    <div>
                      <div className="stat-label">{t("drawer.blockers")}</div>
                      <ul className="mt-1.5 space-y-1">
                        {selectedAction.blockers.map((blocker) => (
                          <li key={blocker} className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1">
                            {blocker}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                {selected.source_note && !hideDemo && !presentation ? (
                  <div className="mt-5 rounded-md border border-[var(--color-border)] bg-[var(--color-demo-bg)] p-3 text-[12px] text-[var(--color-demo-ink)]">
                    <span className="font-semibold">{t("drawer.demoLabel")}</span> {selected.source_note}
                  </div>
                ) : null}
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Tabs.Root>
  );
}

function ConfidenceBadge({ confidence, label }: { confidence: InvestmentSourceConfidence; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        CONFIDENCE_TONE[confidence],
      )}
      title={label}
    >
      {label}
    </span>
  );
}

/** Compact in-toolbar stat — smaller than the section-header `<Stat>`. */
function ToolbarStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">{label}</span>
      <span className="mono text-[13px] tabular text-[var(--color-ink)]">{value}</span>
    </div>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="stat-label">{label}</div>
      <div className={cn("mt-1 text-[14px] text-[var(--color-ink)]", mono && "mono tabular")}>{value}</div>
    </div>
  );
}

function ActionBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="stat-label">{label}</div>
      <p className="mt-1 text-[var(--color-ink-muted)]">{value}</p>
    </div>
  );
}

function Column({
  statusLabel,
  items,
  onOpen,
  emptyTitle,
  emptyDescription,
  confidenceLabel,
  nextActionLabel,
  actionProfileFor,
}: {
  statusLabel: string;
  items: Investment[];
  onOpen: (i: Investment) => void;
  emptyTitle: string;
  emptyDescription: string;
  confidenceLabel: (confidence: InvestmentSourceConfidence) => string;
  nextActionLabel: string;
  actionProfileFor: (investment: Investment) => InvestmentActionPresentation;
}) {
  const total = items.reduce((a, i) => a + i.valueMusd, 0);
  return (
    <div className="flex min-w-[220px] shrink-0 flex-col gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 xl:min-w-[240px]">
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink)]">{statusLabel}</span>
        <span className="mono text-[10px] tabular text-[var(--color-ink-muted)]">
          {items.length} · ${(total / 1000).toFixed(1)}B
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((i) => {
          const Icon = SECTOR_ICON[i.sector];
          const actionProfile = actionProfileFor(i);
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => onOpen(i)}
              className="flex flex-col gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-left transition hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-hover)]"
            >
              <div className="text-[12.5px] font-medium leading-snug text-[var(--color-ink)]">{i.title}</div>
              <ConfidenceBadge confidence={investmentConfidence(i)} label={confidenceLabel(investmentConfidence(i))} />
              <div className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1">
                <div className="text-[9.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                  {nextActionLabel}
                </div>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-[var(--color-ink-muted)]">
                  {actionProfile.nextAction}
                </p>
              </div>
              <div className="flex items-center justify-between text-[10.5px] text-[var(--color-ink-muted)]">
                <span className="flex items-center gap-1">
                  <Icon className="size-3 text-[var(--color-ink-faint)]" />
                  {i.region}
                </span>
                <span className="mono tabular text-[var(--color-ink)]">${i.valueMusd}M</span>
              </div>
            </button>
          );
        })}
        {items.length === 0 ? (
          <EmptyState
            className="px-3 py-5"
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : null}
      </div>
    </div>
  );
}

type WorkspaceTranslator = (key: string, values?: Record<string, string | number>) => string;

interface InvestmentActionPresentation {
  projectOwner: string;
  counterpart: string;
  stage: string;
  nextAction: string;
  blockers: string[];
  usCompanyRelevance: string;
  quoteSafe: boolean;
  publicationGuidance: string;
}

function localizedActionProfile(
  investment: Investment,
  t: WorkspaceTranslator,
  locale: string,
): InvestmentActionPresentation {
  const base = investmentActionProfile(investment);
  const confidence = investmentConfidence(investment);
  const sourceBacked = confidence === "verified_official" || confidence === "company_confirmed";
  const needsSource = confidence === "source_needed" || confidence === "illustrative_demo";
  const isEnglish = locale === "en";
  const customBlockers = isEnglish ? investment.blockers : undefined;

  const blockers = customBlockers?.length
    ? customBlockers
    : needsSource
      ? [t("actions.blockers.ownerSource"), t("actions.blockers.publicUse")]
      : confidence === "internal_unverified"
        ? [t("actions.blockers.ownerReview")]
        : [t("actions.noBlockers")];

  const customAction = investment.nextAction ?? investment.nextStep;
  const hasNamedUsCounterpart =
    !investment.partnerUs.includes("under registration") && !investment.partnerUs.includes("(");

  return {
    projectOwner:
      investment.projectOwner ??
      (investment.is_demo ? t("actions.ownerNeeded") : investment.partnerUz || t("actions.ownerToConfirm")),
    counterpart: investment.governmentCounterpart ?? investment.partnerUz,
    stage: isEnglish && investment.stageDetail ? investment.stageDetail : t(`statuses.${investment.status}`),
    nextAction: isEnglish && customAction ? customAction : t(`actions.status.${investment.status}`),
    blockers,
    usCompanyRelevance:
      isEnglish && investment.usCompanyRelevance
        ? investment.usCompanyRelevance
        : hasNamedUsCounterpart
          ? t("actions.usRelevance.counterpart", { partner: investment.partnerUs })
          : t("actions.usRelevance.confirm"),
    quoteSafe: base.quoteSafe,
    publicationGuidance: sourceBacked
      ? t("actions.publication.verified")
      : investment.is_demo
        ? t("actions.publication.demo")
        : t("actions.publication.internal"),
  };
}
