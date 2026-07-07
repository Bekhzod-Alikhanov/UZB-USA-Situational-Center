---
title: UML · Data Model
type: diagram
diagram_type: uml
tags:
  - architecture/uml
  - data/model
status: draft
version: 1.0
last_updated: 2026-05-06
drawio: uml-data-model.drawio
related:
  - "[[../04-data-flow]]"
  - "[[data-lineage]]"
  - "[[../03-authentication-rbac]]"
---

# UML · Data Model

> [!info] Файл
> [`uml-data-model.drawio`](uml-data-model.drawio)

## Цель

Показать **класс-модель данных** платформы — все основные сущности, их атрибуты, связи. Используется backend-разработчиками при создании Pydantic-моделей и dbt-моделей, DBA при review SQL-схемы, аналитиками при ad-hoc запросах в Superset.

## Группировка

| Schema                 | Сущности                                                                                    | Назначение                |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------------------- |
| `auth.*`               | AppUser, UserPreferences                                                                    | identity-зеркало Keycloak |
| `marts.*`              | PublishedMetric, PublishedMetricHistory, DataReviewQueue, SourceVersionPolicy, SourceRecord | governance-данные         |
| `raw.*`                | RawSourceSnapshot                                                                           | сырые snapshots           |
| `staging/intermediate` | NormalizedObservation, ReviewQueueItem                                                      | dbt-промежуточные         |
| `ops.*`                | CommitmentRecord, DecisionRecord, CommentRecord, AuditLog, IngestRun                        | операционные              |

## Inline mermaid · class diagram

