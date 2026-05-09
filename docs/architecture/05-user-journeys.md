---
title: Пути пользователей
type: journey
tags:
  - architecture
  - ux
  - journeys
status: draft
version: 1.0
last_updated: 2026-05-06
related:
  - "[[03-authentication-rbac]]"
  - "[[diagrams/journey-viewer]]"
  - "[[diagrams/journey-admin]]"
  - "[[diagrams/auth-sequence]]"
---

# Пути пользователей

> [!info] Назначение
> Полный сценарный путь каждой роли — от стандартной аутентификации до выполнения целевой задачи. Используется при UX-дизайне, написании автотестов, тренинге пользователей.

## Обзор ролей

| Роль | Главная задача | Частота входа | Устройство |
|---|---|---|---|
| **Viewer** | Прочитать KPI, открыть дашборд утром | 1–3 раза в день | Десктоп / iPad |
| **Analyst** | Подготовить набор данных для брифа | Ежедневно, 4–6 ч | Десктоп |
| **Editor** | Утвердить новые метрики после ingestion | 1 раз в день | Десктоп |
| **Executive** | Просмотр + одобрить решение | 1–2 раза в день | Десктоп / телефон |
| **Admin** | Управление платформой, инциденты | По мере надобности | Десктоп |

---

## 1. Viewer · стандартный путь

> **Персона**: Сотрудник Аппарата Президента, открывает утренний бриф.
> **Цель**: Увидеть свежие KPI по торговле, ближайшие визиты и сигналы рисков.

### Sequence (стандартный логин)

```mermaid
sequenceDiagram
  autonumber
  actor V as Viewer
  participant Br as Browser
  participant N as Next.js UI
  participant K as Keycloak
  participant F as FastAPI
  participant DB as Postgres

  V->>Br: открывает https://uzus.gov.uz
  Br->>N: GET /
  N-->>Br: 302 → /ru (по Accept-Language)
  Br->>N: GET /ru
  N->>N: проверяет session cookie
  N-->>Br: 302 → /api/auth/signin?provider=keycloak

  Br->>K: GET /realms/uzus/protocol/openid-connect/auth
  K-->>Br: страница логина (русский)
  V->>Br: вводит зулькарнаев@xxx.uz + пароль
  Br->>K: POST credentials
  K-->>Br: запрос TOTP (если MFA настроена)
  V->>Br: вводит 6 цифр из приложения
  Br->>K: POST otp
  K-->>Br: 302 → /api/auth/callback?code=...

  Br->>N: callback
  N->>K: exchange code → tokens
  K-->>N: access_token + refresh_token + id_token
  N->>F: GET /api/v1/users/me<br/>(подтянуть preferences)
  F->>DB: SELECT * FROM ops.user_preferences WHERE user_id=$1
  DB-->>F: theme=light, hide_demo=false
  F-->>N: preferences JSON
  N->>N: кладёт session_id в HttpOnly cookie

  N-->>Br: 302 → /ru
  Br->>N: GET /ru (с session)

  par Параллельная загрузка данных
    N->>F: GET /api/v1/data/trade/latest
    F->>DB: SELECT FROM marts.published_metric<br/>WHERE domain='trade' AND is_current=true
    DB-->>F: rows (RLS-фильтр: viewer.domains)
    F-->>N: JSON
  and
    N->>F: GET /api/v1/visits/horizon?days=90
    F->>DB: SELECT FROM marts.upcoming_visits
    DB-->>F: rows
    F-->>N: JSON
  and
    N->>F: GET /api/v1/risks/aggregated
    F-->>N: JSON
  end

  N-->>Br: HTML главной с KPI, картой, горизонтом
  V->>Br: листает, кликает KPI
  Br->>N: GET /ru/trade?direction=imports
  Note over Br,F: Следующие переходы — через server components<br/>и клиентский router; токен в каждом запросе
```

См. визуально: [[diagrams/journey-viewer]]

### Что Viewer видит и может

| Зона | Доступ |
|---|---|
| Главная (`/[locale]`) | ✅ Все KPI, картa, горизонт визитов, сигналы |
| `/[locale]/trade` | ✅ Все графики, фильтры |
| `/[locale]/visits`, `/agreements`, `/grants` | ✅ Чтение, экспорт PDF |
| `/[locale]/counterparts/[id]` | ✅ Брифинг-карты |
| `/[locale]/assistant` | ✅ AI-чат (rate-limit 20 запросов / час) |
| `/[locale]/admin` | ❌ 403, кнопка скрыта в UI |
| Изменение настроек | ✅ Только UI prefs (theme, language) |

