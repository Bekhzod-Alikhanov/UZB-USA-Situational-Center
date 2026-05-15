// Server component — formerly a client-side filter UI with useState. Now
// driven by a `?q=` URL search param so the directory + filter form
// render in initial HTML, no JS needed.
//
// Result: ~40 KB of client JS (Lucide icons + state) removed from
// /contacts. Per Wave 2.4 of the perf plan.
import { contacts, type Contact } from "@/data/contacts";
import { cn } from "@/lib/utils";
import { Mail, MapPin, Phone, ExternalLink, Users, Search } from "lucide-react";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { getTranslations } from "next-intl/server";

const TYPE_TONE: Record<Contact["type"], string> = {
  hq: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  "embassy-uz-in-us": "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  "embassy-us-in-uz": "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  chamber: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  "gov-agency": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  council: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
};

interface Props {
  locale: string;
  q?: string;
}

export async function ContactsView({ locale, q = "" }: Props) {
  const t = await getTranslations({ locale, namespace: "contacts.view" });
  const filtered = q
    ? contacts.filter((c) => {
        const s = q.toLowerCase();
        if (c.org.toLowerCase().includes(s)) return true;
        if (c.addressLines.some((a) => a.toLowerCase().includes(s))) return true;
        if (c.people?.some((p) => p.name.toLowerCase().includes(s) || p.role.toLowerCase().includes(s))) return true;
        return false;
      })
    : contacts;

  return (
    <div className="flex flex-col gap-4">
      <form method="get" action={`/${locale}/contacts`} className="flex flex-wrap items-center gap-2">
        <label className="flex flex-1 items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={q}
            aria-label={t("searchAria")}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>
        <button
          type="submit"
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]"
        >
          {t("submit")}
        </button>
        {q ? (
          <a
            href={`/${locale}/contacts`}
            className="rounded-md px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]"
          >
            {t("clear")}
          </a>
        ) : null}
      </form>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <article
            key={c.id}
            className="flex flex-col gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                  TYPE_TONE[c.type],
                )}
              >
                {t(`types.${c.type}`)}
              </span>
              {c.is_demo ? <DemoBadge /> : null}
            </div>
            <h2 className="serif text-[15px] font-medium leading-snug text-[var(--color-ink)]">{c.org}</h2>

            <div className="flex items-start gap-1.5 text-[11.5px] text-[var(--color-ink-muted)]">
              <MapPin className="mt-0.5 size-3 shrink-0" />
              <div className="leading-relaxed">
                {c.addressLines.map((a, i) => (
                  <div key={i}>{a}</div>
                ))}
              </div>
            </div>

            {c.phones?.length ? (
              <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-muted)]">
                <Phone className="size-3" />
                <span className="mono tabular">{c.phones.join(" · ")}</span>
              </div>
            ) : null}

            {c.emails?.length ? (
              <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-muted)]">
                <Mail className="size-3" />
                <span className="mono">{c.emails.join(" · ")}</span>
              </div>
            ) : null}

            {c.web ? (
              <a
                href={c.web}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[var(--color-primary)] hover:underline"
              >
                <ExternalLink className="size-3" />
                {c.web.replace("https://", "")}
              </a>
            ) : null}

            {c.people?.length ? (
              <div className="mt-1 border-t border-[var(--color-border)] pt-2">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  <Users className="size-3" />
                  {c.type === "council" ? t("councilMembers") : t("staff")} · {c.people.length}
                </div>
                <ul className="flex flex-col gap-0.5 text-[11.5px]">
                  {c.people.slice(0, c.type === "council" ? 13 : 4).map((p) => (
                    <li key={p.name} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5">
                        {p.side ? (
                          <span
                            className={cn(
                              "mono inline-flex h-4 items-center rounded px-1 text-[9px] font-semibold uppercase tracking-wider",
                              p.side === "uz"
                                ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                                : "bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
                            )}
                          >
                            {p.side}
                          </span>
                        ) : null}
                        <span className={cn("text-[var(--color-ink)]", p.is_demo && "demo-underline")}>{p.name}</span>
                      </span>
                      <span className="truncate text-right text-[var(--color-ink-muted)]">{p.role}</span>
                    </li>
                  ))}
                  {c.type !== "council" && c.people.length > 4 ? (
                    <li className="text-[10.5px] text-[var(--color-ink-faint)]">
                      {t("more", { count: c.people.length - 4 })}
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {c.sourceId ? (
              <div className="border-t border-[var(--color-border)] pt-2">
                <SourceBadge sourceId={c.sourceId} />
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-[12px] text-[var(--color-ink-muted)]">
          {t("empty")}
        </div>
      ) : null}
    </div>
  );
}
