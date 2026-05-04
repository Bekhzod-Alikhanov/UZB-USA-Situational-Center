# Lighthouse audit & performance plan — April 2026 (v2)

Local production build (`pnpm build && next start -p 3100`), Edge headless,
default mobile-emulation slowdown. Aggregate runner: `node scripts/lh-all.mjs`.

## Scores — full sweep (17 routes)

| Route           |   Perf |   A11y |   LCP |        TBT | CLS | Bytes | Unused JS |
| --------------- | -----: | -----: | ----: | ---------: | --: | ----: | --------: |
| `/`             |     88 |     96 | 3.9 s |      67 ms |   0 |   672 |   **208** |
| `/trade`        | **72** |     95 | 4.7 s | **461 ms** |   0 |   614 |       111 |
| `/visits`       |     89 |     95 | 3.7 s |      67 ms |   0 |   429 |        69 |
| `/commitments`  |     88 |     96 | 3.7 s |     117 ms |   0 |   442 |        46 |
| `/agreements`   |     88 | **86** | 3.9 s |      74 ms |   0 |   430 |        69 |
| `/map`          |     86 |     96 | 4.1 s |     123 ms |   0 |   471 |        68 |
| `/investments`  |     88 | **86** | 3.9 s |      73 ms |   0 |   434 |        69 |
| `/events`       |     89 |     96 | 3.7 s |      69 ms |   0 |   428 |        69 |
| `/grants`       | **83** |     94 | 4.4 s |     164 ms |   0 |   536 |       114 |
| `/contacts`     |     88 |     94 | 3.9 s |      63 ms |   0 |   430 |        69 |
| `/counterparts` |     89 |     94 | 3.7 s |      35 ms |   0 |   466 |        49 |
| `/compliance`   |     88 |     96 | 3.9 s |      72 ms |   0 |   427 |        70 |
| `/staff`        |     87 |     94 | 3.9 s |      95 ms |   0 |   432 |        70 |
| `/news`         |     91 | **89** | 3.6 s |      61 ms |   0 |   427 |        69 |
| `/assistant`    | **84** |     98 | 4.4 s |     129 ms |   0 |   539 |   **163** |
| `/benchmark`    | **79** |     96 | 4.5 s | **286 ms** |   0 |   534 |       111 |
| `/sectors`      |     88 |     94 | 3.9 s |      50 ms |   0 |   429 |        70 |

**Compared to previous run:**

- `/map` jumped **45 → 86** (+41) after the maplibre+globe.gl rebuild
- `/` held at 88, `/trade` improved 68 → 72, `/benchmark` 68(prev not measured)→79
- A11y dropped on a few list/filter pages — now also a top-3 issue

**Median Performance: 88. 13 of 17 routes are ≥ 87, three are below 80.**

## What the numbers actually mean

- **FCP (First Contentful Paint) is fast everywhere** (~1.0 s) — text/sidebar paints quickly.
- **LCP (Largest Contentful Paint) ≈ 3.7–4.7 s on all routes** — that 2–3 s gap between FCP and LCP is the universal villain. The hero card / KPI row is being painted 2–4× _after_ the first frame because it depends on chunks of JS that arrive late.
- **TBT is fine on 14 of 17 routes** (< 130 ms). The two outliers, `/trade` (461 ms) and `/benchmark` (286 ms), block the main thread because Recharts hydrates 5+ charts at once.
- **CLS is 0 everywhere** — layout-shift discipline is good; the recent map placeholder fix held.
- **Transfer is ~427 KB baseline**, +0–245 KB per page. The 427 KB is the shared chunk (React 19 + next-intl + Sidebar/Topbar + Radix primitives + lucide icons + i18n messages + fonts). That base is what we have to attack.

## A11y gap (separate from perf)

Pages below the 95 target fail on the same handful of audits:

- **color-contrast** — somewhere in the muted-text colour scheme contrast is < 4.5:1. Likely `--color-ink-faint` on `--color-surface-2` (footnotes / "fetched at" labels).
- **label-content-name-mismatch** — visible text on a button doesn't match its `aria-label` (the Cmd-K search button "Search…" with `aria-label="Open command menu"` is the prime suspect).
- **select-name** — Radix `<Select>` triggers without an explicit `aria-label`.

