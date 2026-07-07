# CLAUDE.md — UZ–US Situational Center platform

This file orients future Claude Code sessions in this repo. Read it first; it is the canonical map of structure, conventions, and non-obvious rules.

## What this is

A production-grade Next.js 16 platform for the **Situational Center on Uzbekistan–USA cooperation**, authorized by Presidential Ordinance Ф-4 (17.02.2026). Primary audience: the Advisor to the President, government officials (Президент Админ., МИД, МИПТ, хокимияты, Посольство), business (AUCC, UZ/US companies), delegation heads, and the Center's staff.

The product is **demo-ready and production-quality**, but every synthetic value carries `is_demo: true` and is visually flagged (DemoBadge / DemoUnderline / DemoBanner) so reputation is protected when real data is later swapped in.

## Stack

| Layer                | Choice                                                                               | Notes                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Runtime              | Node.js 24 LTS on Vercel                                                             | `engines.node = >=24.0.0 <25.0.0`. V8 13.x, Maglev compiler enabled.                         |
| Framework            | Next.js 16.2.9, App Router, Turbopack                                                | React 19.2. TypeScript 6 strict.                                                             |
| Styling              | Tailwind CSS v4 (`@theme`, `@utility`)                                               | All design tokens in `app/globals.css`. No tailwind.config.ts.                               |
| State                | Zustand v5.0.13 + persist                                                            | `lib/store/settings.ts` is the global UI store (theme, hideDemo, presentationMode).          |
| i18n                 | next-intl v4, subpath routing `/[locale]/...`                                        | 3 locales: `en`, `uz-latn`, `ru`. Messages in `messages/*.json`.                             |
| Charts               | Recharts (line/bar/area), Visx (sankey/chord/treemap), zero-dep `<MiniBars />`       | Heavy charts are `next/dynamic({ ssr:false })`-loaded behind `<LazyMount />`.                |
| Maps                 | maplibre-gl 5.x (OpenFreeMap), Globe.gl 2.45.x, d3-geo Albers USA                    | `/map` is gated behind `<MapLoadGate />` — runtime only fetched on user click.               |
| Operational database | PostgreSQL 17 via Supabase                                                           | 12-table schema (`database/schema.sql`). Server-only REST adapter at `lib/db/adapter.ts`.    |
| Live ingestion       | 5 connectors (BEA, U.S. Census, EXIM, World Bank, ForeignAssistance.gov)             | Daily Vercel cron at 07:00 UTC → `raw_snapshot → normalized_observation → published_metric`. |
| Data governance      | No-downgrade policy, pending-vs-published, static fallback (`lib/data-governance/*`) | Enforced by `pnpm test:governance` in the verify gate.                                       |
| Auth                 | Signed, short-lived cookie password gate on `/admin`                                 | Server action + middleware. Set `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`.                   |
| Tests                | Vitest (unit), Playwright (e2e + axe a11y), Lighthouse CI                            | `tests/`, `lhci.config.cjs`, `playwright.config.ts`. CI on `.github/workflows/qa.yml`.       |
| Package manager      | **pnpm**                                                                             | Lockfile at `pnpm-lock.yaml`.                                                                |

## Routes (13 public sidebar sections × 3 locales + redirect stubs + admin/login)

Slimmed in the 2026-07 portal-slim pass: /staff and the /counterparts dossier
pages were removed; /events merged into /visits (calendar tab); /sectors merged
into /investments; the counterparts grid moved onto /contacts. In the
roadmaps-monitoring pass: /commitments (demo registry) was replaced by
/roadmaps (real signed hokimiyat roadmaps), /news was removed (data/news.ts
stays — executive.ts reads it), and /prepare was rebuilt as a password-gated
visit-dossier workspace.

