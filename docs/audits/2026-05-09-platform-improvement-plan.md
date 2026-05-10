# Uzbekistan-USA Economic and Investment Intelligence Platform Audit

Date: 2026-05-09
Auditor: Codex
Production inspected: https://uz-us-center.vercel.app/en
Local repo inspected: C:\Users\behzo\Downloads\US-UZB Dashboard

## 1. Executive Diagnosis

The platform has evolved from a simple dashboard into a broad situational intelligence workspace: it now has a strong App Router structure, three locale routes, source registry, demo registry, guarded admin routes, lazy-loaded heavy charts, optional live-data connectors, and an investment credibility split that separates verified, pending, and illustrative data.

It still feels too much like an internal prototype because the hierarchy is inconsistent: executive summaries, operational controls, technical analysis, demo warnings, and source notes are often at the same visual level. The result is information-rich but cognitively expensive.

Biggest issues:

| Area | Diagnosis | Highest-impact fix |
| --- | --- | --- |
| UX | Users are not always told what to do next; pages are registries before they are briefs. | Add one executive purpose, top insight, "what this means", and next action to every major page. |
| UI | Card-heavy, equal-weight sections reduce hierarchy; dense tables and charts need stronger grouping. | Standardize card variants, source/confidence badges, chart explanations, and advanced-analysis disclosure patterns. |
| Content | Many pages mix executive, analyst, and operations copy without audience targeting. | Rewrite page intros and chart notes around decisions: quote-safe, source-backed, internal-only, or advanced. |
| Localization | P0. `next-intl` exists, but shared components, data-driven components, chart labels, tables, filters, and admin/assistant copy leak English or Russian. | Centralize UI copy, add no-English-leak script, pass locale into analytical components, and create glossary/review flow. |
| Performance | Recent improvements are real, but LCP remains about 3.4-4.0s and shared JS is still heavy. | Continue lazy loading, split messages, server-render static summaries, keep charts but defer hydration. |
| Functionality | Routes return 200, admin redirects, basic API checks exist; interactive controls need locale-aware e2e coverage. | Add locale switch, search, filters, tabs, map-load, chart-load, admin-login, and assistant smoke tests. |
| Credibility | Source governance is strong for the repo size, but source confidence is not visible enough in every headline. | Make quote-safe classification mandatory for KPIs and page headers. |

## 2. Live Site Inspection Summary

Live route checks used `Invoke-WebRequest` after network approval. All inspected routes returned HTTP 200; `/en/admin` redirect behavior was already covered by tests but `/admin/login` was fetched directly.

| Route | First impression | UX/UI/content issues | Localization problems verified | Functionality/perf/a11y concerns | Recommendation | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `/en` | Strongest page; executive brief, source quality, and live readiness are useful. | Too many same-weight sections; relationship pillars compete with KPI strip. | English page leaks Russian timezone labels. | LCP 3.8-4.0s in Lighthouse artifacts; source/action blocks are dense. | Keep and refine hierarchy. | P0/P1 |
| `/ru` | Top shell partly localized. | Same density as EN. | English strings remain: "Executive brief", "Recommended next actions", English footer. | Same as EN. | Fix shell and overview copy extraction. | P0 |
| `/uz-latn` | Uzbek shell partly localized. | Uzbek homepage still feels English-first. | H1 is English: "Cooperation brief - UZ - US"; Russian timezone labels leak. | Same as EN. | Fix overview locale branches. | P0 |
| `/en/trade` | Useful: annual, methodology, monthly, advanced section. | Executive cards are good but all charts need consistent source/unit/meaning notes. | Expected English; still has Russian timezone shell. | Lazy loading improved; chart controls need a11y names. | Preserve all charts, group advanced. | P1 |
| `/ru/trade` | Route loads and title is Russian. | Technical copy remains English. | English: "Quote-ready series", "Advanced Trade Analysis", "What this means". | Chart labels and controls not localized. | Extract trade page/card/chart copy. | P0 |
| `/uz-latn/trade` | Route loads and title is Uzbek. | Mixed-language analytical body. | Same English leaks as RU. | Same. | Extract trade page/card/chart copy. | P0 |
| `/en/investments` | Good credibility split and privatization empty state. | Actual workspace is still English-only. | Expected English plus Russian timezone shell. | Board/table/map/detail drawer need mobile and keyboard checks. | Keep module, localize and improve fields. | P0/P1 |
| `/ru/investments` | Headline translated. | Workspace feels English. | English: "Source-backed", "All sectors", "No projects", labels, table headers. | Same as EN. | Localize `InvestmentsView`; add typed labels. | P0 |
| `/uz-latn/investments` | Headline translated. | Workspace feels English. | Same English leaks as RU. | Same. | Localize `InvestmentsView`. | P0 |
| `/ru/sectors`, `/uz-latn/sectors` | Good sector matrix concept. | Needs investor-ready opportunity framing. | H1 remains English: "Sector opportunities"; matrix labels English. | Static server component is performant. | Localize page and `SectorsView`; preserve matrix and cards. | P0 |
| `/map` locales | Summary metrics useful; map is gated, good performance choice. | Needs clearer "how to use" note and table fallback. | Shell leaks Russian on EN and English footer on RU/UZ; map internals likely partial. | Map button and popup labels need tests. | Keep gated map, add localized alternative table. | P1 |
| `/benchmark` locales | Valuable advanced analysis. | Strategic read makes claims that need source/methodology clarity. | RU/UZ H1 remains English: "Regional benchmark"; most labels English. | Chart load is gated; heatmap uses color only. | Move to Advanced Analysis nav, localize labels, add text summary. | P0/P1 |
| `/visits` locales | Useful chronology. | Visit detail drawer labels are English; data titles mostly source-language. | Filters/table headers/drawer labels English. | Timeline keyboard/detail modal a11y needs test. | Keep, localize controls and date formatting. | P1 |
| `/agreements` locales | Good legal registry direction. | Needs source confidence and "entry into force" clarity. | Cards, filters, headers, empty state English. | Agreement timeline aria labels English. | Keep, localize and add legal-methodology note. | P1 |
| `/events` locales | Useful calendar with iCal. | Hardcoded `TODAY = 2026-04-21` is risky; should use real current date or configured as-of date. | Filter, search, countdown, event card labels English. | ICS export needs locale-safe title/description and test. | Keep, localize and fix date policy. | P1 |
| `/commitments` locales | Strong operational registry. | Needs public vs internal positioning. | Headers, search, pagination, empty states English. | URL sync exists; needs e2e across locales. | Keep as Operations/Risks. | P1 |
| `/compliance` locales | Useful, source-sensitive. | Legal/trade copy must be careful and non-advisory. | Instrument/status/note/code/category labels and calculator English. | Calculator must stay clearly illustrative, not legal advice. | Localize and add stronger disclaimer. | P1 |
| `/grants` locales | Strong split of UZ internal register vs U.S. assistance. | Must avoid summing incompatible accounting systems. | Section headers, filters, chart/table labels English. | MiniBars has no textual chart summary. | Keep split, localize, add methodology. | P1 |
| `/news` locales | Good curated signal feed. | Needs "strategic signals" framing and quote-safe distinctions. | Filter labels, form labels, "Read", empty states English. | Server-rendered filters are good. | Keep, localize and add source/date policy. | P1 |
| `/prepare` locales | Rich operations workspace. | Very dense; should be operations-only or advanced. | Many visit-prep components have mixed English/Russian/Uzbek literals. | DnD/kanban mobile/a11y risk. | Preserve under Operations, do not foreground public journey. | P2 |
| `/staff` locales | Internal performance module. | Should be hidden or operations-only for public executive mode. | Headers/status labels English. | Contains demo placeholders; privacy sensitivity. | Keep gated/operations; localize internal labels. | P2 |
| `/assistant` locales | Good privacy warning concept. | Needs stronger privacy and source-boundary warning. | "Privacy and scope", unavailable state, suggestions English. | Rate limiting and abuse controls absent. | Keep gated by env; localize; add rate limiting. | P1 |
| `/admin/login` locales | Password gate works as a page. | Form copy is English-only. | "Admin sign-in", "Password", "Sign in" English. | Needs brute force/rate-limit plan. | Localize and harden. | P1 |

