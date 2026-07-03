import { getTranslations } from "next-intl/server";
import { countByStatus, commitments } from "@/data/commitments";
import { commitmentsAvgProgress } from "@/components/brief/brief-data";
import { BriefNumber } from "@/components/brief/BriefNumber";

/**
 * Aggregated commitments execution for /brief: one segmented scale
 * (done / in motion / overdue — the three states leadership reads at a
 * glance) plus an animated average-completion figure. The register itself is
 * workflow data (is_demo across the board) — the parent panel head carries
 * the gated DemoBadge.
 */
export async function CommitmentsBar() {
  const t = await getTranslations("brief.commitments");
  const counts = countByStatus();
  const total = commitments.length;
  const inMotion = counts.progress + counts.watch;
  const avg = commitmentsAvgProgress();

  const segments = [
    { key: "done", value: counts.done, color: "var(--brief-pos)", label: t("done") },
    { key: "inMotion", value: inMotion, color: "var(--brief-accent)", label: t("inProgress") },
    { key: "overdue", value: counts.overdue, color: "var(--brief-neg)", label: t("overdue") },
  ].filter((s) => s.value > 0);

  return (
    <div className="brief-print-block">
      <div className="flex items-baseline gap-2">
        <span className="brief-kpi-value !mt-0">
          <BriefNumber value={avg} decimals={0} suffix="%" />
        </span>
        <span className="text-[12.5px] text-[var(--brief-ink-muted)]">{t("completion", { total })}</span>
      </div>
      <div
        className="mt-4 flex h-[10px] w-full gap-px overflow-hidden rounded-full"
        role="img"
        aria-label={t("scaleAria", { done: counts.done, inMotion, overdue: counts.overdue })}
      >
        {segments.map((s) => (
          <span key={s.key} className="h-full" style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[var(--brief-ink-muted)]">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: s.color }} />
            {s.label} · {s.value}
          </li>
        ))}
      </ul>
      {counts.watch > 0 ? (
        <p className="mt-1.5 text-[11.5px] text-[var(--brief-ink-faint)]">{t("watchNote", { watch: counts.watch })}</p>
      ) : null}
    </div>
  );
}
