"use client";
import { investments, type Investment, type InvestmentSector, type InvestmentStatus } from "@/data/investments";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Search, X, Briefcase, Factory, Plane, Wheat, Zap, Pill, Cpu, Shirt, FlaskConical, Banknote, Gem } from "lucide-react";
import dynamic from "next/dynamic";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

const FlatMap = dynamic(() => import("@/components/map/FlatMap").then((m) => m.FlatMap), { ssr: false });

const SECTOR_ICON: Record<InvestmentSector, React.ComponentType<{ className?: string }>> = {
  "mining-metals": Factory,
  "automotive": Briefcase,
  "aviation": Plane,
  "agri-food": Wheat,
  "energy": Zap,
  "pharma": Pill,
  "it-digital": Cpu,
  "textile": Shirt,
  "chemicals": FlaskConical,
  "finance": Banknote,
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

const SECTORS: InvestmentSector[] = [
  "mining-metals", "automotive", "aviation", "agri-food", "energy",
  "pharma", "it-digital", "textile", "chemicals", "finance", "minerals-rare-earth",
];

export function InvestmentsView() {
  const [sector, setSector] = useState<InvestmentSector | "all">("all");
  const [minValue, setMinValue] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Investment | null>(null);

  const filtered = useMemo(() => {
    return investments.filter((i) => {
      if (sector !== "all" && i.sector !== sector) return false;
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
  }, [sector, minValue, search]);

  const grouped = useMemo(() => {
    const m: Record<InvestmentStatus, Investment[]> = {
      mou: [], negotiation: [], agreed: [], construction: [], operating: [], paused: [],
    };
    for (const i of filtered) m[i.status].push(i);
    return m;
  }, [filtered]);

  const totalValue = filtered.reduce((a, i) => a + i.valueMusd, 0);
  const totalJobs = filtered.reduce((a, i) => a + (i.jobs ?? 0), 0);

  return (
    <Tabs.Root defaultValue="board" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs.List className="flex items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
          {[
            { v: "board", l: "Board" },
            { v: "table", l: "Table" },
            { v: "map", l: "Map" },
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
          value={sector}
          onChange={(e) => setSector(e.target.value as InvestmentSector | "all")}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[12px]"
        >
          <option value="all">All sectors</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s.replace("-", " / ")}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11.5px]">
          <span className="text-[var(--color-ink-muted)]">Min $M</span>
          <input
            type="number"
            min={0}
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value) || 0)}
            className="mono w-14 bg-transparent text-right outline-none tabular"
          />
        </div>

        <label className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or partner"
            className="w-56 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>

        <div className="ml-auto flex items-center gap-4 text-[11px] text-[var(--color-ink-muted)]">
          <ToolbarStat label="Projects" value={filtered.length.toString()} />
          <ToolbarStat label="Total" value={`$${(totalValue / 1000).toFixed(2)}B`} />
          <ToolbarStat label="Jobs" value={totalJobs.toLocaleString("en-US")} />
        </div>
      </div>

      <Tabs.Content value="board">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STATUS_ORDER.map((s) => (
            <Column key={s} status={s} items={grouped[s]} onOpen={setSelected} />
          ))}
        </div>
      </Tabs.Content>

      <Tabs.Content value="table">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th className="w-[160px]">Sector</th>
                <th className="w-[140px]">Region</th>
                <th className="w-[200px]">Partners</th>
                <th className="w-[84px] text-right">Value $M</th>
                <th className="w-[72px] text-right">Jobs</th>
                <th className="w-[108px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const Icon = SECTOR_ICON[i.sector];
                return (
                  <tr key={i.id} className="cursor-pointer" onClick={() => setSelected(i)}>
                    <td className="font-medium text-[var(--color-ink)]">{i.title}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-muted)]">
                        <Icon className="size-3.5 text-[var(--color-ink-faint)]" />
                        {i.sector.replace("-", " / ")}
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
                        {i.status}
                      </span>
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

      {/* Detail drawer */}
      <Dialog.Root open={!!selected} onOpenChange={(o) => (o ? null : setSelected(null))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed right-0 top-0 z-50 h-full w-[94vw] max-w-[520px] overflow-y-auto border-l border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            aria-describedby={undefined}
          >
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] pb-3">
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="serif text-[18px] font-medium text-[var(--color-ink)]">
                      {selected.title}
                    </Dialog.Title>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-ink-muted)]">
                      <span className="uppercase tracking-wider">{selected.sector.replace("-", " / ")}</span>
                      <span>·</span>
                      <span>{selected.region}</span>
                      <span>·</span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-wider",
                          STATUS_TONE[selected.status],
                        )}
                      >
                        {selected.status}
                      </span>
                    </div>
                  </div>
                  <Dialog.Close className="rounded p-1 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]">
                    <X className="size-4" />
                  </Dialog.Close>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4">
                  <KV label="Value" value={`$${selected.valueMusd}M`} mono />
                  <KV label="Jobs" value={selected.jobs ? selected.jobs.toLocaleString() : "—"} mono />
                  <KV
                    label="Timeline"
                    value={`${selected.startYear}${selected.expectedCompletion ? ` → ${selected.expectedCompletion}` : ""}`}
                    mono
                  />
                </div>

                <div className="mt-5">
                  <div className="stat-label">U.S. partner</div>
                  <div className="mt-1 text-[14px] text-[var(--color-ink)]">{selected.partnerUs}</div>
                </div>
                <div className="mt-4">
                  <div className="stat-label">UZ partner</div>
                  <div className="mt-1 text-[14px] text-[var(--color-ink)]">{selected.partnerUz}</div>
                </div>

                {selected.sourceId ? (
                  <div className="mt-5">
                    <div className="stat-label mb-1.5">Source</div>
                    <SourceBadge sourceId={selected.sourceId} variant="chip" />
                  </div>
                ) : null}

                {selected.source_note ? (
                  <div className="mt-5 rounded-md border border-[var(--color-border)] bg-[var(--color-demo-bg)] p-3 text-[12px] text-[var(--color-demo-ink)]">
                    <span className="font-semibold">DEMO.</span> {selected.source_note}
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

/** Compact in-toolbar stat — smaller than the section-header `<Stat>`. */
function ToolbarStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
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

function Column({
  status,
  items,
  onOpen,
}: {
  status: InvestmentStatus;
  items: Investment[];
  onOpen: (i: Investment) => void;
}) {
  const total = items.reduce((a, i) => a + i.valueMusd, 0);
  return (
    <div className="flex min-w-[220px] shrink-0 flex-col gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 xl:min-w-[240px]">
      <div className="flex items-center justify-between px-1 pb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink)]">{status}</span>
        <span className="mono text-[10px] tabular text-[var(--color-ink-muted)]">
          {items.length} · ${(total / 1000).toFixed(1)}B
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((i) => {
          const Icon = SECTOR_ICON[i.sector];
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => onOpen(i)}
              className="flex flex-col gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-left transition hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-hover)]"
            >
              <div className="text-[12.5px] font-medium leading-snug text-[var(--color-ink)]">{i.title}</div>
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
          <div className="py-4 text-center text-[10.5px] text-[var(--color-ink-faint)]">—</div>
        ) : null}
      </div>
    </div>
  );
}
