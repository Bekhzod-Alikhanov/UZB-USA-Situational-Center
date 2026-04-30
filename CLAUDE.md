# CLAUDE.md — UZ–US Situational Center dashboard

This file orients future Claude Code sessions in this repo. Read it first; it is the canonical map of structure, conventions, and non-obvious rules.

## What this is

A production-grade Next.js 15 dashboard for the **Situational Center on Uzbekistan–USA cooperation**, authorized by Presidential Ordinance Ф-4 (17.02.2026). Primary audience: the Advisor to the President, government officials (Президент Админ., МИД, МИПТ, хокимияты, Посольство), business (AUCC, UZ/US companies), delegation heads, and the Center's staff.

The product is **demo-ready and production-quality**, but every synthetic value carries `is_demo: true` and is visually flagged (DemoBadge / DemoUnderline / DemoBanner) so reputation is protected when real data is later swapped in.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15.1.6, App Router, Turbopack | React 19. TypeScript strict. |
| Styling | Tailwind CSS v4 (`@theme`, `@utility`) | All design tokens in `app/globals.css`. No tailwind.config.ts. |
| State | Zustand v5 + persist | `lib/store/settings.ts` is the global UI store (theme, locale, hideDemo, presentationMode, AI flags). |
| i18n | next-intl v3, subpath routing `/[locale]/...` | 3 locales: `en`, `uz-latn`, `ru`. Messages in `messages/*.json`. |
| Tables | TanStack Table v8 | Server-shaped data, client filter/sort/page. |
| Charts | Recharts (line/bar/area), Visx (sankey/chord/treemap) | All chart components are `"use client"` and consume CSS vars. |
| Maps | maplibre-gl + react-map-gl with OpenFreeMap style | No API keys. Globe.gl for the 3D globe (lazy). |
| Drag-and-drop | @dnd-kit | Used in Visit Prepare Kanban. |
| AI | Vercel AI SDK + `@ai-sdk/anthropic` | Sonnet 4.5 default; Opus 4.5 toggle in admin. Ephemeral prompt caching on system prompt. |
| Package manager | **pnpm** | Lockfile at `pnpm-lock.yaml`. |

## Routes (18 sections × 4 locales = 72 base + 60 SSG = 136 static pages)

```
/[locale]/                       Overview (KPIs + globe + timeline + alerts)
/[locale]/trade                  Annual + monthly trade, structure, rankings
/[locale]/visits                 Vertical timeline of bilateral visits 1992–2026
/[locale]/visits/prepare/[id]    Kanban + checklists + optimization panel
/[locale]/commitments            TanStack Table, URL-synced status filter
/[locale]/agreements             Timeline + sphere/year filters
/[locale]/map                    Maplibre 3-layer + 3D globe toggle
/[locale]/admin                  Settings, registry viewer, CRUD stubs
/[locale]/investments            Portfolio cards + sector/region/status filters
/[locale]/events                 Unified calendar + iCal export
/[locale]/grants                 7 real grants ($15.381M)
/[locale]/contacts               Org directory
/[locale]/counterparts           Grid w/ role/party/stance filters
/[locale]/counterparts/[id]      SSG briefing card (15 × 4 locales = 60 paths)
/[locale]/compliance             OFAC/BIS/EAR/ITAR/GSP/MFN status + ECCN calc
/[locale]/staff                  KPI table w/ composite-score ranking
/[locale]/news                   Curated feed
/[locale]/assistant              AI chat (Sonnet 4.5 default)
/[locale]/benchmark              UZ vs CA-5 + Caucasus ranking, heatmap

/api/chat                        Dynamic — Anthropic stream proxy
```

## Hard rules