These are 1–2-hour fixes, not perf-related.

---

# Plan: how to significantly speed up performance

The dominant problem is **the 427 KB shared chunk delivers JS that takes 2–3 s to parse on emulated mobile**, pushing LCP up everywhere even though the HTML and fonts have arrived. Attack in three waves.

## Wave 1 — Quick wins (~2 hours, +5–10 perf points across the board)

### 1.1 Cut font payload (saves ~80–100 KB transfer, ~300 ms LCP)

We're loading 6+ woff2 files (~150 KB total): Geist Sans, Instrument Serif (regular + italic), JetBrains Mono with `latin + latin-ext + cyrillic + cyrillic-ext` subsets.

- Drop **Instrument Serif italic** unless it's actually used (`grep` says it's not on critical path).
- JetBrains Mono: drop `cyrillic-ext` — Russian basic fits in `cyrillic`.
- Add `preload: false` on Instrument Serif (it's only for headings, FOUT is fine).
- Confirm `display: "swap"` is set (it is).

### 1.2 Lazy-load `/assistant`'s AI SDK (saves 117 KB on /assistant, ~500 ms TBT)

`@ai-sdk/react` + `ai` package = 117 KB chunk, **84 % unused** until the user types. Wrap `AssistantChat` in `next/dynamic({ ssr: false, loading: <Skeleton /> })` keyed off "user pressed input". → Initial /assistant load drops from 539 KB → ~430 KB.

### 1.3 Defer `SearchCommand` (Cmd-K) hydration (saves ~30 KB on every page)

`fuse.js` + the full search index is hydrated on every navigation but only used if the user presses Cmd-K. Replace its current import with `next/dynamic({ ssr: false })` and load on first keypress (or after `requestIdleCallback`). → -30 KB from the shared chunk = improvement everywhere.

### 1.4 Mark hero KPI cards as static SVG (eliminates the FCP→LCP gap on `/`)

The Overview hero KPI row is currently client-rendered. Split: server-render the static parts (numbers, labels) directly in `app/[locale]/page.tsx`; only the trend sparklines stay client-side. This makes the LCP element appear in the initial HTML instead of after JS hydrates.

### 1.5 Add `optimizePackageImports` for missed barrels

We already have `lucide-react`, `recharts`, `date-fns`, `@dnd-kit/*`, half of `@visx/*`. Add:

- `@radix-ui/react-dropdown-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-tabs` (these still pull their full barrel).
- `@visx/sankey`, `@visx/chord`, `@visx/responsive` — present in deps, missing from the list.

**Wave 1 expected outcome:** /`, `/trade`, `/benchmark`, `/grants`, `/assistant` all gain 5–10 perf points. Median Perf 88 → 92. Three sub-80 routes climb past 85.

## Wave 2 — Targeted refactors (~4 hours, +5–8 more points on the heavy routes)

### 2.1 Defer below-the-fold charts on `/trade` and `/benchmark`

Both pages render 5+ Recharts/Visx charts on first paint, even though only 1–2 are above the fold. Wrap the lower charts (HS-6 treemap, Sankey, Comtrade trend, Services EBOPS) in:

```tsx
const HeavyChart = dynamic(() => import("./HeavyChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-[260px]" />,
});
```

Plus an `IntersectionObserver`-based lazy-mount: `<LazyMount margin="200px"><HeavyChart /></LazyMount>` so charts only hydrate as the user scrolls.

**Expected:** `/trade` 72 → 85, `/benchmark` 79 → 88. TBT drops below 200 ms on both.

### 2.2 Replace simple Recharts on `/` and `/trade` with custom SVG (~5 KB each)

The trend sparklines on KPI cards and the annual trade bar chart are both simple — line, area, or grouped-bar. Recharts adds ~240 KB just to draw them. A 50-line custom SVG component (`<Sparkline>`) does the same with no client cost. Keep Recharts only for charts with rich tooltips (Trade Composed, Benchmark heatmap).

**Expected:** Saves ~80–120 KB on `/` and `/trade` because Recharts is no longer in their primary bundle.

### 2.3 Tree-shake `i18n` messages per route

Right now every page receives the full `messages/en.json` (~30 KB JSON, parsed on every nav). next-intl supports per-route message splitting via `getMessages({ namespace })`. Pages only need their own namespace + `nav` + `common`.

**Expected:** Saves ~20 KB on every route, mostly hitting LCP through faster parse time.

### 2.4 Server-render the `/news` and `/contacts` cards

These are static lists. Right now both pages are server components that pass arrays down to a client wrapper. The wrapper is unnecessary — fold filters into a `<form>` with `searchParams` and the page becomes 100 % server-rendered. **Saves ~80 KB on /news and /contacts.** (And solves their A11y `label-content-name-mismatch` warnings since native `<select name="">` has accessible names by default.)

## Wave 3 — Bigger wins, bigger effort (~8 hours, take median to 95+)

### 3.1 Streaming + Suspense at the layout boundary

Wrap the `<main>` slot in `<Suspense fallback={<RouteSkeleton />}>` and start streaming the HTML before data resolves. Especially powerful on `/trade`, `/benchmark`, and `/assistant` where the initial server work is non-trivial.

### 3.2 Replace Recharts entirely with @observablehq/plot or @nivo/lite

Recharts adds ~240 KB minified+gzipped to any page that imports it. Modern alternatives are 30–50 KB:

- [@observablehq/plot](https://github.com/observablehq/plot) — 60 KB, declarative, supports composition
- [visx](https://airbnb.io/visx/) (which we already have for Treemap/Sankey) is more granular but lower-level
- A custom `<Chart>` primitive built on D3 scales would be ~10 KB and cover 90 % of what we need.

**Expected:** ~150–200 KB drop in shared chunk → median LCP ~2.5 s → median Perf 92 → 96.

### 3.3 Split Sidebar by route group

The Sidebar carries icons and translated labels for 18 nav items on every page. With ICs (Intersection Coalescing) and route-segment metadata, we can ship only the items in the current group ("monitoring", "execution", "knowledge", "internal") on first paint and lazy-load the rest. Saves ~40 KB shared.

### 3.4 Add a CDN with proper cache-control on `/_next/static/`

Vercel does this by default; locally we don't. Ensure deployment sets `Cache-Control: public, max-age=31536000, immutable` on hashed chunks. Repeat-visit Lighthouse jumps 8–12 points because nothing is re-fetched.

### 3.5 Use React Server Components (RSC) for charts where possible

Charts with no interactivity (annual trade summary, agreements timeline, grants list) can be rendered server-side as inline SVG. This is harder than it sounds because Recharts needs a DOM, but [@vx](https://airbnb.io/visx/) primitives work fine in RSC. Big win: zero JS for those charts.

---

## Recommended order of execution

1. Wave 1.1 (fonts) and 1.5 (optimizePackageImports) — 30 min, no risk
2. Wave 1.3 (lazy SearchCommand) — 30 min, no risk
3. Wave 1.2 (lazy AI SDK) — 45 min, isolated to /assistant
4. Wave 2.1 (lazy below-the-fold charts) — 2 hours, biggest single win
5. Wave 2.2 (custom Sparkline) — 1 hour, big shared-chunk win
6. Wave 1.4 (server-render KPI hero) — 1 hour
7. **Stop & re-measure.** If median ≥ 92, ship.
8. If still under target, Wave 3.2 (replace Recharts) is the nuclear option.

A11y cleanup (color contrast + select-name + label match) is a separate 1–2 hour pass and is independent from perf — should ride alongside whatever wave we ship next.

## Reproduce

```bash
pnpm build
npx next start -p 3100   # leave running
node scripts/lh-all.mjs  # writes lh-*.json + prints summary table
```

The runner uses Edge in headless mode (`CHROME_PATH` env var) — no Chrome required.
