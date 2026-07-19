import type { CSSProperties, ReactNode } from "react";
import type { SectionTone } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const TONE_VAR: Record<SectionTone, string> = {
  trade: "var(--color-trade)",
  visits: "var(--color-visits)",
  invest: "var(--color-invest)",
  agree: "var(--color-agree)",
  people: "var(--color-people)",
  rose: "var(--color-rose)",
  slate: "var(--color-slate)",
  primary: "var(--color-primary)",
};

export function PublicPageIntro({
  eyebrow,
  title,
  subtitle,
  icon,
  tone = "primary",
  actions,
  stats,
  meta,
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  icon: ReactNode;
  tone?: SectionTone;
  actions?: ReactNode;
  stats?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  const style = { "--page-tone": TONE_VAR[tone] } as CSSProperties;

  return (
    <header
      style={style}
      className={cn(
        "public-page-intro relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-5 shadow-[var(--shadow-card-elevated)] sm:px-6 sm:py-6 lg:px-8 lg:py-7",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--page-tone)] via-[var(--color-primary)] to-[var(--color-people)]"
      />
      <div
        aria-hidden
        className="absolute -right-20 -top-28 size-72 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--page-tone)" }}
      />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 items-start gap-3.5 sm:gap-5">
          <span
            aria-hidden
            className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl border sm:size-13"
            style={{
              color: "var(--page-tone)",
              borderColor: "color-mix(in oklab, var(--page-tone) 28%, transparent)",
              background: "color-mix(in oklab, var(--page-tone) 12%, var(--color-surface))",
              boxShadow: "0 10px 28px color-mix(in oklab, var(--page-tone) 13%, transparent)",
            }}
          >
            {icon}
          </span>
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-ink-muted)] sm:text-xs">
              <span className="size-1.5 rounded-full bg-[var(--page-tone)]" aria-hidden />
              {eyebrow}
            </div>
            <h1 className="serif max-w-5xl text-[32px] font-medium leading-[0.98] tracking-[-0.025em] text-[var(--color-ink)] sm:text-[40px] lg:text-[48px]">
              {title}
            </h1>
            <p className="mt-3 max-w-[75ch] text-[14px] leading-6 text-[var(--color-ink-muted)] sm:text-[15px] sm:leading-7">
              {subtitle}
            </p>
            {meta ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--color-ink-muted)]">{meta}</div>
            ) : null}
          </div>
        </div>

        {actions || stats ? (
          <div className="flex shrink-0 flex-col gap-3 border-t border-[var(--color-border)] pt-4 xl:max-w-[48%] xl:items-end xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
            {stats ? <div className="flex w-full flex-wrap items-stretch gap-3 xl:justify-end">{stats}</div> : null}
            {actions ? <div className="flex flex-wrap items-center gap-2 xl:justify-end">{actions}</div> : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