```
/[locale]/                       Executive brief — landing page (in-shell panel, fullscreen mode)
/[locale]/overview               Working dashboard (trade editorial, sectors, risk radar, horizon)
/[locale]/brief                  permanentRedirect → / (bookmarks)
/[locale]/trade                  Annual + monthly trade, structure, rankings
/[locale]/visits                 Timeline · grid · table · events-calendar tab
/[locale]/prepare                Visit dossiers: delegation · day program · materials (PASSWORD-GATED via proxy.ts)
/[locale]/roadmaps               Regional roadmap monitor — 61 real projects (Samarkand 48 + Khorezm 13), derived health
/[locale]/commitments            permanentRedirect → /roadmaps (bookmarks)
/[locale]/agreements             Timeline + sphere/year filters
/[locale]/map                    Maplibre 3-layer + 3D globe toggle
/[locale]/admin                  Settings, registry viewer, audit log (gated)
/[locale]/admin/login            Password gate (no auth needed)
/[locale]/investments            Portfolio cards + sector-opportunity briefings
/[locale]/grants                 7 UZ-side grant rows + 4 U.S.-side program records + ForeignAssistance.gov obligations
/[locale]/contacts               Org directory · Council roster · key U.S. figures grid
/[locale]/compliance             OFAC/BIS/EAR/ITAR/GSP/MFN status + ECCN calc
/[locale]/benchmark              UZ vs CA-5 + Caucasus ranking, heatmap
```

Roadmap language policy: `data/roadmaps.ts` stores the document original
(Uzbek Cyrillic) in `title` and the Russian translation in `titleRu`; the ru
locale shows the translation, en/uz-latn show the original
(`roadmapProjectTitle`/`roadmapStepTitle` helpers). Task health is DERIVED
from document deadlines (`stepHealth`), never typed in by hand — the only
manual signal is `step.state` ("done"/"in-progress"/null).

Stage 2 (hokimiyat operations, 2026-07): the gate cookie now carries a ROLE
(`admin` | `samarkand` | `khorezm`; `lib/auth/admin.ts` `GateRole`).
ADMIN_PASSWORD → admin; REGION_PASSWORD_SAMARKAND / REGION_PASSWORD_KHOREZM →
hokimiyat editors, who can enter /prepare (not /admin), mark THEIR region's
roadmap tasks done / leave notes (append-only `roadmap_step_update` journal,
POST /api/roadmaps/step-updates) and upload visit materials (private
`visit-materials` Storage bucket, /api/visit-materials, signed 1-hour links).
Live step states OVERRIDE the `data/roadmaps.ts` baseline via
`overrideStep()`/`RoadmapOverrides` (fetched client-side from GET
/api/roadmaps/step-updates; empty when Supabase is unset, so static deploys
degrade gracefully). Stage-2 tables live in
`database/migrations/2026-07-stage2-hokimiyat.sql` — run AFTER schema.sql.

## Hard rules

1. **Real vs. demo data.** Every value in `data/*.ts` is either backed by a `sourceId` referencing `data/sources.ts` (real) **or** carries `is_demo: true` + an entry in `DEMO_DATA_REGISTRY.md`. Never invent numbers — if a real number isn't available, mark it `is_demo` and add the registry row.
2. **Locale handling.** Every server page calls `setRequestLocale(locale)` after awaiting `params`. Never hardcode `"en"` outside dev fallbacks.
3. **DemoBanner / DemoBadge** — both respect `hideDemo` and `presentationMode` from `useSettings`. Never render demo markers without that gate.
4. **Tokens, not literals.** All color, radius, shadow values reference CSS vars (`var(--color-primary)`, etc.) defined in `app/globals.css` `@theme` and `:root.dark` overrides. Avoid raw hex except inside the maplibre paint specs (the basemap is a light raster regardless of UI theme).
5. **`"use client"` discipline.** Server components by default. Add `"use client"` only when needed (event handlers, hooks, browser APIs). Server components cannot pass `ssr: false` to `next/dynamic` — wrap in a `"use client"` shell instead.
6. **Suspense around `useSearchParams`.** Any client component using `useSearchParams` must be wrapped in `<Suspense>` at the page level, otherwise SSG bails out at build (`/commitments` is the canonical example).
7. **Print exports.** Use `<PrintButton />` + `@media print` CSS in `globals.css`. The print block force-overrides dark-mode tokens to light values so PDFs are always clean. Do not introduce a separate PDF library — `window.print()` covers all current cases.
8. **PII / operational-content boundary (visit-prep).** `/prepare` is password-gated (proxy.ts `GATED_SECTIONS`), and ONLY because of that gate the owner permits it to carry **delegation member names, meeting programs, and material registries** (titles + external links). The platform still NEVER contains — gated or not: passport numbers, visa numbers, flight booking codes / PNRs, hotel reservation codes, talking-point text, draft MoU bodies, personal contact details (phones/emails). That content belongs to a separate operational system with auth + audit + document storage. If a future contributor adds such fields to `data/visit-prep.ts`, or surfaces delegation names on any UNGATED page, that's a security regression — reject the PR. (A unit test greps `upcomingVisits` for forbidden identifier keywords.)
9. **No-downgrade official data.** Live ingestion may store raw snapshots and review items, but it must not replace a newer approved published metric with an older source period. Same-period revisions require review. Newer official values are publication candidates, not automatic replacements, unless a source policy explicitly permits auto-publication.