### Тонкие места для viewer

- При первом логине пустой `user_preferences` → дефолты (theme=light, hide_demo=false)
- При федерализованной учётке (LDAP) первая сессия дольше на ~500 мс — Keycloak ходит в AD
- Если AI quota исчерпана → UI показывает «Превышен лимит, сбросится через 27 минут» (не 503)

---

## 2. Analyst · ежедневная работа с данными

> **Персона**: Аналитик Центра, готовит данные для брифа советника.
> **Цель**: Найти аномалию в торговле, добавить commitment, сделать выгрузку для коллеги.

### Стандартный путь

```mermaid
sequenceDiagram
  autonumber
  actor A as Analyst
  participant N as Next.js
  participant F as FastAPI
  participant S as Superset
  participant DB as Postgres

  Note over A: (после стандартной аутентификации)
  A->>N: открывает /ru/trade
  N->>F: GET /api/v1/data/trade/latest
  F->>DB: with RLS guard
  DB-->>F: rows
  F-->>N: JSON
  N-->>A: график

  A->>A: видит аномалию в марте 2026 (рост импорта +210%)
  A->>S: переходит в Superset (отдельный таб)
  S->>K[Keycloak]: проверяет сессию, SSO работает
  S-->>A: SQL Lab открыт
  A->>S: SELECT period_end, value, source_url<br/>FROM marts.published_metric<br/>WHERE metric_key LIKE 'trade.us.goods.monthly.%'
  S->>DB: query (через marts_reader user)
  DB-->>S: rows
  A->>A: понимает, что аномалия — не данные, а реальный пик после визита

  A->>N: возвращается в /ru/commitments
  A->>N: создаёт новый commitment "Расширить экспорт текстиля"
  N->>F: POST /api/v1/commitments<br/>{title, status='watch', sphere='trade', ...}
  F->>F: validate Pydantic
  F->>F: check permission "commitment:edit"
  F->>DB: INSERT INTO ops.commitment_record
  F->>DB: INSERT INTO ops.audit_log
  F-->>N: 201 Created + id
  N-->>A: новая строка в таблице

  A->>N: GET /ru/exports → выбирает "Trade brief PDF"
  N->>F: POST /api/v1/exports/pdf<br/>{template='trade_brief', filters={...}}
  F->>F: enqueue background job
  F-->>N: 202 + job_id
  N-->>A: «PDF готовится...»
  Note over F: Фон: Playwright рендерит /ru/trade?print=1<br/>с водяным знаком и подписью
  F->>DB: UPDATE export_job SET status='done', url='minio://exports/...'
  F-->>N: WebSocket push: job_done
  N-->>A: «Скачать PDF»
```

### Что Analyst может дополнительно к Viewer

| Действие | Где |
|---|---|
| Создать/редактировать commitment | `/admin/commitments` (subset admin UI) |
| Создать draft decision | `/admin/decisions/new` |
| Доступ в Superset SQL Lab | `https://superset.uzus.local` |
| Подключиться к коннектору в Superset | только marts.* read-only |
| Создать сохранённый чарт | в Superset |
| Скачать выгрузку CSV/XLSX | через FastAPI или Superset |

### Тонкие места для analyst

- Superset и Next.js — отдельные UI; user может запутаться где что искать. Решение: ссылка из каждого мартового KPI «Open in Superset» через deeplink.
- SQL Lab имеет квоту по строкам (max 50K) — больше → выгрузка как async job
- Если Analyst видит раздел `/admin/commitments`, но не имеет permission `metric:publish` — действия по утверждению метрик скрыты UI и заблокированы FastAPI (defence in depth).

---

## 3. Editor · утверждение метрик

> **Персона**: Редактор данных, отвечает за корректность торговой статистики.
> **Цель**: Утром после ingestion-cron'а просмотреть очередь обзора и одобрить/отклонить новые значения.

### Утренний review-цикл

