# Uzbekistan–USA Situational Center — Product Audit

**Audit date:** 2026-07-09
**Scope:** public portal at `https://uz-us-center.vercel.app/en`, localized public routes, and the supplied repository.
**Evidence convention:** **Observed** = current live UI; **Verified** = repository code/data; **Inference** = a recommendation based on the first two; **Not verified** = would require authenticated or production-infrastructure access.

## 1. Executive verdict

- The product is already a polished, unusually rich executive-intelligence portal. Its public brief, trade analysis, investment confidence treatment, source links, roadmaps, map gate, and cross-entity search provide more decision context than a conventional dashboard.
- It is **not yet an operational visit-and-roadmap control room**. The working layer supports roadmap state/note updates and visit-material uploads, but lacks durable actions, individual accountability, evidence, approvals, dependencies, escalation, and post-visit follow-through.
- Do not describe the public executive briefing as live operational data. **Verified:** `data/executive.ts:42` uses a fixed `AS_OF = "2026-07-04"`; the data-governance publication path is not wired into the rendered dashboard.
- Credibility is the release blocker. Executive overview and command-center visualizations aggregate illustrative investment rows into pipeline/sector/counterpart figures without a confidence split (`data/overview.ts:64-142`, `data/executive.ts:275-296`). Agreements and compliance also render demo rows as ordinary facts.
- Localization is also a release blocker. Live EN/RU/UZ shells are largely translated, but verified hardcoded English remains in benchmark, trade-chart, agreement, compliance, admin, map, and source-badge UI. The static i18n check passes while missing these rendered-route cases.
- The information architecture is strong for exploration but weak for “what must happen today?” The decision strip and roadmap status help, but users cannot reliably see an accountable owner, exact deadline, proof, blocker, or escalation path for a commitment.
- Security fundamentals are promising: signed secure sessions, protected write routes, CRON secret checking, server-side service credentials, and RLS are present. The audit trail, rate limiting/live-probe controls, and upload content validation are not yet sufficient for production operations.
- Preserve the analytical depth. The right move is source/confidence hardening, progressive operational layers, and a server-side published-data projection—not deleting charts, maps, tables, or advanced analysis.

## 2. Product map and key journeys

| Area / routes | Primary audience | What exists | Journey health |
|---|---|---|---|
| Executive brief `/[locale]`, staff overview `/overview` | Leadership, analysts | KPI links, trade/geography/visit/roadmap/legal snapshots; decision strip and risks in overview | **Partial:** fast readout, but static as-of data and no actionable queue |
| Trade `/trade`, benchmark `/benchmark` | Trade teams, analysts | UZ/US methodology comparison, annual and monthly trade, category tables, advanced analysis | **Good analytical journey:** source-rich and progressively disclosed; localization needs repair |
| Investments `/investments` | Invest-promotion, leadership | Board/table/map/privatization views, confidence filters, demo separation messaging | **Good foundation:** main board labels confidence; downstream aggregates/maps must stop mixing demo values |
| Visits `/visits`, contacts `/contacts`, agreements `/agreements` | Diplomacy, visit teams | Timeline/grid/calendar, source links, historical outcomes, entity discovery | **Partial:** chronology rather than live coordination; no meeting/action workflow |
| Roadmaps `/roadmaps` | Regions, agencies, operational staff | 61-project regional rollups, filters/search, task status/note updates | **Most operationally useful area:** still missing blockers, evidence, approvals, exact dates, dependencies, escalation |
| Visit preparation `/prepare` | Visit coordinator | Authenticated dossiers, programme, roster, materials/upload | **Gated and narrow:** unauthenticated UI is a broken/narrow layout; authenticated behavior not tested |
| Map `/map` | Leadership, diplomatic planning | On-demand US footprint map, GDP/population/students/missions/planned visits, accessible narrative summary | **Useful but trust/accessibility gaps:** source coverage and keyboard equivalent are incomplete |
| Compliance `/compliance`, grants `/grants` | Trade compliance, analysts | Source-linked status matrix, illustrative pre-check, assistance trends | **High-stakes caution:** demo status must be conspicuous and calculator content fully localized |
| Admin `/admin` | Center staff | Auth-gated administration, settings, activity preview | **Not verified after login:** code shows activity preview/settings claims do not match their persistence scope |

