---
title: Каталог компонентов
type: catalog
tags:
  - architecture
  - components
status: draft
version: 1.0
last_updated: 2026-05-06
related:
  - "[[01-target-architecture]]"
  - "[[diagrams/c4-container]]"
  - "[[diagrams/c4-component]]"
---

# Каталог компонентов

> [!info] Назначение
> Карточка на каждый сервис целевой архитектуры: что делает, на чём, какие интерфейсы, какой owner, какие риски.

---

## Frontend-слой

### `next-ui` — Executive UI

| Поле | Значение |
|---|---|
| **Технология** | Next.js 16 · React 19 · TypeScript 6 · Tailwind v4 · next-intl |
| **Хостинг** | Pod в k3s, 2 реплики |
| **Назначение** | Главный UI для руководителей. SSR/SSG страниц, динамика — через FastAPI |
| **Зависит от** | FastAPI Gateway (HTTP) · Keycloak (OIDC client) |
| **Аудитория** | viewer, executive, editor, analyst (зависит от роли — UI скрывает действия) |
| **Owner** | Frontend-команда |
| **SLO** | p95 TTFB < 600 ms; uptime 99.9% |

**Что остаётся из текущего кода**:
- `app/[locale]/*` — все страницы
- `components/*` — все виджеты
- `lib/store/settings.ts` — только UI-prefs (theme, hideDemo)
- `lib/i18n/*`
- design tokens в `app/globals.css`

**Что уходит**:
- Прямые `import` из `data/*.ts` → заменяются на `await fetchFromApi(...)` через серверный fetch с next-кешем
- `lib/auth/admin.ts` (HMAC-кука) → next-auth + Keycloak provider
- `lib/db/adapter.ts` (Supabase REST) → удаляется
- `lib/data-governance/*` → переезжает на backend
- `app/api/chat/route.ts` → проксирует в FastAPI `/api/v1/ai/chat`
- `app/api/cron/*`, `app/api/admin/*` → удаляются полностью

**Риски**: тёплый кеш revalidation должен быть короче, чем acceptable lag для KPI; иначе на главной устаревшие цифры.

---

### `superset` — Аналитический BI

| Поле | Значение |
|---|---|
| **Технология** | Apache Superset 4 |
| **Хостинг** | Pod в k3s, 2 реплики, отдельный Postgres (metadata) |
| **Назначение** | SQL Lab + drag-and-drop dashboards для аналитиков и data team |
| **Зависит от** | Postgres DWH (read-only пользователь) · Keycloak (OIDC) |
| **Аудитория** | analyst, admin |
| **Owner** | Data team |
| **SLO** | uptime 99% (внутренний инструмент) |

**Конфигурация**:
- OIDC-coupling с Keycloak → SSO
- Database connection: `marts_reader` user, RLS-aware
- `ROW_LEVEL_SECURITY = True` — фильтр по `domain` для роли analyst (если потребуется)
- Default theme: dark (отличается от Executive UI визуально, чтобы не путали)

**Не дублирует Next.js UI**: разные аудитории. Если будет соблазн «давайте всё в Superset» — отказать. Executive UX не получится.

---

## Application / API-слой

### `fastapi-gateway` — главный API

| Поле | Значение |
|---|---|
| **Технология** | Python 3.13 · FastAPI · Pydantic v2 · asyncpg · authlib · uvicorn-gunicorn |
| **Хостинг** | Pod в k3s, 3 реплики, HPA по CPU |
| **Назначение** | Единая точка для frontend и admin: данные, governance, AI-proxy, экспорты, audit |
| **Зависит от** | Postgres DWH · Redis · Keycloak (verify JWT) · MinIO · Anthropic API |
| **Аудитория** | внутренние клиенты (next-ui, admin-console, superset webhook) |
| **Owner** | Backend-команда |
| **SLO** | p95 latency < 250ms (read), < 800ms (write); error-rate < 0.1% |

**Структура модулей** (см. [[diagrams/c4-component]]):

```
fastapi-gateway/
├── app/
│   ├── main.py                # FastAPI()  + middleware chain
│   ├── core/
│   │   ├── config.py          # Pydantic Settings (env)
│   │   ├── security.py        # JWT verify, RBAC guards
│   │   ├── audit.py           # WAL писатель в ops.audit_log
│   │   ├── otel.py            # OpenTelemetry setup
│   │   └── ratelimit.py       # Redis-based, per-user/IP
│   ├── api/v1/
│   │   ├── data/              # /data/{domain}/latest, /history
│   │   ├── governance/        # /governance/review-queue, /publish
│   │   ├── admin/             # /admin/users, /admin/policies
│   │   ├── ai/                # /ai/chat (стрим)
│   │   ├── commitments/       # CRUD + state machine
│   │   ├── decisions/         # Workflow + E-IMZO sign
│   │   ├── exports/           # PDF/DOCX генерация
│   │   └── health/            # /healthz, /readyz
│   ├── domain/                # Pydantic models (Single source of truth)
│   ├── repos/                 # asyncpg-репозитории на schema
│   └── workers/               # Background jobs (PDF, exports)
├── tests/
├── alembic/                   # Миграции
└── pyproject.toml
```