## 3. Repository Inspection Summary

| Area | What exists and what is good | What is broken / root cause | Files involved | Fix | Risk | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Package/build | pnpm, Next 16.2.4, React 19, next-intl, Playwright, axe, Lighthouse, Vitest, validation scripts. | No i18n leak test; `verify` omits e2e/a11y/LH by design. | `package.json`, `playwright.config.ts`, `lhci.config.cjs` | Add `test:i18n`; keep heavy commands separate. | Low. | P0 |
| Next config | Uses next-intl plugin, optimized package imports, image patterns, compression. | Metadata in root layout is English only; root `<html lang="en">` not locale-aware because locale layout does not set `<html>`. | `next.config.ts`, `app/layout.tsx`, `app/[locale]/layout.tsx` | Move locale-specific metadata/lang strategy into locale layout or use metadata generation. | Medium. | P1 |
| i18n routing | `proxy.ts` has locale prefix always and admin gate. | Locale switch preserves path but not query/hash; aria labels hardcoded. | `proxy.ts`, `LocaleSwitch.tsx` | Preserve search/hash; localize labels. | Low. | P0 |
| Messages | `en/ru/uz-latn` have equal 213 keys. | Coverage is too shallow; equality of keys hides hardcoded strings. | `messages/*.json` | Expand namespaces: shell, charts, filters, badges, tables, admin, assistant. | Medium. | P0 |
| Navigation | Central route list with keys and icons. Good foundation. | Route metadata lacks localized descriptions, audience flags not surfaced in UI/search. | `lib/navigation.ts`, `Sidebar.tsx`, `SearchCommand.tsx` | Add route metadata keys and central search labels. | Low. | P0 |
| Layout shell | Sidebar/topbar/mobile/search/freshness exist; search lazy loaded. | Timezone hardcoded Russian; footer hardcoded English; aria labels English. | `components/layout/*` | Extract shell strings to messages; locale-aware clocks. | Low. | P0 |
| Homepage | Strong command-center content and source quality. | Uses locale branches and English literals instead of message keys; UZ mostly English. | `app/[locale]/page.tsx`, `components/overview/*` | Extract `overviewExecutive`, `relationshipPillars`, source quality labels. | Medium. | P0/P1 |
| Trade | Preserves advanced charts; lazy loading is in place. | Most page/card/chart/filter labels hardcoded English. | `app/[locale]/trade/page.tsx`, `components/trade/*`, `data/trade.ts` | Localize UI labels and add chart alt summaries. | Medium. | P0/P1 |
| Investments | Credibility split, privatization empty state, board/table/map preserved. | Workspace hardcoded English; demo hiding excludes rows only visually in some places; missing owner/counterpart/next action display. | `data/investments.ts`, `InvestmentsView.tsx` | Add translated labels, required fields, quote-safe KPIs. | Medium. | P0 |
| Sectors | Good matrix and cards. | Entire page/component hardcoded English and data text English. | `app/[locale]/sectors/page.tsx`, `SectorsView.tsx`, `data/sectors.ts` | Add locale text maps or message-backed sector copy. | Medium. | P0 |
| Admin/API | Signed cookie gate, cron secret, static fallback, no-downgrade governance. | Login/admin UI not localized; no rate limiting; admin dry-run fetch relative URL may fail if not authenticated in edge cases. | `lib/auth/admin.ts`, `app/api/*`, `components/admin/*` | Add rate limit plan, localized admin labels, POST-only writes enforced. | Medium. | P1 |

## 4. Localization/i18n Master Audit

Architecture finding: the app has route-level locale handling and equal message keys, but copy is split across message files, component literals, data files, and ad hoc locale conditionals. This is why RU/UZ pages often start localized and become English in charts, tables, filters, drawers, and admin/assistant surfaces.

Required standards:

- English route must not show Russian shell labels unless content is intentionally multilingual.
- Russian and Uzbek Latin routes must not show English UI copy except official names, source titles, company names, treaty/source titles, and quoted text.
- Dates, numbers, currencies, chart labels, legends, tooltips, filters, empty states, and CTAs must be locale-aware or explicitly exempted.

Localization issue table:

| String / pattern | Current language | Expected behavior | Location/file | Source type | Fix approach | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `Часовые пояса`, `Ташкент`, U.S. zone names | Russian on every locale | Locale-specific city/zone labels | `components/layout/TimezoneClocks.tsx` | Hardcoded component | Add `shell.timezones.*` keys or local object keyed by locale. | P0 |
| `Tashkent · Presidential Administration` | English on every locale | Localized footer or intentionally bilingual with rule | `Sidebar.tsx`, `MobileSidebar.tsx` | Hardcoded component | Add `shell.footer.location`. | P0 |
| `Open menu`, `Search`, `Toggle theme`, `Switch language` | English aria labels | Localized accessible labels | `Topbar.tsx`, `ThemeSwitch.tsx`, `LocaleSwitch.tsx` | Hardcoded component | Add `shell.actions.*`. | P0 |
| `Search dashboard`, `No results`, entity type badges | English | Localized search dialog | `SearchCommand.tsx` | Hardcoded component | Add `search.*` namespace; localize type labels. | P0 |
| Data subtitles in search results | English data fields | Either localized data titles or source-title exception | `SearchCommand.tsx`, `data/*` | Data-driven | Add localized display fields or translation maps for type/sector/status. | P1 |
| `/uz-latn` overview H1 `Cooperation brief` | English | Uzbek H1 | `app/[locale]/page.tsx` | Locale conditional missing UZ | Add `overview.hero.*` keys. | P0 |
| `/ru` overview `Executive brief`, `Recommended next actions` | English | Russian | `app/[locale]/page.tsx` | Hardcoded component/page | Add `overview.executive.*` namespace. | P0 |
| `/ru` and `/uz-latn` sectors H1 | English | Localized | `app/[locale]/sectors/page.tsx` | Hardcoded page | Use `getTranslations("sectors")`. | P0 |
| `/ru` and `/uz-latn` benchmark H1 | English | Localized | `app/[locale]/benchmark/page.tsx` | Hardcoded page | Add `benchmark.*` messages. | P0 |
| Trade executive cards | English | Localized | `app/[locale]/trade/page.tsx` | Hardcoded page | Add `trade.brief.*`, `trade.cards.*`. | P0 |
| `Advanced Trade Analysis`, `Open`, `Close` | English | Localized | `components/trade/AdvancedTradeAnalysis.tsx` | Hardcoded component | Pass translated labels or use `useTranslations("trade.advanced")`. | P0 |
| Chart legends `Exports`, `Imports`, `Balance` | English | Localized | `MonthlyTradeChart.tsx`, `TradeFlowChart.tsx`, `DualMethodologyChart.tsx` | Chart labels | Add chart label maps and locale-aware tooltip formatters. | P0 |
| Investment filters `All sectors`, `All confidence`, `Min $M` | English | Localized | `InvestmentsView.tsx` | Hardcoded component | Add `investments.filters.*`. | P0 |
| Confidence labels `Verified official`, `Illustrative demo` | English | Localized | `InvestmentsView.tsx`, source badges | Hardcoded enum map | Centralize enum label maps. | P0 |
| Investment table headers/drawer/KV labels | English | Localized | `InvestmentsView.tsx` | Hardcoded component | Add `investments.table`, `investments.drawer`. | P0 |
| Privatization empty state | English | Localized | `InvestmentsView.tsx` | Hardcoded component | Add `investments.privatization.empty.*`. | P0 |
| Agreement filters/table headers | English | Localized | `AgreementsTable.tsx`, `AgreementsStats.tsx`, `AgreementsTimeline.tsx` | Hardcoded components | Add `agreements.registry.*`. | P1 |
| Event filters/search/export/countdown | English | Localized | `EventsView.tsx` | Hardcoded component | Add `events.controls.*`; use Intl.RelativeTimeFormat. | P1 |
| Commitments headers/pagination/search | English | Localized | `CommitmentsTable.tsx` | Hardcoded component | Add `commitments.table.*`. | P1 |
| Compliance calculator and disclaimer | English | Localized | `ExportCalculator.tsx` | Hardcoded component | Add `compliance.calculator.*`; preserve legal caution. | P1 |
| Grants filters/cards/methodology | English | Localized | `GrantsView.tsx`, `ForeignAssistanceView.tsx` | Hardcoded components | Add `grants.*` namespaces. | P1 |
| News filters/search/read/empty | English | Localized | `NewsFeed.tsx` | Hardcoded component | Add `news.feed.*`. | P1 |
| Admin/login | English | Localized | `app/[locale]/admin/*`, `components/admin/*` | Hardcoded components | Add `admin.login`, `admin.ops`. | P1 |
| Assistant copy/suggestions/errors | English | Localized | `components/assistant/*`, `app/[locale]/assistant/page.tsx` | Hardcoded components | Add `assistant.*`; pass locale to chat. | P1 |
| Dates/numbers default `en-US` | English formatting | Locale-aware | Many files listed by `rg` | Formatting | Add `locale-utils` for date/number/currency. | P1 |

