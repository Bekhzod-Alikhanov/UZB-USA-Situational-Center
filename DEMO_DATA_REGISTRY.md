# Demo Data Registry

Master log of every record in `data/*.ts` carrying `is_demo: true`. Each entry must specify the responsible agency expected to supply the production-grade replacement.

**Last refresh:** 2026-04-24 · **Demo records:** ~150 across 13 modules (down from 166 after Codex source ingestion)

## Status legend

- **pending** — agency not yet contacted; placeholder visible only.
- **requested** — formal request lodged; awaiting reply.
- **confirmed-demo** — agency confirms data exists internally and will be released.

## Entries

| Where | What | File | Responsible agency | Status |
|---|---|---|---|---|
| Trade — rankings | Top UZ exporters to USA (10 rows) | `data/trade.ts:topExportersUZ` | MIIT + State Customs Committee | requested |
| Trade — rankings | Top US importers to Uzbekistan (10 rows) | `data/trade.ts:topImportersUS` | MIIT + State Customs Committee | requested |
| Investments — portfolio | 35 USD-UZ project portfolio entries | `data/investments.ts` (`is_demo:true` rows) | MIIT + UzInvest + Invest Uzbekistan | requested |
| Commitments — registry | 32 commitments tied to visits | `data/commitments.ts` | Situational Center internal + responsible agencies | pending |
| Agreements — detail | 9 agreement-level rows beyond aggregate | `data/agreements.ts` (`is_demo:true` rows) | MFA Department of Americas | requested |
| Regions — twinning | 14 UZ regions × 3 US-state pairings (ПП-314) | `data/regions.ts` | MFA + Khokimiyats | pending |
| Map — delegations | 3 live delegations | `data/delegations.ts` | Situational Center internal | pending |
| Benchmark | Non-UZ CA-5 + Caucasus regional metrics | `data/benchmark.ts` | World Bank, UN Comtrade (validation) | pending |
| Staff KPI | 10 staff placeholders | `data/staff-kpi.ts` | Situational Center HR | pending |
| News | 22 curated posts with external sources | `data/news.ts` | Situational Center comms | pending |
| Contacts — staff | 10 HQ staff placeholders ("Staff Member 1–10") | `data/contacts.ts:k-hq.people` | Situational Center HR | pending |
| Events — future | Upcoming SD-5 entry | `data/events.ts:e-sd5-2026` | MFA | pending |
| Compliance | CAATSA exposure rating | `data/compliance.ts:ofac-caatsa` | MFA + Treasury (open source) | pending |

## No longer demo after Codex source ingestion (2026-04-24)

The following datasets were upgraded from demo to source-traced after the Codex feature pass:

- **Grants — project rows** (7) → `input_grants_xlsx`
- **Trade — UZ-side product/services structure** (12 categories) → `input_trade_stat_docx`
- **Agreements — aggregate breakdown** (138 = 1 + 71 + 44 + 22) → `input_agreements_docx`
- **Council members** (13 names) → `us_uz_council`
- **Embassy contacts** (UZ-DC + US-Tashkent + AUCC + Invest UZ) → respective official contact pages
- **Real investments** (Air Products GTL/Navoiy/Fergana, Coca-Cola, Franklin Templeton/UzNIF, Traxys critical minerals) → `tradegov_mining_2025` + `input_deep_review_docx`

## Input-derived but still flagged for validation

The following are sourced from attached inputs but require primary source confirmation:

- **Project portfolio aggregate** (77 projects / $22.509B) — sourced from `input_figma_pdf`; underlying project register still pending from MIIT.
- **Trade structure shares** (Codex extracted from `input_trade_stat_docx`) — figures retained verbatim from the document.

## How this file stays accurate

1. Every new `is_demo: true` flag added to a `data/*.ts` file MUST add a row here.
2. Every value upgraded from demo to source-traced MUST move to the "No longer demo" section.
3. The auditable view of this registry is `data/demo-registry.ts` (typed, used in the Admin UI).
