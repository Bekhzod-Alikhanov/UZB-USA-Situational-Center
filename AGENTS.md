# Repository Rules for Codex Agents

## Project Purpose

This repository is the Uzbekistan-USA Economic and Investment Intelligence Platform: an executive-grade decision dashboard for government, diplomacy, investment promotion, trade, business, research, and operational coordination audiences.

The product must improve clarity, credibility, localization correctness, performance, and executive polish while preserving useful analytical depth.

## Package Manager and Commands

- Package manager: `pnpm` (`pnpm-lock.yaml` is authoritative).
- Use `corepack pnpm <script>` when running scripts from automation.
- Common validation:
  - `corepack pnpm lint`
  - `corepack pnpm typecheck`
  - `corepack pnpm validate:data`
  - `corepack pnpm test:governance`
  - `corepack pnpm test:unit`
  - `corepack pnpm verify`
  - `corepack pnpm smoke:routes` with a local server running
  - `corepack pnpm test:e2e`
  - `corepack pnpm test:a11y`
  - `corepack pnpm lhci`
  - `corepack pnpm test:i18n` after the i18n audit script is present

## Non-negotiable Data Rules

- Never fabricate real-world investment projects, privatization companies, trade figures, policy events, agreements, legal claims, or citations.
- Every factual value must be source-backed through `data/sources.ts` or clearly marked as demo/illustrative/internal/source-needed.
- Do not delete useful data records. If a record is misleading, quarantine it behind confidence labels or propose archival with owner approval.
- Verified headline metrics must not include `illustrative_demo` rows.
- Demo rows may remain useful for UI testing and workflow demonstration, but must never be presented as official facts.
- Preserve source citations, source IDs, source methodology notes, freshness labels, and credibility warnings.
- Do not hide warnings simply to make the product cleaner.

## Chart and Visualization Preservation Rules

- Do not delete useful charts, maps, tables, dashboards, timelines, benchmarks, or analytical exhibits.
- Prefer hierarchy over deletion: tabs, accordions, disclosures, route-level Advanced Analysis, lazy loading, and server-rendered summaries.
- For every proposed chart move/simplification, document:
  - current component and file path
  - value provided
  - current problem
  - target location
  - what remains preserved
  - risk
  - recommendation: keep, simplify, merge, move to advanced, archive, or candidate for deletion
  - confidence level
- Deletion requires owner approval unless the visualization is broken, misleading, unused, or clearly duplicative.

## Localization Rules

Localization is a P0 release blocker.

- Supported locales are `en`, `ru`, and `uz-latn`.
- English pages must not show Russian shell labels unless intentionally multilingual.
- Russian and Uzbek Latin pages must not show English UI copy except official names, source titles, company names, treaty titles, source IDs, HS/ECCN/EBOPS terms, and quoted source names.
- UI labels, explanations, filters, empty states, table headers, chart titles, chart legends, axis labels, tooltips, CTAs, dialogs, admin labels, and source/confidence labels must be localized.
- Dates, numbers, percentages, and currencies should use locale-aware formatting.
- Keep official source titles in their original language where appropriate, but localize surrounding explanatory copy.
- Do not add new hardcoded English/Russian/Uzbek UI strings in components. Add message keys or typed locale maps.
- Run or update the i18n audit when adding user-visible strings.

## Route and Navigation Conventions

- Localized public routes live under `app/[locale]`.
- Every server page must call `setRequestLocale(locale)` after awaiting `params`.
- Locale switching should preserve route context, query string, and hash where possible.
- Keep public/executive navigation concise. Operations/Admin/Staff/Visit Prep should remain visually separated from public/executive intelligence pages.
- Search must be able to reach all pages, but search labels and entity type badges must be localized.

## Source and Confidence UI Rules

- Use `<SourceBadge sourceId="...">` wherever a displayed value depends on an external or internal source.
- Prefer explicit confidence labels:
  - verified official
  - company confirmed
  - media reported
  - internal/unverified
  - source needed
  - illustrative demo
- Investment and privatization summaries must clearly separate verified, pending/source-needed, internal, and illustrative records.
- Quote-safe KPIs must show source, date/as-of context, and confidence.

## Files and Directories to Protect

Do not delete or wholesale rewrite without owner approval:

- `data/`
- `messages/`
- `components/trade/`
- `components/investments/`
- `components/map/`
- `components/benchmark/`
- `components/charts/`
- `SOURCE_REGISTRY.md`
- `DEMO_DATA_REGISTRY.md`
- `DATA_INVENTORY.md`
- `VISUALIZATION_PRESERVATION_LOG.md`
- `database/schema.sql`
- `scripts/validate-data.mjs`
- `scripts/check-governance.mjs`
- `tests/`

## Performance Rules

- Do not solve performance by deleting analytical content.
- Prefer dynamic imports, lazy loading, progressive disclosure, route splitting, memoization, server-rendered summaries, and smaller shared layout payloads.
- Keep map and heavy chart runtimes gated when practical.
- Re-measure after performance changes with Lighthouse or configured scripts.

## Accessibility Rules

- Preserve keyboard access, focus states, semantic headings, landmarks, and dialog labels.
- Charts and maps need textual alternatives or explanatory summaries.
- Tables should use captions/scopes where useful.
- Status must not rely only on color.
- All icon-only buttons need localized accessible names.

## Security and Reliability Rules

- Admin routes and write-capable APIs must remain authenticated.
- Cron ingestion must require `CRON_SECRET`.
- Do not expose service-role credentials or private operational data client-side.
- Add rate limiting before treating admin/live-probe functionality as production-ready.

## Done Criteria

A change is not done until:

- Useful data and visualizations are preserved.
- Localization impact is considered and tested.
- Source/demo/confidence labeling remains visible.
- `pnpm validate:data` and relevant type/lint/test commands have been run or explicitly documented as not run.
- New user-visible strings are message-backed or intentionally exempted.
- Any remaining release risks are documented.