Recommended localization architecture:

1. Keep `next-intl` as the single UI copy source of truth.
2. Add namespaces: `shell`, `search`, `routes`, `charts`, `tables`, `enums`, `sourceQuality`, `investments`, `trade.advanced`, `admin.login`, `assistant.chat`.
3. Add typed message key coverage by generating key lists in a validation script.
4. Add `scripts/audit-i18n.mjs` to scan locale routes/components for forbidden leaks.
5. Add route-level locale screenshot/smoke tests for `/ru` and `/uz-latn`, not only `/en`.
6. Define exception rules: official source titles, company names, agency names, treaty titles, source IDs, HS/EBOPS/ECCN terms may remain original; UI labels and explanations must translate.
7. Create RU/UZ glossary for: investment pipeline, privatization, source-backed, quote-safe, owner review, source needed, methodology, turnover, balance, counterpart, commitment, compliance.
8. Human review workflow: machine extraction -> bilingual editor review -> owner sign-off for policy/legal terms.

## 5. UX and Product Journey Redesign

Target journey:

| Section | Purpose | Audience | Above the fold | Secondary | Advanced/hidden |
| --- | --- | --- | --- | --- | --- |
| Executive Brief | Answer where the relationship stands now, what changed, and what to do next. | Officials, diplomats, investors. | 3-5 quote-safe KPIs, top insight, top risks, next actions. | Relationship pillars, 90-day horizon. | Full source quality, live connector details. |
| Trade & Economic Flows | Explain bilateral goods/services flows and methodology. | Analysts, trade officials, business. | Quote-ready UZ-side annual summary and methodology note. | Monthly Census, product categories. | HS-6, Comtrade mirror, ITC, EBOPS. |
| Investment & Privatization | Separate verified opportunity pipeline from pending/demo. | MIIT/UzInvest, U.S. investors, DFC/EXIM. | Verified official pipeline, pending review count, next action. | Board/table/map, confidence legend. | Demo rows, privatization schema diagnostics. |
| Sectors & U.S. Market Entry | Convert sector data into market-entry decisions. | Companies, investment promotion, delegations. | Opportunity matrix with U.S. fit, readiness, risk, action. | Sector cards. | Methodology and raw sector source notes. |
| Diplomacy, Agreements & Stakeholders | Connect visits, agreements, counterparts, contacts. | MFA, embassy, analysts. | Momentum summary and upcoming engagements. | Visits, legal registry, counterpart grid. | Counterpart detail cards. |
| Risks, Bottlenecks & Actions | Turn findings into accountability. | Center staff, officials. | Top blockers and owners. | Commitments, compliance, grants, signals. | Full operational trackers. |
| Sources & Methodology | Make every figure auditable. | All serious users. | Source taxonomy and quote-safe rules. | Source drawer/panel. | Data owner registry and freshness decay logic. |
| Advanced Analysis | Preserve complex charts without overloading first journey. | Analysts/researchers. | Entry points to trade, benchmark, map, technical exhibits. | Charts/tables grouped by method. | Raw technical notes. |
| Operations/Admin | Internal settings, ingestion, staff, visit prep. | Center staff/admin. | Gate and readiness overview. | Data ops, registries, staff. | Backend pending modules. |

## 6. UI and Visual Design Plan

Design direction: executive-grade intelligence, not generic SaaS. Use restrained surfaces, tight spacing, sober accents, and source/confidence visible at the point of interpretation.

Rules:

- Use 7-9 primary nav items max; move staff/admin/prepare under Operations and benchmark/map/trade technical exhibits under Advanced Analysis.
- Replace equal-weight card fields with three levels: executive brief cards, analytical panels, operational registries.
- Every chart card gets: title, unit, source chip, methodology note, "What this means", optional "How to use".
- Source/confidence badges: visible, low-noise, but not hidden. Use taxonomy colors consistently.
- Demo/verified labels: do not hide demo warnings for polish; presentation mode must be clearly internal.
- Mobile: tables get summary cards or sticky first column, charts get min-height and overflow-safe legends.
- Print/PDF: preserve source badges and methodology notes; hide nav/admin controls.
- Avoid new gradient/orb decoration. Current palette is broad enough; tune contrast instead.

## 7. Content and Storytelling Plan

Narrative:

1. Relationship snapshot: current state, verified metrics, latest changes.
2. Strategic signals: diplomatic/business/policy developments with source dates.
3. Trade/economic flows: quote-ready series first, advanced methodology lower.
4. Investment opportunities: verified vs pending vs illustrative; next actions.
5. Privatization pipeline: only source-backed records, safe empty state otherwise.
6. U.S. market entry: sector opportunity matrix and counterpart fit.
7. Diplomatic momentum: visits, agreements, stakeholders.
8. Risks and bottlenecks: owner, due date, blocker, next step.
9. Sources and methodology: what can be quoted externally.
10. Advanced analysis: preserve detailed charts.

For every major page: add a one-sentence purpose, top insight, "what this means", source/confidence context, recommended action, advanced link, localized copy, and source-backed claims only.

## 8. Investment and Privatization Improvement Plan

Current value:

- `data/investments.ts` has a clear `InvestmentSourceConfidence` taxonomy and `investmentCredibilitySummary`.
- `/investments` uses verified, pending, and illustrative buckets at the top.
- `privatizationOpportunities` is empty, which is good because no fake privatization assets are fabricated.

Problems:

- The workspace still shows English-only filters/table/drawer in RU/UZ.
- Some pending rows from `input_figma_pdf` can visually feel official unless confidence is made stronger.
- Project cards do not consistently display `usCompanyRelevance`, `nextStep`, `blockers`, `requiredApprovals`, owner/counterpart, and quote-safe status.

Required model additions:

- `projectOwner`, `governmentCounterpart`, `nextAction`, `blockers`, `stage`, `quoteSafe`, `asOfDate`, `dataOwner`, `sourceReviewStatus`.
- Privatization record fields already exist; keep empty state until sourced.

Investment acceptance rules:

- Verified headline metrics include only `verified_official` and `company_confirmed`.
- Pending/source-needed rows can be visible but must not be quote-safe by default.
- Illustrative demo rows remain searchable and filterable, but never included in public headline totals.
- Any fake privatization company or official figure is prohibited.

## 9. Trade and Advanced Analysis Plan

Preserve:

- Annual trade summary.
- Monthly Census trade.
- UZ Stat vs U.S. Census methodology comparison.
- Product categories.
- HS-6/HS-2/Comtrade/ITC exhibits.
- Services/EBOPS.
- Benchmark-linked charts.

Visualization preservation matrix:

| Current chart/component | File path | Value provided | Current problem | Target location | Preserved | Risk if changed | Recommendation | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Overview trade flow editorial | `components/overview/TradeFlowEditorial.tsx` | Fast executive framing of bilateral flows. | Needs localized labels/source note and clearer quote-safe context. | Homepage Executive Brief; detailed chart link to Trade. | Keep visual and summary. | Misquoting if context is removed. | Keep and localize. | High |
| Overview trade flow chart | `components/charts/TradeFlowChart.tsx` | Compact relationship signal on trade direction. | Needs alt text and localized axis/legend/unit labels. | Homepage plus Trade summary. | Keep chart. | Accessibility regression if only visual. | Keep and add chart summary. | High |
| Grants donut | `components/overview/GrantsDonut.tsx` | Shows assistance composition at a glance. | Needs unit/source clarity and mobile-safe legend. | Homepage as a compact signal; detailed grants page. | Keep chart and source context. | Users may confuse grant workbook vs official totals. | Keep with stronger methodology note. | Medium |
| 3D globe | `components/overview/Globe3D.tsx` | Provides spatial/executive polish and relationship geography. | Heavy visual, should not block first content. | Homepage secondary visual, lazy-loaded. | Keep, defer hydration. | Performance cost or blank canvas on weak devices. | Keep lazy-loaded with fallback. | Medium |
| Activity timeline | `components/overview/ActivityTimeline.tsx` | Shows recent relationship momentum. | Needs locale dates and source/confidence chips. | Homepage and Strategic Signals. | Keep events and links. | Timeline can imply official priority if unsourced. | Keep and label. | High |
| Upcoming events | `components/overview/UpcomingEvents.tsx` | Gives immediate operational awareness. | Needs dynamic current date, locale dates, and source status. | Homepage compact; Events full route. | Keep. | Stale "today" logic damages trust. | Keep and fix freshness. | High |
| Monthly trade chart | `components/trade/MonthlyTradeChart.tsx` | Key time-series for recent trade changes. | Needs localized tooltips, axis, "what this means", and source note. | Trade main route, above advanced section. | Keep chart. | Misread seasonality or units. | Keep and explain. | High |
| Dual methodology chart | `components/trade/DualMethodologyChart.tsx` | Explains U.S. Census vs UZ Stat differences. | Technical; needs quote-ready note and localized methodology. | Trade main route, near quote-ready KPI; advanced detail below. | Keep comparison. | Wrong quoted figure if simplified too far. | Keep, simplify wording. | High |
| Trade table | `components/trade/TradeTable.tsx` | Preserves detailed numerical record. | Dense on mobile; headers and units need localization. | Trade detail tab and Advanced Analysis. | Keep table. | Loss of analyst utility if hidden too deeply. | Keep with responsive mode. | High |
| TradeMap products/exhibits | `components/trade/TrademapProducts.tsx`, `components/trade/TrademapExhibits.tsx` | Product and ITC/HS analytical depth. | Too technical for first screen; labels likely English-only. | Trade Advanced Analysis. | Keep HS/product evidence. | Expert users lose export opportunity insight. | Move to advanced disclosure/subroute. | High |
| Advanced trade analysis | `components/trade/AdvancedTradeAnalysis.tsx` | Preserves advanced charts, caveats, source comparisons. | English-only disclosure controls and high cognitive load. | Advanced Analysis route plus Trade page disclosure. | Keep every exhibit. | Deletion would weaken analyst value. | Move/group, do not delete. | High |
| Investment board/table/map workspace | `components/investments/InvestmentsView.tsx` | Core project pipeline, map/table/detail surfaces. | English controls, weak action fields, mobile complexity. | Investment & Privatization route. | Keep board, table, map, drawer. | Fake certainty if pending/demo records look official. | Keep and strengthen confidence/action UX. | High |
| Map load gate and flat map | `components/map/MapLoadGate.tsx`, `components/map/FlatMap.tsx`, `components/map/UsCenteredMap.tsx` | Geographic view of projects, visits, and economic lanes. | Heavy map dependency and popup localization gaps. | Map route; summary map may remain lazy. | Keep map and fallback. | Performance and accessibility issues if no table fallback. | Keep lazy-loaded with accessible list fallback. | Medium |
| Benchmark chart | `components/benchmark/BenchmarkChart.tsx`, `components/benchmark/BenchmarkView.tsx` | Regional comparison and competitive context. | English title/body and color-heavy interpretation. | Benchmark route; summary card in Executive Brief if needed. | Keep metrics. | Oversimplified rankings can mislead policy readers. | Keep and add textual caveats. | High |
| Sectors matrix/grid | `components/sectors/SectorsView.tsx`, `components/overview/SectorsGrid.tsx` | Shows priority sectors and cooperation lanes. | English labels and weak next-action connection. | Sectors route; homepage compact grid. | Keep sector cards. | Missing localization hurts core audience. | Keep and localize. | High |
| Agreements timeline/stats/table | `components/agreements/AgreementsTimeline.tsx`, `components/agreements/AgreementsStats.tsx`, `components/agreements/AgreementsTable.tsx` | Preserves diplomatic/legal record. | Registry framing and labels need localization and quote-safe nuance. | Diplomacy & Stakeholders plus Advanced registry. | Keep timeline, stats, table. | Legal/diplomatic overclaim risk. | Keep with source/status labels. | High |
| Commitments table | `components/commitments/CommitmentsTable.tsx` | Tracks bilateral follow-through. | Headers, search, status labels English. | Risks, Bottlenecks & Actions / Operations. | Keep table. | Could expose internal operational assumptions. | Keep; separate public vs ops view. | Medium |
| Grants and assistance views | `components/grants/GrantsView.tsx`, `components/grants/ForeignAssistanceView.tsx` | Differentiates grants workbook and foreign assistance data. | Filters and methodology need stronger distinction. | Grants route; source/methodology drawer. | Keep both views. | Blending sources could create false official total. | Keep and clarify methods. | High |
| Visit prep dashboards | `components/visit-prep/*`, `app/[locale]/prepare/page.tsx` | Useful operational readiness and delegation planning. | Too internal for public executive IA; labels English. | Operations / Visit Prep, visually separated. | Keep readiness scorecard, timeline, logistics, docs. | Public users may mistake internal readiness for official commitments. | Move/label as operations. | Medium |

Improve:

- Executive trade summary first: "which figure to quote and why".
- Add clear units and methods to every chart.
- Add localized chart legend/axis/tooltips.
- Add non-visual chart summaries for screen readers.
- Keep advanced charts in `AdvancedTradeAnalysis`, but make it a real route or subnav entry as well.
- Continue dynamic imports/lazy loading; do not delete charts for performance.

## 10. Functionality and QA Plan

Bug table:

| Bug | Severity | Repro | Likely cause | Files | Fix | Test |
| --- | --- | --- | --- | --- | --- | --- |
| Russian timezone labels on all locales | P0 | Visit `/en`, `/uz-latn`; sidebar shows Cyrillic timezone labels. | Hardcoded `CITIES` and title. | `TimezoneClocks.tsx` | Locale keyed labels. | `test:i18n`, Playwright locale assertions. |
| RU/UZ sectors H1 English | P0 | `/ru/sectors`, `/uz-latn/sectors`. | Page never uses translations. | `app/[locale]/sectors/page.tsx` | Add messages. | Locale route test. |
| RU/UZ benchmark H1 English | P0 | `/ru/benchmark`, `/uz-latn/benchmark`. | Page never uses translations. | `app/[locale]/benchmark/page.tsx` | Add messages. | Locale route test. |
| Search dialog hardcoded English | P0 | Any RU/UZ, open search. | Hardcoded strings and data fields. | `SearchCommand.tsx` | Add search namespace. | Search e2e. |
| Locale switch drops query/hash | P1 | `/en/news?tag=trade#x`, switch locale. | Path replacement ignores query/hash in router state. | `LocaleSwitch.tsx` | Preserve search/hash. | E2E. |
| Events current date stale | P1 | `/events`; countdown based on 2026-04-21. | Hardcoded `TODAY`. | `EventsView.tsx` | Use current date or configured as-of. | Unit/e2e. |
| Admin/assistant unlocalized | P1 | RU/UZ admin/login/assistant. | Hardcoded UI. | `app/[locale]/admin/*`, `components/assistant/*` | Add message namespaces. | Locale smoke. |
| Chart labels unlocalized | P1 | RU/UZ charts. | Recharts data keys are English. | `components/charts/*`, `components/trade/*` | Locale label maps. | Screenshot/e2e. |

Test coverage needed:

- Route smoke for all routes and locales.
- Locale switch preservation.
- Search open/type/select.
- Filters/tabs/accordions on investments, trade, agreements, commitments, news, grants.
- Chart load buttons and lazy sections.
- Map load and fallback table.
- Admin login redirect and failed login.
- Assistant disabled and enabled states.
- Print/PDF buttons.
- Responsive breakpoints and horizontal table behavior.
- Source links and broken-link scan.

## 11. Performance Plan

Current measured artifacts:

- Most routes: Lighthouse Performance 91-92, A11y 96-100.
- Overview has two artifacts: newer `lh-_overview.json` P89/427 KiB and older `lh-overview.json` P88/674 KiB.
- LCP remains around 3.4-4.0s. CLS is 0. TBT is low after lazy-loading improvements.

Recommendations:

- Lazy-load map/globe/chart/admin/assistant modules; already partially done.
- Split message payload by namespace if practical.
- Server-render static summaries and tables; keep interactive controls only where needed.
- Memoize expensive computed filters in client tables and charts.
- Keep map runtime gated by load button.
- Keep advanced trade charts behind disclosure or route-level Advanced Analysis.
- Add performance budgets: initial transfer under 400 KiB for normal pages, under 450 KiB for overview, LCP under 3.0s mobile target, TBT under 100ms.

Measurement commands:

- `corepack pnpm build`
- `corepack pnpm lhci`
- `node scripts/lh-all.mjs`
- Add `analyze:bundle` if bundle analyzer is configured later.

## 12. Accessibility Plan

Issue table:

| Issue | Location | Severity | WCAG concern | Fix | Acceptance |
| --- | --- | --- | --- | --- | --- |
| Unlocalized aria labels | Shell/search/theme/locale | P0 | Name/role/value, language consistency | Message-backed aria labels. | Axe + locale text assertions. |
| Chart-only meaning | Charts/maps | P1 | Non-text content | Add text summaries and `aria-describedby`. | Screen-reader summary exists. |
| Color-only heatmap/status | Benchmark/status badges | P1 | Use of color | Add text labels and patterns/values. | Meaning understandable without color. |
| Table headings/captions missing | Several tables | P1 | Info and relationships | Add captions, scopes where useful. | Axe no serious table issues. |
| Dialog close buttons unlabeled | Some drawers | P1 | Button name | Add localized aria-label. | Axe pass. |
| DnD Kanban mobile | Visit prep | P2 | Keyboard operation | Add keyboard alternatives or non-DnD table. | Keyboard path exists. |
| Touch targets in dense filters | Mobile filters | P2 | Target size | Increase min height to 36-40px. | Mobile tap audit. |

## 13. Security and Reliability Plan

Good:

- Admin area uses signed httpOnly cookie, `secure` in production, safe redirect check.
- Cron requires bearer `CRON_SECRET`.
- Assistant is env-gated and body-limited.
- Supabase service key is server-only.
- Static fallback protects availability.

Risks:

- No login rate limiting/brute-force protection.
- Assistant lacks per-IP/user rate limiting and privacy banner enforcement.
- Admin APIs allow dry-run via GET; writes are POST with body, but make write semantics stricter.
- Public live snapshot endpoints can hit external sources and should have rate/caching controls.
- Admin UI includes real staff/contact names; confirm public/internal boundary.

Recommendations:

- Add rate limiting to `/api/chat`, admin login, live probes, and admin ingest.
- POST-only any write or write-capable endpoint; dry-run can remain GET but cannot write.
- Add CSRF posture review for server actions and admin POSTs.
- Keep secrets documented in `.env.example`; never expose service role key client-side.
- Add assistant privacy warning and refusal to process personal/confidential data.

## 14. Data Credibility and Source Governance Plan

Current strengths:

- `data/sources.ts` central registry has 63 sources.
- `DEMO_DATA_REGISTRY.md`, `DATA_INVENTORY.md`, and `SOURCE_REGISTRY.md` exist.
- `validate:data` checks source references, route presence, env docs, schema, and message key parity.
- `lib/data-governance/*` has no-downgrade policy and static fallback.

Required taxonomy:

- `verified_official`
- `company_confirmed`
- `media_reported`
- `internal_unverified`
- `source_needed`
- `illustrative_demo`

Governance rules:

- Every KPI gets `sourceId`, `asOf`, `confidence`, `quoteSafe`.
- No headline metric can include illustrative demo data.
- Internal/unverified can inform operations but not public quote cards.
- Demo rows can remain for UI testing but must be marked and excluded from verified totals.
- Freshness should be displayed but internal legal sources should not decay like live statistical sources.
- Add owner/data steward fields for investment, privatization, commitments, and source registries.

## 15. Information Architecture Plan