## Common operations

```bash
pnpm dev                 # dev server with Turbopack
pnpm build               # production build (must pass before commit)
pnpm typecheck           # strict TS check (zero errors required)
pnpm lint                # ESLint
pnpm validate:data       # source-id, locale, route, and env-doc validation
pnpm smoke:routes        # route smoke test against a running server
pnpm check:package       # tracked-file/package artifact hygiene
pnpm test:governance     # no-downgrade/RLS/cron/static-fallback checks
pnpm test:unit           # Vitest unit tests
pnpm test:e2e            # Playwright browser route/API tests (requires build)
pnpm test:a11y           # Playwright + axe accessibility tests (requires build)
pnpm knip                # unused dependency/file/export check
pnpm format:check        # Prettier formatting check
pnpm lhci                # Lighthouse CI against key pages (requires build)
pnpm verify              # lint + typecheck + data validation + governance checks + unit tests
```

When changing styling or design tokens, run `pnpm build` and inspect the route table — bundle bloat shows up there first.

## File-tree map

```
app/
  [locale]/             Localized App Router pages (server components by default)
    layout.tsx          Sidebar + Topbar shell
    counterparts/[id]/  generateStaticParams over data/counterparts.ts
  api/admin/ingest/*    Admin-only governed official-data ingestion dry-run/status
  api/cron/ingest       Vercel cron ingestion endpoint, requires CRON_SECRET
  api/data/*/latest     Approved-current metrics with DB-first/static-fallback reads
  api/live-data/*       Public connector health and best-effort snapshots
  globals.css           Design tokens + light/dark themes + print CSS
  layout.tsx            Root layout (fonts, metadata, themeColor)

components/
  benchmark/, commitments/, compliance/, contacts/, counterparts/, events/,
  grants/, investments/, news/, staff/, trade/, visits/, visit-prep/,
  overview/, map/, charts/, demo-markers/, exports/, admin/,
  layout/, ui/

data/                   Source-of-truth typed modules (one file per entity)
                        Every real value should carry sourceId; every demo value has is_demo:true
lib/
  store/settings.ts     Zustand persist store
  auth/admin.ts         Signed admin cookie helpers
  data-governance/*     No-downgrade policy, static baseline, governed ingestion
  db/adapter.ts         Server-only Supabase REST adapter
  live-data/*           Official-source connector adapters
  i18n/{config,request}.ts
  ai/system-prompt.ts   Compiled RAG-style prompt over /data/*
  utils.ts              cn() helper

messages/               en.json, uz-latn.json, ru.json
proxy.ts                next-intl locale routing + signed admin gate
scripts/                validation, smoke-route, and package-hygiene checks
DEMO_DATA_REGISTRY.md   Master log of every is_demo entry + responsible agency
```

## Phase history

