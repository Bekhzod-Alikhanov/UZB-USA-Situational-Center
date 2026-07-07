# Stitch Canonical Screen Prompts

Use these prompts with the Stitch MCP `generate_screen_from_text` workflow after connecting the Stitch server. Generate Overview first, refine it with targeted edits, then use the resulting screen as context for the remaining prompts.

## Shared Design System Block

Diplomatic Command Surface: a dense, modern executive command dashboard for the Uzbekistan-USA Situational Center. Preserve current IA, source-governance warnings, demo markers, and trilingual-safe labels. Do not invent data, statistics, source names, agreements, investment projects, uptime values, or performance numbers. Use placeholder labels like `[verified KPI]` only where a real value is not provided.

**DESIGN SYSTEM (REQUIRED):**

- Platform: Web dashboard, desktop-first with mobile parity
- Theme: Dark executive command surface, operational, diplomatic, data-dense
- Background: Command Canvas (#0D1117)
- Surface: Command Panel (#111820), Raised Command Panel (#172231), Muted Command Panel (#0F151D)
- Primary Accent: Primary Intelligence Blue (#95BFFF) for active states and executive emphasis
- Secondary Accent: Live Cyan (#3FD5E6) for freshness, search, focus, and geospatial signals
- Opportunity: Opportunity Emerald (#41D69A)
- Diplomacy: Diplomatic Amber (#D6A66F)
- Risk: Risk Rose (#FF8F87)
- Text: Command Ink (#F0F4F8), Muted Command Ink (#AEB9C8)
- Borders: Civic Border rgba(149,191,255,0.18), Strong Civic Border rgba(149,191,255,0.34)
- Shape: 6-10px panel radius, crisp dividers, no oversized marketing cards
- Typography: Geist-like sans for UI, restrained serif only for executive titles, mono/tabular numbers for metrics

## 1. Overview Command Center

Design the main morning brief dashboard for executives and analysts.

**Page Structure:**

1. **Command Shell:** Compact left navigation with grouped route families, active group rail, UZ-US mark, timezone/status footer, topbar with search, freshness, language, and theme controls.
2. **Executive Brief Header:** Daily brief chip, serif title, short mandate, print/action control, source/freshness context.
3. **Primary KPI Row:** Four dense KPI cards for turnover, exports, imports, and balance. Show source/freshness slots and visible confidence/demo state slots.
4. **Signal Band:** Executive summary panel, active risks panel, next visit or horizon panel.
5. **Intelligence Grid:** Trade flow chart, sectors, source quality, grants, counterparts, and risk radar. Preserve analytical density.

## 2. Trade Analytics

Design a dense trade intelligence page for analysts and business users.

**Page Structure:**

1. **Header:** Page title, source/freshness badges, export/print control.
2. **Sticky Filter Rail:** Direction, period, product/service, source methodology controls.
3. **Primary Chart:** Trade flow or monthly trend with direct labels, source narration, and confidence context.
4. **Advanced Analysis:** Treemap/Sankey/HS6 sections in collapsible or progressive panels, all preserved but visually prioritized.
5. **Data Table:** Sticky headers, compact rows, clear source/confidence column, hover state, and empty state.

## 3. Geospatial Command Map

Design the map route as the most immersive screen.

**Page Structure:**

1. **Full-Bleed Map Surface:** U.S.-centered map and Uzbekistan mission context; map is primary, not trapped in a decorative card.
2. **Overlay Panels:** Active presence, state-level engagement, coverage, economic relevance, and source quality.
3. **Controls:** Layer toggles, load interactive map state, keyboard/focus-visible controls.
4. **Narration:** Methodology and data provenance summary below or beside the map.

## 4. Visit Preparation Operations

Design a visit-prep workspace for operations users.

**Page Structure:**

1. **Readiness Header:** T-minus timeline, readiness score, next milestone.
2. **Operational Board:** Kanban pipeline, checklist, logistics matrix, document registry.
3. **Risk and Outcome Panels:** Gaps, blockers, post-visit reconciliation, responsible agency slots.
4. **Controls:** Compact, utilitarian, no decorative flourish.

## 5. Admin Operations

Design a quiet admin dashboard.

**Page Structure:**

1. **Admin Header:** Protected operations context, ingestion status, audit status.
2. **Control Panels:** Data operations, settings, production readiness, demo registry, audit preview.
3. **Risk Treatment:** Irreversible actions must have calm but clear danger styling using Risk Rose (#FF8F87).
4. **Tables:** Compact rows, source/data policy visibility, accessible controls.

## 6. Mobile Overview and Navigation

Design mobile parity for the overview and shell.

**Page Structure:**

1. **Topbar:** Menu, title, search, language, theme.
2. **Drawer:** Same grouped IA as desktop with active group rail and compact labels.
3. **Overview Stack:** Brief header, KPI cards, priority risks, next visit, source quality, and key chart previews in a single column.
4. **Touch Targets:** Minimum 44px for interactive controls; no horizontal overflow.