### Critical user journeys

1. **Executive review — partial health.** The brief answers “what is happening?” within seconds: linked KPIs, risks, status, trade, visits, roadmaps, legal base, and source cues. It cannot reliably answer “what decision is needed, by whom, by when, with what proof?” because the action model is absent.
2. **Visit preparation — partial health.** The protected path contains dossiers/materials, but live public access stops at sign-in. **Observed:** the logged-out desktop page collapses the form into a very narrow strip. **Not verified:** user roles, upload persistence, materials access, or approval workflow.
3. **Delegation coordination — weak health.** Timeline/grid/calendar views and visit detail data are good reference material. They do not provide a live roster, readiness check, meeting briefs, task assignments, minute-by-minute changes, or incident/escalation queue.
4. **Roadmap monitoring — partial-to-good health.** The regional cards, 61-project explorer, source badges, filtering, and status rollups are valuable. A collapsed row lacks the operational fields required to resolve risk: accountable individual, exact due date, evidence, next action, blocker/dependency, approval, and escalation.
5. **Trade/investment analysis — good analytical health.** Trade clearly distinguishes methodologies and provides useful advanced-analysis gates. Investment is unusually transparent about verified/pending/demo records in its primary board. Executive summaries and maps undermine that model by combining illustrative values.
6. **Post-visit follow-up — weak health.** There is no persistent plan-vs-actual debrief, action generation, owner handoff, outcome/evidence capture, or executive closure report.

### Recommended information architecture

Keep the current executive navigation, but make one operational object model the spine:

`Visit → meeting → agreement/project → commitment/roadmap step → action → owner → evidence → approval → escalation`

Add three clearly separated workspaces:

- **Executive today:** decision requests, overdue/at-risk commitments, changes since last brief, source/freshness state.
- **Visit command:** readiness score, agenda, attendee/briefing cards, action register, materials, approvals, live issue log.
- **Follow-through:** commitments by owner/agency, evidence review, dependencies/blockers, approvals, escalations, plan-vs-actual outcomes.

## 3. What already works well

- **Calm executive visual language.** The public brief, timeline, roadmaps, and trade page have restrained color, strong type hierarchy, legible cards, and a credible briefing tone. The live visits timeline is particularly scannable.
- **Useful analytical depth without obvious clutter.** The map is loaded on demand (`components/map/MapLoadGate.tsx:7-52`), trade uses progressive disclosure/lazy charts (`components/trade/LazyCharts.tsx:24-150`), and the globe is deferred (`components/brief/GlobeSection.tsx:21-69`).
- **Trade methodology transparency.** The live trade page visibly names the source, date, UZ-side methodology, U.S. Census comparison, and category tables. This is a strong model for other routes.
- **Investment confidence language.** The investment portfolio distinguishes verified, pending/source-needed, and illustrative pipeline data, exposes a confidence filter, and explains quote-safe totals.
- **Structured semantic patterns.** The live DOM exposes headings, tablists, tables with headers, chart/image labels, a named search dialog, an accessible map summary, and a named visit-detail dialog. These are good foundations—not a certification of WCAG conformance.
- **Cross-entity discovery.** Global search finds pages, visits, people, agreements, and investment projects. It is a practical entry point, although it does not yet index roadmap steps, dossiers, risks, or decisions.
- **Baseline engineering discipline.** Strict TypeScript, signed sessions, authenticated write routes, CRON secret enforcement, server-only service credentials, source governance/data validation, RLS, and a sensible route/component structure are all verified.

