---
title: Бизнес-процессы (BPMN)
type: process
tags:
  - architecture
  - bpmn
  - process
status: draft
version: 1.0
last_updated: 2026-05-06
related:
  - "[[04-data-flow]]"
  - "[[05-user-journeys]]"
  - "[[diagrams/bpmn-ingestion]]"
  - "[[diagrams/bpmn-publication]]"
  - "[[diagrams/bpmn-commitment]]"
---

# Бизнес-процессы

> [!info] Что здесь
> Каждый ключевой кросс-функциональный процесс описан как BPMN: участники, события, шаги, шлюзы, исключения. Визуальная BPMN-нотация — в `.drawio` файлах.

---

## 1. Ingestion внешних источников

> [!info] Диаграмма
> [[diagrams/bpmn-ingestion]]

### Действующие лица (lanes)

| Lane | Роль |
|---|---|
| Dagster Scheduler | автомат |
| Connector | автомат (Python) |
| MinIO | хранилище |
| Postgres `raw.*` | БД |
| dbt | автомат |
| Editor | человек |
| Notification (Telegram) | автомат |

### Поток

```mermaid
flowchart LR
  Start([07:00 UTC<br/>Schedule fires]) --> A1[Dagster<br/>materializes asset]
  A1 --> A2{HTTPS GET<br/>API}
  A2 -->|200 OK| A3[Save snapshot<br/>to MinIO]
  A2 -->|429/503| A2R[Retry x3<br/>exp backoff]
  A2 -->|after 3 fails| A2F[Alert Grafana<br/>→ Telegram]
  A2R --> A2
  A2F --> End1([End: failure])
  A3 --> A4[INSERT INTO raw.*<br/>UNIQUE on content_hash]
  A4 --> A5{Dup?}
  A5 -->|yes| End2([End: dedup])
  A5 -->|no| A6[Trigger dbt<br/>downstream]
  A6 --> B1[stg_<connector><br/>типизация]
  B1 --> B2[int_normalized_observations]
  B2 --> B3[int_evaluated_review<br/>применяет policy]
  B3 --> B4{Action?}
  B4 -->|publish-candidate<br/>auto_publish=true| C1[INSERT marts.published_metric<br/>+ history]
  B4 -->|publish-candidate<br/>auto_publish=false| Q1[INSERT data_review_queue<br/>severity=watch]
  B4 -->|manual-review| Q1
  B4 -->|reject-older| Q2[INSERT data_review_queue<br/>status=closed<br/>severity=block]
  B4 -->|ignore-irrelevant| End3([End: noop])
  Q1 --> N1[Telegram уведомление<br/>editors]
  Q2 --> N2[Telegram уведомление<br/>admin]
  C1 --> N3[Trigger Redis<br/>cache invalidation]
  N3 --> End4([End: published])
  N1 --> End5([End: queued])
  N2 --> End6([End: rejected])
```

### Гарантии

- **At-least-once**: при сбое Dagster повторит. Дедупликация по `content_hash` в БД.
- **Идемпотентность**: повторный run с тем же snapshot → no-op.
- **Транзакционность**: snapshot + INSERT в одной транзакции; либо весь run прошёл, либо ничего.
- **Атомарность смены `is_current`**: переключение текущей метрики в одной транзакции (старая → false, новая вставляется).

### Исключения