1. **Real vs. demo data.** Every value in `data/*.ts` is either backed by a `source_url`/`source_name` (real) **or** carries `is_demo: true` + an entry in `DEMO_DATA_REGISTRY.md`. Never invent numbers — if a real number isn't available, mark it `is_demo` and add the registry row.
2. **Locale handling.** Every server page calls `setRequestLocale(locale)` after awaiting `params`. Never hardcode `"en"` outside dev fallbacks.
3. **DemoBanner / DemoBadge** — both respect `hideDemo` and `presentationMode` from `useSettings`. Never render demo markers without that gate.
4. **Tokens, not literals.** All color, radius, shadow values reference CSS vars (`var(--color-primary)`, etc.) defined in `app/globals.css` `@theme` and `:root.dark` overrides. Avoid raw hex except inside the maplibre paint specs (the basemap is a light raster regardless of UI theme).
5. **`"use client"` discipline.** Server components by default. Add `"use client"` only when needed (event handlers, hooks, browser APIs). Server components cannot pass `ssr: false` to `next/dynamic` — wrap in a `"use client"` shell instead.
6. **Suspense around `useSearchParams`.** Any client component using `useSearchParams` must be wrapped in `<Suspense>` at the page level, otherwise SSG bails out at build (`/commitments` is the canonical example).
7. **Print exports.** Use `<PrintButton />` + `@media print` CSS in `globals.css`. The print block force-overrides dark-mode tokens to light values so PDFs are always clean. Do not introduce a separate PDF library — `window.print()` covers all current cases.
8. **AI gating.** `/api/chat` returns 503 if `ANTHROPIC_API_KEY` is unset. The client (`AssistantChat.tsx`) also checks `useSettings.aiEnabled` and shows a disabled state. Never call the AI route without both gates passing.
9. **PII / operational-content boundary (visit-prep).** The dashboard tracks **status only** for visit preparation: percentage complete, owner role-slots, due dates, document titles, booking statuses, coverage counts. It NEVER contains: passport numbers, visa numbers, flight booking codes / PNRs, hotel reservation codes, talking-point text, draft MoU bodies, financial estimates, individual delegate names, personal contact details. That content belongs to a separate operational system with auth + audit + document storage. If a future contributor adds such fields to `data/visit-prep.ts`, that's a security regression — reject the PR.

## Common operations

```bash
pnpm dev                 # dev server with Turbopack
pnpm build               # production build (must pass before commit)
pnpm typecheck           # strict TS check (zero errors required)
pnpm lint                # next lint
```

When changing styling or design tokens, run `pnpm build` and inspect the route table — bundle bloat shows up there first.

## File-tree map

```
app/
  [locale]/             18 page.tsx files, one per route (server components)
    layout.tsx          Sidebar + Topbar shell
    counterparts/[id]/  generateStaticParams over data/counterparts.ts
  api/chat/route.ts     Anthropic streamText proxy with caching
  globals.css           Design tokens + light/dark themes + print CSS
  layout.tsx            Root layout (fonts, metadata, themeColor)

components/
  benchmark/, commitments/, compliance/, contacts/, counterparts/, events/,
  grants/, investments/, news/, staff/, trade/, visits/, visit-prep/,
  overview/, map/, charts/, demo-markers/, exports/, assistant/, admin/,
  layout/, ui/

data/                   Source-of-truth typed modules (one file per entity)
                        Every demo value has is_demo:true + source_note
lib/
  store/settings.ts     Zustand persist store
  i18n/{config,request}.ts
  ai/system-prompt.ts   Compiled RAG-style prompt over /data/*
  utils.ts              cn() helper

messages/               en.json, uz-latn.json, ru.json
middleware.ts           next-intl locale routing
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
5. Add `nav.<entity>` to all 4 message files.
6. Add 1+ entries to `DEMO_DATA_REGISTRY.md` if the data is synthetic.
7. Run `pnpm typecheck && pnpm build` — the new route should appear in the build table.

## Accessibility & performance targets

- Lighthouse Performance ≥ 90, Accessibility ≥ 95 on Overview, Trade, Map.
- All interactive controls keyboard-reachable (no `onClick` without semantic element).
- All icon-only buttons carry `aria-label`.
- Images use `next/image` where remote (whitehouse.gov, state.gov, wikimedia).
- No client-side data fetching during SSG — pages should hit `data/*.ts` directly.

## Known constraints

- **No backend.** All data is in-process from `data/*.ts`. Admin "CRUD" is stubbed; persistence will require a future migration to a real DB or CMS.
- **Map basemap is light-only.** OpenFreeMap raster style does not have a dark variant; map labels stay readable on the light tiles regardless of UI theme.
- **AI is BYOK.** Set `ANTHROPIC_API_KEY` in `.env.local` to enable the assistant; without it the route 503s gracefully.
- **Russian content** is shipped but may need professional review before production publication — current strings come from compact translation passes, not native-speaker review.