## 4. Findings by audit area

### A. Strategic fit and functionality

| Priority | Finding and evidence | Impact / user groups | Recommended implementation |
|---|---|---|---|
| P0 | The executive data is static/as-of while the UI signals a current situation screen. `data/executive.ts:42,263-306` fixes the reference date; repository pages import bundled data directly rather than consuming published/live APIs (`app/[locale]/trade/page.tsx:24`, `components/investments/InvestmentsView.tsx:1-11`). | Leadership may treat a briefing shell as current operational state. | Add a server-side projection repository, visible **as-of / degraded / source-of-truth** status, and only label live when approval-backed projections are current. |
| P1 | Only roadmap state/note updates and visit-material uploads are implemented. No code matches for action register, approval, dependency, evidence, blocker, escalation, handoff, meeting brief, or decision log. `components/roadmaps/StepUpdateForm.tsx:31-60`; `components/visit-prep/MaterialUploadsPanel.tsx:66-92`. | Visit teams, ministries, regions, leadership cannot execute follow-through. | Implement `action` and `commitment` workflows first; link all existing visit/project/roadmap entities. |
| P1 | Visit preparation has no visit creation/editing, readiness checklist, sign-off, travel/logistics, or post-visit debrief. `app/[locale]/prepare/page.tsx:13-68`, `components/visit-prep/VisitCard.tsx:57-199`, `data/visit-prep.ts:51-68`. | Visit coordinators work outside the platform. | Build a per-visit readiness board and automatic post-visit action generation. |
| P1 | Role taxonomy is only `admin`, `samarkand`, `khorezm`; navigation audiences are labels, not role-specific views. `lib/auth/admin.ts:6-33`, `lib/navigation.ts:23-90`, `components/layout/Sidebar.tsx:35-120`. | Ministry/agency leads, approvers, diplomats, leadership lack tailored queues. | Move to individual identities and permissioned roles: owner, contributor, approver, visit lead, regional lead, executive viewer. |

### B. UI and visual design

| Priority | Finding and evidence | Impact | Recommended implementation |
|---|---|---|---|
| P1 | The public experience feels like a polished intelligence showcase until the user needs to act. Roadmap cards show counts/status, but not an action, named accountable individual, proof, or blocker. `components/roadmaps/RoadmapsExplorer.tsx:140-178`. | The design does not convert attention into execution. | Add a universal operational row pattern: **next action · owner · due · evidence · blocker · escalation**. |
| P1 | The logged-out `/prepare` state has a severe desktop layout failure: visually inspected capture shows a narrow vertical auth form with most of the canvas empty. | The designated operations entry point feels unfinished and is hard to use. | Repair the auth layout at desktop/mobile breakpoints; run visual regression on `/prepare` and `/admin/login`. |
| P2 | The sidebar/header consume meaningful space on content-rich desktop pages. This is not a deletion problem—trade and roadmaps remain useful—but working users see limited above-the-fold context. | Analysts and leaders need more decision information at once. | Use collapsible shell density/presentation mode, a sticky route-level summary, and route-specific density rather than removing content. |
| P2 | There is no clearly visible loading/error/degraded state for static fallback and failed operational persistence. `components/roadmaps/live.ts:44-62`, `lib/data-governance/published.ts:61-74`. | A calm visual layer can imply certainty that is not present. | Add standard `Live / as-of / static fallback / source needed` status components. |

### C. UX and information architecture

