"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface CountUpValueProps {
  /** Final numeric value. */
  value: number;
  /** Literal text rendered before the number (e.g. "$" or "−$"). */
  prefix?: string;
  /** JSX rendered after the number (e.g. a styled unit suffix). */
  suffix?: ReactNode;
  /** Fixed decimal places. When omitted, derived from `value` so the final
   *  render matches the source number's natural precision exactly. */
  decimals?: number;
  /** Group thousands with en-US separators (default true). */
  group?: boolean;
  /** Animation duration in ms (default 900). */
  durationMs?: number;
  className?: string;
}

/** Decimal places of a number (capped at 3), so the final render matches the
 *  source value's own precision rather than forcing an arbitrary rounding. */
function decimalsOf(n: number) {
  if (Number.isInteger(n)) return 0;
  const s = String(n);
  const i = s.indexOf(".");
  return i === -1 ? 0 : Math.min(3, s.length - i - 1);
}

function formatNumber(n: number, decimals: number, group: boolean) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: group,
  });
}

/**
 * Animated count-up for headline KPI numbers. Renders the final value during
 * SSR and for users who prefer reduced motion (so there is never a no-JS or
 * accessibility regression); otherwise eases 0 → value once the element
 * scrolls into view. A restrained, executive-grade "wow" moment.
 */
export function CountUpValue({
  value,
  prefix = "",
  suffix,
  decimals,
  group = true,
  durationMs = 900,
  className,
}: CountUpValueProps) {
  const dec = decimals ?? decimalsOf(value);
  // Initialise to the final value: SSR markup and the reduced-motion path both
  // show the real number with no flash of zero.
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Honor reduced-motion: snap to the final value, no animation.
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
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
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
      {formatNumber(display, dec, group)}
      {suffix}
    </span>
  );
}