| Current route | Current purpose | Problem | Recommendation | Preserve/move/simplify | Priority |
| --- | --- | --- | --- | --- | --- |
| `/[locale]` | Overview | Too much same-weight content | Executive Brief home | Preserve/refine | P1 |
| `/trade` | Trade analysis | Good but technical | Trade & Economic Flows | Preserve/group advanced | P1 |
| `/investments` | Portfolio | P0 localization, missing action fields | Investment & Privatization | Preserve/enhance | P0 |
| `/sectors` | Sector cards | Not localized | Sectors & U.S. Market Entry | Preserve/rework | P0 |
| `/map` | U.S. footprint | Advanced, heavy | Advanced Analysis or Geography | Preserve/move | P1 |
| `/benchmark` | Peer benchmark | Not localized, advanced | Advanced Analysis | Preserve/move | P0/P1 |
| `/visits` | Chronology | Detail labels English | Diplomacy | Preserve | P1 |
| `/agreements` | Legal registry | Needs methodology | Diplomacy/Agreements | Preserve | P1 |
| `/events` | Calendar | Stale current date | Diplomacy/Signals | Preserve/fix | P1 |
| `/commitments` | Tracker | Operational | Risks & Actions | Preserve | P1 |
| `/compliance` | Export/sanctions | Legal caution | Risks & Compliance | Preserve with disclaimer | P1 |
| `/grants` | Grants/assistance | Accounting risk | Aid & Grants under Risks/Signals | Preserve | P1 |
| `/news` | Curated feed | Needs strategic framing | Strategic Signals | Preserve | P1 |
| `/prepare` | Visit operations | Too internal for public | Operations | Preserve/move | P2 |
| `/staff` | Staff KPI | Internal/privacy | Operations/Admin | Preserve/gate | P2 |
| `/assistant` | AI Q&A | Needs privacy/rate limit | Assistant / Advanced | Preserve/harden | P1 |
| `/admin` | Operations | Unlocalized, hardening | Operations/Admin | Preserve/gate | P1 |

Final primary nav:

1. Executive Brief
2. Trade & Economic Flows
3. Investment & Privatization
4. Sectors & U.S. Market Entry
5. Diplomacy & Stakeholders
6. Risks, Bottlenecks & Actions
7. Strategic Signals
8. Sources & Methodology
9. Advanced Analysis

Operations/Admin should be visually separated from public/executive nav.

## 16. File-by-file Implementation Plan

| File path | Role | Issue | Change | Risk | Difficulty | Loc? | Visuals? | Test |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `app/[locale]/page.tsx` | Homepage | Locale branches, English UZ, many hardcoded cards | Extract hero/executive/action strings; locale-aware formatting | Medium | M | Yes | Yes | Locale screenshots |
| `app/[locale]/trade/page.tsx` | Trade route | English cards/titles/table headings | Add trade page messages | Low | M | Yes | Yes | Route/i18n |
| `app/[locale]/investments/page.tsx` | Investment route | Stats/card copy English | Message-backed cards and quote-safe labels | Low | S | Yes | No | Route/i18n |
| `components/investments/InvestmentsView.tsx` | Investment UI | P0 hardcoded filters/table/drawer | Add `useTranslations`; enum label helpers; show next action/blockers | Medium | L | Yes | Map/table | E2E |
| `data/investments.ts` | Investment data | Needs owner/action schema filled safely | Add optional fields only; do not invent values | Medium | M | No | No | validate:data |
| `app/[locale]/sectors/page.tsx` | Sectors route | Not localized | Use `getTranslations("sectors")` | Low | S | Yes | No | Locale smoke |
| `components/sectors/SectorsView.tsx` | Sector matrix | English labels/data text | Pass locale/translate labels; data localized map | Medium | M | Yes | No | i18n |
| `app/[locale]/map/page.tsx` | Map route | Manual locale object incomplete | Move to messages; add UZ date/number formatting | Low | M | Yes | Map | E2E |
| `components/map/*` | Map runtime | Popup/layer labels likely English | Localize controls/popups; add table fallback | Medium | M | Yes | Map | E2E |
| `app/[locale]/benchmark/page.tsx` | Benchmark route | English H1 | Add benchmark messages | Low | S | Yes | Chart | Locale smoke |
| `components/benchmark/BenchmarkView.tsx` | Benchmark UI | English labels and color-only heatmap | Localize metrics; add text summaries | Medium | M | Yes | Chart | A11y |
| `app/[locale]/visits/page.tsx` | Visits | Source anchor text English | Translate source label | Low | S | Yes | No | i18n |
| `components/visits/*` | Visits UI | Filters/table/drawer labels English | Add messages and date format | Medium | M | Yes | No | E2E |
| `app/[locale]/agreements/page.tsx` | Agreements | Page cards English | Add messages | Low | S | Yes | Chart | i18n |
| `components/agreements/*` | Agreement UI | Filters/headers/status English | Add enum maps | Medium | M | Yes | Chart | E2E |
| `app/[locale]/events/page.tsx` | Events | Stats/header English | Add messages | Low | S | Yes | No | i18n |
| `components/events/EventsView.tsx` | Calendar | Hardcoded TODAY, labels English | Locale date/relative time; configured as-of | Medium | M | Yes | No | Unit/e2e |
| `app/[locale]/commitments/page.tsx` | Commitments | Stats/card copy English | Messages | Low | S | Yes | No | i18n |
| `CommitmentsTable.tsx` | Table | Headers/pagination/search English | Table namespace | Medium | M | Yes | Table | E2E |
| `app/[locale]/compliance/page.tsx` | Compliance | Table headers English | Messages | Low | S | Yes | Table | i18n |
| `ExportCalculator.tsx` | Calculator | Legal copy English | Localize, add disclaimer | Medium | M | Yes | No | A11y |
| `app/[locale]/grants/page.tsx` | Grants | Section cards English | Messages | Low | S | Yes | Chart | i18n |
| `components/grants/*` | Grant UI | Filters/card/methodology English | Message namespace | Medium | M | Yes | Chart | E2E |
| `app/[locale]/news/page.tsx` | News | Stats/card copy English | Messages | Low | S | Yes | No | i18n |
| `NewsFeed.tsx` | Feed | Filters/read/empty English | Server message props or locale labels | Medium | M | Yes | No | E2E |
| `app/[locale]/prepare/page.tsx` | Visit prep | Rich but internal, mixed labels | Preserve under Operations; localize controls | Medium | L | Yes | Kanban | E2E |
| `app/[locale]/staff/page.tsx` | Staff | Internal labels English | Localize or gate | Low | M | Yes | No | i18n |
| `app/[locale]/assistant/page.tsx` | Assistant | Privacy scope English | Messages; stronger privacy warning | Low | S | Yes | No | i18n |
| `components/assistant/*` | Assistant UI | Suggestions/errors English | Pass locale/messages; rate-limit server | Medium | M | Yes | No | API/e2e |
| `app/[locale]/admin/login/*` | Login | English-only | Add `admin.login` messages | Low | S | Yes | No | E2E |
| `components/layout/*` | Shell | Mixed languages | Add shell/search namespaces | Low | M | Yes | No | P0 i18n |
| `messages/*.json` | UI copy | Too shallow | Expand namespaces | Medium | L | Yes | No | test:i18n |
| `scripts/validate-data.mjs` | Governance | No leak detection | Keep source checks; add separate i18n audit | Low | S | Yes | No | test:i18n |
| `AGENTS.md` | Contributor guardrails | Missing | Add project-specific rules | Low | S | No | No | Review |

## 17. Implementation Roadmap