- **Phase A** — Scaffold + design tokens + demo markers + i18n. Commit: `chore: scaffold ...`.
- **Phase B** — Source-of-truth `/data` modules with `is_demo` flags + registry. Commit: `feat(data): ...`.
- **Phase C** — 8 MVP pages. Commit: `feat(mvp): Phase C ...`.
- **Phase D** — 10 extended modules + full 4-locale i18n + print-to-PDF. Commit: `feat(iter2): ...`.
- **Phase E** — `/benchmark` + dark-theme tokens completed + drill-downs (KPI cards → filtered pages, Alerts → commitments status query) + Lighthouse tuning (`optimizePackageImports`, dynamic Globe3D) + this CLAUDE.md. Commit: `feat(iter3): ...`.

## Adding a new section

1. Create `data/<entity>.ts` with TS interface + `is_demo` flag where synthetic.
2. Create `components/<entity>/<EntityView>.tsx` (`"use client"` if interactive).
3. Create `app/[locale]/<entity>/page.tsx` — async server component, awaits params, calls `setRequestLocale`, wraps view in `<Card>` + `<DemoBanner>`.
4. Add nav entry in `components/layout/Sidebar.tsx` (group: monitoring / execution / knowledge / internal).
5. Add `nav.<entity>` to all 3 message files.
6. Add 1+ entries to `DEMO_DATA_REGISTRY.md` if the data is synthetic.
7. Run `pnpm verify && pnpm build` — the new route should appear in the build table.

## Accessibility & performance targets

Latest **live production** Lighthouse sweep (June 2026, 16 routes, `https://uz-us-center.vercel.app/ru`, mobile emulation; Lighthouse's accessibility category runs axe-core):

- **Median Performance: 93.** Range 86–99; 14 of 16 routes ≥ 92. Two heavier routes: `staff` (88) and `news` (86) from their interactive tables.
- **Median Accessibility: 100.** Every route 100 after the June contrast/label-in-name pass (small delta-pill / decision-strip / map status-badge text darkened for AA in the light theme; `LocaleSwitch` + `SourceBadge` accessible names now contain their visible text).
- **Best Practices: 96 · SEO: 100** median.
- **TBT: under 50 ms on 14 of 16 routes** (`staff`/`news` ~300 ms from table sort/filter hydration).
- **CLS: 0 everywhere.**
- **Transfer: 399–529 KB per route.**

Targets to keep:

- Lighthouse Performance ≥ 89 across every route, Accessibility ≥ 96.
- All interactive controls keyboard-reachable (no `onClick` without semantic element).
- All icon-only buttons carry `aria-label`.
- Heavy charts/maps stay behind `<LazyMount />` + `next/dynamic({ ssr: false })`.
- Images use `next/image` where remote (whitehouse.gov, state.gov, wikimedia).
- No client-side data fetching during SSG — pages should hit `data/*.ts` directly.

Reproduce: `node scripts/lh-all.mjs` (local `next start`) or `LH_BASE=https://uz-us-center.vercel.app/ru node scripts/lh-all.mjs` (live production) writes `lh-*.json` per route + a console summary.

## Known constraints

- **Operational backend is opt-in.** `DATA_BACKEND=static` (default) keeps the platform fully deployable from bundled `data/*.ts`. To wire up live ingestion, set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + `CRON_SECRET` and run `database/schema.sql`. The 5 live-data connectors (`lib/live-data/*`) and the daily cron (`/api/cron/ingest`) only write through the no-downgrade policy in `lib/data-governance/*`.
- **Map basemap is light-only.** OpenFreeMap raster style does not have a dark variant; map labels stay readable on the light tiles regardless of UI theme.
- **Vercel cold start.** `/api/data/*`, `/api/cron/ingest` are serverless and may take +800–1500 ms on the first request after ~5 min idle on Hobby tier. Pro tier has always-warm functions.
- **Russian content** is shipped but may need professional review before production publication — current strings come from compact translation passes, not native-speaker review.