```mermaid
classDiagram
  direction LR

  class AppUser {
    +UUID id
    +string email
    +string display_name
    +string agency
    +string primary_role
    +string[] domains
    +bool active
    +timestamp last_seen_at
    +timestamp created_at
    +timestamp updated_at
  }

  class UserPreferences {
    +UUID user_id  «PK»
    +string theme
    +bool hide_demo
    +bool presentation_mode
    +bool ai_enabled
    +string default_domain
    +jsonb notification_channels
    +timestamp updated_at
  }

  class SourceRecord {
    +string id  «PK»
    +string name
    +enum level  A | B
    +string url
    +string source_file
    +date fetched_at
    +string data_type
    +string confidence
    +string owner_agency
    +string note
  }

  class SourceVersionPolicy {
    +string connector_id  «PK»
    +string source_id  «FK»
    +enum cadence
    +string owner
    +numeric min_relevance_score
    +bool allow_auto_publish
    +enum replace_rule
    +int retention_days
    +string dashboard_use
  }

  class RawSourceSnapshot {
    +string id  «PK»
    +string run_id  «FK»
    +string connector_id  «FK»
    +string source_id  «FK»
    +string source_url
    +timestamp fetched_at
    +string content_hash
    +int row_count
    +jsonb payload
    -- UNIQUE connector_id, content_hash --
  }

  class NormalizedObservation {
    +string connector_id
    +string source_id
    +string metric_key
    +string label
    +enum domain
    +variant value
    +string unit
    +date period_start
    +date period_end
    +jsonb dimensions
    +string source_url
    +date source_published_at
    +timestamp fetched_at
    +bool is_preliminary
    +numeric relevance_score
    +string recommended_use
    +string[] quality_flags
  }

  class PublishedMetric {
    +string id  «PK»
    +string connector_id
    +string source_id
    +string metric_key
    +string label
    +enum domain
    +variant value
    +string unit
    +date period_start
    +date period_end
    +jsonb dimensions
    +string source_url
    +date source_published_at
    +timestamp fetched_at
    +bool is_preliminary
    +numeric relevance_score
    +string[] quality_flags
    +timestamp approved_at
    +UUID approved_by  «FK»
    +string revision_id
    +bool is_current
  }

  class DataReviewQueue {
    +string id  «PK»
    +string run_id  «FK»
    +string connector_id  «FK»
    +string metric_identity
    +string metric_key
    +enum action
    +enum severity
    +string reason
    +jsonb observation
    +string current_metric_id
    +enum status  open | approved | rejected | escalated | closed
    +UUID reviewer_id  «FK»
    +string reviewer_note
    +timestamp reviewed_at
  }

  class IngestRun {
    +string id  «PK»
    +string scope
    +enum mode  dry-run | write
    +timestamp started_at
    +timestamp finished_at
    +jsonb summary
  }

  class CommitmentRecord {
    +string id  «PK»
    +string title
    +enum status  draft | agreed | in_progress | watch | overdue | done | cancelled
    +string owner
    +string[] co_owners
    +date due_date
    +date agreed_on
    +enum sphere
    +int progress_pct
    +string linked_visit_id
    +numeric value_musd
    +string source_id  «FK»
    +bool is_demo
    +UUID created_by  «FK»
    +UUID updated_by  «FK»
  }

  class DecisionRecord {
    +UUID id  «PK»
    +string title
    +text context
    +text recommendation
    +enum status  draft | ready | approved | rejected | deferred
    +string owner
    +date due_date
    +string[] source_ids
    +bytea signature
    +string signed_by_cert_subject
    +timestamp signed_at
    +UUID created_by  «FK»
  }

  class CommentRecord {
    +UUID id  «PK»
    +string entity_type
    +string entity_id
    +text body
    +UUID created_by  «FK»
    +timestamp created_at
  }

  class AuditLog {
    +UUID id  «PK»
    +UUID actor_id  «FK»
    +string actor_role
    +string actor_agency
    +inet actor_ip
    +string action
    +string entity_type
    +string entity_id
    +jsonb before_data
    +jsonb after_data
    +string reason
    +string trace_id
    +bytea signature
    +timestamp created_at
  }

  AppUser "1" --o "0..1" UserPreferences : has
  AppUser "1" --o "*" CommitmentRecord : creates / co-owns
  AppUser "1" --o "*" DecisionRecord : creates
  AppUser "1" --o "*" CommentRecord : authors
  AppUser "1" --o "*" AuditLog : actor

  SourceRecord "1" --o "*" SourceVersionPolicy : configured
  SourceRecord "1" --o "*" RawSourceSnapshot : sourced
  SourceRecord "1" --o "*" PublishedMetric : sourced
  SourceRecord "1" --o "*" CommitmentRecord : evidence

  SourceVersionPolicy "1" --o "*" RawSourceSnapshot : produces
  SourceVersionPolicy "1" --o "*" PublishedMetric : governs

  IngestRun "1" --o "*" RawSourceSnapshot : contains
  IngestRun "1" --o "*" DataReviewQueue : produces

  RawSourceSnapshot "1" ..> "*" NormalizedObservation : normalized into
  NormalizedObservation "1" ..> "1" DataReviewQueue : evaluated
  DataReviewQueue "1" --o "0..1" PublishedMetric : becomes if approved
  PublishedMetric "1" --o "*" PublishedMetric : history (revisions)

  CommitmentRecord "1" --o "*" CommentRecord : entity_type='commitment'
  DecisionRecord "1" --o "*" CommentRecord : entity_type='decision'
```

## Ключевые инварианты

### `metric_identity` — стабильный ключ

```python
metric_identity = metric_key + "::" + sorted(dimensions)
```

Используется для сравнения versions без зависимости от порядка ключей в JSONB. Является **деривативным** значением — не хранится отдельно, вычисляется по требованию.

### Один `is_current=true` per metric_identity

Constraint:

```sql
create unique index published_metric_current_unique
  on marts.published_metric (metric_key, dimensions)
  where is_current = true;
```

При утверждении новой записи — старая `UPDATE SET is_current = false` в той же транзакции.

### `value` — variant

В Postgres реализуется как 3 nullable колонки + check:

```sql
check (
  (value_num is not null)::integer +
  (value_text is not null)::integer +
  (value_bool is not null)::integer = 1
)
```

В Pydantic — `Union[float, str, bool]`. В TS — discriminated union по `value_kind`.

### WORM на `audit_log`

Триггер `before update / before delete → return null` блокирует мутацию. Вставка только через FastAPI с подписью Ed25519.

### `is_demo` пропагация

Если запись помечена `is_demo: true`:

- В UI отображается с `DemoBadge`
- При `hideDemo=true` — скрывается
- В прод-DWH (`DATA_BACKEND=dwh, target=prod`) — dbt-test блокирует попадание в `marts.published_metric`

## Связанные

- Полное описание data-flow → [[../04-data-flow]]
- Lineage диаграмма → [[data-lineage]]
- Структура таблиц SQL → [database/schema.sql](../../../database/schema.sql)
