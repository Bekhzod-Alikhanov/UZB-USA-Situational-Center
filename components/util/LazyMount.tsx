"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  /** IntersectionObserver rootMargin — how far from viewport to pre-arm. Default 240 px. */
  rootMargin?: string;
  /** Reserve this much vertical space so the layout doesn't jump on mount. */
  minHeight?: number | string;
  /** Render this until visible. Defaults to a transparent placeholder. */
  fallback?: ReactNode;
  className?: string;
}

/**
 * Renders `children` only after the wrapper scrolls within `rootMargin` of
 * the viewport. Combined with `next/dynamic({ ssr: false, loading: () =>
 * null })` this defers BOTH chunk fetch and React hydration of below-the-
 * fold charts, which is the single biggest TBT contributor on /trade and
 * /benchmark per the April 2026 Lighthouse audit.
 *
 * Always reserves `minHeight` to keep CLS at 0.
 */
export function LazyMount({
  children,
  rootMargin = "240px",
  minHeight = 280,
  fallback = null,
  className,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // Old browser / no support — render immediately.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [rootMargin]);

  const reservedHeight = typeof minHeight === "number" ? `${minHeight}px` : minHeight;

  return (
    <div ref={ref} className={className} style={{ minHeight: reservedHeight }}>
      {visible ? children : fallback}
    </div>
  );
}
