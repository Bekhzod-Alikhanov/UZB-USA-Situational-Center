import { agreementsAggregate } from "@/data/agreements";

const LABELS: Record<string, string> = {
  interstate: "Interstate",
  intergov: "Intergovernmental",
  interagency: "Inter-agency",
  other: "Other",
  invest: "Investment",
};

export function AgreementsStats() {
  const { totalDocuments, totalInvestAgreements, byCategory } = agreementsAggregate;
  const entries = Object.entries(byCategory) as Array<[keyof typeof byCategory, number]>;
  const max = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <HeadStat label="Base documents" value={totalDocuments} hint="MFA registry" />
        <HeadStat label="Investment agreements" value={totalInvestAgreements} hint="MIIT registry" />
        <HeadStat label="Oldest in force" value="1992" hint="Establishment of relations" mono={false} />
        <HeadStat label="Most recent" value="2026-02-04" hint="Critical Minerals MoU" mono={false} />
      </div>

      <div>
        <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
          Category distribution
        </div>
        <div className="flex flex-col gap-1.5">
          {entries.map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="w-40 text-[12px] text-[var(--color-ink)]">{LABELS[k]}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${(v / max) * 100}%` }}
                />
              </div>
              <span className="mono w-12 text-right text-[12px] tabular text-[var(--color-ink-muted)]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeadStat({
  label,
  value,
  hint,
  mono = true,
}: {
  label: string;
  value: string | number;
  hint: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">{label}</div>
      <div className={`mt-1 text-[22px] font-semibold text-[var(--color-ink)] ${mono ? "mono tabular" : "serif"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">{hint}</div>
    </div>
  );
}
