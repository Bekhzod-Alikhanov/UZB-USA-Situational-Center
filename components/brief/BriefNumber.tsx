"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { intlLocale } from "@/components/brief/brief-data";

/**
 * Locale-aware count-up for the /brief exhibition numbers.
 * Modeled on components/overview/CountUpValue (IntersectionObserver + rAF +
 * easeOutCubic + reduced-motion snap + SSR final value) but formats through
 * Intl.NumberFormat(locale) on every frame — the overview component hardcodes
 * en-US, and the brief demo runs primarily in Russian (space separators,
 * decimal comma). Fixed fraction digits per frame prevent jumping digits.
 */
interface BriefNumberProps {
  value: number;
  /** Fraction digits, fixed for the whole animation. Default 0. */
  decimals?: number;
  prefix?: string;
  suffix?: ReactNode;
  durationMs?: number;
  className?: string;
}

export function BriefNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix,
  durationMs = 1300,
  className,
}: BriefNumberProps) {
  const locale = useLocale();
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(intlLocale(locale), {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [locale, decimals],
  );
  // Initialise to the final value: SSR markup and the reduced-motion path
  // both show the real number with no flash of zero.
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(value * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
        else setDisplay(value);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatter.format(display)}
      {suffix}
    </span>
  );
}
