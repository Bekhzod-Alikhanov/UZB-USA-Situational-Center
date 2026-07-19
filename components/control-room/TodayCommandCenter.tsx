import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CalendarCheck2,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Compass,
  FileCheck2,
  FileText,
  Hourglass,
  Info,
  Map,
  MapPin,
  Medal,
  ShieldCheck,
  Star,
  TrendingDown,
  Truck,
  UserRound,
} from "lucide-react";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { intlLocale } from "@/components/brief/brief-data";

export interface TodayMetrics {
  asOf: string;
  today: string;
  tradeYear: number;
  tradeTurnoverMusd: number;
  tradeYoyPct: number;
  verifiedInvestmentMusd: number;
  pendingInvestmentMusd: number;
  roadmapProjects: number;
  roadmapDoneSteps: number;
  roadmapTotalSteps: number;
  roadmapOverdueSteps: number;
  roadmapDueSoonSteps: number;
  visitAgendaEntries: number;
  visitSourceArtifacts: number;
}

type Tone = "blue" | "cyan" | "green" | "gold" | "red";

const toneClasses: Record<Tone, { icon: string; chip: string; text: string; border: string }> = {
  blue: {
    icon: "border-[#2c73e8]/50 bg-[#123b78] text-[#a9c9ff]",
    chip: "border-[#347eea]/70 bg-[#0c326b] text-[#a9c9ff]",
    text: "text-[#80b0ff]",
    border: "hover:border-[#397fdb]/80",
  },
  cyan: {
    icon: "border-[#2ed1d3]/45 bg-[#0a5366] text-[#6aebe5]",
    chip: "border-[#32d1cb]/60 bg-[#073d4a] text-[#72e8e1]",
    text: "text-[#62ded8]",
    border: "hover:border-[#36c7c9]/75",
  },
  green: {
    icon: "border-[#35c996]/45 bg-[#0c4e45] text-[#68e0b7]",
    chip: "border-[#40d4a1]/60 bg-[#0a4036] text-[#79e6bf]",
    text: "text-[#63dbb2]",
    border: "hover:border-[#40c79c]/75",
  },
  gold: {
    icon: "border-[#f0ae1c]/55 bg-[#66470a] text-[#ffd15e]",
    chip: "border-[#eba916]/75 bg-[#4d3507] text-[#ffd15e]",
    text: "text-[#ffc94f]",
    border: "hover:border-[#dca11d]/80",
  },
  red: {
    icon: "border-[#ff665d]/55 bg-[#6f2225] text-[#ff9a92]",
    chip: "border-[#ff655b]/75 bg-[#541a1d] text-[#ff958d]",
    text: "text-[#ff8d84]",
    border: "hover:border-[#ef675f]/80",
  },
};

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatUsdMillions(value: number, locale: string) {
  return new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatUsdBillions(valueMusd: number, locale: string) {
  return new Intl.NumberFormat(intlLocale(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valueMusd / 1000);
}

function MetaItem({
  icon: Icon,
  label,
  value,
  tone = "blue",
}: {
  icon: typeof UserRound;
  label: string;
  value: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <Icon className={`mt-0.5 size-5 shrink-0 ${toneClasses[tone].text}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#8295ad]">{label}</div>
        <div className={`mt-0.5 min-w-0 truncate text-[12px] font-medium ${toneClasses[tone].text}`}>{value}</div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  tone,
  title,
  subtitle,
  badge,
  titleId,
}: {
  icon: typeof Star;
  tone: Tone;
  title: string;
  subtitle: string;
  badge?: string;
  titleId?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full border ${toneClasses[tone].icon}`}
          aria-hidden
        >
          <Icon className="size-[19px]" />
        </span>
        <div className="min-w-0">
          <h2 id={titleId} className="text-[18px] font-bold uppercase tracking-[0.12em] text-white sm:text-[20px]">
            {title}
          </h2>
          <p className="mt-1 text-[12.5px] leading-5 text-[#9fb0c5] sm:text-[13.5px]">{subtitle}</p>
        </div>
      </div>
      {badge ? (
        <span className="rounded-md border border-[#dfa817] bg-[#201b0c] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd25e] sm:text-[11px]">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export function TodayCommandCenter({ locale, metrics }: { locale: string; metrics: TodayMetrics }) {
  const t = useTranslations("today");
  const date = formatDate(metrics.today, locale);
  const asOf = formatDate(metrics.asOf, locale);
  const nextWeekDate = new Date(`${metrics.today}T12:00:00Z`);
  nextWeekDate.setUTCDate(nextWeekDate.getUTCDate() + 7);
  const nextWeek = formatDate(nextWeekDate.toISOString().slice(0, 10), locale);
  const pendingInvestment = formatUsdMillions(metrics.pendingInvestmentMusd, locale);

  const updates = [
    {
      number: 1,
      icon: ClipboardList,
      tone: "blue" as const,
      href: `/${locale}/trade`,
      title: t("updates.trade.title", { year: metrics.tradeYear }),
      detail: t("updates.trade.detail", {
        value: formatUsdMillions(metrics.tradeTurnoverMusd, locale),
        yoy: Math.abs(metrics.tradeYoyPct).toFixed(1),
      }),
      owner: t("owners.dataDesk"),
      due: t("notApplicable"),
      evidence: t("verified"),
      status: t("informed"),
      statusTone: "gold" as const,
      sourceId: "input_trade_stat_docx",
    },
    {
      number: 2,
      icon: ShieldCheck,
      tone: "cyan" as const,
      href: `/${locale}/investments`,
      title: t("updates.investment.title"),
      detail: t("updates.investment.detail", {
        verified: formatUsdBillions(metrics.verifiedInvestmentMusd, locale),
        pending: pendingInvestment,
      }),
      owner: t("owners.dataDesk"),
      due: t("notSet"),
      evidence: t("verified"),
      status: t("pendingReview"),
      statusTone: "gold" as const,
      sourceId: "tradegov_mining_2025",
    },
    {
      number: 3,
      icon: Map,
      tone: "red" as const,
      href: `/${locale}/roadmaps`,
      title: t("updates.roadmap.title"),
      detail: t("updates.roadmap.detail", { count: metrics.roadmapOverdueSteps }),
      owner: t("owners.roadmapRegister"),
      due: t("sourceRegister"),
      evidence: t("verified"),
      status: t("actionNeeded"),
      statusTone: "red" as const,
      sourceId: "input_roadmap_samarkand_docx",
    },
  ];

  const actions = [
    {
      number: 1,
      icon: AlertCircle,
      tone: "red" as const,
      title: t("actions.roadmaps.title"),
      detail: t("actions.roadmaps.detail", { count: metrics.roadmapOverdueSteps }),
      due: t("sourceRegister"),
      status: t("overdue"),
      href: `/${locale}/roadmaps`,
      sourceId: "input_roadmap_samarkand_docx",
    },
    {
      number: 2,
      icon: CheckCircle2,
      tone: "cyan" as const,
      title: t("actions.investment.title"),
      detail: t("actions.investment.detail", { value: pendingInvestment }),
      due: t("sourceNeeded"),
      status: t("pending"),
      href: `/${locale}/investments`,
      sourceId: "input_deep_review_docx",
    },
    {
      number: 3,
      icon: CalendarCheck2,
      tone: "blue" as const,
      title: t("actions.platform.title"),
      detail: t("actions.platform.detail"),
      due: formatDate("2026-07-15", locale),
      status: t("inReview"),
      href: `/${locale}/commitments`,
      sourceId: "gpd_protocol_2026",
    },
  ];

  const readiness = [
    {
      icon: CalendarRange,
      tone: "blue" as const,
      title: t("readiness.agenda"),
      state: t("readiness.previewOnly"),
      value: t("readiness.entries", { count: metrics.visitAgendaEntries }),
      href: `/${locale}/prepare`,
    },
    {
      icon: FileText,
      tone: "cyan" as const,
      title: t("readiness.materials"),
      state: t("readiness.verified"),
      value: t("readiness.artifacts", { count: metrics.visitSourceArtifacts }),
      href: `/${locale}/prepare`,
    },
    {
      icon: Medal,
      tone: "gold" as const,
      title: t("readiness.approvals"),
      state: t("sourceNeeded"),
      value: t("readiness.unavailable"),
      href: `/${locale}/prepare`,
    },
    {
      icon: AlertCircle,
      tone: "red" as const,
      title: t("readiness.risks"),
      state: t("sourceNeeded"),
      value: t("readiness.unavailable"),
      href: `/${locale}/prepare`,
    },
  ];

  return (
    <div className="today-command min-h-screen bg-[#031323] text-[#eaf2ff]">
      <a
        href="#today-main"
        className="sr-only z-[100] rounded bg-white px-4 py-3 text-[#06182b] focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        {t("skip")}
      </a>

      <header className="border-b border-[#23415c]/70 bg-[#041629]/95 px-4 py-4 sm:px-6 lg:px-7">
        <div className="mx-auto flex max-w-[1510px] flex-wrap items-center gap-3 sm:gap-4">
          <Link href={`/${locale}/today`} className="flex min-w-0 items-center gap-3" aria-label={t("brandAria")}>
            <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#3e85ea]/40 bg-[#1557b9] text-[12px] font-black tracking-[-0.04em] text-white shadow-[0_8px_28px_rgba(34,112,220,0.28)] sm:size-[56px] sm:text-[13px]">
              UZ·US
            </span>
            <span className="min-w-0 border-r border-[#29435d] pr-3 sm:pr-5">
              <span className="block truncate text-[17px] font-bold tracking-[-0.02em] text-white sm:text-[20px]">
                {t("brand")}
              </span>
              <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.17em] text-[#91a5bd] sm:text-[10.5px]">
                {t("center")}
              </span>
            </span>
          </Link>

          <div className="mr-auto min-w-[180px]">
            <div className="text-[17px] font-bold text-white sm:text-[20px]">{t("title")}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-[#91a5bd] sm:text-[11.5px]">
              <span className="size-1.5 rounded-full bg-[#52d6b0]" aria-hidden />
              <span>{t("dataState", { date: asOf })}</span>
              <Info className="size-3.5" aria-hidden />
            </div>
          </div>

          <Link
            href={`/${locale}/brief`}
            className="order-4 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#6cafff] bg-[#1753a9] px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_0_0_3px_rgba(68,143,245,0.18),0_10px_30px_rgba(20,83,169,0.35)] transition hover:bg-[#2063bf] focus-visible:outline-[#8fc0ff] sm:order-none sm:w-auto sm:text-[15px]"
          >
            <FileText className="size-5" aria-hidden />
            {t("openBrief")}
            <ChevronRight className="size-5" aria-hidden />
          </Link>

          <nav
            className="ml-auto flex rounded-lg border border-[#243e58] bg-[#07192b] p-1"
            aria-label={t("languageNav")}
          >
            {(["en", "uz-latn"] as const).map((itemLocale) => {
              const active = locale === itemLocale;
              return (
                <Link
                  key={itemLocale}
                  href={`/${itemLocale}/today`}
                  hrefLang={itemLocale === "en" ? "en" : "uz-Latn"}
                  aria-current={active ? "page" : undefined}
                  className={`grid min-h-11 min-w-12 place-items-center rounded-md px-3 text-[13px] font-semibold transition ${
                    active
                      ? "border border-[#d6e6f9] bg-[#10253c] text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                      : "text-[#8fa0b4] hover:bg-[#0d2238] hover:text-white"
                  }`}
                >
                  {itemLocale === "en" ? "EN" : "UZ"}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main id="today-main" className="mx-auto max-w-[1540px] px-4 pb-24 pt-4 sm:px-5 lg:px-5 lg:pb-0">
        <section aria-labelledby="situation-ribbon-heading">
          <h1 id="situation-ribbon-heading" className="sr-only">
            {t("title")}
          </h1>
          <div className="grid grid-cols-2 items-center gap-3 px-2 pb-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-5 sm:px-12">
            <div className="hidden h-px bg-[#60768d] sm:block" aria-hidden />
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#dce8f7] sm:text-[12px]">
                {t("ribbon.since")}
              </div>
              <div className="mt-1 text-[11px] tabular-nums text-[#99acc3] sm:text-[12.5px]">{asOf}</div>
            </div>
            <div className="hidden items-center gap-2 sm:flex" aria-hidden>
              <div className="h-px flex-1 bg-[#60768d]" />
              <ArrowRight className="size-4 text-[#788da4]" />
              <div className="h-px flex-1 bg-[#60768d]" />
            </div>
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white sm:text-[12px]">
                {t("ribbon.today")}
              </div>
              <div className="mt-1 text-[11px] tabular-nums text-[#b7c7da] sm:text-[12.5px]">{date}</div>
            </div>
            <div className="hidden items-center gap-2 sm:flex" aria-hidden>
              <div className="h-px flex-1 bg-[#60768d]" />
              <ArrowRight className="size-4 text-[#788da4]" />
              <div className="h-px flex-1 bg-[#60768d]" />
              <div className="ml-2 text-center">
                <div className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.16em] text-[#dce8f7]">
                  {t("ribbon.next")}
                </div>
                <div className="mt-1 whitespace-nowrap text-[12.5px] tabular-nums text-[#99acc3]">{nextWeek}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-3">
            {updates.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.number}
                  className={`min-h-[180px] rounded-xl border border-[#29445e] bg-[#071b2d]/95 p-3.5 shadow-[0_12px_34px_rgba(0,0,0,0.18)] transition ${toneClasses[item.tone].border} sm:p-4`}
                >
                  <Link href={item.href} className="group block">
                    <div className="flex items-start gap-3">
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border text-[15px] font-bold ${toneClasses[item.tone].chip}`}
                      >
                        {item.number}
                      </span>
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border ${toneClasses[item.tone].icon}`}
                        aria-hidden
                      >
                        <Icon className="size-[19px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16px] font-bold leading-5 text-white sm:text-[18px]">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[13px] leading-5 text-[#b5c1d0] sm:text-[14px]">
                          {item.detail}
                        </span>
                      </span>
                      <ChevronRight
                        className="mt-1 size-4 shrink-0 text-[#7792ae] transition group-hover:translate-x-0.5 group-hover:text-white"
                        aria-hidden
                      />
                    </div>
                  </Link>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#29445e] pt-3 sm:grid-cols-4">
                    <MetaItem icon={UserRound} label={t("owner")} value={item.owner} />
                    <MetaItem icon={CalendarDays} label={t("due")} value={item.due} />
                    <MetaItem
                      icon={BadgeCheck}
                      label={t("evidence")}
                      tone="green"
                      value={
                        <span className="inline-flex max-w-full items-center gap-1 text-[10px] tracking-tight">
                          <SourceBadge
                            sourceId={item.sourceId}
                            variant="mark"
                            className="!shrink-0 !border-[#34516d] !bg-[#0b2238] !px-1 !text-[#9fb5cd]"
                          />
                          <span className="truncate">{item.evidence}</span>
                        </span>
                      }
                    />
                    <MetaItem
                      icon={item.statusTone === "red" ? AlertCircle : Hourglass}
                      label={t("status")}
                      value={item.status}
                      tone={item.statusTone}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-3 grid gap-3 xl:grid-cols-[1.04fr_1fr]">
          <section
            className="rounded-xl border border-[#29445e] bg-[#06192a]/95 shadow-[0_16px_38px_rgba(0,0,0,0.2)]"
            aria-labelledby="leadership-attention-title"
          >
            <SectionTitle
              icon={Star}
              tone="gold"
              titleId="leadership-attention-title"
              title={t("leadership.title")}
              subtitle={t("leadership.subtitle")}
            />
            <div className="space-y-2 px-3 sm:px-4">
              {actions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.number}
                    href={item.href}
                    className={`group grid min-h-[76px] grid-cols-[38px_42px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-[#29445e] bg-[#0a2034] px-2.5 py-2 transition ${toneClasses[item.tone].border} sm:grid-cols-[42px_46px_minmax(0,1fr)_82px_88px] sm:gap-3 sm:px-3`}
                  >
                    <span
                      className={`grid size-9 place-items-center rounded-full border text-[15px] font-bold ${toneClasses[item.tone].chip}`}
                    >
                      {item.number}
                    </span>
                    <span
                      className={`grid size-9 place-items-center rounded-full border ${toneClasses[item.tone].icon}`}
                      aria-hidden
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-bold text-white sm:text-[17px]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-[#a8b7c9] sm:text-[12.5px]">
                        {item.detail}
                      </span>
                    </span>
                    <span className="hidden text-[10px] text-[#8fa1b5] sm:block">
                      <span className="flex items-center gap-1">
                        {t("due")}
                        <SourceBadge
                          sourceId={item.sourceId}
                          variant="mark"
                          className="!shrink-0 !border-[#34516d] !bg-[#0b2238] !px-1 !text-[#8fa8c1]"
                        />
                      </span>
                      <span className="mt-1 block text-[11px] tabular-nums text-[#c1cede]">{item.due}</span>
                    </span>
                    <span
                      className={`rounded-md border px-2.5 py-2 text-center text-[11px] font-semibold ${toneClasses[item.tone].chip}`}
                    >
                      {item.status}
                    </span>
                  </Link>
                );
              })}
            </div>
            <Link
              href={`/${locale}/commitments`}
              className="group flex min-h-11 items-center gap-2 px-5 text-[12.5px] font-medium text-[#77adff] transition hover:text-white"
            >
              {t("leadership.viewAll")}
              <ChevronRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </section>

          <section
            className="rounded-xl border border-[#29445e] bg-[#06192a]/95 shadow-[0_16px_38px_rgba(0,0,0,0.2)]"
            aria-labelledby="visit-readiness-title"
          >
            <SectionTitle
              icon={MapPin}
              tone="cyan"
              titleId="visit-readiness-title"
              title={t("readiness.title")}
              subtitle={t("readiness.subtitle")}
              badge={t("demoSourceNeeded")}
            />
            <div className="space-y-2 px-3 sm:px-4">
              {readiness.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`group grid min-h-[58px] grid-cols-[42px_minmax(0,1fr)_auto_18px] items-center gap-3 rounded-lg border border-[#29445e] bg-[#0a2034] px-3 py-2 transition ${toneClasses[item.tone].border} sm:grid-cols-[46px_minmax(0,1fr)_140px_100px_18px]`}
                  >
                    <span
                      className={`grid size-9 place-items-center rounded-full border ${toneClasses[item.tone].icon}`}
                      aria-hidden
                    >
                      <Icon className="size-[19px]" />
                    </span>
                    <span className="truncate text-[14px] font-bold text-white sm:text-[16px]">{item.title}</span>
                    <span
                      className={`hidden items-center gap-2 text-[12px] font-medium sm:flex ${toneClasses[item.tone].text}`}
                    >
                      {item.tone === "cyan" ? (
                        <Check className="size-4" aria-hidden />
                      ) : (
                        <Info className="size-4" aria-hidden />
                      )}
                      {item.state}
                    </span>
                    <span className="whitespace-nowrap text-right text-[12px] tabular-nums text-[#c4cfdd]">
                      {item.value}
                    </span>
                    <ChevronRight
                      className="size-4 text-[#91a4b9] transition group-hover:translate-x-0.5 group-hover:text-white"
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </div>
            <Link
              href={`/${locale}/prepare`}
              className="group flex min-h-11 items-center gap-2 px-5 text-[12.5px] font-medium text-[#77adff] transition hover:text-white"
            >
              {t("readiness.openWorkspace")}
              <ChevronRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </section>
        </div>

        <section
          className="mt-3 rounded-xl border border-[#29445e] bg-[#06192a]/95 shadow-[0_18px_42px_rgba(0,0,0,0.22)]"
          aria-labelledby="baseline-title"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-2 pt-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="size-6 text-[#75aaff]" aria-hidden />
              <h2
                id="baseline-title"
                className="text-[17px] font-bold uppercase tracking-[0.12em] text-white sm:text-[19px]"
              >
                {t("baseline.title")}
              </h2>
            </div>
            <p className="text-[10.5px] font-medium text-[#7890a8]">{t("governanceShort")}</p>
          </div>
          <div className="grid divide-y divide-[#29445e] px-4 pb-3 lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:px-0">
            <div className="grid grid-cols-[62px_1fr] gap-4 px-1 py-4 sm:grid-cols-[72px_1fr] sm:px-5">
              <span
                className="grid size-[62px] place-items-center rounded-full border-2 border-[#2364bc] bg-[#0b2a55] text-[#75aaff] sm:size-[68px]"
                aria-hidden
              >
                <TrendingDown className="size-8" />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] text-[#aebccd] sm:text-[13px]">
                  {t("baseline.trade", { year: metrics.tradeYear })}
                </div>
                <div className="mt-1 text-[34px] font-semibold leading-none tracking-[0.01em] text-white tabular-nums sm:text-[46px]">
                  ${formatUsdMillions(metrics.tradeTurnoverMusd, locale)}M
                </div>
                <div className="mt-2 text-[13px] text-[#b7c4d2]">
                  <span className="font-semibold text-[#ff8279]">{metrics.tradeYoyPct.toFixed(1)}%</span>{" "}
                  {t("baseline.yoy")}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-[#869ab1]">
                  <SourceBadge
                    sourceId="input_trade_stat_docx"
                    variant="mark"
                    className="!border-[#34516d] !bg-[#0b2238] !px-1 !text-[#9fb5cd]"
                  />
                  <span>{t("sources.trade")}</span>
                  <span>{t("period", { value: metrics.tradeYear })}</span>
                  <span>·</span>
                  <span className="text-[#61d9b0]">{t("verifiedOfficial")}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[62px_1fr] gap-4 px-1 py-4 sm:grid-cols-[72px_1fr] sm:px-5">
              <span
                className="grid size-[62px] place-items-center rounded-full border-2 border-[#177f7c] bg-[#0b393f] text-[#62ded8] sm:size-[68px]"
                aria-hidden
              >
                <ShieldCheck className="size-8" />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] text-[#aebccd] sm:text-[13px]">{t("baseline.investment")}</div>
                <div className="mt-1 text-[34px] font-semibold leading-none tracking-[0.01em] text-white tabular-nums sm:text-[46px]">
                  ${formatUsdBillions(metrics.verifiedInvestmentMusd, locale)}B
                </div>
                <div className="mt-2 text-[12px] text-[#a9b8c9]">
                  +${pendingInvestment}M {t("baseline.pendingVerification")}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-[#869ab1]">
                  <SourceBadge
                    sourceId="tradegov_mining_2025"
                    variant="mark"
                    className="!border-[#34516d] !bg-[#0b2238] !px-1 !text-[#9fb5cd]"
                  />
                  <span>{t("sources.investment")}</span>
                  <span>{t("publication", { date: asOf })}</span>
                  <span>·</span>
                  <span className="text-[#61d9b0]">{t("verifiedOfficial")}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[62px_1fr] gap-4 px-1 py-4 sm:grid-cols-[72px_1fr] sm:px-5">
              <span
                className="grid size-[62px] place-items-center rounded-full border-2 border-[#2364bc] bg-[#0b2a55] text-[#75aaff] sm:size-[68px]"
                aria-hidden
              >
                <Truck className="size-8" />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] text-[#aebccd] sm:text-[13px]">{t("baseline.delivery")}</div>
                <div className="mt-1 flex flex-wrap items-end gap-x-6 gap-y-2">
                  <div>
                    <span className="text-[40px] font-semibold leading-none text-white tabular-nums sm:text-[48px]">
                      {metrics.roadmapProjects}
                    </span>
                    <span className="ml-2 text-[12px] text-[#aab8c9]">{t("baseline.projects")}</span>
                  </div>
                  <div className="space-y-1 border-l border-[#34516d] pl-5 text-[12px]">
                    <div className="flex items-center gap-2 text-white">
                      <CheckCircle2 className="size-5 text-[#58d8b0]" aria-hidden />
                      <strong className="text-[15px] tabular-nums">
                        {metrics.roadmapDoneSteps} / {metrics.roadmapTotalSteps}
                      </strong>
                      <span className="text-[#aab8c9]">{t("baseline.complete")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <AlertCircle className="size-5 text-[#ff837a]" aria-hidden />
                      <strong className="text-[15px] tabular-nums">{metrics.roadmapOverdueSteps}</strong>
                      <span className="text-[#aab8c9]">{t("baseline.overdue")}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-[#869ab1]">
                  <SourceBadge
                    sourceId="input_roadmap_samarkand_docx"
                    variant="mark"
                    className="!border-[#34516d] !bg-[#0b2238] !px-1 !text-[#9fb5cd]"
                  />
                  <SourceBadge
                    sourceId="input_roadmap_khorezm_docx"
                    variant="mark"
                    className="!border-[#34516d] !bg-[#0b2238] !px-1 !text-[#9fb5cd]"
                  />
                  <span>{t("sources.roadmaps")}</span>
                  <span>{t("publication", { date: asOf })}</span>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/${locale}`}
            className="group flex min-h-[49px] items-center justify-center gap-3 border-t border-[#223e58] text-[14px] font-medium text-[#79adff] transition hover:bg-[#0a2034] hover:text-white"
          >
            <Compass className="size-5" aria-hidden />
            {t("openIntelligence")}
            <ChevronRight className="size-5 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </section>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-[#29445e] bg-[#06182a]/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden"
        aria-label={t("mobileNav.label")}
      >
        {[
          { label: t("mobileNav.today"), icon: Circle, href: `/${locale}/today`, active: true },
          { label: t("mobileNav.visits"), icon: CalendarRange, href: `/${locale}/prepare`, active: false },
          { label: t("mobileNav.delivery"), icon: FileCheck2, href: `/${locale}/commitments`, active: false },
          { label: t("mobileNav.explore"), icon: Compass, href: `/${locale}`, active: false },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium ${
                item.active ? "bg-[#12345c] text-[#9bc4ff]" : "text-[#8ba0b8]"
              }`}
            >
              <Icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
