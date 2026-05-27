# CLAUDE.md — UZ–US Situational Center platform

This file orients future Claude Code sessions in this repo. Read it first; it is the canonical map of structure, conventions, and non-obvious rules.

## What this is

A production-grade Next.js 16 platform for the **Situational Center on Uzbekistan–USA cooperation**, authorized by Presidential Ordinance Ф-4 (17.02.2026). Primary audience: the Advisor to the President, government officials (Президент Админ., МИД, МИПТ, хокимияты, Посольство), business (AUCC, UZ/US companies), delegation heads, and the Center's staff.

The product is **demo-ready and production-quality**, but every synthetic value carries `is_demo: true` and is visually flagged (DemoBadge / DemoUnderline / DemoBanner) so reputation is protected when real data is later swapped in.

## Stack

| Layer                | Choice                                                                            | Notes                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Runtime              | Node.js 24 LTS on Vercel                                                          | `engines.node = >=24.0.0 <25.0.0`. V8 13.x, Maglev compiler enabled.                                  |
| Framework            | Next.js 16.2.4, App Router, Turbopack                                             | React 19.2. TypeScript 6 strict.                                                                      |
| Styling              | Tailwind CSS v4 (`@theme`, `@utility`)                                            | All design tokens in `app/globals.css`. No tailwind.config.ts.                                        |
| State                | Zustand v5.0.13 + persist                                                         | `lib/store/settings.ts` is the global UI store (theme, locale, hideDemo, presentationMode, AI flags). |
| i18n                 | next-intl v4, subpath routing `/[locale]/...`                                     | 3 locales: `en`, `uz-latn`, `ru`. Messages in `messages/*.json`.                                      |
| Tables               | TanStack Table v8                                                                 | Server-shaped data, client filter/sort/page.                                                          |
| Charts               | Recharts (line/bar/area), Visx (sankey/chord/treemap), zero-dep `<MiniBars />`    | Heavy charts are `next/dynamic({ ssr:false })`-loaded behind `<LazyMount />`.                         |
| Maps                 | maplibre-gl 5.x (OpenFreeMap), Globe.gl 2.45.x, d3-geo Albers USA                 | `/map` is gated behind `<MapLoadGate />` — runtime only fetched on user click.                        |
| Drag-and-drop        | @dnd-kit                                                                          | Used in Visit Prepare Kanban with mount-gate to avoid React 19 SSR aria-describedby drift.            |
| Operational database | PostgreSQL 17 via Supabase                                                        | 12-table schema (`database/schema.sql`). Server-only REST adapter at `lib/db/adapter.ts`.             |
| Live ingestion       | 5 connectors (BEA, U.S. Census, EXIM, World Bank, ForeignAssistance.gov)          | Daily Vercel cron at 07:00 UTC → `raw_snapshot → normalized_observation → published_metric`.          |
| Data governance      | No-downgrade policy, pending-vs-published, static fallback (`lib/data-governance/*`) | Enforced by `pnpm test:governance` in the verify gate.                                                |
| Auth                 | Signed, short-lived cookie password gate on `/admin`                              | Server action + middleware. Set `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`.                            |
| AI                   | Vercel AI SDK v6 + `@ai-sdk/anthropic` v3.0.74                                    | Sonnet 4.6. Gated by `ASSISTANT_ENABLED` and `ANTHROPIC_API_KEY`. Lazy-loaded behind interaction.      |
| Tests                | Vitest (unit), Playwright (e2e + axe a11y), Lighthouse CI                         | `tests/`, `lhci.config.cjs`, `playwright.config.ts`. CI on `.github/workflows/qa.yml`.                |
| Package manager      | **pnpm**                                                                          | Lockfile at `pnpm-lock.yaml`.                                                                         |

## Routes (19 public sidebar sections × 3 locales + admin/login + counterpart SSG)

```
/[locale]/                       Overview (KPIs + globe + timeline + alerts)
/[locale]/trade                  Annual + monthly trade, structure, rankings
/[locale]/visits                 Vertical timeline of bilateral visits 1992–2026
/[locale]/prepare                Visit pipelines · Kanban · plan-vs-actual outcomes
/[locale]/commitments            TanStack Table, URL-synced status filter
/[locale]/agreements             Timeline + sphere/year filters
/[locale]/map                    Maplibre 3-layer + 3D globe toggle
/[locale]/admin                  Settings, registry viewer, audit log (gated)
/[locale]/admin/login            Password gate (no auth needed)
/[locale]/investments            Portfolio cards + sector/region/status filters
/[locale]/events                 Unified calendar + iCal export
/[locale]/grants                 7 UZ-side grant rows + 4 U.S.-side program records + ForeignAssistance.gov obligations
/[locale]/contacts               Org directory · 13-member Council roster
/[locale]/counterparts           Grid w/ role/party/stance filters
/[locale]/counterparts/[id]      SSG briefing card (21 × 3 locales = 63 paths)
/[locale]/sectors                8 sector-opportunity briefing cards
/[locale]/compliance             OFAC/BIS/EAR/ITAR/GSP/MFN status + ECCN calc
/[locale]/staff                  KPI table w/ composite-score ranking
/[locale]/news                   Curated feed
/[locale]/assistant              AI chat (BYOK Anthropic key)
/[locale]/benchmark              UZ vs CA-5 + Caucasus ranking, heatmap

/api/chat                        Dynamic — Anthropic stream proxy (503 unless ASSISTANT_ENABLED=true and key is set)
```

## Hard rules

