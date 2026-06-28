# Visualization Preservation Log

This file documents chart, map, table, and visualization hierarchy changes made after the 360-degree audit. The rule is preservation first: improve explanation, design, grouping, or progressive disclosure before considering deletion.

| Component / file                                                                                                                                                     | Classification             | Value preserved                                                         | Placement issue                                                 | Where it remains accessible                                                                    | Loss / tradeoff                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `TradeFlowChart` in `components/charts/TradeFlowChart.tsx`                                                                                                           | Keep but explain           | Executive annual trend for turnover, exports, imports, balance          | Needed clearer "what this means" guidance                       | Main `/[locale]/trade` flow                                                                    | No analytical loss                             |
| `DualMethodologyChart` in `components/trade/DualMethodologyChart.tsx`                                                                                                | Keep                       | Explains UZ Stat vs U.S. Census methodology differences                 | Could confuse users without framing                             | Main `/[locale]/trade`, paired with methodology note                                           | No analytical loss                             |
| `LazyMonthlyTrade` in `components/trade/LazyCharts.tsx`                                                                                                              | Keep                       | U.S. Census monthly flow context                                        | Useful in main trade journey                                    | Main `/[locale]/trade`                                                                         | No analytical loss                             |
| `LazyExportStructure` / `LazyImportStructure` in `components/trade/LazyCharts.tsx`                                                                                   | Keep                       | 2025 category structure                                                 | Useful as executive detail                                      | Main `/[locale]/trade`                                                                         | No analytical loss                             |
| `LazyComtradeHs6`, `LazyComtradeMirror`, `LazyComtradeTrendSparklines`, `LazyHs2ChapterTreemap`, `LazyTrademapProducts`, `LazyServicesEbops`, `LazyTrademapExhibits` | Move to advanced section   | Granular HS/Comtrade/ITC/services analysis for analysts and researchers | Too technical for the first trade story and cognitively crowded | Same `/[locale]/trade` route under "Advanced Trade Analysis" disclosure                        | One extra click to open; no data/chart removal |
| Investment board/table/map in `components/investments/InvestmentsView.tsx`                                                                                           | Keep but simplify          | Pipeline stage board, detailed rows, geographic view                    | Mixed verified/demo totals could mislead                        | Same `/[locale]/investments` page, with confidence filter and badges                           | No analytical loss                             |
| Investment table rows in `components/investments/InvestmentsView.tsx`                                                                                                | Keep but fix accessibility | Detailed project inspection                                             | Entire row click was weaker for keyboard users                  | Same table; title is now an accessible button                                                  | No analytical loss                             |
| Privatization module in `components/investments/InvestmentsView.tsx`                                                                                                 | Add safe empty state       | Future source-backed privatization pipeline                             | No verified records currently exist                             | `/[locale]/investments` -> Privatization tab                                                   | No fake records added                          |
| Sector cards in `components/sectors/SectorsView.tsx`                                                                                                                 | Keep but add matrix        | Sector signals, why-it-matters notes, next questions                    | Cards alone made comparison hard                                | Same `/[locale]/sectors` page under opportunity matrix                                         | No analytical loss                             |
| Map and benchmark routes                                                                                                                                             | Move in navigation only    | Geographic footprint and regional benchmark analysis                    | Secondary/advanced for executive users                          | Existing `/[locale]/map` and `/[locale]/benchmark` routes, now grouped under Advanced Analysis | No route or visualization removal              |
| Prepare, staff, admin routes                                                                                                                                         | Move in navigation only    | Internal operations and admin workflows                                 | Mixed internal workflows with public/executive product          | Existing routes, now grouped under Operations                                                  | No route or visualization removal              |

Candidate deletions: none for useful source-backed exhibits. No useful charts, maps, tables, historical records, source records, methodology notes, or localized pages were deleted.

## 2026-06-27 UI Regression Follow-Up

- Current component and file path: `TradeFlowChart` in `components/charts/TradeFlowChart.tsx`.
  Value provided: quote-ready annual view of turnover, exports, imports, and balance.
  Current problem: it was reachable through a disclosure, while a weaker inline sparkline occupied the executive summary slot.
  Target location: promoted to the main `/[locale]/trade` flow before the annual table.
  What remains preserved: chart, source badge, narration, annual table, methodology notes.
  Risk: low; one above-the-fold Recharts component returns to the main trade page.
  Recommendation: keep and promote.
  Confidence level: high.

- Current component and file path: `DualMethodologyChart` in `components/trade/DualMethodologyChart.tsx`.
  Value provided: UZ Stat vs U.S. Census methodology comparison.
  Current problem: important but too technical for first-screen executive scanning.
  Target location: remains in the methodology disclosure on `/[locale]/trade`.
  What remains preserved: full chart, methodology note, narration.
  Risk: low; disclosure keeps performance and comprehension manageable.
  Recommendation: keep lazy.
  Confidence level: high.

- Current component and file path: `LazyMonthlyTrade`, `LazyExportStructure`, `LazyImportStructure`, and advanced HS/ITC/services charts in `components/trade/LazyCharts.tsx`.
  Value provided: monthly monitoring, commodity structure, mirror/HS/services analyst depth.
  Current problem: too much technical depth above the fold would crowd the executive story.
  Target location: unchanged below the main annual flow, loaded lazily or under Advanced Trade Analysis.
  What remains preserved: every chart and source-backed analytical exhibit.
  Risk: low; no visualization is deleted.
  Recommendation: keep.
  Confidence level: high.

- Current component and file path: inline `TradePulseSummary` in `app/[locale]/trade/page.tsx`.
  Value provided: intended as quick scan summary.
  Current problem: visually weaker and duplicative of `TradeFlowChart`.
  Target location: removed in favor of the existing full chart.
  What remains preserved: underlying annual data and stronger chart representation.
  Risk: low; analytical capability improves and no source data is removed.
  Recommendation: archive/remove.
  Confidence level: high.