| Priority | Finding and evidence | Impact | Recommended implementation |
|---|---|---|---|
| P0 | The supposed “Recent actions across the portal” is a hardcoded preview (`components/admin/AuditLogPreview.tsx:12-53`) presented as an actual activity panel (`app/[locale]/admin/page.tsx:69-74`). | An operations console can show fictitious audit history. | Query real `audit_log`; otherwise label it **illustrative example** and keep it out of executive decision surfaces. |
| P1 | Search does not index roadmap steps, visit dossiers, risks, or decisions. `components/layout/SearchCommand.tsx:45-80`. | Users cannot reliably reach the operational object they need. | Index the new action/commitment entities; localize type badges and add filter chips. |
| P1 | `/commitments` redirects to `/roadmaps`; there is no independent commitment registry. `app/[locale]/commitments/page.tsx:1-10`. | Cross-cutting commitments disappear into a project-centric tracker. | Restore a commitment register linked to roadmaps, agreements, visits, owners, and outcomes. |

### D. Data, statistics, and credibility

| Priority | Finding and evidence | Impact | Recommended implementation |
|---|---|---|---|
| P0 | Executive sector/counterpart visualizations aggregate **all** investments, including demos, without confidence signaling. `data/overview.ts:64-142`, `components/overview/SectorsGrid.tsx:28-87`, `components/overview/CounterpartsRank.tsx:17-67`. `KNOWN_TRENDS` adds visible unsourced percentages (`data/overview.ts:106-116`). | Violates the repository’s verified-headline rule; misleading in executive briefs. | Filter quote-safe / verified metrics by default; retain a separately labeled pending/demo lens. Remove or source every trend percentage. |
| P0 | Executive Command Center totals all investments as a positive pipeline (`data/executive.ts:275-296`). | The disclosure count does not make the headline quote-safe. | Split verified / pending / internal / illustrative values before aggregation, visibly and in exported briefs. |
| P0 | Ten demo agreements appear as ordinary rows and are included in timeline counts. `data/agreements.ts:235-332`, `components/agreements/AgreementsTable.tsx:121-148`, `AgreementsTimeline.tsx:8-15`. | Misstated bilateral record risk. | Exclude demos from official totals or always label/filter them. |
| P0 | CAATSA compliance data is `is_demo: true` but appears as an ordinary factual status (`data/compliance.ts:84-92`, `app/[locale]/compliance/page.tsx:38-66`). | High-stakes legal/compliance misunderstanding. | Display an unmistakable demo/source-needed state; suppress it from operational risk conclusions until verified. |
| P0 | Data ingestion does not publish approved metrics to the dashboard: ingestion writes snapshots/observations/review queue, while `published_metric` is only read/fallback (`lib/data-governance/ingest.ts:413-427`, `published.ts:59-74`). All policies disable auto-publish (`data/source-policies.ts:3-158`). | No audited path from intake to displayed fact. | Implement approval/rejection, atomic published-metric supersession, revision history, and route revalidation. |
| P0 | Live-data parsers coerce missing/invalid values to zero (`lib/live-data/foreign-assistance.ts:18-57`, `exim.ts:55-141`). | Schema drift may produce believable zeroes. | Require columns/valid values; preserve raw payload and show a schema-drift warning rather than a zero. |
| P1 | Source freshness is mostly **watch**, not fresh: 2 fresh, 57 watch, 1 stale under project thresholds. The freshness pill is calculated against newest source date, not the current clock (`lib/source-quality.ts:38-42`, `lib/freshness.ts:46-61`, `FreshnessPill.tsx:8`). | “Updated just now” risks describing UI render rather than data recency. | Replace generic freshness claims with data-as-of per metric/source group and surface stale owner queues. |
| P1 | Map data lacks central source IDs/badges; non-demo missions often lack row-level source URL. `data/us-state-metrics.ts:26-103`, `data/uz-missions-us.ts:50-117`, `components/map/UsCenteredMap.tsx`. | Geography decisions lack portable provenance. | Migrate each factual map record to `sourceId`, add map-level source badges and per-pin source/confidence disclosure. |
| P1 | The demo registry disagrees with code: 35 vs 25 investment demos, 10 vs 9 agreements, no planned-visit entries. `DEMO_DATA_REGISTRY.md:56`; corresponding data files. | The registry cannot guarantee demo separation. | Generate the registry/test from typed data and fail CI on mismatches. |

