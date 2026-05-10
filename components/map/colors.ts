/**
 * Map paint colors. MapLibre paint specs and inline popup HTML can't
 * resolve CSS custom properties, so the literal hex values mirror the
 * design tokens defined in app/globals.css's `@theme` block. Keep these
 * in sync with that file when the brand palette changes.
 *
 * Suffix `_LIGHT` is used for halos / strokes that must remain readable
 * on a light raster basemap (OpenFreeMap positron) regardless of UI theme.
 */
export const MAP_COLORS = {
  /** --color-primary (#1a3a6c) — investment bubbles + stroke */
  primary: "#1A3A6C",
  /** --color-ink (#1a1a1a) — symbol text */
  ink: "#1a1a1a",
  /** Halo / stroke / endpoint highlight on light tiles */
  haloLight: "#ffffff",
  /** --color-warn (#8a5d00 → tuned to #C88A12 for arc legibility on positron tiles) */
  warn: "#C88A12",
  /** --color-pos (#0a7c5a) — US-city endpoints */
  pos: "#0A7C5A",
  /** --color-neg (#a5342a) — active delegation markers */
  neg: "#A5342A",
  /** Popup secondary text — must remain readable on white popup background */
  popupMuted: "#555555",
} as const;