```mermaid
sequenceDiagram
  autonumber
  actor E as Editor
  participant N as Next.js
  participant F as FastAPI
  participant DB as Postgres
  participant Tg as Telegram bot

  Note over E: 08:30 утра, после daily ingestion (07:00 UTC = 12:00 Tashkent)
  E->>N: открывает /ru/admin/review-queue
  N->>F: GET /api/v1/governance/review-queue?status=open
  F->>F: check permission "review-queue:approve"
  F->>DB: SELECT FROM marts.data_review_queue<br/>WHERE status='open' ORDER BY severity, created_at
  DB-->>F: 12 open items
  F-->>N: JSON
  N-->>E: таблица: 3 publish-candidate + 7 manual-review + 2 escalated

  E->>E: открывает первый item:<br/>"trade.us.goods.monthly.exports", март 2026, +210%
  E->>N: GET /governance/item/{id}/details
  N->>F: GET /api/v1/governance/item/{id}
  F->>DB: SELECT raw, current, history, source_url
  F-->>N: extended JSON
  N-->>E: detail-страница: дельта, история, ссылка на census.gov

  E->>E: открывает census.gov в новой вкладке,<br/>проверяет что там действительно 38.7M (не ошибка парсинга)

  E->>N: нажимает [Approve]
  N-->>E: модалка: "Подтвердите MFA"
  E->>N: вводит TOTP код
  N->>F: POST /api/v1/governance/publish<br/>{item_id, reviewer_note: "Verified vs Census API"}<br/>+ MFA challenge response
  F->>F: re-verify TOTP via Keycloak
  F->>DB: BEGIN TX
  F->>DB: UPDATE marts.published_metric SET is_current=false<br/>WHERE metric_identity=$1
  F->>DB: INSERT INTO marts.published_metric (...new...)
  F->>DB: UPDATE marts.data_review_queue SET status='approved'
  F->>DB: INSERT INTO ops.audit_log {action='metric:publish', ...}
  F->>DB: COMMIT
  F-->>N: 200 OK
  N->>F: invalidates Redis cache for trade.*
  N-->>E: «Опубликовано. Откатить (5:00)» — таймер undo

  alt Editor нажимает откат в течение 5 минут
    E->>N: clicks [Undo]
    N->>F: POST /api/v1/governance/undo/{audit_id}
    F->>F: проверяет, что не позже 5 мин
    F->>DB: BEGIN TX → revert  insertion  + restore previous is_current=true
    F->>DB: INSERT INTO ops.audit_log {action='metric:undo', ...}
    F->>DB: COMMIT
    F-->>N: ok
  end

  E->>E: переходит ко второму item: spike в imports +400%
  E->>E: видит, что данные подозрительные (возможна ошибка источника)
  E->>N: нажимает [Reject]
  N-->>E: модалка: «Причина? (мин. 30 символов)»
  E->>N: «Census API вернул дубликат, ждём revision»
  N->>F: POST /api/v1/governance/reject {item_id, reason}
  F->>DB: UPDATE data_review_queue SET status='rejected', reviewer_note=...
  F->>DB: INSERT INTO ops.audit_log {action='metric:reject', ...}
  F->>Tg: уведомить data-team channel
  Tg-->>F: ok
  F-->>N: ok
```

### Эскалация

Если editor сомневается, вместо approve/reject он жмёт **[Escalate]** → `status='escalated'` → admin получает Telegram-нотификацию + видит в своей очереди.

### Тонкие места для editor

- 5-минутное окно undo — после этого нужна формальная процедура «отзыв публикации» через admin
- Для **block-severity** items (например, `reject-older-period`) кнопка Approve физически отсутствует — нельзя обойти политику кнопкой
- При большой дельте (>50%) reviewer_note обязателен ≥ 30 символов
- Если за 5 секунд после approve не пришло уведомление от FastAPI → UI запрашивает статус (защита от двойного approve)

---

## 4. Executive · утверждение решений

> **Персона**: Министр / Советник Президента.
> **Цель**: Просмотреть подготовленные аналитиками решения, одобрить/отклонить с цифровой подписью.

### Workflow одобрения decision

