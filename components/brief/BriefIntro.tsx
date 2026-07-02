"use client";
import { useEffect, useState, type AnimationEvent } from "react";

const INTRO_KEY = "uzus-brief-intro";
const INTRO_DONE_ATTR = "data-brief-intro-done";

/**
 * One-time ceremonial intro (≈3.3 s): void → serif title fades/scales in →
 * a gold hairline draws → subtitle → the overlay dissolves into the dashboard.
 * Pure CSS keyframes (transform/opacity only) on server-rendered markup, so
 * it starts on first paint without waiting for hydration.
 *
 * Replay protection, three paths:
 *  - Hard reload, already seen: the synchronous inline <script> in page.tsx
 *    reads sessionStorage before paint and sets `data-brief-intro-done` on
 *    <html>, which display:none's this overlay with zero flash.
 *  - Soft (client-side) navigation back to /brief: the attribute persists on
 *    <html> across route changes, so the re-mounted overlay is hidden by the
 *    same CSS; the effect below also unmounts it immediately.
 *  - Reduced motion: CSS hides the intro entirely (final state at once).
 *
 * The attribute is written only after the staggered content reveal finishes
 * (~4 s) so setting it doesn't cancel reveal animations mid-flight.
 */
export function BriefIntro({ title, subtitle }: { title: string; subtitle: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(INTRO_KEY) === "1";
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Storage unavailable (e.g. Safari private mode): the intro simply
      // replays next visit — never breaks the page.
    }
    if (alreadySeen) {
      document.documentElement.setAttribute(INTRO_DONE_ATTR, "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDone(true);
      return;
    }
    // Fallback unmount for paths where animationend never fires (overlay is
    // display:none under reduced motion), then mark the session as played.
    const unmountTimer = setTimeout(() => setDone(true), 4500);
    const attrTimer = setTimeout(() => document.documentElement.setAttribute(INTRO_DONE_ATTR, ""), 4600);
    return () => {
      clearTimeout(unmountTimer);
      clearTimeout(attrTimer);
    };
  }, []);

  const onAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "brief-intro-out") setDone(true);
  };

  if (done) return null;

  return (
    <div className="brief-intro" aria-hidden onAnimationEnd={onAnimationEnd}>
      <div className="brief-intro-inner">
        <p className="brief-intro-title">{title}</p>
        <div className="brief-intro-line" />
        <p className="brief-intro-sub">{subtitle}</p>
      </div>
    </div>
  );
}