1. **Real vs. demo data.** Every value in `data/*.ts` is either backed by a `sourceId` referencing `data/sources.ts` (real) **or** carries `is_demo: true` + an entry in `DEMO_DATA_REGISTRY.md`. Never invent numbers — if a real number isn't available, mark it `is_demo` and add the registry row.
2. **Locale handling.** Every server page calls `setRequestLocale(locale)` after awaiting `params`. Never hardcode `"en"` outside dev fallbacks.
3. **DemoBanner / DemoBadge** — both respect `hideDemo` and `presentationMode` from `useSettings`. Never render demo markers without that gate.
4. **Tokens, not literals.** All color, radius, shadow values reference CSS vars (`var(--color-primary)`, etc.) defined in `app/globals.css` `@theme` and `:root.dark` overrides. Avoid raw hex except inside the maplibre paint specs (the basemap is a light raster regardless of UI theme).
5. **`"use client"` discipline.** Server components by default. Add `"use client"` only when needed (event handlers, hooks, browser APIs). Server components cannot pass `ssr: false` to `next/dynamic` — wrap in a `"use client"` shell instead.
6. **Suspense around `useSearchParams`.** Any client component using `useSearchParams` must be wrapped in `<Suspense>` at the page level, otherwise SSG bails out at build (`/commitments` is the canonical example).
7. **Print exports.** Use `<PrintButton />` + `@media print` CSS in `globals.css`. The print block force-overrides dark-mode tokens to light values so PDFs are always clean. Do not introduce a separate PDF library — `window.print()` covers all current cases.
8. **AI gating.** `/api/chat` returns 503 unless `ASSISTANT_ENABLED=true` and `ANTHROPIC_API_KEY` are both configured. The client (`AssistantChat.tsx`) also checks server availability and `useSettings.aiEnabled`. Never call the AI route without both gates passing.
9. **PII / operational-content boundary (visit-prep).** The platform tracks **status only** for visit preparation: percentage complete, owner role-slots, due dates, document titles, booking statuses, coverage counts. It NEVER contains: passport numbers, visa numbers, flight booking codes / PNRs, hotel reservation codes, talking-point text, draft MoU bodies, financial estimates, individual delegate names, personal contact details. That content belongs to a separate operational system with auth + audit + document storage. If a future contributor adds such fields to `data/visit-prep.ts`, that's a security regression — reject the PR.
10. **No-downgrade official data.** Live ingestion may store raw snapshots and review items, but it must not replace a newer approved published metric with an older source period. Same-period revisions require review. Newer official values are publication candidates, not automatic replacements, unless a source policy explicitly permits auto-publication.

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
  api/chat/route.ts     Anthropic streamText proxy with env gating and request limits
  api/admin/ingest/*    Admin-only governed official-data ingestion dry-run/status
  api/cron/ingest       Vercel cron ingestion endpoint, requires CRON_SECRET
  api/data/*/latest     Approved-current metrics with DB-first/static-fallback reads
  api/live-data/*       Public connector health and best-effort snapshots
  globals.css           Design tokens + light/dark themes + print CSS
  layout.tsx            Root layout (fonts, metadata, themeColor)

components/
  benchmark/, commitments/, compliance/, contacts/, counterparts/, events/,
  grants/, investments/, news/, staff/, trade/, visits/, visit-prep/,
  overview/, map/, charts/, demo-markers/, exports/, assistant/, admin/,
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

Latest local Lighthouse sweep (May 2026, all 17 routes, mobile emulation, `pnpm build && next start -p 3100`):

- **Median Performance: 91.** All 17 routes ≥ 89. Best routes hit 92.
- **Median Accessibility: 98.** Six routes hit 100 (`/`, `/trade`, `/map`, `/events`, `/benchmark`, `/counterparts`).
- **TBT: 13–59 ms across all routes** (was 460 ms on `/trade` before Wave 2 lazy-loading).
- **CLS: 0 everywhere.**
- **Transfer: 365–410 KB per route** (down from 427–536 KB baseline).

Targets to keep:

- Lighthouse Performance ≥ 89 across every route, Accessibility ≥ 96.
- All interactive controls keyboard-reachable (no `onClick` without semantic element).
- All icon-only buttons carry `aria-label`.
- Heavy charts/maps stay behind `<LazyMount />` + `next/dynamic({ ssr: false })`.
- Images use `next/image` where remote (whitehouse.gov, state.gov, wikimedia).
- No client-side data fetching during SSG — pages should hit `data/*.ts` directly.

Reproduce: `node scripts/lh-all.mjs` writes `lh-*.json` per route + a console summary.

## Known constraints

- **Operational backend is opt-in.** `DATA_BACKEND=static` (default) keeps the platform fully deployable from bundled `data/*.ts`. To wire up live ingestion, set `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` + `CRON_SECRET` and run `database/schema.sql`. The 5 live-data connectors (`lib/live-data/*`) and the daily cron (`/api/cron/ingest`) only write through the no-downgrade policy in `lib/data-governance/*`.
- **Map basemap is light-only.** OpenFreeMap raster style does not have a dark variant; map labels stay readable on the light tiles regardless of UI theme.
- **AI is BYOK and opt-in.** Set `ASSISTANT_ENABLED=true` and `ANTHROPIC_API_KEY` in Vercel env (or `.env.local`) to enable the assistant; without both, the route 503s gracefully.
- **Vercel cold start.** `/api/data/*`, `/api/chat`, `/api/cron/ingest` are serverless and may take +800–1500 ms on the first request after ~5 min idle on Hobby tier. Pro tier has always-warm functions.
- **Russian content** is shipped but may need professional review before production publication — current strings come from compact translation passes, not native-speaker review.
