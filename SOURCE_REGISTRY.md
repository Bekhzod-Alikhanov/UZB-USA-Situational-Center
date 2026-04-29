# Source Registry

Master list of every source backing values in this dashboard. Every datum in `data/*.ts` should carry a `sourceId` referencing this registry. Authoritative copy lives in `data/sources.ts`.

**Last refresh:** 2026-04-29 · **Sources:** 50 (11 Level A inputs · 39 Level B open URLs)

## Levels

- **A** — User-attached inputs (DOCX / XLSX / PDF / internal note). Used as primary fact when no public counterpart is available.
- **B** — Official public URL. Use for production-grade citations, briefing footnotes, and external linking.

## Inventory

| ID | Level | Source | URL / File | Data type |
|---|:-:|---|---|---|
| `census_goods_uz` | B | U.S. Census Bureau — Trade in Goods with Uzbekistan | https://www.census.gov/foreign-trade/balance/c4644.html | Monthly/yearly goods trade, USD millions |
| `ustr_uzbekistan` | B | Office of the U.S. Trade Representative — Uzbekistan | https://ustr.gov/Uzbekistan | Goods/services trade summary |
| `state_history_uz` | B | U.S. State Department — Office of the Historian | https://history.state.gov/countries/uzbekistan/1000 | Diplomatic relations dates |
| `exim_buy_american` | B | EXIM — Buy American, Build the Future agreement | https://www.exim.gov/news/exim-signs-buy-american-build-future-agreement-uzbekistan-boost-exports-and-support-american | Export finance framework (2025-11-10) |
| `dfc_joint_framework` | B | U.S. DFC — Investment partnership with Uzbekistan | https://www.dfc.gov/media/press-releases/dfc-leadership-lays-foundation-investment-partnership-uzbekistan | Joint Investment Framework (2026-02-18) |
| `us_uz_gateway` | B | U.S.-Uzbekistan Business Gateway | https://us-uz.gov.uz/en | Council news and context |
| `us_uz_council` | B | American-Uzbek Business and Investment Council — Members | https://us-uz.gov.uz/en/about/council | Council member roster |
| `input_deep_review_docx` | A | Deep review (trade, investments, projects, legal, visits, contacts) | `input/us_uz_deep_review.docx` | Compiled analytical review with source links |
| `input_trade_stat_docx` | A | National Statistics Committee — UZ-US trade 2017–2025 | `input/Данные к US_SC/ВЭД/Показатели_внешней_торговли_Узбекистана_с_США_2017_2025.docx` | UZ-side trade series and 2025 structure |
| `input_grants_xlsx` | A | Grant project workbook (status 07.01.2026) | `input/Данные к US_SC/Грант 2025/Грант_по_проектно.xlsx` | 7 grants × $15.381M |
| `input_agreements_docx` | A | Bilateral agreements summary (MFA) | `input/Данные к US_SC/Двухсторонние соглашения/Документ Microsoft Word.docx` | 138 documents by legal type |
| `input_diplomatic_docx` | A | Diplomatic links and visits (MFA) | `input/Данные к US_SC/Дипломатические связи/Документ Microsoft Word.docx` | Diplomatic chronology, C5+1, congressional |
| `input_figma_pdf` | A | Figma dashboard concept | `input/Данные к US_SC/Страница (FIGMA)/...pdf` | Portfolio metrics: 77 projects, $22.509B |
| `president_uz_8197` | B | President.uz — Uzbekistan-U.S. Business Forum (June 2025) | https://president.uz/ru/lists/view/8197 | Forum, investment, enterprises |
| `govuz_business_forum_2025` | B | GOV.UZ — Uzbekistan-U.S. Business Forum (June 2025) | https://gov.uz/en/news/view/59822 | Forum metrics: trade, US FDI, enterprises, FEZs |
| `ustr_visit_2024` | B | USTR — Joint Statement on visit to Uzbekistan (June 2024) | https://ustr.gov/about-us/policy-offices/press-office/press-releases/2024/june/joint-statement-visit-united-states-trade-representative-uzbekistan | WTO/GSP/IP/market access |
| `tradegov_market_opportunities` | B | ITA — Uzbekistan market opportunities | https://www.trade.gov/country-commercial-guides/uzbekistan-market-opportunities | Priority sectors |
| `tradegov_mining_2025` | B | ITA — Uzbekistan mining and quarrying sectors | https://www.trade.gov/country-commercial-guides/uzbekistan-mining-and-quarrying-sectors | Critical minerals + project context |
| `tradegov_agreements` | B | ITA — Uzbekistan trade agreements | https://www.trade.gov/country-commercial-guides/uzbekistan-trade-agreements | TIFA + investment treaties |
| `ustr_wto_2024` | B | USTR — Uzbekistan WTO market-access statement (Dec 2024) | https://ustr.gov/about-us/policy-offices/press-office/press-releases/2024/december/statement-ambassador-katherine-tai-uzbekistans-work-toward-accession-world-trade-organization | WTO accession milestone |
| `usaid_wave` | B | USAID — Regional Water and Vulnerable Environment Activity | https://pdf.usaid.gov/pdf_docs/PA00ZQVJ.pdf | $21.5M regional activity 2020–2025 |
| `usaid_eras_ii` | B | USAID — Environment Restoration of the Aral Sea II | https://www.usaid.gov/sites/default/files/2022-10/ERAS_II_-_USAID_Environment_Restoration_of_the_Aral_Sea_II_-_ENG_factsheet.docx.pdf | $1.65M Muynak/Karakalpakstan |
| `govuz_us_visa_free_2026` | B | GOV.UZ Tourism Committee — visa-free for U.S. citizens | https://gov.uz/en/uzbektourism/news/view/99187 | 30-day visa-free regime from 2026 |
| `govuz_us_tourism_2025` | B | GOV.UZ Tourism Committee — U.S. visitor signal | https://gov.uz/en/uzbektourism/news/view/124526 | 37,000+ U.S. visitors in 2025 |
| `uzbek_embassy_dc` | B | Embassy of Uzbekistan in Washington — Contact | https://uzbekistan.org/contact-us/ | Address, phone, key staff |
| `us_embassy_tashkent` | B | U.S. Embassy in Tashkent — Contact | https://uz.usembassy.gov/contact/ | Address, phone, key staff |
| `aucc_online` | B | American–Uzbekistan Chamber of Commerce | https://aucconline.com/ | Business association directory |
| `invest_uzbekistan` | B | Invest Uzbekistan / Investment Promotion Agency | https://invest.gov.uz | Investment single-window |
| `f4_ordinance_2026` | A | Presidential Ordinance Ф-4 (17.02.2026) | (Office of the President) | Center mandate, location, staffing, aggregate counts |
| `cbu_statistics` | B | Central Bank of the Republic of Uzbekistan — Statistics | https://cbu.uz/en/statistics/ | FX, reserves, balance of payments, IIP, external debt |
| `census_intl_trade_api` | B | U.S. Census Bureau — International Trade developer datasets | https://www.census.gov/data/developers/data-sets/international-trade.html | Programmatic monthly merchandise trade by country / HS code |
| `bea_developers` | B | U.S. Bureau of Economic Analysis — Developer resources | https://www.bea.gov/resources/for-developers | Services-trade datasets; anchors USTR's $603M services figure |
| `state_spd_3_joint` | B | U.S. State Department — SPD-3 Joint Statement | https://2021-2025.state.gov/joint-statement-on-the-united-states-uzbekistan-strategic-partnership-dialogue-3/ | SPD chronology and joint statements |
| `foreign_assistance_gov` | B | ForeignAssistance.gov | https://foreignassistance.gov/ | U.S. foreign-assistance disbursements to Uzbekistan |
| `worldbank_data` | B | World Bank Open Data | https://data.worldbank.org/ | GDP, FDI, population — benchmark inputs |
| `oecd_data_api` | B | OECD Data API | https://www.oecd.org/en/data/insights/data-explainers/2024/09/api.html | Cross-country macro / trade indicators |
| `lex_uz` | B | lex.uz — National Database of Legislation of Uzbekistan | https://lex.uz/ru/ | Canonical UZ legal-acts database |
| `lex_uz_visa_free_2025` | B | Decree УП-203 (03.11.2025) — visa-free regime for U.S. citizens | https://lex.uz/ru/docs/7807760 | 30-day visa-free entry, effective 2026-01-01 |
| `lex_uz_embassy_us_1993` | B | Resolution №212 (10.05.1993) — Opening of UZ Embassy in the U.S. | https://lex.uz/docs/521494 | Cabinet resolution establishing the embassy in DC |
| `lex_uz_diplomatic_missions_1992` | B | Resolution №649-XII (03.07.1992) — Heads of UZ diplomatic missions abroad | https://lex.uz/ru/docs/19509 | Framework for appointing UZ heads of mission |
| `state_spd_2_joint` | B | State Dept — SPD-2 Joint Statement (Dec 2022) | https://2021-2025.state.gov/joint-statement-on-the-second-united-states-uzbekistan-strategic-partnership-dialogue/ | SPD-2 joint statement |
| `state_c5_1_2015` | B | State Dept — Launch of C5+1 (Samarkand, Nov 2015) | https://2009-2017.state.gov/secretary/remarks/2015/11/249260.htm | Kerry remarks launching C5+1 |
| `state_blinken_c5_2023` | B | State Dept — Blinken Tashkent / C5+1 (Feb-Mar 2023) | https://2021-2025.state.gov/secretary-antony-j-blinken-travel-to-kazakhstan-uzbekistan-and-india/ | Blinken Tashkent / C5+1 ministerial |
| `state_c5_summit_2023` | B | White House — First C5+1 Presidential Summit (Sep 2023) | https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2023/09/19/joint-statement-of-the-c51-presidential-summit/ | Heads of State C5+1 summit joint statement |
| `state_pompeo_c5_2020` | B | State Dept — Pompeo Tashkent / C5+1 (Feb 2020) | https://2017-2021.state.gov/secretary-michael-r-pompeos-travel-to-the-united-kingdom-ukraine-belarus-kazakhstan-uzbekistan/ | Pompeo Tashkent visit + C5+1 FM |
| `whitehouse_us_uz_2018` | B | White House — Joint Statement on Strategic Partnership (May 2018) | https://trumpwhitehouse.archives.gov/briefings-statements/joint-statement-united-states-uzbekistan-launching-new-era-strategic-partnership/ | Trump-Mirziyoyev joint statement |
| `whitehouse_c5_2025` | B | White House — C5+1 Summit (Washington, Nov 2025) | https://www.whitehouse.gov/briefings-statements/2025/11/joint-statement-of-the-c5-1-summit/ | Second C5+1 Heads of State summit |
| `usaid_power_visit_2023` | B | USAID — Administrator Power travel to Central Asia (Oct 2023) | https://www.usaid.gov/news-information/press-releases/oct-23-2023-administrator-samantha-power-travel-uzbekistan-and-kazakhstan | Power Tashkent + Samarkand visit |
| `gpd_protocol_2026` | A | Civil-law contract Annex 1 — Protocol on stages and deadlines (15.04.2026) | (internal — Agency for Strategic Development and Reforms) | 12 monthly Center deliverables |
| `comtrade_hs6` | B | UN Comtrade — HS-6 bilateral preview API | https://comtradeapi.un.org/public/v1/preview/C/A/HS | UZ↔US HS-6 commodity flows 2021–2025, both reporters |

## Notes

- Every value rendered in the dashboard should carry a `sourceId` field referencing one of the IDs above.
- `<SourceBadge sourceId="…" />` resolves the ID to a clickable chip (level B → external link; level A → file marker with full path tooltip).
- Production hardening should replace `f4_ordinance_2026` with the original signed Presidential Ordinance text and supporting agency materials.
- No runtime external fetch is required — all values are bundled at build time from `data/*.ts`.