```mermaid
sequenceDiagram
  autonumber
  actor X as Executive
  actor A as Analyst (заранее)
  participant N as Next.js
  participant F as FastAPI
  participant E as E-IMZO server-side
  participant DB as Postgres
  participant Tg as Telegram

  rect rgb(240, 240, 250)
    Note over A: Заранее: аналитик подготовил decision
    A->>F: POST /api/v1/decisions<br/>{title, context, recommendation, source_ids[]}
    F->>DB: INSERT ops.decision_record (status='ready', owner_role='executive')
    F->>Tg: notify executives
    Tg-->>X: уведомление: «Готово к рассмотрению — 2 решения»
  end

  X->>N: открывает /ru/admin/decisions?status=ready
  N->>F: GET /api/v1/decisions?status=ready
  F->>F: check permission "decision:approve"
  F-->>N: 2 items
  N-->>X: список решений

  X->>N: открывает первое
  N->>F: GET /api/v1/decisions/{id}/full
  F->>DB: SELECT decision + linked metrics + source citations
  F-->>N: detail
  N-->>X: страница: контекст · рекомендация · источники

  X->>X: читает, вопросов нет
  X->>N: нажимает [Approve and sign]
  N-->>X: окно браузера E-IMZO просит выбрать сертификат
  X->>X: выбирает свой ID-card сертификат, вводит PIN
  N->>E: подпись через E-IMZO browser API
  E-->>N: signed payload (PKCS#7)
  N->>F: POST /api/v1/decisions/{id}/approve<br/>{signature: <base64>, signed_data: <hash>}
  F->>E: verify signature server-side
  E-->>F: valid + cert info (ФИО, ПИНФЛ хеш)
  F->>F: cross-check certificate.subject == auth.user.full_name
  F->>DB: UPDATE decision_record SET status='approved', signed_at=now(), signature=...
  F->>DB: INSERT ops.audit_log {action='decision:approve', signed=true, ...}
  F-->>N: 200 OK
  N-->>X: «Решение №42 утверждено. Документ доступен для скачивания.»

  X->>N: скачать подписанный PDF
  N->>F: GET /api/v1/decisions/{id}/pdf
  F->>F: generate PDF with embedded signature + QR for verification
  F-->>N: stream
  N-->>X: PDF
```

### Что Executive дополнительно может

| Действие | Особенность |
|---|---|
| Подписать решение | E-IMZO обязательно (физический USB-токен или SIM-карта) |
| Комментировать | Комментарии видят только executive + admin |
| Настроить уведомления | Telegram / email per event-type |
| Видеть аудит **своих** действий | Личный лог |

### Тонкие места для executive

- E-IMZO работает только в Chrome/Firefox с установленным client-side helper. На iPad — не работает → подписание только с десктопа.
- Если в момент подписи Keycloak session истекла → re-login + re-MFA
- При rejecting decision требуется reason ≥ 50 символов (для аудита)

---

## 5. Admin · управление платформой

> **Персона**: Системный администратор.
> **Цель**: Управлять пользователями, политиками источников, реагировать на инциденты.

### Типичный день admin

```mermaid
sequenceDiagram
  autonumber
  actor A as Admin
  participant N as Next.js
  participant F as FastAPI
  participant K as Keycloak
  participant D as Dagster UI
  participant G as Grafana
  participant DB as Postgres

  Note over A: Утренний health check
  A->>G: открывает https://grafana.uzus.local
  G-->>A: Platform Overview dashboard
  A->>A: видит 1 alert: «Census connector failing 3 times»

  A->>D: открывает https://dagster.uzus.local
  D-->>A: asset-graph
  A->>D: открывает census-hs-trade
  D-->>A: error: "API key invalid (HTTP 403)"
  A->>A: понимает: ключ ротировался без обновления

  A->>N: /ru/admin/secrets
  N->>F: GET /api/v1/admin/secrets/connectors
  F->>F: check permission "admin:view"
  F->>F: pulls (masked) from Vault: census_api_key=***
  F-->>N: list with last_rotated dates
  N-->>A: видит, что census_api_key не ротировался 95 дней

  A->>A: открывает census.gov, регенерирует key
  A->>N: жмёт [Update Secret]
  N->>F: POST /api/v1/admin/secrets/connectors<br/>{name: 'CENSUS_API_KEY', value: 'new-key'}
  F->>F: write to Vault
  F->>D: trigger Dagster k8s pod restart (для подхвата env)
  F->>DB: INSERT ops.audit_log {action='secret:rotate', ...}
  F-->>N: ok

  A->>D: triggers manual run of census-hs-trade
  D-->>A: ✅ Run successful

  Note over A: Управление пользователями
  A->>N: /ru/admin/users
  N->>F: GET /api/v1/admin/users
  F->>K: GET /admin/realms/uzus/users (admin client_credentials)
  K-->>F: list
  F-->>N: users + roles + last_seen
  N-->>A: таблица

  A->>N: создать пользователя «И. Каримов, аналитик МИИП»
  N-->>A: форма
  A->>N: заполняет
  N->>F: POST /api/v1/admin/users {email, name, agency, role: 'analyst', domains: ['trade', 'investment']}
  F->>K: POST /admin/realms/uzus/users
  K-->>F: created (with temp password)
  F->>K: assign-role analyst, set domains attribute
  F->>DB: INSERT auth.app_user (зеркало)
  F->>DB: audit_log
  F->>F: enqueue email "Welcome, set TOTP and password"
  F-->>N: ok
  N-->>A: «Пользователь создан, ссылка на установку отправлена»

  Note over A: Реакция на security alert
  G-->>A: alert: «10 failed logins from 1 IP за 5 мин»
  A->>N: /ru/admin/security/incidents
  N->>F: GET /api/v1/admin/security/incidents/active
  F->>DB: query ops.audit_log + Keycloak events
  F-->>N: incident detail
  A->>N: жмёт [Block IP at edge]
  N->>F: POST /api/v1/admin/security/block-ip
  F->>F: добавляет в CrowdSec через bouncer API
  F-->>N: ok
```

