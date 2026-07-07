---
title: Journey · Admin
type: diagram
diagram_type: sequence
tags:
  - architecture/sequence
  - journey/admin
status: draft
version: 1.0
last_updated: 2026-05-06
drawio: journey-admin.drawio
related:
  - "[[../05-user-journeys]]"
---

# Journey · Admin

> [!info] Файл
> [`journey-admin.drawio`](journey-admin.drawio)

## Сценарий

Утром admin делает health-check, реагирует на инцидент с истекшим API-ключом, потом создаёт нового пользователя.

## Inline mermaid

```mermaid
sequenceDiagram
  autonumber
  actor A as Admin
  participant N as Next.js
  participant F as FastAPI
  participant K as Keycloak
  participant V as Vault
  participant D as Dagster API
  participant DB as Postgres
  participant G as Grafana

  Note over A: 09:00 — admin открывает Grafana
  A->>G: открывает Platform Overview
  G-->>A: dashboard · alert: «census_connector failing»

  A->>N: открывает /ru/admin/ingestion
  N->>F: GET /api/v1/admin/ingestion/runs?days=1
  F->>F: require_permission('admin:view') + require_mfa()
  F->>D: GET /runs?status=failure
  D-->>F: census-hs-trade · "API key invalid (HTTP 403)"
  F-->>N: список falled runs
  N-->>A: видит причину

  A->>N: переходит /ru/admin/secrets
  N->>F: GET /api/v1/admin/secrets/connectors
  F->>F: require_permission('secret:rotate')
  F->>V: read-meta(secret/data/connectors/census)
  V-->>F: last_rotated=2026-02-01 (95 дней)
  F-->>N: список с last_rotated
  N-->>A: «census_api_key — устарел»

  A->>A: открывает census.gov, регенерирует ключ
  A->>N: жмёт [Rotate] → форма ввода
  A->>N: вставляет новый ключ
  N->>F: POST /api/v1/admin/secrets/rotate<br/>{name: 'CENSUS_API_KEY', value: '<new>'}
  F->>F: re-MFA challenge (critical action)
  A->>N: TOTP
  N->>F: + otp
  F->>K: verify TOTP via /admin/realms/uzus/users/{id}/credentials
  K-->>F: ok
  F->>V: write secret/data/connectors/census {value, rotated_at, rotated_by}
  V-->>F: ok
  F->>D: POST /runs/restart-pod (через Dagster API)
  D-->>F: pod restarting
  F->>DB: INSERT ops.audit_log {action: 'secret:rotate', target: 'census_api_key'}
  F-->>N: 200 OK
  N-->>A: «Secret rotated. Pod restarting.»

  Note over A: 1 минута спустя
  A->>D: triggers manual census-hs-trade run
  D->>D: pod ready · run started
  D-->>A: ✅ Run successful

  Note over A: Создание нового пользователя
  A->>N: открывает /ru/admin/users
  N->>F: GET /api/v1/admin/users
  F->>F: require_permission('user:manage')
  F->>K: GET /admin/realms/uzus/users (admin client_credentials)
  K-->>F: list
  F->>DB: enrich with last_seen from auth.app_user
  F-->>N: users + roles + activity
  N-->>A: таблица

  A->>N: жмёт [Create] · форма
  A->>N: email='ikar@miip.uz', name='И. Каримов', agency='МИИП', role='analyst', domains=['trade','finance']
  N->>F: POST /api/v1/admin/users
  F->>F: re-MFA для critical action
  A->>N: TOTP
  N->>F: + otp
  F->>K: verify TOTP
  K-->>F: ok
  F->>K: POST /admin/realms/uzus/users {email, name, ...}
  K-->>F: created · user_id
  F->>K: PUT /admin/realms/uzus/users/{id}/role-mappings/realm
  F->>K: PUT user attributes {domains: 'trade,finance', agency: 'МИИП'}
  F->>K: trigger required actions: VERIFY_EMAIL, CONFIGURE_TOTP, UPDATE_PASSWORD
  F->>DB: INSERT INTO auth.app_user (зеркало) + audit_log
  F->>F: enqueue email "Welcome, set password and TOTP"
  F-->>N: ok + temp_password (одноразовый)
  N-->>A: «Пользователь создан. Email отправлен.»

  Note over A: Реакция на security alert
  G-->>A: alert: «10 failed logins from IP 1.2.3.4 за 5 мин»
  A->>N: /ru/admin/security/incidents
  N->>F: GET /api/v1/admin/security/incidents/active
  F->>DB: query ops.audit_log + Keycloak event log
  F-->>N: detail
  A->>N: жмёт [Block IP at edge]
  N->>F: POST /api/v1/admin/security/block-ip {ip: '1.2.3.4', duration: '24h'}
  F->>F: вызывает CrowdSec bouncer API
  F->>DB: audit_log
  F-->>N: ok
  N-->>A: «IP blocked»
```

## Особенности admin-сценариев

### Re-MFA для critical actions

Не достаточно session-MFA при логине. Каждое из:

- secret rotation
- user creation / role assignment
- maintenance mode toggle
- audit export
- block IP / force logout

требует **повторного TOTP** в момент действия. Это защита от угнанной session.

### Audit на всё

Каждое действие admin пишется в `ops.audit_log` с полным контекстом:

- before / after state
- IP, User-Agent
- target (user_id / secret_name / etc)
- reason (если требуется)
- Ed25519 signature

### Никаких прямых SQL

Admin **не может** выполнять SQL напрямую через UI. Для emergency — bastion-host с pgAudit. Это разделение даёт audit trail на уровне БД.

### Vault-only для secrets

Никакие секреты не показываются в UI. Только:

- last_rotated date
- rotated_by user
- secret name

Чтобы посмотреть значение → bastion + Vault CLI с дополнительным MFA.

## Связанные

- Auth → [[auth-sequence]]
- Полный гид по journeys → [[../05-user-journeys#5. Admin]]
- RBAC → [[rbac-matrix]]
