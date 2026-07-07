---
title: BPMN · Ingestion
type: diagram
diagram_type: bpmn
tags:
  - architecture/bpmn
  - process/ingestion
status: draft
version: 1.0
last_updated: 2026-05-06
drawio: bpmn-ingestion.drawio
related:
  - "[[../06-business-processes#1. Ingestion внешних источников]]"
  - "[[../04-data-flow]]"
  - "[[data-lineage]]"
---

# BPMN · Ingestion внешних источников

> [!info] Файл
> [`bpmn-ingestion.drawio`](bpmn-ingestion.drawio)

## Цель

Описать процесс **получения данных из внешних API** и складирования в DWH с применением no-downgrade политики. BPMN показывает участников (lanes), события, шлюзы, исключения.

## Lanes

| Lane                   | Роль                              |
| ---------------------- | --------------------------------- |
| **Dagster scheduler**  | автомат, запускает по cron        |
| **Connector (Python)** | автомат, asset-материализация     |
| **External API**       | внешний сервис                    |
| **MinIO**              | хранилище                         |
| **Postgres raw.***     | БД                                |
| **dbt**                | автомат, трансформации            |
| **Editor**             | человек, при необходимости review |
| **Notification**       | автомат, Telegram + email         |

## Inline mermaid

```mermaid
flowchart LR
  Start([07:00 UTC<br/>schedule fires]) --> A1[Dagster<br/>materializes asset]
  A1 --> A2[Connector calls<br/>External API]
  A2 --> G1{HTTP?}
  G1 -->|200 OK| A3[Save snapshot<br/>to MinIO]
  G1 -->|429/503| R1[Wait + retry]
  R1 --> G2{Retries<br/>< 3?}
  G2 -->|yes| A2
  G2 -->|no| F1[Alert Grafana<br/>+ Telegram]
  F1 --> EndF([End: failure])
  G1 -->|400/401/403| F2[Schema/auth error<br/>→ alert]
  F2 --> EndF
  A3 --> A4[INSERT INTO raw.*<br/>UNIQUE on content_hash]
  A4 --> G3{Duplicate?}
  G3 -->|yes| EndD([End: dedup noop])
  G3 -->|no| A5[Trigger dbt<br/>downstream models]
  A5 --> B1[stg_<connector><br/>typed columns]
  B1 --> B2[int_normalized_observations]
  B2 --> B3[int_evaluated_review<br/>policy check]
  B3 --> G4{Action?}
  G4 -->|publish-candidate<br/>auto_publish=true| C1[INSERT marts.published_metric<br/>+ history]
  G4 -->|publish-candidate<br/>auto_publish=false| Q1[INSERT data_review_queue<br/>severity=watch]
  G4 -->|manual-review| Q1
  G4 -->|reject-older-period| Q2[INSERT data_review_queue<br/>status=closed<br/>severity=block]
  G4 -->|ignore-irrelevant| EndN([End: noop])
  Q1 --> N1[Telegram уведомление<br/>editors]
  Q2 --> N2[Telegram уведомление<br/>admin]
  C1 --> N3[Trigger Redis<br/>cache invalidation]
  N3 --> EndOk([End: published])
  N1 --> EndQ([End: queued])
  N2 --> EndR([End: rejected])
```

## Правила и инварианты

### Идемпотентность

- Каждый `(connector_id, content_hash)` уникален → повторная загрузка одного снимка пропускается на уровне БД (`UNIQUE constraint`).
- Dagster retries не создают дубликатов.

### Атомарность

- `BEGIN TX → INSERT raw + INSERT staging via dbt → COMMIT`
- Если dbt падает после INSERT raw — следующий run перевычислит staging.

### Ограничения

| Параметр            | Значение                             |
| ------------------- | ------------------------------------ |
| Connector timeout   | 8 секунд                             |
| Retry count         | 3 (exponential backoff: 1s, 5s, 25s) |
| Dagster run timeout | 5 минут                              |
| Snapshot size limit | 10 MB (защита от runaway pull)       |

## Что происходит при ошибках

| Ошибка                        | Реакция                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| HTTP 429 (rate limit)         | Wait + retry (max 3)                                                |
| HTTP 503 (server unavailable) | Wait + retry                                                        |
| HTTP 401/403                  | Без retry, alert «secret rotation needed»                           |
| HTTP 400                      | Schema mismatch → Pydantic validation error → alert + manual review |
| Timeout                       | Считается как 503, retry                                            |
| Empty response                | quality_flag=`empty-response`, переходит в queue                    |
| Postgres connection refused   | Dagster retries; данные в MinIO живы                                |
| dbt test failure              | run fail; ничего в `marts.*` не появляется                          |

## Связанные

- Полное описание процесса → [[../06-business-processes#1. Ingestion внешних источников]]
- Data lineage → [[data-lineage]]
- BPMN publication → [[bpmn-publication]]
