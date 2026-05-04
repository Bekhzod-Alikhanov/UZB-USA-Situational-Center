import { Banknote, Building2, Gem, Zap, Wheat, HeartPulse, Cpu, Plane, Lightbulb } from "lucide-react";
import { sectorOpportunities, type SectorIcon } from "@/data/sectors";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

const ICON_MAP: Record<SectorIcon, React.ComponentType<{ className?: string }>> = {
  banking: Banknote,
  privatization: Building2,
  minerals: Gem,
  energy: Zap,
  agri: Wheat,
  health: HeartPulse,
  it: Cpu,
  tourism: Plane,
};

const TONE_MAP: Record<SectorIcon, string> = {
  banking: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  privatization: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  minerals: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  energy: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  agri: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  health: "bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  it: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  tourism: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
};

/**
 * Sector opportunity cards — eight briefing-quality summaries of where US-UZ
 * cooperation has the most leverage. Server component; no interactivity needed
 * because the value is the curated content, not the controls.
 */
export function SectorsView() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
      {sectorOpportunities.map((s) => {
        const Icon = ICON_MAP[s.icon];
        return (
          <article
            key={s.id}
            className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-border-strong)]"
          >
            <header className="flex items-start gap-3">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-md ${TONE_MAP[s.icon]}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="serif text-[16px] font-medium leading-snug tracking-tight text-[var(--color-ink)]">
                  {s.sector}
                </h3>
              </div>
              <SourceBadge sourceId={s.sourceId} />
            </header>

            <dl className="flex flex-col gap-2.5 text-[12.5px] leading-relaxed">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                  Signal
                </dt>
                <dd className="mt-0.5 text-[var(--color-ink)]">{s.signal}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                  Why it matters
                </dt>
                <dd className="mt-0.5 text-[var(--color-ink-muted)]">{s.whyItMatters}</dd>
              </div>
              <div className="rounded-md border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] px-3 py-2">
                <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-warn)]">
                  <Lightbulb className="size-3" />
                  Next question
                </dt>
                <dd className="mt-0.5 text-[var(--color-ink)]">{s.nextQuestion}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}
