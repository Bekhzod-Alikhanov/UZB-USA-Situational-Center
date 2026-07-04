import { getTranslations } from "next-intl/server";
import { attentionRows, intlLocale, parseDay } from "@/components/brief/brief-data";
import { localizedCommitmentTitle } from "@/lib/i18n/overview-content";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";

/**
 * "Requires attention" — at most three triaged rows (overdue first, then
 * watch), quiet by design: a status dot and a due date, no table chrome.
 */
export async function AttentionList({ locale }: { locale: string }) {
  const t = await getTranslations("brief.attention");
  const rows = attentionRows(3);
  const day = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short" });

  return (
    <div className="brief-print-block mt-5 border-t border-[var(--brief-border)] pt-3.5">
      <h2 className="brief-eyebrow">{t("title")}</h2>
      <ul className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <li key={row.id} className="flex items-start gap-2.5">
            <span
              aria-hidden
              className="mt-[7px] inline-block size-2 shrink-0 rounded-full"
              style={{ background: row.status === "overdue" ? "var(--brief-neg)" : "var(--brief-accent)" }}
            />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] leading-snug text-[var(--brief-ink)]">
                {localizedCommitmentTitle(row.id, row.title, locale)} <DemoBadge variant="dot" className="ml-1" />
              </p>
              <p className="text-[11.5px] text-[var(--brief-ink-faint)]">
                {row.status === "overdue" ? t("overdue") : t("watch")} ·{" "}
                {t("due", { date: day.format(parseDay(row.dueDate)) })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
