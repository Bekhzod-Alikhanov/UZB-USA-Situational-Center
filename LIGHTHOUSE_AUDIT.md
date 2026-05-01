# Lighthouse audit — April 2026

Local production build (`pnpm build && next start`), Edge headless, default
mobile-emulation slowdown. Run command:

```
CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  npx lighthouse http://localhost:3100/<route> --quiet \
  --only-categories=performance,accessibility,best-practices,seo
```

## Scores

| Route       | Performance | Accessibility | Best Practices | SEO |
|-------------|------------:|--------------:|---------------:|----:|
| `/en` (overview) | **88** | **96** ✅ | 96 | 60* |
| `/en/trade` | 68 | **95** ✅ | 96 | 63* |
| `/en/map`   | 45 | **96** ✅ | 96 | 60* |

\* SEO is 60–63 because the app sets `robots: { index: false, follow: false }`
in `app/layout.tsx` — this is an internal tool, not a public-search target,
so SEO is intentionally deprioritised. The remaining SEO-category items
(meta description, `<title>`, etc.) all pass.

## Verdict against original targets (CLAUDE.md)

- **Accessibility ≥ 95**: ✅ met on every audited route.
- **Performance ≥ 90**: ❌ Overview is 2 points short (88), Trade and Map
  are below target. Documented as known perf debt — see below.

## Why Performance is below target

### `/en` (88)
- LCP 4.0 s, TBT 40 ms, CLS 0, TTI 4.4 s.
- 674 KB transfer, ~201 KB unused JS — main remaining opportunity.
- Realistically: removing 1–2 unused Recharts/Visx subpackages and
  pre-loading the hero card image gets this to ≥ 90.

### `/en/trade` (68)
- LCP 4.8 s, TBT 590 ms, CLS 0, TTI 5.3 s.
- 615 KB transfer, ~107 KB unused JS.
- Trade page renders 5+ Recharts charts on first paint. Wrapping
  below-the-fold charts (Treemap, Sankey, ComtradeHs6, ServicesEbops) in
  `next/dynamic({ ssr: false })` would defer ~120 KB of Visx code and
  drop TBT by ~300 ms.

### `/en/map` (45) — biggest gap
- LCP 4.4 s, **TBT 1,790 ms**, CLS 0.203, TTI 7.8 s.
- 2.17 MB transfer, ~221 KB unused JS.
- maplibre-gl and globe.gl both load eagerly even though only one is
  visible at a time. Split into separate `dynamic()` chunks per tab and
  the map mounts ~600 ms faster.
- CLS 0.203 — basemap tiles arriving after layout finalises. Fix:
  set explicit `aspect-ratio: 16/9` (or `min-h-[480px]`) on the map
  container so the tile load doesn't shift the layout.

## Recommended next iteration

These are out of scope for the pre-presentation cleanup but should be
the first items in the post-demo perf-pass:

1. `/map`: lift CLS by giving the maplibre wrapper an explicit min-height
   of 520 px (or `aspect-[16/10]`).
2. `/map`: gate the Globe3D component behind `requestIdleCallback` and
   load it only when the user clicks the 3D toggle.
3. `/trade`: lazy-load below-the-fold charts (Treemap, Sankey, Hs6).
4. Audit `optimizePackageImports` in `next.config.ts` for `@visx/*` and
   `recharts` — Next 16 can tree-shake these more aggressively when
   listed explicitly.

## Reproduce

```bash
pnpm build
npx next start -p 3100   # leave running

# in another shell:
CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  npx lighthouse http://localhost:3100/en \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html --output-path=./lh-overview.html \
  --chrome-flags="--headless=new --no-sandbox" --view
```