### E. Charts, maps, and analytical storytelling

The detailed preservation audit is in section 5. The governing recommendation is **keep and strengthen**: no useful visualization should be deleted. Put deep analysis behind route-level advanced disclosure, source/confidence context, and accessible textual equivalents.

### F. Localization and accessibility

| Priority | Finding and evidence | Impact | Recommended implementation |
|---|---|---|---|
| P0 | `test:i18n` reports 0 findings but skips rendered-route auditing. It misses hardcoded English in `BenchmarkView.tsx:22-244`, `MonthlyTradeChart.tsx:11-88`, `DualMethodologyChart.tsx:11-81`, `TradeFlowChart.tsx:51`, `SourceBadge.tsx:28-83`, agreements/compliance/admin pages, and map labels. | RU/UZ users can receive English UI/aria copy; localization policy is not enforceable. | Convert visible copy/formatters to `next-intl`; run browser-based text audit across all 3 locales in CI. |
| P0 | `ExportCalculator.tsx:12-113` has substantive English licensing/denial guidance despite localized labels. | High-stakes compliance content is not safely localized. | Localize the decision matrix and obtain subject-matter/legal review before presenting it as guidance. |
| P1 | Live EN roadmaps show Uzbek Cyrillic original project titles. This may be legitimate source content (`data/roadmaps.ts:1215-1233`) but lacks an English synopsis/translation pattern. | English-language executives cannot scan key risks. | Retain the original text and add a clearly labeled translation/summary field; never overwrite source language. |
| P1 | Map state paths/pins have click handlers but no keyboard role/tab stop/keyboard handler (`UsCenteredMap.tsx:432,462,496`). | Keyboard users lack equivalent map interaction. | Keep map, add keyboard-operable list/table and focusable pin controls with linked detail panel. |
| P1 | A11y tests cover only six English routes; serious violations warn rather than fail (`tests/accessibility/a11y.spec.ts:4-33`). | Passing Axe test is narrow assurance. | Add map, investments, agreements, grants, all locales, tabs/dialogs, and keyboard paths; fail serious issues after triage. |

### G. Codebase and engineering review

| Priority | Finding and evidence | Impact | Recommended implementation |
|---|---|---|---|
| P0 | Audit log schema supports `actor_id`, but handlers omit it and accept caller-supplied author text (`database/schema.sql:79-87`, `app/api/roadmaps/step-updates/route.ts:78-120`, `visit-materials/route.ts:198-205`). | No defensible accountability with shared passwords. | Individual identity subjects, server-side actor binding, immutable audit metadata, role/event capture. |
| P1 | Roadmap data failures are returned as HTTP 200 / static fallback without visible user warning (`app/api/roadmaps/step-updates/route.ts:59-63`, `components/roadmaps/live.ts:44-62`). | Users cannot distinguish persistence failure from success. | Typed error contracts, retry state, degraded banner, and last-write confirmation. |
| P1 | No repo-level rate limiting found; public snapshot/active probe endpoints trigger upstream fetches (`app/api/live-data/snapshot/route.ts:10-44`, `health/route.ts:14-63`). | Cost/availability abuse risk. | Edge/server rate limits, budgets, monitoring; restrict active probes as appropriate. |
| P1 | Upload validation trusts MIME/type and allows ZIP without content sniffing/malware scanning (`app/api/visit-materials/route.ts:11-23,150-180`). | Material-upload attack surface. | Magic-byte validation, quarantine/AV scan, retention policy, generic errors. |
| P1 | Admin settings claim portal-wide effect but only persist in local Zustand state (`app/[locale]/admin/page.tsx:35-39`, `lib/store/settings.ts:29-69`). | Administrative claim is misleading. | Relabel as browser-only presentation preferences or build audited global setting scope. |
| P2 | CI does not gate i18n, E2E, a11y, or LHCI; manual QA workflow owns them (`.github/workflows/ci.yml:27-37`, `.github/workflows/qa.yml:3-43`). | Release regressions escape a passing `verify`. | Require targeted checks on PR/protected deployment; add publish/audit/write-path integration coverage. |
| P2 | `next.config.ts:34-36` omits CSP; runtime connectors use casts instead of schema validation (`lib/live-data/fetcher.ts:3-21`). | Defense-in-depth and parsing reliability gap. | Deploy nonce CSP in report-only mode first; add runtime schemas/typed repositories. |

