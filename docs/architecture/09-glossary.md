---
title: Глоссарий
type: glossary
tags:
  - architecture
  - glossary
status: draft
version: 1.0
last_updated: 2026-05-06
---

# Глоссарий терминов

> [!info] Цель
> Один термин — одно определение. Если встретили термин в любом другом документе vault и не уверены — здесь.

---

## A

**ABAC** (Attribute-Based Access Control) · авторизация по атрибутам субъекта/ресурса/контекста. В нашей системе ABAC уточняет RBAC через атрибут `domains[]` (например, `analyst` с `domains=['trade']` не видит `security`).

**ACID** · свойство транзакций БД: Atomicity, Consistency, Isolation, Durability. Гарантия Postgres для всех мутирующих операций.

**ADR** (Architecture Decision Record) · краткая фиксация архитектурного решения с альтернативами и обоснованием. Сводная таблица в [[00-overview#Ключевые архитектурные решения]].

**AS-IS** · текущее состояние архитектуры (то, что в коде сейчас).

**AUCC** · American-Uzbek Chamber of Commerce · бизнес-канал партнёров.

**Audit log** · журнал всех state-changing действий с подписью (Ed25519). Хранится в `ops.audit_log`, WORM-режим, 7 лет.

---

## B

**BPMN** (Business Process Model and Notation) · нотация бизнес-процессов. Используется для ingestion, publication, commitment lifecycle. Файлы в `diagrams/bpmn-*.drawio`.

**Break-glass** · экстренный аккаунт с расширенными правами, хранящийся offline (бумажный конверт в сейфе ИБ-офиса). Для emergency восстановления Keycloak.

**BYOK** (Bring Your Own Key) · модель, при которой ключ к внешнему сервису (Anthropic) предоставляется заказчиком, не вшит в продукт.

---

## C

**C4 Model** · нотация архитектуры в 4 уровнях: Context · Container · Component · Code. Используется для всех схем уровней (см. [[diagrams/c4-context]], [[diagrams/c4-container]], [[diagrams/c4-component]]).

**CapEx / OpEx** · capital expenses (одноразовые) / operational expenses (ежемесячные). См. [[08-migration-roadmap#Бюджет]].

**CERT-UZ** · Computer Emergency Response Team Uzbekistan, нац. CERT при Гос. инспекции по контролю в сфере информатизации и связи. Аттестация информ-систем 2-й категории.

**connector_id** · стабильный идентификатор источника данных в нашей governance-модели. Например: `census-hs-trade`, `world-bank-wdi`, `foreign-assistance`. Видно в [data/external-data.ts](../../data/external-data.ts).

**CRL** (Certificate Revocation List) · список отозванных сертификатов от УЦ. Проверка обязательна при validate E-IMZO подписи.

**CSP** (Content Security Policy) · HTTP-заголовок ограничивающий загрузку скриптов / стилей / iframe. В нашей версии — nonce-based.

**CRUD** · Create / Read / Update / Delete — стандартный набор операций над сущностью.

**CSRF** (Cross-Site Request Forgery) · атака на сессионную аутентификацию. Защита: SameSite cookies + CSRF-токены.

---

## D

**Dagster** · оркестратор data-pipelines с asset-first моделью. Альтернатива Airflow/Prefect.

**Data review queue** · `marts.data_review_queue` — буфер из ingestion-pipeline, где наблюдения ждут human review перед публикацией.

**DBT** (data build tool) · SQL-first инструмент для трансформаций в DWH с тестами и документацией.

**Defense-in-depth** · принцип многослойной безопасности: каждый слой проверяет независимо. См. [[01-target-architecture#Безопасность · Defense-in-depth]].

**Dimensions** · поле `dimensions: jsonb` в `published_metric` — `{country: 'US', flow: 'exports', sourceMethodology: 'us-census'}`. Формирует `metric_identity` вместе с `metric_key`.

**Domain** · одна из категорий метрики: `trade`, `macro`, `assistance`, `finance`, `mobility`, `education`, `security`, `operations`. Используется для ABAC.

**DR** (Disaster Recovery) · процедура восстановления после катастрофы. RPO 1 час, RTO 8 часов в нашем плане.

**DWH** (Data Warehouse) · единое хранилище аналитических данных. У нас — Postgres 17 со схемами `raw`, `staging`, `marts`, `ops`.

---

## E

**E-IMZO** · стек цифровой подписи РУз, основан на ID-карте/SIM. Browser SDK работает в Chrome/Firefox через нативный helper. Используется для подписания decisions.

**ETL/ELT** · Extract-Transform-Load / Extract-Load-Transform. Наша архитектура ELT: сначала загружаем raw, потом dbt трансформирует.

---

## F

**FastAPI** · Python web-framework, основной API нашей платформы. Async, Pydantic, авто-OpenAPI.

**Federation** (identity) · подключение внешнего IdP (LDAP, OneID) к Keycloak через стандартные протоколы.

---

## G

**GosSUZI** · Государственный центр специальной экспертизы технических средств защиты информации УзСтандарт. Альтернатива/связано с CERT-UZ для аттестации.

**Governance pipeline** · поток данных с правилами утверждения (`raw_snapshot → normalized_observation → review → published_metric`). См. [[04-data-flow]].

---

## H

**HA** (High Availability) · топология с active-active или active-passive репликами. У нас Patroni для Postgres, 2 реплики Keycloak.

**HIBP** (Have I Been Pwned) · сервис проверки утекших паролей. Используется при создании user.

**HSTS** (HTTP Strict Transport Security) · заголовок, заставляющий браузер всегда использовать HTTPS.

---

## I

**Idempotent** · операция, повторение которой не меняет результат. Все ingestion-runs идемпотентны через UNIQUE constraint на `content_hash`.

**IdP** (Identity Provider) · сервис, выдающий identity-tokens. У нас — Keycloak.

**Ingestion** · процесс получения внешних данных + сохранения в `raw.*`.

**`is_demo`** · флаг в `data/*.ts` и в DWH, помечающий синтетические значения. Отображаются с DemoBadge, скрываются по `hideDemo`.

---

## J

**JWT** (JSON Web Token) · подписанный токен с claims. У нас — RS256, TTL 15 мин, передаётся в `Authorization: Bearer`.

**JWKS** (JSON Web Key Set) · публичные ключи IdP, по которым проверяется JWT. Кешируются в FastAPI на 1 час.

---

## K

**k3s** · легковесный Kubernetes-дистрибутив. У нас — production-кластер.

**Keycloak** · OSS Identity Provider, наш SSO. Поддерживает OIDC, SAML, LDAP federation.

**KPI** (Key Performance Indicator) · ключевой показатель в дашборде. Карточка KpiCard ссылается на `marts.published_metric`.

---

## L

**LGTM-stack** · Loki + Grafana + Tempo + Mimir. OSS observability стек.

**Landing zone** · MinIO bucket `raw-snapshots` куда складываются сырые ответы внешних API (immutable, 7 лет).

**Lineage** · отслеживание происхождения данных от источника до дашборда. Поддерживается dbt docs + Dagster asset-graph.

---

## M

**marts** · схема в DWH с финальными витринами. Только для read из приложения (FastAPI, Superset).

**MCP** · не наш термин. Не путать с **Maglev** (V8 compiler).

**metric_identity** · стабильный ключ метрики = `metric_key + "::" + sorted(dimensions)`. Используется для no-downgrade-сравнения.

**metric_key** · stable identifier metric, например `trade.us.goods.monthly.exports`.

**MFA** (Multi-Factor Authentication) · второй фактор. У нас — TOTP в приложении (Google Auth / Yubico). Обязательно для editor+.

**MinIO** · S3-совместимый объектный сторадж on-prem.

**MIIP** · Министерство инвестиций, индустрии и торговли РУз.

**MID** · МИД РУз.

**mTLS** · взаимный TLS, обязательный для service-to-service связей внутри k3s.

---

## N

**Next.js** · React framework. Frontend-слой для executive UX. Server components для SSR.

**No-downgrade policy** · правило, что старший период не может заменить более новый утверждённый. См. [[04-data-flow#No-downgrade]].

**NormalizedObservation** · контракт между ingestion и dbt. Pydantic-модель.

---

## O

**OneID** · государственный SSO РУз для граждан. Federation в Keycloak для бизнес-пользователей.

**OIDC** (OpenID Connect) · стандарт идентификации поверх OAuth 2.0. Используется между Keycloak ↔ Next.js / FastAPI / Superset.

**OpenTelemetry** · стандарт телеметрии (трассы, метрики, логи). Все сервисы эмитят через OTel SDK.

**ops** · схема DWH с операционными таблицами: commitments, decisions, audit_log, comments, user_preferences.

---

## P

**Patroni** · кластерный фреймворк для Postgres с автоматическим failover, основан на etcd.

**PII** (Personally Identifiable Information) · персональные данные. См. жёсткий boundary в [[../../CLAUDE]].

**PKCE** (Proof Key for Code Exchange) · обязательное расширение OIDC для public clients (Next.js).

**Postgres RLS** (Row Level Security) · политики доступа на уровне строк. Защита defense-in-depth даже при компрометации middleware.

**Pre-аттестация** · внутренний security audit перед подачей в CERT-UZ. См. [[08-migration-roadmap#Pre-security audit]].

**Presentation Mode** · флаг в [lib/store/settings.ts](../../lib/store/settings.ts), скрывает demo-маркеры для презентации.

**Promise.all** · параллельная загрузка данных в server components.

**published_metric** · таблица в `marts.*` с текущими утверждёнными значениями. По одному `is_current=true` на `metric_identity`.

---

## Q

**Quality flags** · массив строк в `NormalizedObservation`, помечающий неполноценность снимка: `missing-source-last-update`, `parse-error`, `manual-review-required`.

---

## R

**RBAC** (Role-Based Access Control) · модель доступа по ролям. См. [[03-authentication-rbac]].

**Refresh token** · токен с TTL 8 часов, ротируется при каждом use. Используется для обновления access_token.

**Relevance score** · поле `0..1` в `NormalizedObservation`, насколько коннектор уверен в применимости. Низкий score → `ignore-irrelevant`.

**Review queue** · см. Data review queue.

**RLS** · см. Postgres RLS.

**RPO** (Recovery Point Objective) · максимальная допустимая потеря данных. У нас — 1 минута для DB через sync replica, 5 минут для DR-сайта.

**RTO** (Recovery Time Objective) · максимальное время восстановления. У нас — 5 минут для failover, 8 часов для full DR.

---

## S

**SAML** · альтернативный OIDC стандарт. Поддерживается Keycloak, может потребоваться для federation с гос. AD.

**Sankey** · диаграмма потоков (используется в trade page).

**Sentry** · инструмент error-tracking. Self-hosted в k3s.

**Service account** · машинная учётка в Keycloak (client_credentials grant). Используется Dagster, cron, fastapi-internal.

**SOA** · service-oriented architecture. Описывает наш слой FastAPI как service-oriented.

**Source registry** · `data/sources.ts` + `marts.source_record` — реестр всех источников данных с уровнем доверия.

**SSO** (Single Sign-On) · одна аутентификация на все сервисы. Keycloak это обеспечивает.

**State machine** · машина состояний commitment / decision. См. [[06-business-processes]].

**Static fallback** · feature, при которой страницы рендерятся даже при недоступности БД из bundled snapshot. Защита от SPOF.

**Static-source-registry** · магическое значение `approved_by` для метрик загруженных при миграции из `data/*.ts`.

**Superset** · Apache OSS BI-инструмент. SQL Lab + dashboards для аналитиков.

---

## T

**Tashkent timezone** · `Asia/Tashkent`, UTC+5. Все scheduling в UTC, отображение в локальной зоне.

**TOTP** (Time-based One-Time Password) · стандарт MFA, RFC 6238. Используется в Google Authenticator / Yubico Auth.

**Trace** · в OTel — корневой span с trace_id, проходящий через все сервисы. Используется для корреляции в Tempo.

**Traefik** · reverse proxy с автоматическим TLS-terminations.

**TTL** (Time To Live) · срок жизни токена / cookie / cache-ключа.

---

## U

**UWS** · UI/UX wars syndrome — слишком много кнопок. Не наш case, целевой UX simple.

**UWS-USA** · alias для проекта.

**Uzinfocom** · инфраструктурный гос. провайдер РУз.

---

## V

**Vault** · HashiCorp secret manager. Хранит API-keys, DB-passwords, TLS-certs.

**Visit-prep PII boundary** · жёсткое правило: платформа НЕ хранит passport-numbers, visa-numbers, PNRs, hotel codes, talking-points text, MoU drafts, individual delegate names, personal contact details. См. [[../../CLAUDE]] правило 9.

---

## W

**WAL** (Write-Ahead Log) · Postgres журнал транзакций. Streaming в DR-сайт.

**Webhook** · HTTP callback. Keycloak event listener шлёт в FastAPI.

**WORM** (Write Once Read Many) · режим неизменяемости. Применяется к `ops.audit_log`.

---

## X-Z

**Zustand** · клиентский state-manager в Next.js. Используется для UI prefs (theme, hideDemo).

---

## Аббревиатуры РУз

- **АП** — Аппарат Президента
- **МИД** — Министерство иностранных дел
- **МИИП** — Министерство инвестиций, индустрии и торговли
- **МИПТ** (если встретится) — Министерство иннoваций и продвинутых технологий
- **AUCC** — American-Uzbek Chamber of Commerce
- **ИКС** — Информационно-коммуникационная система (термин гос. классификации)
- **ИС 2-й категории** — Информ. система с обработкой ПДн / служебной инфо
- **ПДн** — персональные данные
- **РУз** — Республика Узбекистан

---

## Дальше

- Каталог диаграмм → [[diagrams/README]]
- Главный индекс → [[README]]
