# Design System: UZ-US Situational Center

**Project ID:** Pending Stitch MCP project connection

## 1. Visual Theme & Atmosphere

Diplomatic Command Surface is a dense executive command interface for government decision-making, diplomacy, trade, investment, and operations. It should feel like a secure morning brief room: deep graphite canvas, crisp civic dividers, source-backed data, and luminous but restrained intelligence signals. The interface is operational, not promotional. It preserves analytical depth while giving ministers, analysts, and administrators a faster scan path.

Density is high but ordered. Layouts use compact panels, sticky controls, and strong typographic hierarchy. Motion is restrained and purposeful: hover lift, focus clarity, and live-state pulses only where they communicate data freshness or operational status.

## 2. Color Palette & Roles

- **Command Canvas** (#0D1117) - Primary application background.
- **Deep Operations Canvas** (#080B10) - Highest-depth page and overlay backdrop.
- **Command Panel** (#111820) - Default card, sidebar, topbar, and table surface.
- **Raised Command Panel** (#172231) - Elevated panels, active navigation groups, and modal interiors.
- **Muted Command Panel** (#0F151D) - Secondary analytical panels and KPI bodies.
- **Primary Intelligence Blue** (#95BFFF) - Primary active states, executive headings, trade/data emphasis.
- **Live Cyan** (#3FD5E6) - Search, freshness, live status, focus rings, geospatial highlights.
- **Opportunity Emerald** (#41D69A) - Positive deltas, verified opportunities, investment confidence.
- **Diplomatic Amber** (#D6A66F) - Agreements, legal/diplomatic milestones, cautionary but non-risk states.
- **Risk Rose** (#FF8F87) - Risk, alerts, negative deltas, and irreversible operational warnings.
- **Command Ink** (#F0F4F8) - Primary text on dark surfaces.
- **Muted Command Ink** (#AEB9C8) - Secondary labels, metadata, and explanatory text.
- **Civic Border** (rgba(149,191,255,0.18)) - Default panel, table, nav, and control stroke.
- **Strong Civic Border** (rgba(149,191,255,0.34)) - Active, hover, and selected states.

## 3. Typography Rules

- **Display:** Instrument Serif is reserved for executive page titles and high-level narrative headings only.
- **Body:** Geist is used for all interface text, filters, tables, descriptions, and controls.
- **Numbers:** JetBrains Mono or tabular numerals are mandatory for KPIs, timestamps, rankings, deltas, and compact metrics.
- **Hierarchy:** Use weight, tone, and spacing before increasing size. Dashboard headings must stay controlled and never become landing-page hero type.
- **Localization:** All labels must fit English, Russian, and Uzbek Latin without clipping. Avoid narrow fixed-width controls for translated text.

## 4. Component Stylings

- **Shell:** Compact left navigation with active group rail, source/status cluster in the topbar, and mobile drawer parity. No decorative marketing navigation.
- **Cards and Panels:** 6-10px radii, thin civic border, muted glass only on command surfaces, no heavy outer glow. Use elevated variants for executive summary and map overlays only.
- **KPI Cards:** Dense metrics with a thin tone strip, mono/tabular values, source/freshness context, and visible demo/confidence markers when applicable.
- **Tables:** Sticky headers, compact row rhythm, clear hover state, no loss of source or confidence fields. Filters sit close to the table and stay scannable.
- **Charts:** Prefer dark-surface chart frames, direct labels where possible, restrained gridlines, source narration below, and no invented data labels.
- **Maps and Globe:** Use immersive geospatial treatment with command overlays. Map screens may break out of ordinary card framing when the map is the primary work surface.
- **Inputs and Controls:** Label above or accessible name always present. Focus uses Live Cyan (#3FD5E6). Icon buttons require localized accessible names.
- **Empty and Error States:** Explain the operational state and next action. Do not use generic filler copy.

## 5. Layout Principles

Use the existing IA and route model. Redesign by route families: executive overview, economic analytics, diplomacy/contacts, risk/governance, geospatial/benchmark, and operations/admin. Preserve charts, maps, tables, source badges, demo warnings, and confidence labeling.

Desktop layouts use asymmetric grids where they improve scan speed, but must remain predictable for repeated daily use. Mobile layouts collapse to single-column panels with persistent access to navigation, search, language, and theme controls. No horizontal overflow is allowed.

## 6. Motion & Interaction

Use CSS transitions on transform, opacity, border, and shadow only. Motion duration should stay between 120ms and 280ms. Respect `prefers-reduced-motion` globally. Live status pulses are permitted for freshness and operational state; decorative animation is not.

## 7. Anti-Patterns

Never fabricate statistics, agreements, investment records, source claims, or operational states. Do not remove demo/source/confidence warnings for visual cleanliness. Avoid pure black, neon glows, purple-blue gradient branding, oversized hero cards, decorative blobs, generic three-card marketing rows, emojis, fake placeholder names, and copywriting cliches.