### H. Performance and reliability

- **Verified strength:** command palette, map, globe, and expensive trade visuals are lazy/on-demand. Keep this approach.
- **Measured local Lighthouse (one desktop run):** `/en` performance 86, accessibility 100, best practices 96, SEO 91, LCP 888 ms, TBT 256 ms; `/en/trade` 99/100/96/91 with LCP 823 ms, TBT 67 ms; `/en/benchmark` 100/100/96/91 with LCP 745 ms, TBT 12 ms. These are useful baselines, not production field data.
- **Limitation:** LHCI only covers those three EN desktop routes, once, with permissive warning thresholds (`lhci.config.cjs:8-28`). Add mobile and operational-route budgets before using the scores as a release claim.

## 5. Visualization preservation audit

| Visualization / files | Decision question / current value | Current issue | Target / preservation action | Risk / confidence |
|---|---|---|---|---|
| Executive globe — `components/brief/GlobeSection.tsx`, `BriefGlobe.tsx` | Where bilateral activity is geographically concentrated | Generic alternative; hover detail is inaccessible; inherits visit/investment demo risk | **Keep** on executive brief; add sourced corridor/list/table alternative and keyboard equivalents | Medium risk, high confidence |
| Brief trade chart — `BriefTradeChart.tsx` | How trade direction changed | Needs explicit text summary/source cue | **Keep**; source badge + accessible summary | Low risk, high confidence |
| Legal-base donut — `BriefAgreementsDonut.tsx` | Legal-base composition | Good legend; direct source cue weak | **Keep**; attach source/confidence to figure | Low risk, high confidence |
| Roadmap execution — `RoadmapExecutionBar.tsx` | What is done/in motion/overdue | Good visible list/ARIA; task facts still need operational evidence | **Keep**; link bars to action queue/evidence | Low risk, high confidence |
| Overview sector/counterpart views — `SectorsGrid.tsx`, `CounterpartsRank.tsx` | Where investment attention should go | Aggregates demos; unsourced trend % | **Keep after repair**; verified/pending/demo tabs or split totals | High risk, high confidence |
| Overview risk/horizon — `RiskRadar.tsx`, `Horizon.tsx` | What needs attention now / next | Valuable storytelling, but no persistent task workflow | **Keep**; link every item to action/evidence/owner detail | Medium risk, high confidence |
| Trade annual chart/table — `TradeFlowChart.tsx`, `/trade` | Executive trade direction | Tooltip/legend locale is English | **Keep**; localize, retain annual table | Low risk, high confidence |
| Methodology chart — `DualMethodologyChart.tsx` | Why US/UZ trade series differ | English UI strings | **Keep in methodology disclosure**; localize, retain both sources | Low risk, high confidence |
| Monthly/HS/treemap advanced charts — `MonthlyTradeChart.tsx`, `StructureTreemap.tsx`, `LazyCharts.tsx` | Shocks, composition, product opportunity | Localization/text alternatives incomplete | **Keep in Advanced Analysis**; preserve lazy loading and add chart summaries | Medium risk, high confidence |
| US footprint map — `MapLoadGate.tsx`, `UsCenteredMap.tsx` | Which US state deserves next engagement | Source gaps, planned-demo pins, no keyboard interaction | **Keep** on demand; source every metric/pin + provide sortable equivalent list | High risk, high confidence |
| Investment board/map — `InvestmentsView.tsx`, `FlatMap.tsx` | Pipeline execution and regional allocation | Board is strong; map sums all investments | **Keep**; apply confidence split to map/totals | High risk, high confidence |
| Benchmark — `BenchmarkView.tsx`, `BenchmarkChart.tsx` | Peer comparison | Hardcoded English; per-metric source/method ambiguity | **Keep in Advanced Analysis**; localize and display methodology/source | Medium risk, high confidence |
| Agreements stats/timeline/table — `AgreementsStats.tsx`, `AgreementsTimeline.tsx` | Legal-base scale/history | Demo rows/counts not marked | **Keep after demo segregation** | High risk, high confidence |
| Roadmap cards/explorer — `RegionCards.tsx`, `RoadmapsExplorer.tsx` | Regional delivery health | Dense rows lack operational fields | **Keep; elevate as core control-room component** | Medium risk, high confidence |
| Grants charts — `ForeignAssistanceView.tsx`, `MiniBars.tsx`, `GrantsDonut.tsx` | Assistance trends/composition | Chart ARIA has English copy | **Keep**; localize and retain tabular fallback | Low risk, high confidence |