См. визуально: [[diagrams/journey-admin]]

### Зоны admin-доступа

| Раздел | Что доступно |
|---|---|
| `/admin` (главная) | сводка инцидентов, статус сервисов, демо-флаги |
| `/admin/users` | CRUD users, role assignment, force logout, сброс TOTP |
| `/admin/policies` | CRUD `source_version_policy`, demo registry |
| `/admin/secrets` | ротация секретов через Vault (без раскрытия значений) |
| `/admin/ingestion` | список runs, ручной trigger, статус коннекторов |
| `/admin/audit` | полный лог + фильтры + экспорт |
| `/admin/security` | failed logins, blocked IPs, AI quota breaches |
| `/admin/maintenance` | включить maintenance mode, force cache invalidation |
| Прямой доступ в Keycloak Admin | для emergency, через bookmark |
| Прямой доступ в Grafana / Dagster / Sentry | через SSO |
| Доступ в Postgres | только через bastion + 2FA + audit (`pgAudit`) |

### Тонкие места для admin

- Прямой доступ к Postgres — за bastion-узлом с дополнительным MFA. Каждое подключение → запись в `ops.audit_log` через pgAudit.
- При создании пользователя email отправляется через SMTP-relay Центра (не Vercel/Sendgrid)
- Force-logout не разрывает уже открытые WebSocket-соединения мгновенно — следующее API-сообщение приведёт к 401 → reconnect
- Nuclear option «выключить platform» — admin может включить maintenance mode → весь UI показывает страницу «технические работы», только admin-routes доступны

---

## Cross-cutting: что одинаково для всех

### Стандартная аутентификация (унифицированная)

См. детальный sequence: [[diagrams/auth-sequence]] и [[03-authentication-rbac#Authorization Code Flow с PKCE]].

**Базовый поток**:
1. Запрос ресурса → нет session → редирект на Keycloak
2. Логин (federated или local) + MFA если применимо
3. Code exchange → tokens → server-side session
4. RBAC + ABAC проверки на каждом API-запросе
5. Audit-log на каждое state-changing действие

### Logout

Любая роль:
- Инициирует через UI «Выйти» → Next-auth уничтожает session → Keycloak SLO (single logout) → все вкладки получают `auth-required` next request.

### Сессия истекла

- При истечении access_token (15 мин) Next-auth прозрачно делает refresh.
- При истечении refresh_token (8 часов) → next request 401 → редирект на login.

### Maintenance mode

- Admin включает → все non-admin запросы получают 503 + страница «Технические работы до 14:00».
- Admin может ходить через специальный header `X-Admin-Bypass: <vault-secret>`.

---

## Дальше

- Sequence-диаграмма стандартного логина → [[diagrams/auth-sequence]]
- Sequence-диаграмма Viewer → [[diagrams/journey-viewer]]
- Sequence-диаграмма Admin → [[diagrams/journey-admin]]
- BPMN бизнес-процессов → [[06-business-processes]]