| Phase | Item | Problem | Action | Likely files | Impact | Difficulty | Risk | Acceptance | Commands |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | Language leakage architecture | P0 mixed shell | Add i18n audit, localize shell, inventory hardcoded strings | `components/layout/*`, `messages/*`, `scripts/*` | High | M | Low | RU/UZ no shell leaks | `pnpm test:i18n`, `pnpm typecheck` |
| A | Nav/search labels | Search/nav inconsistencies | Centralize route metadata and search labels | `lib/navigation.ts`, `SearchCommand.tsx` | High | M | Low | Search localized | `pnpm test:e2e` |
| A | README/data honesty | Docs may overstate readiness | Align docs with current defects and commands | `README.md`, `AGENTS.md` | Medium | S | Low | Docs truthful | `pnpm check:package` |
| A | Demo/verified headlines | Avoid quote risk | Enforce verified headline totals only | `investments.ts`, pages | High | S | Low | No demo in headline | `pnpm validate:data` |
| B | Message extraction | Hardcoded UI copy | Extract page/component strings | app/components/messages | Very high | L | Medium | No-English leak script passes | `pnpm test:i18n` |
| C | Executive polish | Prototype feel | Refine homepage/page hierarchy and source chips | Overview, UI components | High | M | Medium | 10-sec clarity improved | screenshot QA |
| D | Investment UX | Top module incomplete | Cards/funnel/table/action fields | `InvestmentsView.tsx`, data | Very high | L | Medium | Verified/pending/demo clear | e2e |
| E | Trade advanced | Technical overload | Group and explain advanced charts | trade components | High | M | Low | Charts preserved and explained | a11y/e2e |
| F | QA | Regression risk | Add route/locale/filter/chart tests | tests/scripts | High | L | Low | CI confidence | `pnpm verify`, browser tests |
| G | Hardening | Prod risk | A11y, perf, auth/rate limits | API/layout/charts | High | L | Medium | release checklist green | `pnpm test:a11y`, `pnpm lhci` |

## 18. Implementation Tickets

| Priority | Title | Goal | Scope | Files likely involved | Exact change | Must not change | Acceptance criteria | Validation commands | Rollback risk | Dependencies |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Localization architecture audit and hardcoded string inventory | Make language leakage visible and repeatable. | Static source scan plus optional rendered route scan. | `scripts/audit-i18n.mjs`, `package.json`, `messages/*`, `components/layout/*` | Add an audit script that checks same-as-English message values, known hardcoded source hotspots, and live/local route output when `--base-url` is passed. | Do not block source titles, agency names, company names, treaty names, HS/ECCN/EBOPS terms, or cited source names. | `pnpm audit:i18n` reports current defects; `pnpm test:i18n` fails while P0 leaks remain. | `corepack pnpm audit:i18n`; `corepack pnpm test:i18n` | Low; remove script and package entries. | None. |
| 2 | No-English-leak validation gate | Turn localization into a release blocker. | Fail on RU/UZ English UI leaks and EN/UZ Russian shell leaks. | `scripts/audit-i18n.mjs`, future `tests/i18n/*` | Expand allowlists and route patterns; add CI usage after initial fixes. | Do not add false positives for official names or original-language source titles. | Gate passes only when shared shell, page titles, controls, chart labels, empty states, and badges are localized. | `corepack pnpm test:i18n -- --base-url=http://localhost:3000` after wiring support | Medium if CI enabled too early; keep out of `verify` until defects are fixed. | Ticket 1. |
| 3 | Centralized navigation/search/locale labels | Stop route/search labels from drifting across components. | Navigation groups, route titles, search placeholders, entity badges. | `lib/navigation.ts`, `components/layout/SearchCommand.tsx`, `components/layout/Sidebar.tsx`, `components/layout/MobileSidebar.tsx`, `messages/*` | Move display labels and search entity labels into message namespaces or typed localized route metadata; pass locale/messages into search. | Do not remove routes or hide operations/admin from search. | RU/UZ search dialog has localized title, placeholder, entity badges, no-result text, and route descriptions. | `corepack pnpm test:i18n`; `corepack pnpm test:e2e` | Medium; search UX is broad. | Ticket 1. |
| 4 | Locale switch route preservation | Make language switching keep the user's current context. | Pathname, query string, and hash preservation. | `components/layout/LocaleSwitch.tsx`, `tests/e2e/routes.spec.ts` | Replace locale segment while preserving `?query` and `#hash`; localize aria label. | Do not change supported locale codes or `proxy.ts` prefix behavior. | `/en/news?tag=trade#signals` switches to `/ru/news?tag=trade#signals`. | `corepack pnpm test:e2e`; manual browser check | Low. | Ticket 3 helpful but not required. |
| 5 | Homepage Executive Brief polish | Make first 10 seconds executive-grade. | Hero, KPI strip, brief cards, next actions, source quality. | `app/[locale]/page.tsx`, overview components, `messages/*` | Extract copy to messages; make top insight and recommended actions clearer; keep source quality/live readiness visible. | Do not remove data-quality warnings, source quality cards, or advanced links. | EN/RU/UZ homepage gives localized title, purpose, top insight, what it means, and next actions. | `corepack pnpm test:i18n`; screenshot QA | Medium; homepage is high visibility. | Tickets 1-3. |
| 6 | Source/confidence badge polish | Make credibility understandable at interpretation points. | Source badges, demo badges, investment confidence labels, quote-safe status. | `components/SourceBadge.tsx`, `components/DemoDataBadge.tsx`, `components/source-quality.tsx`, `data/sources.ts`, `messages/*` | Add localized labels/tooltips; add quote-safe/source-needed/demo styling; ensure badges include text, not only color. | Do not hide warnings or downgrade source IDs. | Every headline KPI has a visible confidence/source context. | `corepack pnpm validate:data`; `corepack pnpm test:a11y`; `corepack pnpm test:i18n` | Medium; label taxonomy affects trust. | Ticket 1. |
| 7 | Investment verified/pending/demo safety | Prevent unsafe headline totals. | Investment metrics, summaries, confidence taxonomy. | `data/investments.ts`, `app/[locale]/investments/page.tsx`, `components/investments/InvestmentsView.tsx`, `scripts/validate-data.mjs` | Enforce verified/company-confirmed-only headline totals; show pending/source-needed/demo as separate counts. | Do not delete demo rows or merge pending/demo into verified metrics. | Headline metric is quote-safe and excludes `illustrative_demo`. | `corepack pnpm validate:data`; `corepack pnpm test:unit` | Medium; affects external interpretation. | Ticket 6 recommended. |
| 8 | Investment cards/funnel/table UX | Make the investment module actionable for officials and companies. | Project cards, pipeline funnel, filters, table, drawer, map handoff. | `components/investments/InvestmentsView.tsx`, `data/investments.ts`, `messages/*` | Add localized filter labels, funnel by stage/confidence, next action/blocker/counterpart fields where sourced or marked missing, table preserved. | Do not invent company relevance, counterpart, owner, blocker, or stage values. | Users can separate verified, pending, source-needed, and demo projects and see next action fields. | `corepack pnpm test:e2e`; `corepack pnpm test:i18n`; `corepack pnpm validate:data` | Medium-high; complex UI. | Tickets 6-7. |
| 9 | Privatization schema and safe empty state | Preserve opportunity area without fake companies. | Empty state, schema, data owner/source requirements. | `data/investments.ts`, `components/investments/InvestmentsView.tsx`, `SOURCE_REGISTRY.md`, `messages/*` | Add source-backed schema fields and localized safe empty state explaining required data. | Do not add fake privatization companies, fake values, or official-sounding placeholders. | Empty state is useful and quote-safe; future data requirements are explicit. | `corepack pnpm validate:data`; `corepack pnpm test:i18n` | Low. | Ticket 6. |
| 10 | Sectors opportunity matrix | Make sector pages decision-oriented and localized. | Sector cards, opportunity matrix, U.S. market-entry signals. | `app/[locale]/sectors/page.tsx`, `components/sectors/*`, `data/sectors.ts`, `messages/*` | Localize page title/body/matrix labels; add what-it-means and next-action copy per sector. | Do not delete sector analysis or source-backed warnings. | RU/UZ sector page has no English UI copy and gives clear sector actions. | `corepack pnpm test:i18n`; route screenshot QA | Medium. | Tickets 1-3. |
| 11 | Trade chart explanation and advanced grouping | Preserve trade depth while improving comprehension. | Annual/monthly/methodology/product/advanced charts. | `app/[locale]/trade/page.tsx`, `components/trade/*`, `data/trade.ts`, `messages/*` | Add localized "what this means", units, quote-ready methodology note, and advanced disclosures/tabs. | Do not delete useful trade charts or methodology comparisons. | Every major trade chart has localized title, legend/axis labels, unit/source note, and interpretation note. | `corepack pnpm test:i18n`; `corepack pnpm test:a11y`; `corepack pnpm lhci` | Medium. | Tickets 1 and 6. |
| 12 | Chart localization and accessibility | Make charts usable in all locales and with assistive tech. | Shared chart wrappers, legends, axes, tooltips, text alternatives. | `components/charts/*`, `components/trade/*`, `components/benchmark/*`, `components/grants/*`, `messages/*` | Add locale-aware number/date formatting, accessible summaries, captions, keyboard-safe controls, and localized tooltip labels. | Do not remove visualizations for accessibility or performance. | Chart content is understandable without color-only cues or mouse-only tooltips. | `corepack pnpm test:a11y`; `corepack pnpm test:i18n` | Medium-high; broad chart surface. | Ticket 11 for trade-specific pieces. |
| 13 | Mobile table/chart behavior | Improve mobile usability without reducing analytical content. | Tables, overflow, sticky labels, mobile summaries. | `components/table/*`, `components/investments/*`, `components/trade/*`, `components/grants/*`, CSS utilities | Add responsive table card summaries, stable chart heights, overflow-safe legends, and touch targets. | Do not hide critical fields without an alternate path. | Key pages are usable at 375px and 768px with no overlapping text. | `corepack pnpm test:e2e`; `corepack pnpm test:a11y`; browser screenshots | Medium. | Tickets 8, 11, 12. |
| 14 | Performance lazy loading | Keep advanced analysis but lower initial route cost. | Heavy charts, maps/globe, assistant, command search, advanced sections. | `components/*Lazy*`, `app/[locale]/*`, `next.config.ts`, `scripts/run-lhci.mjs` | Continue dynamic imports, route splitting, progressive disclosure, server-rendered summaries, and memoized data transforms. | Do not delete charts/maps/tables for performance. | LCP and transferred JS remain within route budgets while charts stay reachable. | `corepack pnpm build`; `corepack pnpm lhci`; bundle analyzer when added | Medium. | Page-specific fixes. |
| 15 | Admin/API hardening | Make operational surfaces safer for production. | Admin login, assistant, cron/import/API endpoints, live data endpoints. | `app/[locale]/admin/login/*`, `app/api/*`, `lib/auth/admin.ts`, `lib/rate-limit*` | Add rate limiting, localized login copy, POST-only writes, privacy warning for assistant, clearer internal/public data boundaries. | Do not weaken `ADMIN_SESSION_SECRET`, cron auth, or RLS expectations. | Brute-force and write endpoints have documented controls; login/assistant copy localized. | `corepack pnpm test:governance`; API tests; `corepack pnpm test:i18n` | Medium-high; auth changes require care. | Ticket 1; owner security review. |
| 16 | Final route/locale/e2e QA | Confirm release readiness across product flows. | Routes, locale switch, search, filters, tabs, accordions, map, charts, investments, admin, assistant, exports/print. | `tests/e2e/*`, `tests/accessibility/*`, `scripts/smoke-routes.mjs`, future `scripts/smoke-live.mjs` | Add coverage for all supported locales and key interactions; include live smoke optional base URL. | Do not make tests depend on private credentials or unstable external data. | All public routes pass EN/RU/UZ smoke; key workflows pass; known admin auth behavior asserted. | `corepack pnpm verify`; `corepack pnpm smoke:routes`; `corepack pnpm test:e2e`; `corepack pnpm test:a11y`; `corepack pnpm test:i18n` | Low-medium; tests may expose real defects. | Most preceding tickets. |