## 6. Top 10 improvements, ranked by impact

| Rank | Recommendation | Priority / effort | Primary users | Implementation direction / dependency |
|---:|---|---|---|---|
| 1 | Enforce quote-safe executive aggregates | P0 / M | Leadership, investment teams | Shared aggregation policy; filter verified/public values; separate pending/internal/demo in overview, command center, maps, agreements, compliance |
| 2 | Build an approved-published data projection | P0 / L | All | Reviewer workflow → versioned `published_metric` → server repository → revalidate routes; keep static fallback visibly labeled |
| 3 | Establish individual accountability and real audit history | P0 / L | Center, regions, leadership | Replace shared passwords with identity subject; server-bind actor, role, event; replace hardcoded admin log |
| 4 | Fix localization as a release gate | P0 / M | RU/UZ users, accessibility users | Move hardcoded UI/formatters to messages; rendered-route audit across 3 locales; locale-aware chart/tooltips/source labels |
| 5 | Correct high-stakes compliance presentation | P0 / S | Trade/compliance teams | Mark/suppress demo CAATSA row; fully localize calculator; legal SME review and stronger disclaimer/route guard |
| 6 | Deliver the action/commitment core | P1 / L | Visit teams, agencies, regions | Action register with owner, exact due date, blocker/dependency, evidence, approval, escalation; link to existing entities |
| 7 | Create visit readiness and post-visit closure | P1 / L | Diplomacy, coordinators | Checklist, meeting briefs, material ownership, approval state, debrief, plan-vs-actual action generation |
| 8 | Make static/degraded state unmistakable | P1 / M | All | Last refresh/as-of, freshness group, write confirmation, backend/static fallback, source needed queue |
| 9 | Harden map/chart accessibility and provenance | P1 / M | Executives, keyboard/AT users | Map list/table alternative, focusable pins, source badges, per-visual summaries; retain charts/maps |
| 10 | Harden operational APIs and release assurance | P1 / M | Platform team | Rate limit/probe controls, upload AV/quarantine, runtime schemas, mobile/full-locale a11y & visual tests, stricter CI/LHCI gates |

## 7. 30 / 60 / 90-day delivery plan

### First 30 days — truth and release safety

- Ship quote-safe aggregation and visible demo/source-needed segregation across overview, executive, agreements, compliance, map, and exports.
- Fix hardcoded UI/locales, compliance calculator language, logged-out auth layout, source-badge strings, and roadmap English synopsis pattern.
- Replace misleading activity/settings claims or visibly scope them as illustrative/browser-only.
- Add data tests for demo registry parity, source coverage, and “verified headline does not include demo.”
- Add `as-of`, data freshness, static fallback, source-of-truth, and write-failure states.

### Days 31–60 — operationally accountable workflows

