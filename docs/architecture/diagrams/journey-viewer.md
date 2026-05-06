---
title: Journey · Viewer
type: diagram
diagram_type: sequence
tags:
  - architecture/sequence
  - journey/viewer
status: draft
version: 1.0
last_updated: 2026-05-06
drawio: journey-viewer.drawio
related:
  - "[[../05-user-journeys]]"
  - "[[auth-sequence]]"
---

# Journey · Viewer

> [!info] Файл
> [`journey-viewer.drawio`](journey-viewer.drawio)

## Сценарий

Сотрудник Аппарата Президента открывает утренний бриф. Цель — увидеть свежие KPI, ближайшие визиты, сигналы рисков.

## Inline mermaid

```mermaid
sequenceDiagram
  autonumber
  actor V as Viewer
  participant Br as Browser
  participant N as Next.js
  participant K as Keycloak
  participant F as FastAPI
  participant R as Redis cache
  participant DB as Postgres

  Note over V,DB: см. полную аутентификацию в [[auth-sequence]]
  V->>Br: открывает /[locale]
  Br->>N: GET /
  N->>N: имеет session, НЕ нужно перелогиниться
  N->>F: GET /api/v1/users/me + /preferences
  F->>DB: SELECT preferences
  F-->>N: theme=light, hide_demo=false

  par 5 параллельных запросов на главной
    N->>F: GET /api/v1/data/dashboard/overview
    F->>R: GET cache:dashboard:overview:user_domains
    alt cache hit
      R-->>F: cached JSON
    else cache miss
      F->>DB: SELECT marts.* (RLS)
      DB-->>F: rows
      F->>R: SET cache TTL 300s
    end
    F-->>N: KPIs, micro-KPIs
  and
    N->>F: GET /api/v1/visits/horizon?days=90
    F-->>N: список визитов
  and
    N->>F: GET /api/v1/risks/aggregated
    F-->>N: signals
  and
    N->>F: GET /api/v1/sectors/grid
    F-->>N: 8 сфер
  and
    N->>F: GET /api/v1/sources/quality
    F-->>N: source quality stats
  end

  N-->>Br: HTML главной (SSR)
  V->>Br: видит KPI, кликает «Trade $300M»
  Br->>N: GET /ru/trade?direction=imports
  N->>F: GET /api/v1/data/trade/history
  F->>DB: SELECT marts.published_metric_history
  F-->>N: timeseries
  N-->>Br: trade страница
  V->>Br: листает, открывает «Export PDF»
  Br->>N: POST /api/v1/exports/pdf<br/>{template: 'trade_brief', filters: {...}}
  N->>F: forward + Bearer
  F->>F: enqueue job в Dramatiq
  F-->>N: 202 + job_id
  N-->>Br: «PDF готовится...»

  Note over F: Background worker
  F->>F: pdf_renderer запускает Playwright
  F->>F: Playwright рендерит /ru/trade?print=1
  F->>F: добавляет watermark + QR-verify
  F->>DB: UPDATE export_job SET status=done
  F-->>N: WebSocket push
  N-->>Br: «Скачать PDF»
  V->>Br: скачивает
  Br->>N: GET /api/v1/exports/pdf/{job_id}/file
  N->>F: forward + Bearer
  F->>DB: validate ownership
  F-->>N: stream from MinIO
  N-->>Br: PDF (binary)
```

## Ключевые особенности

### Параллельная загрузка

Главная страница открывается ~700 ms за счёт **параллельных fetch** в server components: 5 запросов одновременно через `Promise.all`. Backend кеширует ответы в Redis на 5 минут — повторные открытия за 50-200 ms.

### RLS-фильтрация на уровне БД

`viewer.domains` проходит через GUC в Postgres. Если у viewer нет домена `security`, RLS-policy на `marts.published_metric` отфильтрует строки. UI получает уже отфильтрованный набор без лишних проверок.

### Async PDF export

Принципиально не блокируем HTTP-запрос на рендеринг: enqueue → 202 Accepted → background worker → WebSocket / polling.

### Что viewer **не** видит

- Действия approve/reject в UI скрыты
- `/admin/*` — 404 на frontend (не редирект, не 403, чтобы не давать info-leak)
- `/api/v1/admin/*` от backend → 403 если попытается дёрнуть напрямую

## Связанные

- Auth → [[auth-sequence]]
- Полный гид по journeys → [[../05-user-journeys]]
