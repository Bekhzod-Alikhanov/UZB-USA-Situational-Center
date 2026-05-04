# Data Inventory

Map of input files in `input/` and the `data/*.ts` modules each one feeds.

**Last refresh:** 2026-04-24

## Available input files

| File                                                                                    | Status | Extracted into                                                  | Notes                                                                                  |
| --------------------------------------------------------------------------------------- | :----: | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `input/Данные к US_SC/ВЭД/Показатели_внешней_торговли_Узбекистана_с_США_2017_2025.docx` | parsed | `data/trade.ts` (UZ-side annual + 2025 structure)               | National Statistics Committee figures.                                                 |
| `input/Данные к US_SC/Грант 2025/Грант_по_проектно.xlsx`                                | parsed | `data/grants.ts` (7 rows × $15.381M)                            | Workbook title: _Grant mablag'larini jalb qilish to'g'risida ma'lumot_ (07.01.2026).   |
| `input/Данные к US_SC/Двухсторонние соглашения/Документ Microsoft Word.docx`            | parsed | `data/agreements.ts` (aggregate breakdown 138 = 1+71+44+22)     | Source: MFA.                                                                           |
| `input/Данные к US_SC/Дипломатические связи/Документ Microsoft Word.docx`               | parsed | `data/visits.ts` + `data/events.ts` (24 dated events 1992–2026) | C5+1, SPD, congressional, presidential visits.                                         |
| `input/Данные к US_SC/Страница (FIGMA)/O'ZBEKISTON – AQSH SITUATSION MARKAZ.pdf`        | parsed | Reference only — UI/concept                                     | Used for portfolio totals (77 projects / $22.509B); underlying register still pending. |
| `input/us_uz_deep_review.docx` (when attached)                                          | parsed | `data/investments.ts`, `data/agreements.ts`, `data/contacts.ts` | Cross-source compiled review with embedded official URLs.                              |

## Module → primary source map

| Module                 | Primary source(s)                                                                              |    Demo entries | Notes                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------- | --------------: | ------------------------------------------------------------------------------------ |
| `data/trade.ts`        | `input_trade_stat_docx`, `census_goods_uz`, `ustr_uzbekistan`                                  |  ~20 (rankings) | Holds two methodologies side-by-side: UZ-side (Stat Committee) and US-side (Census). |
| `data/grants.ts`       | `input_grants_xlsx`                                                                            |               0 | Fully real — 7 named projects.                                                       |
| `data/agreements.ts`   | `input_agreements_docx`, `input_deep_review_docx`, `tradegov_agreements`, `ustr_wto_2024`      |               9 | Aggregate is real; some named-agreement rows still demo.                             |
| `data/visits.ts`       | `input_diplomatic_docx`, `state_history_uz`, `ustr_visit_2024`, `dfc_joint_framework`          |          varies | 1992–2026 chronology.                                                                |
| `data/events.ts`       | `input_diplomatic_docx`, `us_uz_gateway`, `dfc_joint_framework`, `exim_buy_american`           |          varies | Real upcoming + historical events.                                                   |
| `data/investments.ts`  | `tradegov_mining_2025`, `input_deep_review_docx`, `input_figma_pdf`                            |              26 | 9 named-company real entries; remainder demo pending MIIT.                           |
| `data/contacts.ts`     | `uzbek_embassy_dc`, `us_embassy_tashkent`, `aucc_online`, `invest_uzbekistan`, `us_uz_council` |    1 (HQ staff) | 13 council members are real.                                                         |
| `data/counterparts.ts` | open sources (verified individually)                                                           |               0 | All 15 counterparts real.                                                            |
| `data/compliance.ts`   | treasury.gov, bis.doc.gov                                                                      |               1 | OFAC/BIS/EAR statuses are real.                                                      |
| `data/benchmark.ts`    | World Bank, UN Comtrade                                                                        | 6 (non-UZ rows) | UZ row real; peers pending validation.                                               |
| `data/regions.ts`      | open source                                                                                    |               0 | 14 region geocoords real.                                                            |
| `data/staff-kpi.ts`    | (none)                                                                                         |              10 | All placeholders.                                                                    |
| `data/news.ts`         | external open URLs (per row)                                                                   |              22 | Curated demo feed pointing to real news URLs.                                        |

## Confirmed official/open sources added (Codex pass 2026-04-24)

- U.S. Census Bureau — yearly + monthly UZ-US goods trade
- USTR Uzbekistan country summary (goods + services)
- U.S. State Department — diplomatic-relations facts
- EXIM "Buy American, Build the Future" framework (2025-11-10)
- DFC Joint Investment Framework Heads of Terms (2026-02-18)
- US-UZ Business Gateway and Council member directory
- ITA market-opportunities, mining, and trade-agreements country guides
- USTR WTO accession completion statement (2024-12-19)
- USAID WAVE and ERAS-II fact sheets
- GOV.UZ tourism committee announcements (37K U.S. visitors, 30-day visa-free)
- Embassy contact pages (UZ-DC, US-Tashkent), AUCC, Invest Uzbekistan

## Tier A citations added (2026-04-26)

Additional public, machine-readable sources surfaced as `<SourceBadge>` chips on the relevant pages:

- **CBU statistics** (`cbu_statistics`) — FX, reserves, balance of payments, IIP, external debt → `/trade` supplementary footer
- **U.S. Census Bureau international trade developer entry** (`census_intl_trade_api`) → `/trade` supplementary footer
- **U.S. BEA developer resources** (`bea_developers`) — anchor for the USTR services-trade figure → added as a fifth methodology note on `/trade`
- **U.S. State Department SPD-3 joint statement** (`state_spd_3_joint`) → `data/visits.ts:v-2023-11-sd-3.source_url`
- **ForeignAssistance.gov** (`foreign_assistance_gov`) — authoritative US foreign-assistance ledger for UZ → `/grants` supplementary footer
- **World Bank Open Data** (`worldbank_data`) → `/benchmark` supplementary footer
- **OECD Data API** (`oecd_data_api`) → `/benchmark` supplementary footer

## Data gaps

Items where no real source has been ingested yet:

- Original signed Presidential Ordinance Ф-4 text and accompanying materials
- Full agreement-level register behind the 138 aggregate (legal-type breakdown is available; row-level documents are not)
- Underlying 77-project investment register behind the Figma PDF aggregate
- Internal owner / deadline / status records for commitments
- Approved delegation rosters and protocol files for upcoming visits
- ПП-314 region-state twinning matrix (14 × 3 = 42 pairings)
- Situational Center staff roster (10 placeholders in `data/contacts.ts`)
- CA-5 + Caucasus benchmark figures from official sources

## Treatment policy

- **Level B (open URL)** sources are non-demo and surfaced via `<SourceBadge>`.
- **Level A (attached input)** sources are non-demo when extracted verbatim; flagged "input-derived" in `DEMO_DATA_REGISTRY.md` when synthesis was applied.
- **Workflow records** (commitments, delegation rosters, visit prep) remain DEMO until the responsible agency supplies primary records.
- **Trade methodology** is explicitly dual: UZ-side and US-side series are kept separately and labeled — see `methodologyNotes` in the deep-review document.