- Introduce individual identities and an immutable audit event model.
- Implement actions/commitments with owner, exact deadline, status, evidence request/upload, comments, dependencies, blockers, approval, and escalation.
- Link actions to visit, meeting, agreement/project, roadmap step, and decision.
- Replace the static admin activity log with authenticated database history and scoped admin preferences.
- Build visit readiness/dossier flows and post-visit debrief/action generation.

### Days 61–90 — production control room and scale

- Implement governed ingestion approval → published metrics → server-side projections and route revalidation.
- Launch leadership/region/agency queues, notification/escalation rules, decision brief exports, and plan-vs-actual reporting.
- Add map keyboard list/detail alternative and complete source-provenance migration.
- Require localised E2E/a11y/visual regression and mobile Lighthouse budgets in CI; add rate limits, upload quarantine, runtime schemas, and CSP report-only rollout.

## 8. Evidence limits and assumptions

- Authenticated administration, Supabase provisioning, storage bucket policy, actual uploaded files, role behavior, audit persistence, production environment variables, database triggers, WAF/rate limits, and production field performance were not accessed.
- No security exploit, secret exposure, fabricated fact, or production vulnerability is claimed. Findings concern verified repository behavior, visible live UI, or narrowly stated hardening gaps.
- Live screenshots demonstrate public states at one desktop viewport. A responsive browser check found no horizontal overflow at 390 px on the home brief, but the in-app capture target closed before a valid mobile screenshot could be accepted. The repository’s mobile E2E renders passed.
- The public `/prepare` and `/admin` boundaries correctly required authentication; no credentials were entered or inferred.
- Passing validation does not prove production data correctness: `validate:data`, governance, unit, type, E2E, accessibility, i18n, and LHCI were run at their documented scope, but external source truth and full production wiring remain unverified.

## 9. Ideal future-state control room

```text
┌ Executive Today ──────────┬ Visit Command ─────────────┬ Delivery & Assurance ────────┐
│ Decisions needing sign-off │ Readiness score / agenda   │ At-risk commitments            │
│ Changes since last brief   │ Meeting briefs / attendees  │ Owner / exact deadline          │
│ Verified KPI delta + as-of │ Material & approval status  │ Evidence / dependency / blocker │
│ Source & confidence state  │ Live issue / escalation log │ Approval / audit history         │
└───────────────────────────┴────────────────────────────┴──────────────────────────────┘
                                 ↓
      Visit → Meeting → Agreement/Project → Roadmap Step → Action → Evidence → Approval → Outcome
```

The brief remains calm and source-backed, but every alert has one accountable next step, one owner, one due date, a confidence/source state, and an auditable path to closure.

## Validation recorded during this audit

| Check | Result |
|---|---|
| `corepack pnpm validate:data` | Passed — 60 sources, 160 source references, 39 data files, 3 locales, 17 routes |
| `corepack pnpm test:governance` | Passed |
| `corepack pnpm test:unit` | Passed — 43 tests |
| `corepack pnpm lint` | Passed with three unused-disable warnings |
| `corepack pnpm typecheck` | Passed |
| `corepack pnpm test:i18n` | Passed with 0 static findings; rendered route audit skipped |
| `corepack pnpm test:a11y` | Passed — 6 English-route Axe tests; scope is limited |
| `corepack pnpm test:e2e` | Passed — 112 tests; 2 manual screenshot tests skipped |
| `corepack pnpm lhci` | Passed — local desktop `/en`, `/en/trade`, `/en/benchmark`; see performance notes above |

## Screenshot evidence

Accepted live captures are in `audit-captures-2026-07-09/`:

- `01-en-executive-brief.png`
- `02-en-visits-timeline.png`
- `04-en-roadmaps.png`
- `05-en-visit-preparation-auth.png`
- `06-en-trade.png`

An attempted visit-detail capture was rejected because the rendered modal was blurred. It is not used as visual evidence.
