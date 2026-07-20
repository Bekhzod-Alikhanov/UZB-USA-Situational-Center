# Restored Data Review

Status: **quarantined, not publication eligible**. This recovery preserves removed values for review; it does not add them to routes, projections, KPIs, maps, rankings, exports, or alerts.

## Recovery inventory

| Dataset                  |  Recovered | Snapshot origin                                                    | Removal commit                             | Git blob                                   | Canonical record SHA-256                                           |
| ------------------------ | ---------: | ------------------------------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------ |
| Pre-2025 visits          | 20 records | `a9e3f890347304eea54ec7b4266bef088be63ad2:data/visits.ts`          | `6b866c24ad6adcfb580357e9e4a04cc25f505bea` | `b5cc1ae4fe1451822f7578622a3729f24c36b90d` | `8b81dc032a88caa71d447711b49662c2403ab07d3cf5ac07b357e98dab59aabf` |
| Pre-2026 events          |  8 records | `6b866c24ad6adcfb580357e9e4a04cc25f505bea:data/events.ts`          | `02e1edc9e30dabeddf4c83acc7884623fdd29c6a` | `34bff8c9885496890aa2c69180bdc72dacacbcee` | `8caabf960d05f2803283e255f085270f5f86fac68204dcd2c553e6b1c70dbe3c` |
| Uzbekistan-reporter HS-6 |   240 rows | `9f2a324ce28a424ab7313361b1016386c716ed47:data/comtrade-hs6-uz.ts` | `985c8962fdddbf8ac04f4eac0aa95e4f7992eba7` | `4257fcdf556d265ecd0919215a7fd5c3181fe245` | `cbe35680ea96be5a1bebde6f066bc7b0f01a2ecd8d2823bd70c114a5429041e2` |

`node scripts/restore-history-manifest.mjs` reconstructs the three Git snapshots, evaluates the recovered modules, and fails if the canonical values differ. It also prints the current file hashes, counts, source-lineage split, numeric checksums, and deduplication notes.

## Source and confidence review

All 268 restored records are quarantined with `publicationEligible: false`.

- Visits: 16 records retain a registered public source ID and 4 have no source ID. The four without a source ID are `v-2017-riyadh`, `v-2017-unga`, `v-2017-12-19-phone`, and `v-2024-03-daines`; they carry `source_needed`.
- Events: 4 retain registered public sources, 3 retain registered attached-source evidence, and 1 (`e-ustr-tai-2024`) refers to `ustr_visit_2024`, which is not in the current source registry and therefore carries `source_needed`.
- HS-6: all 240 rows retain source ID `comtrade_hs6`, reporter code 860 (UZB), partner code 842 (USA), annual periods 2021–2024, USD values, H6 classification, and the recovered UN Comtrade preview-API methodology. They remain blocked from publication until deduplication and advanced-analysis parity review.

Registered public source IDs and attached-source records remain `internal_unverified`; missing or unregistered lineage is `source_needed`. Source level alone never upgrades a recovered claim to `verified_official`, and recovery never overrides the publication gate.

## Uzbekistan-reporter HS-6 preservation

The 240-row slice is kept separate from U.S.-reporter and U.S. Census data. Each flow contains the recovered top 30 HS-6 rows for each of 2021, 2022, 2023, and 2024. The original module also had empty 2025 arrays; those remain in the immutable source snapshot but do not create rows.

| Reporter flow      | 2021 rows / value checksum |                 2022 |                 2023 |                 2024 |
| ------------------ | -------------------------: | -------------------: | -------------------: | -------------------: |
| UZ exports to US   |        30 / $19,472,650.78 |  30 / $15,117,937.18 |  30 / $60,211,229.56 | 30 / $155,284,704.92 |
| UZ imports from US |        30 / $83,103,676.78 | 30 / $102,651,114.66 | 30 / $273,079,961.55 | 30 / $279,997,718.72 |

These are integrity checksums of the recovered top-30 rows, not bilateral annual totals or quote-safe headline values. The recovered module does not encode a customs valuation basis, so the typed envelope explicitly records `valuationBasis: "unspecified_in_recovered_snapshot"` instead of assuming FOB or CIF.

## Deduplication review

- `e-c51-samarkand-2015` overlaps `v-2015-kerry` by date, location, and C5+1 launch subject. Preserve both entity types until the owner decides whether the event should reference the visit.
- `e-spd4-washington-2024` overlaps `v-2024-sd-4` by date and dialogue subject.
- `e-c51-ny-2023` overlaps `v-2023-09-unga-biden` by summit subject and adjacent date; chronology and source locators need review.
- `e-c51-wash-2025` already links to current visit `v-2025-11-c5-1`; treat it as a candidate event-to-visit relationship, not a second visit.
- The two 2025 C5+1 event records share a date but represent a summit and its business conference. Do not merge solely on date.

## Review gates before activation

1. Confirm every source locator and add sources for the five missing/unregistered lineages.
2. Reconcile overlaps without deleting either evidence record.
3. Add independently reviewed English and Uzbek Latin entity content; no translation is fabricated in this recovery.
4. Approve the HS-6 destination under Advanced Trade Analysis, with reporter/methodology labels and a table alternative.
5. Change publication eligibility only through the governed review and release workflow.