| Сценарий | Реакция |
|---|---|
| API недоступен 5 минут | Retry x3 → alert; следующий run по расписанию |
| API key истёк | Alert «secret rotation needed» → admin в [[05-user-journeys#5. Admin]] |
| Источник вернул мусор (parsing error) | Snapshot всё равно сохраняется; в `staging` не доедет; `quality_flags=['parse-error']` |
| Постгрес лежит | Dagster ставит run в `failed`, retry через 10 мин; данные в MinIO живы → можно реплейнуть |
| dbt тест упал | run помечен failed; никаких записей в `marts.*` не появляется до фикса |

---

## 2. Publication review (утверждение метрик)

> [!info] Диаграмма
> [[diagrams/bpmn-publication]]

### Действующие лица

| Lane | Роль |
|---|---|
| Editor | человек |
| Admin (escalation) | человек |
| FastAPI | автомат |
| Postgres | БД |
| Audit log | автомат |
| Telegram | автомат |

### Поток

```mermaid
flowchart TD
  Start([Item появился<br/>в data_review_queue]) --> N1[Telegram<br/>«15 новых items»]
  N1 --> E1[Editor открывает<br/>review-queue]
  E1 --> E2[Сортирует по severity:<br/>block → watch → info]
  E2 --> E3[Open item details]
  E3 --> E4[Видит: дельта,<br/>история, source URL]
  E4 --> E5{Решение}

  E5 -->|Approve| MFA1[MFA challenge]
  MFA1 -->|ok| TX1[BEGIN TX]
  TX1 --> P1[UPDATE existing<br/>SET is_current=false]
  P1 --> P2[INSERT new<br/>SET is_current=true]
  P2 --> P3[UPDATE queue<br/>SET status=approved]
  P3 --> P4[INSERT audit_log<br/>action=metric:publish]
  P4 --> TX2[COMMIT]
  TX2 --> R1[Redis cache<br/>invalidate]
  R1 --> U1[5 min undo<br/>window starts]
  U1 -->|undo clicked| TXU[Reverse TX]
  U1 -->|5 min passed| EndP([End: published])
  TXU --> EndU([End: undone])

  E5 -->|Reject| RJ1{Severity = block?}
  RJ1 -->|yes| RJ2[Approve disabled<br/>at UI level]
  RJ1 -->|no| RJ3[Require<br/>reason ≥ 30 char]
  RJ3 --> RJ4[UPDATE queue<br/>SET status=rejected]
  RJ4 --> RJ5[INSERT audit_log]
  RJ5 --> RJ6[Telegram<br/>data team]
  RJ6 --> EndR([End: rejected])

  E5 -->|Escalate| ESC1[UPDATE queue<br/>SET status=escalated]
  ESC1 --> ESC2[Telegram<br/>admins]
  ESC2 --> A1[Admin opens]
  A1 --> A2{Decision}
  A2 -->|approve| MFA1
  A2 -->|reject| RJ3
  A2 -->|defer| DF1[UPDATE queue<br/>defer_until=tomorrow]
  DF1 --> EndD([End: deferred])
```

### Защитные механизмы

- **Two-eye rule** для high-impact: если изменение KPI > 50% или влияет на главную страницу → нужен **второй editor** для co-sign.
- **Cooldown**: повторное approve того же `metric_identity` блокируется на 1 минуту (защита от двойного клика).
- **Audit trail**: каждый approve/reject/escalate пишется в WORM-лог, подписывается.

---

## 3. Commitment lifecycle

> [!info] Диаграмма
> [[diagrams/bpmn-commitment]]

### Состояния

```mermaid
stateDiagram-v2
  [*] --> draft: Analyst создал
  draft --> agreed: stakeholders одобрили
  agreed --> in_progress: запуск работы
  in_progress --> watch: исполнитель сообщил риск
  watch --> in_progress: риск снят
  watch --> overdue: due_date пройдено
  in_progress --> overdue: due_date пройдено
  in_progress --> done: готово, акт принят
  overdue --> done: догнали
  overdue --> cancelled: отменено решением exec
  watch --> cancelled
  done --> [*]
  cancelled --> [*]
```

### Жизненный цикл

| Событие | Кто инициирует | Что происходит |
|---|---|---|
| Создание (`draft`) | analyst, editor | INSERT `commitment_record`, audit |
| Согласование (`agreed`) | editor + executive co-sign | UPDATE status, audit |
| В работе (`in_progress`) | owner | UPDATE status, due_date обязательно |
| Сигнал риска (`watch`) | owner или система (за 7 дней до overdue) | UPDATE status, Telegram |
| Просрочено (`overdue`) | автомат | nightly job: WHERE due_date < today AND status NOT IN done/cancelled |
| Завершено (`done`) | owner + editor co-sign | UPDATE, audit, attach proof file (MinIO) |
| Отменено (`cancelled`) | executive | UPDATE + reason ≥ 50 char |

### Связи с остальной системой

- Каждый `commitment` может быть привязан к `visit_id` → отслеживание исполнения договорённостей визита.
- При просрочке → запись в `overview/Risk Radar` сигнал.
- При завершении со ссылкой на `agreement_id` → дополняет агригат на странице `/agreements`.

### Уведомления

| Событие | Канал | Получатели |
|---|---|---|
| Created | Email + Telegram | Все co-owners |
| Status changed | Telegram | Owner |
| 7 дней до overdue | Telegram + Email | Owner + co-owners |
| Overdue | Telegram + Email | Owner + executive домена |
| Done | Email | Все co-owners + executive |

---

## 4. Decision workflow

### Состояния

```mermaid
stateDiagram-v2
  [*] --> draft: Analyst создал
  draft --> ready: автор отправил на рассмотрение
  ready --> approved: executive подписал (E-IMZO)
  ready --> rejected: executive отклонил
  ready --> deferred: executive отложил с заметкой
  deferred --> ready: триггер - дата вернулась
  approved --> [*]: PDF архивируется в MinIO с подписью
  rejected --> [*]
```

### Особенности

- В состоянии `ready` decision виден всем executives с правом по этому домену.
- Подпись в `approved` → **обязательно E-IMZO** (физический сертификат).
- После approval — мутирующие операции запрещены (immutable).
- Связь со списком `commitments` — decision может породить N commitments автоматически (если так настроен шаблон).

---

## 5. Visit-prep coordination

> [!warning] PII boundary
> См. жёсткое правило в [[../../CLAUDE]] и [[00-overview#Связанные сущности из CLAUDE.md]]. Этот процесс трекает **только статус**, не содержимое.

### Поток подготовки визита

```mermaid
flowchart LR
  A1([Анонс визита<br/>в системе]) --> A2[Создание<br/>visit_prep_kit]
  A2 --> A3[Назначение role-slots:<br/>protocol-lead, content-lead,<br/>logistics-lead, comms-lead]
  A3 --> B1[Чек-листы по lanes:<br/>Protocol · Content · Logistics · Comms]
  B1 --> B2[Каждый lane: статус %<br/>+ список doc-titles]
  B2 --> C1[Daily standup<br/>через UI Kanban]
  C1 --> D1{Все lanes 100%?}
  D1 -->|no| C1
  D1 -->|yes| D2[Финальный sign-off<br/>от protocol-lead]
  D2 --> End([Визит проведён])
  End --> P1[Post-visit:<br/>plan vs actual outcomes]
  P1 --> P2[Связь с commitments<br/>и agreements]
```

### Что НЕ хранится (по жёсткому правилу)

- Номера паспортов, виз
- PNR, гостиничные брони
- Тексты talking points
- Тела MoU
- ФИО делегатов
- Личные контакты

Эти артефакты живут в **отдельной операционной системе** с полноценным authn/authz/document-storage и audit. Платформа знает только:
- статус % lane (по чеклисту)
- название документа (но не его текст)
- факт «бронирование сделано» (но не код)

---

## 6. AI assistant использование (с квотами)

```mermaid
sequenceDiagram
  actor U as User
  participant N as Next.js
  participant F as FastAPI
  participant R as Redis
  participant A as Anthropic API
  participant DB as Postgres

  U->>N: вводит вопрос в /assistant
  N->>F: POST /api/v1/ai/chat<br/>Authorization: Bearer ...
  F->>R: INCR ai_quota:user:{id}:{hour}
  R-->>F: count
  alt quota exceeded
    F-->>N: 429 + reset_at
    N-->>U: «Лимит 20 запросов/час исчерпан, до 14:00»
  else quota ok
    F->>F: PromptInjectionFilter:<br/>проверить prompt на запрещённые паттерны
    F->>F: DomainAccessFilter:<br/>проверить, что user имеет доступ ко всем упомянутым доменам
    F->>F: build system prompt с контекстом из marts.*
    F->>A: POST /v1/messages (stream)
    A-->>F: SSE chunks
    F->>F: redact PII в output (по regex)
    F->>F: validate URLs в output (только allowlist)
    F-->>N: stream
    N-->>U: текст по словам
    F->>DB: INSERT ai_audit (user, prompt_hash, tokens, cost)
  end
```

---

## 7. Backup и восстановление

### Backup (автомат, ежедневно)

```mermaid
flowchart LR
  Cron([02:00 UTC<br/>Cron]) --> P1[pgBackRest<br/>full backup]
  P1 --> M1[Encrypt + upload<br/>to MinIO bucket-1]
  M1 --> M2[Replicate<br/>to MinIO DR-site]
  M2 --> M3[Once a week:<br/>copy to tape archive]
  M3 --> V1[Verify checksum<br/>on each replica]
  V1 -->|ok| End([End])
  V1 -->|fail| Alert[Alert ИБ + DBA]
```

### Restore drill (квартально)

1. Admin триггерит restore-drill workflow.
2. Восстановление в staging-кластер из последнего бэкапа.
3. Сверка `marts.published_metric` count vs prod.
4. dbt-test полный прогон.
5. Документирование RTO/RPO в `docs/runbooks/restore-drill-{quarter}.md`.

---

## 8. Incident response

```mermaid
flowchart TD
  D([Detection:<br/>Grafana alert / user report]) --> T1[Triage<br/>severity 1-4]
  T1 --> Sev1{Severity?}
  Sev1 -->|S1: data-leak| IR1[ИБ + DBA + Admin<br/>немедленно]
  Sev1 -->|S2: outage| IR2[Admin + DevOps<br/>≤ 15 min]
  Sev1 -->|S3: degradation| IR3[On-call<br/>≤ 1 час]
  Sev1 -->|S4: minor| IR4[Backlog]

  IR1 --> C1[Containment:<br/>отключение сервиса,<br/>blocking IPs]
  IR2 --> C2[Failover<br/>или scale-up]
  IR3 --> C3[Mitigation]

  C1 --> R1[Recovery + RCA]
  C2 --> R1
  C3 --> R1
  R1 --> P1[Postmortem doc<br/>в Obsidian docs/incidents/]
  P1 --> P2[Action items в backlog]
  P2 --> End([End])
```

---

## Сводная карта процессов

| Процесс | Trigger | Длительность | Owner |
|---|---|---|---|
| Ingestion | Schedule (07:00 UTC) | < 10 мин | Data team |
| Publication review | Появление item в queue | < 4 ч SLA | Editor |
| Commitment lifecycle | Создание/событие | дни-месяцы | Owner + editor |
| Decision workflow | Готов к рассмотрению | < 24 ч SLA | Executive |
| Visit-prep | За N дней до визита | дни-недели | Protocol-lead |
| AI assistance | Per request | < 30 сек | n/a (per-user) |
| Backup | 02:00 UTC daily | < 30 мин | DevOps |
| Restore drill | Quarterly | 4 ч | DBA + DevOps |
| Incident response | Detection | по severity | On-call rotation |

---

## Дальше

- Узкие места и тупики в этих процессах → [[07-bottlenecks-and-risks]]
- Визуальные BPMN → [[diagrams/bpmn-ingestion]], [[diagrams/bpmn-publication]], [[diagrams/bpmn-commitment]]