**Контракт API**: автогенерация OpenAPI 3.1 → клиент TypeScript генерируется через `openapi-typescript` в frontend.

**Backwards compatibility**: версионирование `/api/v1/*` — изменения breaking → `/api/v2/*` параллельно ≥ 1 квартала.

---

### `admin-console` — административная панель

| Поле | Значение |
|---|---|
| **Технология** | Внутри Next.js UI как защищённый раздел `/admin/*`, бизнес-логика — в FastAPI |
| **Хостинг** | Тот же что Next.js |
| **Назначение** | RBAC, source-policies, ingestion runs, demo registry, audit viewer, источники |
| **Зависит от** | FastAPI · Keycloak |
| **Аудитория** | admin, editor (subset) |
| **Owner** | Backend + Frontend |
| **SLO** | то же что Next.js |

**Замена существующего `/admin`** (см. [app/[locale]/admin/page.tsx]):
- `SettingsPanel` → остаётся, но persist в БД (per-user)
- `DemoRegistryTable` → CRUD через FastAPI
- `DataOperationsPanel` → → подключается к `/api/v1/governance/runs`
- `AuditLogPreview` → читает `ops.audit_log` через FastAPI с фильтрами
- Управление users → новая страница, синк с Keycloak

---

## Identity / IdP слой

### `keycloak` — Identity Provider

| Поле | Значение |
|---|---|
| **Технология** | Keycloak 26 · embedded Postgres |
| **Хостинг** | 2 реплики, активный + горячий резерв |
| **Назначение** | OIDC SSO, MFA, federation, токены |
| **Зависит от** | свой Postgres |
| **Аудитория** | Все сервисы, пользователи |
| **Owner** | DevOps + ИБ |
| **SLO** | uptime 99.95% (всё лежит, если лежит он) |

**Конфигурация realm** `uzus`:

| Поле | Значение |
|---|---|
| Token TTL (access) | 15 минут |
| Token TTL (refresh) | 8 часов · ротация |
| MFA | TOTP обязательно для `editor`/`admin`/`executive`. Для `viewer`/`analyst` — опционально |
| Federation | OneID РУз (для бизнес-пользователей AUCC) · LDAP (для гос. служащих, если есть AD) |
| Roles | `viewer` `analyst` `editor` `executive` `admin` (см. [[03-authentication-rbac]]) |
| Groups | `dept-mid`, `dept-mipt`, `dept-aucc`, `dept-center` |
| Claims | `roles[]`, `domains[]` (для ABAC), `agency` |

**Audit**: все события Keycloak шипятся в Loki через KC event listener.

---

## Data / Storage-слой

### `postgres-dwh` — основное хранилище

| Поле | Значение |
|---|---|
| **Технология** | PostgreSQL 17, Patroni 3, etcd 3, pgBouncer (transaction pool) |
| **Хостинг** | 2 узла (primary + sync replica) + 1 async replica для аналитики |
| **Назначение** | Единое хранилище: raw, staging, marts, ops, auth |
| **Зависит от** | etcd (для Patroni) |
| **Аудитория** | Dagster, dbt, FastAPI, Superset |
| **Owner** | DBA |
| **SLO** | RPO 1 минута · RTO 5 минут (failover) |

**Схемы**:

| Схема | Содержание | Доступ |
|---|---|---|
| `raw` | snapshots источников (JSONB) | dbt write · никто read из приложения |
| `staging` | типизированные observations | dbt только |
| `marts` | published_metric, агрегаты | FastAPI read · Superset read · dbt write |
| `ops` | commitments, decisions, audit_log, comments | FastAPI rw |
| `auth` | sync роли с Keycloak (для FK) | FastAPI rw |
| `dbt` | snapshots dbt (history таблицы) | dbt только |

**Конфигурация**:
- `wal_level = replica`
- `max_wal_senders = 8`
- `archive_mode = on`, archive в MinIO bucket `wal-archive`
- `pg_stat_statements` включён
- `log_min_duration_statement = 1000` (медленные запросы в Loki)
- TLS обязательно, `pg_hba.conf` только `hostssl`
- pgBouncer pool size = 25 на каждый сервис