## 19. Validation Plan

Package manager: pnpm because `pnpm-lock.yaml` exists.

Existing commands:

- Install: `corepack pnpm install --offline` if dependencies are present; otherwise `corepack pnpm install`.
- Typecheck: `corepack pnpm typecheck`.
- Lint: `corepack pnpm lint`.
- Build: `corepack pnpm build`.
- Data validation: `corepack pnpm validate:data`.
- Governance: `corepack pnpm test:governance`.
- Unit: `corepack pnpm test:unit`.
- E2E: `corepack pnpm test:e2e`.
- A11y: `corepack pnpm test:a11y`.
- Route smoke: `corepack pnpm smoke:routes`.
- Package hygiene: `corepack pnpm check:package`.
- Lighthouse: `corepack pnpm lhci`.

Recommended additions:

- `test:i18n`
- `test:locale-routes`
- `test:no-english-leak`
- `smoke:live`
- `analyze:bundle`

## 20. Final Recommendation

Top 10 changes first:

1. Add `AGENTS.md` guardrails.
2. Add i18n leak audit script.
3. Localize shell: timezone, footer, aria labels.
4. Localize search command.
5. Fix `/ru` and `/uz-latn` homepage, sectors, benchmark H1/body leaks.
6. Localize investment filters/table/drawer/confidence labels.
7. Add source/confidence/quote-safe badge improvements.
8. Add chart labels and accessible chart summaries.
9. Fix event date policy.
10. Add locale e2e tests.

Top 10 things not to touch yet:

1. Do not delete advanced trade charts.
2. Do not delete map/globe.
3. Do not delete demo rows; quarantine and label them.
4. Do not fabricate privatization assets.
5. Do not merge UZ grant workbook and U.S. assistance totals.
6. Do not expose internal staff/operations as public executive facts without owner review.
7. Do not migrate frameworks.
8. Do not remove source warnings.
9. Do not hide methodology notes.
10. Do not replace source-backed content with generic marketing copy.

Top 10 risks if shipped as-is:

1. RU/UZ routes look unprofessional because English and Russian leak throughout.
2. Executives may quote mixed/demo investment totals if context is missed.
3. Serious users may distrust data if source/confidence is not visible at interpretation points.
4. Legal/trade/compliance copy could be misread as advice.
5. Staff/admin/internal modules may expose operational details to unintended audiences.
6. Advanced users have charts, but non-technical users lack explanations.
7. Mobile users may struggle with tables/charts.
8. Assistant route has privacy/rate-limit gaps.
9. Locale switch and search need better route-state behavior.
10. Stale hardcoded dates can undermine credibility.

What would make it impressive:

- A crisp executive brief with quote-safe KPIs.
- A visibly governed investment pipeline.
- Trade methodology clarity that tells users exactly which figure to quote.
- Sector opportunity matrix tied to U.S. investor fit and next actions.
- Full RU/UZ localization with terminology reviewed by humans.
- Source/confidence drawer available everywhere.
- Advanced analysis preserved, but not forced into the main journey.

First Codex coding pass:

- `AGENTS.md`
- `scripts/audit-i18n.mjs` + `package.json` script
- shell localization fixes
- route preservation in locale switch
- obvious P0 sectors/benchmark/homepage H1 leaks

Owner review before:

- Any deletion/archive of charts.
- Any new investment or privatization facts.
- Any public release of staff/internal operations data.
- Any legal/compliance wording that could be interpreted as advice.
- Any major IA/nav restructuring.
