# UZ–US Situational Center · dashboard

Production-grade Next.js 15 dashboard for the **Situational Center on Uzbekistan–USA cooperation**, authorized by Presidential Ordinance Ф-4 (17.02.2026). Built for the Advisor to the President, government officials, business stakeholders, and the Center's staff.

> **Demo-ready and production-quality.** Every synthetic value carries `is_demo: true` and is visually flagged so reputation is protected when real data is later swapped in. See [`DEMO_DATA_REGISTRY.md`](./DEMO_DATA_REGISTRY.md), [`SOURCE_REGISTRY.md`](./SOURCE_REGISTRY.md), and [`DATA_INVENTORY.md`](./DATA_INVENTORY.md) for the full provenance map.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15.1.6 · App Router · Turbopack · React 19 |
| Styling | Tailwind CSS v4 · CSS-var design tokens |
| State | Zustand v5 + persist |
| i18n | next-intl v3 · 3 locales: `en`, `uz-latn`, `ru` |
| Tables | TanStack Table v8 |
| Charts | Recharts (line/bar/area) · Visx (sankey/chord/treemap) |
| Maps | maplibre-gl + react-map-gl (OpenFreeMap) · Globe.gl (lazy-loaded) |
| Drag-and-drop | @dnd-kit (Visit Prep Kanban) |
| AI | Vercel AI SDK v6 + `@ai-sdk/anthropic` v3 (Sonnet 4.6) |
| Auth | Cookie-based password gate on `/admin` (server action + middleware) |
| Package manager | **pnpm** |

## Quick start

```bash
pnpm install
cp .env.example .env.local       # set ADMIN_PASSWORD and (optional) ANTHROPIC_API_KEY
pnpm dev                         # → http://localhost:3000
```

Open `http://localhost:3000`; you'll be redirected to `/en` (or your browser's preferred locale). The root sidebar lists all 19 routes.

### Common scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with Turbopack hot reload |
| `pnpm build` | Production build (must pass before commit) |
| `pnpm typecheck` | Strict TypeScript check (zero errors required) |
| `pnpm lint` | next lint |
| `pnpm start` | Serve the production build locally |

> **Cache note:** running `pnpm build` while `pnpm dev` is alive will clobber the Turbopack cache and cause "missing required error components" errors in the running dev server. Stop dev before running build, or use `pnpm typecheck` for fast verification during development.

## Routes (19 sections × 3 locales + admin/login + counterpart SSG)

```
/[locale]/                       Overview (KPIs + globe + timeline + alerts)
/[locale]/trade                  UZ Stat ↔ U.S. Census dual-methodology view
/[locale]/visits                 Vertical timeline 1992–2026
/[locale]/prepare                Visit pipelines · Kanban · plan-vs-actual outcomes
/[locale]/commitments            TanStack Table · URL-synced status filter
/[locale]/agreements             Timeline + sphere/year filters
/[locale]/map                    Maplibre 3-layer + 3D globe toggle
/[locale]/admin                  Settings, registry viewer, audit log (gated)
/[locale]/admin/login            Password gate (no auth needed)
/[locale]/investments            Portfolio cards + sector/region/status filters
/[locale]/events                 Unified calendar + iCal export
/[locale]/grants                 7 real grants ($15.381M)
/[locale]/contacts               Org directory · 13-member Council roster
/[locale]/counterparts           Grid w/ role/party/stance filters
/[locale]/counterparts/[id]      SSG briefing card (21 × 3 locales = 63 paths)
/[locale]/sectors                8 sector-opportunity briefing cards
/[locale]/compliance             OFAC/BIS/EAR/ITAR/GSP/MFN status + ECCN calc
/[locale]/staff                  KPI table w/ composite-score ranking
/[locale]/news                   Curated press feed (16 verified entries)
/[locale]/assistant              AI chat (BYOK Anthropic key)
/[locale]/benchmark              UZ vs CA-5 + Caucasus ranking, heatmap

/api/chat                        Dynamic — Anthropic stream proxy (503 if key missing)
```

## Deploy to Vercel

1. **Push to GitHub** (private repo recommended).
2. **Import** the repo in Vercel; framework auto-detects as Next.js.
3. **Set environment variables** in *Project Settings → Environment Variables* (Production + Preview):
   - `ADMIN_PASSWORD` — required for the admin gate
   - `ANTHROPIC_API_KEY` — optional; enables the `/assistant` page
4. **Deploy.** First build takes ~3 minutes.
5. **Custom domain** (optional): add via *Project Settings → Domains*.

The `/api/chat` route is a dynamic Node route; everything else is fully static and cached at the edge.

## Hard rules for contributors

1. **Real vs. demo data.** Every value in `data/*.ts` is either backed by a `sourceId` referencing `data/sources.ts` (real) **or** carries `is_demo: true` + an entry in [`DEMO_DATA_REGISTRY.md`](./DEMO_DATA_REGISTRY.md). Never invent numbers.
2. **Locale handling.** Every server page calls `setRequestLocale(locale)` after awaiting `params`.
3. **`<DemoBanner>` / `<DemoBadge>`** respect `hideDemo` and `presentationMode` from `useSettings`.
4. **Tokens, not literals.** Reference CSS vars (`var(--color-primary)`) defined in `app/globals.css`. Avoid raw hex except inside maplibre paint specs.
5. **`"use client"` discipline.** Server components by default. Wrap `useSearchParams` in `<Suspense>` at the page level.
6. **Print exports.** Use `<PrintButton />`; the `@media print` block in `globals.css` force-overrides dark-mode tokens for clean PDFs.
7. **AI gating.** `/api/chat` returns 503 if `ANTHROPIC_API_KEY` is unset. The client (`AssistantChat.tsx`) also checks `useSettings.aiEnabled`.

See [`CLAUDE.md`](./CLAUDE.md) for the full style and architectural guide future Claude Code sessions will follow.

## Source provenance

The single source of truth for every external citation is `data/sources.ts` (29 entries, level A = attached input, level B = official URL). Render any record with `<SourceBadge sourceId="…" />` to expose its provenance.

Most-used sources:
- **U.S. Census Bureau** trade-in-goods balance — [www.census.gov/foreign-trade/balance/c4644.html](https://www.census.gov/foreign-trade/balance/c4644.html)
- **USTR** Uzbekistan country page — [ustr.gov/Uzbekistan](https://ustr.gov/Uzbekistan)
- **EXIM** "Buy American, Build the Future" framework — [exim.gov press release](https://www.exim.gov/news/exim-signs-buy-american-build-future-agreement-uzbekistan-boost-exports-and-support-american)
- **DFC** Joint Investment Framework — [dfc.gov press release](https://www.dfc.gov/media/press-releases/dfc-leadership-lays-foundation-investment-partnership-uzbekistan)
- **U.S.-Uzbekistan Business Gateway** — [us-uz.gov.uz/en](https://us-uz.gov.uz/en)
- **National Statistics Committee** — UZ-side trade indicators 2017–2025 (attached DOCX)

## License

Internal — Office of the President of the Republic of Uzbekistan.
