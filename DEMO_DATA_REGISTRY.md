# Demo Data Registry

Master log of every record in `data/*.ts` carrying `is_demo: true`. Each entry must specify the responsible agency expected to supply the production-grade replacement.

**Last refresh:** 2026-04-26 · **Demo records:** ~75 across 8 modules (down from ~150)

## Status legend

- **pending** — agency not yet contacted; placeholder visible only.
- **requested** — formal request lodged; awaiting reply.
- **confirmed-demo** — agency confirms data exists internally and will be released.

## Entries

| Where                            | What                                                                                                            | File                                         | Responsible agency                                 | Status    |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------- | --------- |
| Investments — portfolio          | 25 illustrative rows plus 10 source-backed/pending rows; verified, pending, and demo totals are separated in UI | `data/investments.ts` (`is_demo:true` rows)  | MIIT + UzInvest + Invest Uzbekistan                | requested |
| Agreements — detail              | 9 agreement-level rows beyond aggregate                                                                         | `data/agreements.ts` (`is_demo:true` rows)   | MFA Department of Americas                         | requested |
| Map — delegations                | 3 live delegations                                                                                              | `data/delegations.ts`                        | Situational Center internal                        | pending   |
| Contacts — staff                 | 10 HQ staff placeholders ("Staff Member 1–10")                                                                  | `data/contacts.ts:k-hq.people`               | Situational Center HR                              | pending   |
| Events — future                  | Upcoming SD-5 entry                                                                                             | `data/events.ts:e-sd5-2026`                  | MFA                                                | pending   |
| Compliance                       | CAATSA exposure rating                                                                                          | `data/compliance.ts:ofac-caatsa`             | MFA + Treasury (open source)                       | pending   |
| Visit prep — upcoming visits     | 2 demo upcoming visits + demo delegation/meeting/material rows on the real May-2026 regional missions           | `data/visit-prep.ts:upcomingVisits`          | Situational Center internal + regional khokimiyats | pending   |

## No longer demo after the Tier-B pass (2026-04-26)

- **Benchmark — CA-5 + South Caucasus** — GDP and population for KZ/KG/TJ/TM/AZ/GE replaced with **real World Bank Open Data** (2024 figures, indicators NY.GDP.MKTP.CD + SP.POP.TOTL via the public WB JSON API). Bilateral US-trade values come from US Census; UZ row aligned with `tradeAnnualUs` 2025. `is_demo: true` cleared on every row; the `<DemoBanner>` was removed from `/benchmark`.
- **Grants — 4 new US-side program rows** — added USAID DOAG education partnership ($47M cumulative), WAVE ($21.5M 2020-2025), Business Support Project ($17.7M 2024-2029), and ERAS II ($1.65M 2022-2025). All sourced from USAID / U.S. Embassy press releases and ForeignAssistance.gov.

## No longer demo after the cleanup pass (2026-04-26)

The following datasets were upgraded from demo to source-traced or removed:

- **News feed** — 22 fabricated posts replaced with 16 real curated press entries; every URL points to an officially published page (USTR / EXIM / DFC / GOV.UZ / State / ITA / USAID / Census / Gateway / Council).
- **Trade — top exporter/importer rankings** — fabricated company names replaced with real commodity-category rankings derived from the State Statistics Committee 2025 structure.
- **Region twinnings** — fabricated ПП-314 state-pairings dropped entirely from `data/regions.ts`; will be re-introduced when MFA + Khokimiyats publish the official matrix. Population, geocoords, and capitals remain real.

## No longer demo after Codex source ingestion (2026-04-24)

- **Grants — project rows** (7) → `input_grants_xlsx`
- **Trade — UZ-side product/services structure** (12 categories) → `input_trade_stat_docx`
- **Agreements — aggregate breakdown** (138 = 1 + 71 + 44 + 22) → `input_agreements_docx`
- **Council members** (13 names) → `us_uz_council`
- **Embassy contacts** (UZ-DC + US-Tashkent + AUCC + Invest UZ) → respective official contact pages
- **Real investments** (Air Products GTL/Navoiy/Fergana, Coca-Cola, Franklin Templeton/UzNIF, Traxys critical minerals) → `tradegov_mining_2025` + `input_deep_review_docx`

## Input-derived but still flagged for validation

The following are sourced from attached inputs but require primary source confirmation:

- **Project portfolio aggregate** — do not quote mixed demo/source-backed totals externally. Use the verified/pending/demo split in `data/investments.ts`; the underlying MIIT/UzInvest project register is still required.
- **Trade structure shares** (Codex extracted from `input_trade_stat_docx`) — figures retained verbatim from the document.

## How this file stays accurate

1. Every new `is_demo: true` flag added to a `data/*.ts` file MUST add a row here.
2. Every value upgraded from demo to source-traced MUST move to the "No longer demo" section.
3. The auditable view of this registry is `data/demo-registry.ts` (typed, used in the Admin UI).
