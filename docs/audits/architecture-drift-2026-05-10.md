# Architecture-drift Audit — 2026-05-10

**Auditor:** 3-agent parallel review (backend / frontend / data) dispatched from the main session (Opus 4.7).
**Scope:** drift between the AS-IS Next.js codebase and what `docs/architecture/` (locked under PR #2) says is the current state.
**Important framing:** the architecture pack describes a TO-BE target (Keycloak, FastAPI gateway, Postgres DWH, Dagster, Superset). Where the docs describe TO-BE behavior absent from AS-IS code, that is **not drift** — that is migration runway. Only AS-IS↔doc mismatches count as drift.
**Constraint:** `docs/architecture/**` is out-of-scope for modification this session (per session out-of-scope rules). Drift items requiring doc edits are flagged **DOC FIX** for a separate PR; only **CODE FIX** items are applied here.

---

## Summary

| Slice | Real drift | Acceptable TO-BE | Total raw findings |
|---|---:|---:|---:|
| Backend / auth / governance / API | 3 | 2 | 6 |
| Frontend | 3 | 2 | 5 |
| Data layer | 7 | 0 | 8 |
| **Total** | **13** | **4** | **19 raw** (→ 13 actionable, within the 15 cap) |

**Items I will fix this session (CODE FIX):** 3 — all converge on a single `lib/auth/roles.ts` expansion.
**Items deferred (DOC FIX, out-of-scope):** 10 — listed below for a follow-up PR against the architecture pack.

---

## Backend slice (lib/auth, lib/data-governance, lib/db, lib/live-data, app/api)

### D-B1 — Role × permission table in `lib/auth/roles.ts` is a subset of the doc taxonomy

- **Severity:** P1
- **Type:** CODE FIX
- **Doc:** [docs/architecture/03-authentication-rbac.md:156–204](docs/architecture/03-authentication-rbac.md) — yaml block listing `viewer | analyst | editor | executive | admin` with explicit per-role permission lists.
- **Code:** [lib/auth/roles.ts:1–26](lib/auth/roles.ts) — `executive` role exists ✓ but ROLE_PERMISSIONS only lists 7 permissions; doc enumerates ~22.
- **Doc says vs. code does:** Doc claims `analyst` has `commitment:edit`, `decision:draft`, `superset:access`, `export:create`; code grants only `commitment:edit`. Doc claims `editor` has `source:approve`, `metric:publish`, `review-queue:approve`, `review-queue:reject`; code grants only `source:approve`. Doc claims `executive` has `decision:approve`, `decision:reject`, `comment:create`, `notification:configure`; code grants only `decision:approve`. Doc claims `admin` has `user:manage`, `role:assign`, `policy:edit`, `audit:export`, `admin:view`, `ingestion:trigger`, `ai:configure`; code grants `user:manage`, `admin:view`.
- **Note:** The doc itself states "Существующая структура верная — добавляются новые permissions для новых модулей" (line 154). Expansion is explicitly endorsed.
- **Fix:** extend the `Permission` union and `ROLE_PERMISSIONS` map.

### D-B2 — RBAC permission matrix references `/api/v1/governance/*` endpoints that don't exist

- **Severity:** P1
- **Type:** Acceptable TO-BE (FastAPI gateway is TO-BE)
- **Doc:** [docs/architecture/03-authentication-rbac.md:230–246](docs/architecture/03-authentication-rbac.md) — `/api/v1/governance/publish` etc.
- **Code:** AS-IS has `/api/admin/ingest/{run,status}` only; no `/api/v1/` namespace.
- **Note:** The endpoints listed exist in the FastAPI gateway target. AS-IS does not need them. Not a drift in the sense we care about, but worth keeping visible for migration planning.

### D-B3 — `data/external-data.ts` has 14 connector entries; AS-IS docs say "5 public APIs"

- **Severity:** P2
- **Type:** DOC FIX (cannot modify docs)
- **Doc:** [docs/architecture/00-overview.md](docs/architecture/00-overview.md) AS-IS section, [04-data-flow.md](docs/architecture/04-data-flow.md).
- **Code:** [lib/data-governance/ingest.ts](lib/data-governance/ingest.ts) wires exactly 5 (census, world-bank, foreign-assistance, bea, exim) ✓ — matches doc. But [data/external-data.ts](data/external-data.ts) lists 14 connector entries (5 `live-ready` + 1 `key-required` + 8 `manual-review`). Doc only describes the 5 live ones.
- **Note:** AS-IS *behavior* matches docs; the registry surface is wider than the doc enumerates. Docs should say "5 live + 9 planned" rather than "5 connectors".

### D-B4 — `lib/data-governance/policy.ts` matches doc; no AS-IS audit-log writes

- **Severity:** P0 (only if we treated audit-log as required for AS-IS)
- **Type:** Acceptable TO-BE
- **Doc:** [docs/architecture/03-authentication-rbac.md:314–333](docs/architecture/03-authentication-rbac.md) — "Каждое state-changing API-вызов пишет в `ops.audit_log`" with WORM/signed semantics.
- **Code:** No audit-log writes in the 11 AS-IS API routes. The governance policy evaluates no-downgrade correctly per doc, but no audit row is emitted.
- **Note:** `ops.audit_log` is part of the Postgres DWH TO-BE schema. AS-IS has `schema.sql:79-88` which defines an audit_log table but no FastAPI to populate it. Not drift — feature gap.

### D-B5 — `lib/live-data/` has 7 files (5 connectors + fetcher + types)

- **Severity:** P2 (no drift)
- **Code matches doc.** No action.

### D-B6 — `Permission` union missing ~14 doc-listed permissions (subsumed by D-B1)

Merged into D-B1's fix.

---

## Frontend slice (components/**, app/[locale]/**, lib/store, lib/i18n)

### D-F1 — Page count: 21 page.tsx ✓

No drift. Doc-implicit count matches.

### D-F2 — `lib/store/settings.ts` lacks `default_domain` and `notification_channels`

- **Severity:** P2
- **Type:** Acceptable TO-BE
- **Doc:** [docs/architecture/03-authentication-rbac.md:391–401](docs/architecture/03-authentication-rbac.md) — `ops.user_preferences` table (server-side, post-SSO).
- **Code:** [lib/store/settings.ts](lib/store/settings.ts) holds `theme`, `hideDemo`, `presentationMode`, `aiEnabled`. Doc itself notes (line 404) that "Сейчас preferences живут в `localStorage` ([lib/store/settings.ts])" — AS-IS is exactly what doc describes.
- **Note:** No action. AS-IS matches doc's description of AS-IS.

### D-F3 — No `can(session, perm)` UX-guard helper

- **Severity:** P1
- **Type:** CODE FIX
- **Doc:** [docs/architecture/03-authentication-rbac.md:252–267](docs/architecture/03-authentication-rbac.md) — example `can()` function for hiding actions in UI.
- **Code:** [lib/auth/roles.ts](lib/auth/roles.ts) has `roleHasPermission(role, perm)` but no `can()` alias. No component currently uses RBAC-conditional rendering.
- **Fix:** export a small `can(role, perm)` alias from `lib/auth/roles.ts`. Bundled into the D-B1 fix.

### D-F4 — RBAC permission mismatch (duplicate of D-B1)

Subsumed by D-B1.

### D-F5 — Dark-mode `--shadow-glow-primary` not redefined in `:root.dark`

- **Severity:** P2
- **Type:** CODE FIX (optional polish)
- **Code:** [app/globals.css:62](app/globals.css) defines `--shadow-glow-primary` for light mode only. Dark mode at lines 70–118 redefines other shadows but not this one — so dark-mode glow uses the light-mode navy.
- **Note:** Tiny visual inconsistency; not flagged by any user-facing audit. Skip for this session to keep diff small. Logging as P2 follow-up.

### D-F6 — Stack versions match doc

[package.json](package.json): Next 16.2.4, React 19.2.5, TS 6.0.3, Tailwind 4.2.4, next-intl 4.11.0 — all match [docs/architecture/02-component-catalog.md:23–35](docs/architecture/02-component-catalog.md). No drift.

### D-F7 — Settings persist to localStorage only

- **Severity:** P1
- **Type:** Acceptable TO-BE (no server to sync to in AS-IS)
- **Doc:** [docs/architecture/03-authentication-rbac.md:404–406](docs/architecture/03-authentication-rbac.md) — explicitly notes "Сейчас preferences живут в `localStorage`".
- **Note:** Doc *correctly* describes AS-IS. Not drift.

---

## Data slice (data/**, database/schema.sql, vercel.json, lib/data-governance/static-baseline.ts)

All 7 findings here are **DOC FIX** — AS-IS code is correct; UML / data-flow docs are stale. Out-of-scope to fix this session per project rules.

### D-D1 — AppUser schema: doc has `primary_role`, `domains[]`, `last_seen_at`; code has only `role`

- **Severity:** P1, DOC FIX
- **Doc:** [docs/architecture/diagrams/uml-data-model.md:48–54](docs/architecture/diagrams/uml-data-model.md)
- **Code:** [database/schema.sql:8–17](database/schema.sql)

### D-D2 — DecisionRecord doc has `signature`, `signed_by_cert_subject`, `signed_at`; code has none

- **Severity:** P1, DOC FIX
- **Doc:** [docs/architecture/diagrams/uml-data-model.md:193–206](docs/architecture/diagrams/uml-data-model.md)
- **Code:** [database/schema.sql:55–68](database/schema.sql)

### D-D3 — CommitmentRecord status enum: doc has 7 values, code has 4

- **Severity:** P1, DOC FIX
- **Doc:** [docs/architecture/diagrams/uml-data-model.md:178](docs/architecture/diagrams/uml-data-model.md) — `draft | agreed | in_progress | watch | overdue | done | cancelled`
- **Code:** [database/schema.sql:37](database/schema.sql) — `done | progress | watch | overdue`

### D-D4 — DataReviewQueue status: doc has 5 values (includes `escalated`), code has 4

- **Severity:** P1, DOC FIX
- **Doc:** [docs/architecture/diagrams/uml-data-model.md:160](docs/architecture/diagrams/uml-data-model.md)
- **Code:** [database/schema.sql:209](database/schema.sql)

### D-D5 — `marts.published_metric_history` table referenced in doc; not in schema

- **Severity:** P1, DOC FIX
- **Doc:** [docs/architecture/04-data-flow.md:65](docs/architecture/04-data-flow.md), [diagrams/uml-data-model.md:254](docs/architecture/diagrams/uml-data-model.md)
- **Code:** [database/schema.sql](database/schema.sql) — no such table; revision tracking lives on `published_metric.revision_id` + `is_current`. The doc's dbt-snapshot mechanism is TO-BE.

### D-D6 — Connector registry has 14 entries; doc mentions ~5 examples

- **Severity:** P2, DOC FIX
- Cross-references D-B3.

### D-D7 — AuditLog fields: doc has `actor_role`, `actor_agency`, `actor_ip`, `signature`, `trace_id`; code has none

- **Severity:** P2, DOC FIX
- **Doc:** [docs/architecture/diagrams/uml-data-model.md:217–232](docs/architecture/diagrams/uml-data-model.md)
- **Code:** [database/schema.sql:79–88](database/schema.sql)

### D-D8 — Cron schedule documented correctly ✓

[vercel.json:10](vercel.json) `0 7 * * *` matches doc's "Daily 07:00 UTC". No drift.

---

## Actionable code fixes this session (Phase C3)

**One coherent fix consolidates D-B1, D-B6, D-F3, D-F4:**

Expand [lib/auth/roles.ts](lib/auth/roles.ts):
1. Add the missing 15 permissions to the `Permission` type union.
2. Expand `ROLE_PERMISSIONS` per the doc's role taxonomy (lines 156–204 of `03-authentication-rbac.md`).
3. Export `can(role, permission)` as a UX-guard alias for `roleHasPermission`.

This is purely additive — no existing permission is removed, no enforcement point is changed. Risk is low; existing call sites (`roleHasPermission`) keep working.

D-F5 (dark-mode glow token) is logged as P2 polish; skipping to keep the Phase C diff scoped.

---

## DOC FIX backlog for a separate PR

A future PR against the architecture pack should:
1. **D-B3 / D-D6**: clarify connector count as "5 live + 9 planned".
2. **D-D1**: align AppUser UML with [database/schema.sql:8–17](database/schema.sql) AS-IS.
3. **D-D2**: mark DecisionRecord signature fields explicitly as TO-BE.
4. **D-D3**: align CommitmentRecord status enum with AS-IS.
5. **D-D4**: remove `escalated` from DataReviewQueue UML.
6. **D-D5**: mark `published_metric_history` as TO-BE in [04-data-flow.md:65](docs/architecture/04-data-flow.md).
7. **D-D7**: align AuditLog UML with AS-IS schema or mark fields TO-BE.

These items respect the user-facing rule "Architecture pack is locked under PR #2" — they need a deliberate doc-correction PR, not a code-side workaround.

---

## Out-of-scope (verified untouched)

- `data/sources.ts`, `database/schema.sql`, `vercel.json` cron, `proxy.ts` locale routing, signed-cookie admin gate, `DEMO_DATA_REGISTRY.md`, `docs/architecture/**`.
- 56 data integrations.

---

## Verification plan for Phase C3 fix

```
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm test:governance && pnpm build
```

Mojibake guard: not applicable (no `messages/*` edit).
