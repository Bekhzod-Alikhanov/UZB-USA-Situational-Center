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

const DECISION_MATRIX: Record<
  string,
  {
    usFit: "High" | "Medium" | "Source needed";
    readiness: "High" | "Medium" | "Needs project register";
    risk: "Low" | "Medium" | "High" | "Source needed";
    nextAction: string;
  }
> = {
  "sector-banking-capital-markets": {
    usFit: "High",
    readiness: "Medium",
    risk: "Medium",
    nextAction: "Identify bank/IPO candidates and data-room owners.",
  },
  "sector-privatization-soe": {
    usFit: "High",
    readiness: "Needs project register",
    risk: "Source needed",
    nextAction: "Load source-backed privatization asset records.",
  },
  "sector-critical-minerals": {
    usFit: "High",
    readiness: "Medium",
    risk: "High",
    nextAction: "Screen reserve, ESG, offtake, and financing readiness.",
  },
  "sector-green-energy": {
    usFit: "High",
    readiness: "Medium",
    risk: "Medium",
    nextAction: "Map projects to EXIM/DFC/private investor fit.",
  },
  "sector-agri-food": {
    usFit: "Medium",
    readiness: "High",
    risk: "Medium",
    nextAction: "Prioritize regions with supplier and logistics capacity.",
  },
  "sector-health-pharma": {
    usFit: "Medium",
    readiness: "Needs project register",
    risk: "Medium",
    nextAction: "Connect tenders, approvals, and hospital-system demand.",
  },
  "sector-it-digital": {
    usFit: "High",
    readiness: "Medium",
    risk: "Medium",
    nextAction: "Separate startup, cloud, AI, and e-government lanes.",
  },
  "sector-tourism-people": {
    usFit: "Medium",
    readiness: "Medium",
    risk: "Low",
    nextAction: "Track routes, universities, and tourism service partners.",
  },
};

/**
 * Sector opportunity cards — eight briefing-quality summaries of where US-UZ
 * cooperation has the most leverage. Server component; no interactivity needed
 * because the value is the curated content, not the controls.
 */
export function SectorsView({ locale = "en" }: { locale?: string }) {
  const read =
    locale === "ru"
      ? {
          label: "Что это означает: ",
          text: "Это направляющий слой приоритизации на основе существующих секторных записей. Он не заменяет проектные данные с источниками; он помогает понять, какие сектора первыми требуют проектных записей, работы с инвесторами и проверки узких мест.",
        }
      : locale === "uz-latn"
        ? {
            label: "Bu nimani anglatadi: ",
            text: "Bu mavjud soha yozuvlari asosidagi yo‘naltiruvchi ustuvorlik qatlami. U manbaga ega loyiha ma’lumotlarini almashtirmaydi; qaysi sohalarga birinchi navbatda loyiha yozuvlari, investorlar bilan aloqa va to‘siqlar tahlili kerakligini ko‘rsatadi.",
          }
        : {
            label: "What this means: ",
            text: "This is a directional prioritization layer built from existing sector records. It does not replace source-backed project data; it helps users decide which sectors need project records, investor outreach, and bottleneck review first.",
          };

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="table">
          <caption className="sr-only">
            Sector opportunity matrix comparing U.S. company fit, readiness, risk, and recommended next action.
          </caption>
          <thead>
            <tr>
              <th scope="col">Sector</th>
              <th scope="col">U.S. fit</th>
              <th scope="col">Readiness</th>
              <th scope="col">Risk</th>
              <th scope="col">Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {sectorOpportunities.map((s) => {
              const matrix = DECISION_MATRIX[s.id];
              return (
                <tr key={s.id}>
                  <td className="font-medium text-[var(--color-ink)]">{s.sector}</td>
                  <td>{matrix.usFit}</td>
                  <td>{matrix.readiness}</td>
                  <td>{matrix.risk}</td>
                  <td className="max-w-[340px] text-[12px] text-[var(--color-ink-muted)]">{matrix.nextAction}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        <span className="font-semibold text-[var(--color-ink)]">{read.label}</span>
        {read.text}
      </div>

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
                  <h2 className="serif text-[16px] font-medium leading-snug tracking-tight text-[var(--color-ink)]">
                    {s.sector}
                  </h2>
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
    </div>
  );
}
