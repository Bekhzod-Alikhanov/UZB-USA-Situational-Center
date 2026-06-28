# Platform Improvement Audit - 2026-06-27

## Audit Scope

Local build audited at `http://localhost:3001` with Playwright screenshots. The flow represents an executive/public user trying to understand the platform, trust the data, and drill into priority economic pages.

Screenshots are saved in `screenshots/`. Browser console errors were not observed in the captured states.

## Captured Steps

1. `01-overview-desktop.png` - English overview, desktop. Health: strong strategic surface, dense first screen.
2. `02-overview-source-readiness.png` - Source confidence and live-data readiness area. Health: high credibility, freshness story needs clearer wording.
3. `03-trade-desktop.png` - Trade page. Health: source-aware and quote-ready, but the first view is table-heavy.
4. `04-investments-desktop.png` - Investment portfolio page. Health: excellent demo separation, default board still foregrounds demo rows.
5. `05-map-load-gate.png` - Map page load gate. Health: good performance pattern, could preview map value better before loading.
6. `06-mobile-menu.png` - Mobile navigation drawer. Health: usable and grouped, but long and operational pages are partly buried.
7. `07-mobile-overview.png` - Mobile overview. Health: clean responsive stack, but key summary takes a lot of vertical space.
8. `08-russian-overview.png` - Russian overview. Health: localized shell is strong, but several body sections still show English copy.

## Strengths

- The platform already feels credible: demo warnings, source badges, freshness panels, methodology notes, and confidence labels are visible rather than hidden.
- The information architecture is more mature than a normal dashboard demo. Navigation groups separate executive, economic, diplomacy, risk, advanced, and operations work.
- The visual system has a strong executive command-center feel: restrained dark surface, consistent cards, clear domain colors, and good use of dense metrics.
- Performance choices are thoughtful. The map route uses an explicit load gate instead of forcing a heavy runtime into the first paint.
- The investment page is unusually careful about verified, pending, and illustrative records. This is a major trust advantage.

## Notable Risks

1. Executive scan speed is the main UX risk.
   - Evidence: `01-overview-desktop.png`.
   - The first screen has KPIs, micro-KPIs, an executive command center, risk cards, and priority tiles. It is rich, but a senior user may need too much time to answer "what changed, what matters, what do I do next?"
   - Recommendation: Add a very small "Today" strip near the top with three items only: top change, top risk, top requested action. Keep the current command center below it.

2. Freshness language can undermine trust if read quickly.
   - Evidence: `02-overview-source-readiness.png`.
   - The topbar says "Up-to-date 04 May 2026", while the source panel says `Fresh 0`, `Watch 62`, `Stale 1`. Both may be true, but the user has to infer the difference between platform recency and source freshness.
   - Recommendation: Rename the topbar state to something more precise, such as "Last reviewed 04 May 2026", and add the freshness threshold directly beside `Fresh / Watch / Stale`.

3. Russian localization is not release-ready in the captured overview.
   - Evidence: `08-russian-overview.png`.
   - Several high-visibility executive-command and risk-card strings remain in English, including the situation-read sentence and risk titles. This conflicts with the repository localization rules.
   - Recommendation: Prioritize the overview command-center/risk components for message-backed localization before polishing lower-traffic routes.

4. The investment default view still lets demo records dominate the first board.
   - Evidence: `04-investments-desktop.png`.
   - The demo banner is clear, but the board immediately shows illustrative demo project cards. For external briefings, users may still anchor on those names and values.
   - Recommendation: Default executive mode to verified plus pending records, with demo rows collapsed behind an explicit "Show illustrative demo rows" control. Preserve the demo rows for testing and walkthroughs.

5. The trade page is credible but under-visualized above the fold.
   - Evidence: `03-trade-desktop.png`.
   - The page leads with useful methodology cards and a quote-ready annual table. The trend/chart story is lower in the page, so the first impression is more ledger than briefing.
   - Recommendation: Put a compact annual trend sparkline or mini flow chart beside the annual summary, while keeping the table as the quote-safe source of truth.

6. Navigation is well grouped, but still too long for fast executive use.
   - Evidence: `01-overview-desktop.png`, `06-mobile-menu.png`.
   - On mobile, operations content begins near the bottom and some items fall below the captured viewport. On desktop, the time-zone block competes with lower navigation.
   - Recommendation: Make time zones collapsible on desktop and add a compact "Public / Operations" switch or pinned quick links for the five most-used executive routes.

7. The map load gate protects performance but does not fully sell the payoff.
   - Evidence: `05-map-load-gate.png`.
   - The empty grid area communicates that the map is deferred, but the user gets little preview of available layers, states, or expected decisions before clicking.
   - Recommendation: Add a static thumbnail/legend summary inside the gate: layers available, best-use cases, and whether loading the map adds state-level details or only visualization.

8. Mobile overview is readable but slow to reach synthesis.
   - Evidence: `07-mobile-overview.png`.
   - The first mobile screen shows the title, export button, and large KPI cards. The synthesis/risk content is pushed far down.
   - Recommendation: Add a mobile-only compact brief card above KPIs with the one-sentence situation read and top action. Keep the KPI cards below.

## Accessibility Risks From Screenshots

- Several labels and helper texts appear around 10-11px. Screenshot review cannot prove contrast ratios, but this is a zoom/readability risk for long executive sessions.
- Color is usually paired with signs or text, which is good. Keep that rule for all future status and delta treatments.
- The mobile drawer appears keyboard- and touch-friendly, but screenshot review cannot verify focus order, escape behavior, or screen-reader names.
- The black circular Next.js dev indicator appears in local screenshots and overlaps the mobile view. This is a local-dev artifact, not a production product issue.

## Highest-Value Improvements

1. Fix Russian and Uzbek overview leakage first: command center, risk cards, action labels, freshness labels, and source/readiness copy.
2. Create a top-of-overview "Today" decision strip: one change, one risk, one action, each source-backed.
3. Reconcile freshness wording: separate "platform reviewed", "source age", and "live connector status".
4. Change investment defaults so demo rows are preserved but not foregrounded in executive mode.
5. Add compact visual summaries above the fold on trade and mobile overview.
6. Reduce navigation pressure by collapsing time zones and separating operations from public/executive navigation more strongly.

## Evidence Limits

- This audit used screenshots plus visible behavior only. It did not run a full keyboard, screen-reader, axe, Lighthouse, route-smoke, or i18n test sweep.
- Admin authentication, search result quality, export output, map post-load interaction, and data-ingestion workflows were not audited.
- Local screenshots were captured from a development server, so dev-only overlays and server-port behavior should not be treated as production UX issues.