**Бэкапы 3-2-1**:
- pgBackRest full ежедневно, incremental каждые 6 часов
- Хранение: MinIO основной, MinIO в DR-ЦОД, ленточный архив (раз в неделю)
- Restore drill: ежеквартально

**Расширения**: `pgcrypto`, `pg_stat_statements`, `pg_trgm` (для search), `postgis` (опционально для регионов).

---

### `minio` — объектный сторадж

| Поле | Значение |
|---|---|
| **Технология** | MinIO RELEASE.2026-XX, Erasure-coded |
| **Хостинг** | 4 узла, EC 4+2 (выдерживает падение 2 узлов) |
| **Назначение** | landing для raw, экспорты PDF/DOCX, attachments комментариев, WAL-архив Postgres |
| **Зависит от** | — |
| **Аудитория** | Dagster (write raw) · FastAPI (write exports/read raw) · pgBackRest |
| **Owner** | DevOps |
| **SLO** | uptime 99.9%, durability 99.999999999% (EC) |

**Buckets**:

| Bucket | Содержание | Versioning | Retention | Lifecycle |
|---|---|---|---|---|
| `raw-snapshots` | Сырые JSON ответы коннекторов | enabled | immutable 7 лет | move to cold после 90 дней |
| `exports-pdf` | PDF брифы с подписью | enabled | 5 лет | — |
| `exports-docx` | Документы для подготовки делегаций | enabled | 5 лет | — |
| `attachments` | Файлы из комментариев | enabled | 3 года | — |
| `wal-archive` | Postgres WAL | — | 30 дней | удаление |
| `dagster-storage` | Dagster IO manager | — | 90 дней | удаление |

**Шифрование at-rest**: SSE-S3 с KMS (ключ хранится в Vault).

---

### `redis` — cache + rate-limit + queue

| Поле | Значение |
|---|---|
| **Технология** | Redis 8 + Sentinel HA |
| **Хостинг** | 1 primary + 2 replicas + 3 sentinels |
| **Назначение** | Cache (горячие KPI), rate-limit (FastAPI), очереди фоновых задач, sessions |
| **Зависит от** | — |
| **Аудитория** | FastAPI, Next.js (через FastAPI) |
| **Owner** | Backend |
| **SLO** | uptime 99.9% |

**Базы**:
- `db=0` — cache (TTL 5 мин для KPI, 1 час для статичного)
- `db=1` — rate-limit counters (TTL 60 сек / 1 час окна)
- `db=2` — Dramatiq/RQ очередь background-jobs
- `db=3` — distributed locks для cron-операций

---

## Data-integration слой

### `dagster` — оркестратор

| Поле | Значение |
|---|---|
| **Технология** | Dagster 1.x · Postgres metadata · MinIO IO manager |
| **Хостинг** | Daemon + webserver, 1 реплика (singleton) |
| **Назначение** | DAG'и для 5 коннекторов, scheduling, retries, lineage UI |
| **Зависит от** | Postgres (Dagster meta) · MinIO · Postgres DWH (write) · Anthropic для description (опц.) |
| **Аудитория** | Data engineers, admins (kick-off ручных runs) |
| **Owner** | Data team |
| **SLO** | failure rate < 5% после 3 retry; uptime daemon 99% |

**Assets** (1 asset = 1 metric_key):
- `census_us_goods_monthly_exports`, `_imports`, `_balance` (3 assets)
- `bea_us_services_metadata`
- `exim_authorizations_uzbekistan`
- `worldbank_uz_gdp`, `_population` (и далее по списку индикаторов)
- `foreign_assistance_uz_obligations`

**Schedules**:
- Daily 07:00 UTC: census, foreign-assistance, worldbank
- Weekly Mon 06:00 UTC: bea, exim
- Manual только: file-watcher (XLSX inbox)

**Sensors**: file-sensor на MinIO bucket `inbox/` → если появился XLSX → trigger DAG `manual-ingest`.

---

### `dbt-core` — трансформации

| Поле | Значение |
|---|---|
| **Технология** | dbt 1.9 · adapter dbt-postgres |
| **Хостинг** | Запускается из Dagster (dagster-dbt) |
| **Назначение** | Трансформации raw → staging → marts с тестами |
| **Зависит от** | Postgres DWH |
| **Аудитория** | Data engineers, analysts |
| **Owner** | Data team |
| **SLO** | dbt run длится < 5 мин для daily; tests pass rate 100% перед merge |

**Ключевые модели**:

```
models/
├── staging/
│   ├── stg_census__monthly.sql           # 1:1 типизация из raw.census_*
│   ├── stg_worldbank__indicators.sql
│   └── stg_foreign_assistance__obligations.sql
├── intermediate/
│   ├── int_normalized_observations.sql   # унификация в схему NormalizedObservation
│   └── int_evaluated_review.sql           # реализует politику policy.ts на SQL
└── marts/
    ├── published_metric.sql               # текущие утверждённые
    ├── published_metric_history.sql       # snapshot table (dbt snapshots)
    ├── data_review_queue.sql
    └── domain_aggregates/
        ├── trade_kpi.sql
        ├── investment_kpi.sql
        └── grants_kpi.sql
```

**Тесты, замещающие [[04-data-flow#No-downgrade]]**:
```sql
-- tests/no_downgrade.sql
select metric_identity, period_end, candidate_period_end
from {{ ref('int_evaluated_review') }}
where action = 'reject-older-period'
  and severity = 'block'
  -- если строка появилась — кто-то нарушил политику
```

---

### `file-watcher` — приёмник XLSX/PDF

| Поле | Значение |
|---|---|
| **Технология** | Python script + watchdog → MinIO upload + Dagster trigger |
| **Хостинг** | sidecar в Dagster pod |
| **Назначение** | Приём файлов от ведомств (XLSX/DOCX/PDF) на email или папку |
| **Зависит от** | MinIO · Dagster · IMAP (опционально) |

---

## Observability-слой

### `opentelemetry-collector`

Принимает traces/logs/metrics от всех сервисов (через OTLP gRPC). Распределяет в Tempo/Loki/Prometheus. 2 реплики.

### `tempo` (traces) + `loki` (logs) + `mimir` (metrics)

LGTM-стек. Хранение: 30 дней горячее, 365 дней холодное в MinIO.

### `grafana`

Главный observability-UI. Дашборды:
- **Platform Overview** — все сервисы, golden signals
- **Postgres Health** — connections, slow queries, replication lag
- **Ingestion** — успешность DAG'ов, latency коннекторов, объём raw
- **API Latency** — p50/p95/p99 на endpoint
- **Security Events** — failed logins, rate-limit hits, AI quota breaches

Alertmanager → отправка в Telegram-bot ICCT (incident channel) + email on-call.

### `sentry`

Self-hosted. Frontend (Next.js) и backend (FastAPI) отправляют ошибки. Releases tracking, source-maps загрузка из CI.

---

## Security · вспомогательные сервисы

### `vault` — secret manager

HashiCorp Vault (community). Хранит: DB-пароли, API-ключи, JWT-секреты, TLS-сертификаты. K8s-integration через kubernetes auth backend → каждый pod получает ServiceAccount → Vault выдаёт секреты.

### `crowdsec` — WAF / behavior

CrowdSec community edition на Traefik. Bouncer блокирует подозрительные IP. Datasets — глобальная база + локальные сценарии (брутфорс /admin/login, подозрительные AI-промпты).

---

## Сводная таблица

| Сервис | Реплики | RAM | CPU | Disk | Аудит | Owner |
|---|---|---|---|---|---|---|
| Next.js UI | 2 | 512Mi | 0.5 | — | — | Frontend |
| FastAPI | 3 | 1Gi | 1.0 | — | ✅ | Backend |
| Superset | 2 | 1Gi | 1.0 | — | ✅ | Data |
| Keycloak | 2 | 1Gi | 0.5 | — | ✅ | DevOps + ИБ |
| Postgres DWH | 2 (HA) + 1 | 8Gi | 4.0 | 500GB SSD | ✅ | DBA |
| MinIO | 4 | 2Gi | 1.0 | 2TB HDD | partial | DevOps |
| Redis | 3 | 1Gi | 0.3 | 50GB SSD | — | Backend |
| Dagster | 1 | 2Gi | 1.0 | — | ✅ | Data |
| LGTM-stack | 1 каждый | 1Gi | 0.5 | 200GB SSD | — | DevOps |
| Sentry | 1 (full stack) | 2Gi | 1.0 | 100GB SSD | — | DevOps |
| Vault | 3 | 256Mi | 0.2 | 10GB SSD | ✅ | ИБ |

**Итого минимум** (production): ~30 GB RAM, ~15 vCPU, ~3 TB storage. Помещается в 3-узловой k3s по 16 GB / 8 vCPU / 1 TB SSD каждый + отдельный data-узел 32 GB / 8 vCPU / 4 TB.

---

## Дальше

- Как сервисы общаются → [[04-data-flow]]
- Как пользователь проходит через них → [[05-user-journeys]]
- Деплой-диаграмма → [[diagrams/deployment]]
