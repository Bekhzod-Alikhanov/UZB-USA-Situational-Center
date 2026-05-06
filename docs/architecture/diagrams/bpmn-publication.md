---
title: BPMN · Publication review
type: diagram
diagram_type: bpmn
tags:
  - architecture/bpmn
  - process/publication
status: draft
version: 1.0
last_updated: 2026-05-06
drawio: bpmn-publication.drawio
related:
  - "[[../06-business-processes#2. Publication review]]"
  - "[[../05-user-journeys#3. Editor]]"
---

# BPMN · Publication review

> [!info] Файл
> [`bpmn-publication.drawio`](bpmn-publication.drawio)

## Цель

Описать **человеческий процесс утверждения метрик** после автоматической ingestion. Показывает: что делает editor, какие шаги защищены MFA, как работают undo/escalation.

## Lanes

| Lane | Роль |
|---|---|
| **Telegram bot** | автомат, нотификации |
| **Editor** | человек |
| **Admin** (escalation) | человек |
| **FastAPI** | автомат, валидация + транзакции |
| **Postgres** | БД |
| **Audit log** | автомат |

## Inline mermaid

```mermaid
flowchart TD
  Start([Item появился<br/>в data_review_queue]) --> N1[Telegram<br/>«15 новых items»]
  N1 --> E1[Editor открывает<br/>review-queue]
  E1 --> E2[Сортирует по severity:<br/>block → watch → info]
  E2 --> E3[Open item details]
  E3 --> E4[Видит: дельта,<br/>история, source URL]
  E4 --> G1{Решение<br/>editor'а?}

  G1 -->|Approve| G2{severity<br/>= block?}
  G2 -->|yes| Disabled[UI кнопка disabled<br/>нельзя обойти policy]
  G2 -->|no| MFA1[MFA challenge]
  MFA1 --> G3{Дельта<br/>> 50%?}
  G3 -->|yes| Reason[Reviewer note<br/>≥ 30 char обязателен]
  G3 -->|no| TX1
  Reason --> TX1[BEGIN TX]
  TX1 --> P1[UPDATE existing<br/>SET is_current=false]
  P1 --> P2[INSERT new<br/>SET is_current=true]
  P2 --> P3[UPDATE queue<br/>SET status=approved]
  P3 --> P4[INSERT audit_log<br/>+ Ed25519]
  P4 --> TX2[COMMIT]
  TX2 --> R1[Redis cache<br/>invalidate trade.*]
  R1 --> U1[5-min undo<br/>window starts]
  U1 -->|undo clicked| TXU[Reverse TX]
  TXU --> EndU([End: undone])
  U1 -->|5 min passed| EndP([End: published])

  G1 -->|Reject| RJ1[Require<br/>reason ≥ 30 char]
  RJ1 --> RJ2[UPDATE queue<br/>SET status=rejected]
  RJ2 --> RJ3[INSERT audit_log]
  RJ3 --> RJ4[Telegram<br/>data team]
  RJ4 --> EndR([End: rejected])

  G1 -->|Escalate| ESC1[UPDATE queue<br/>SET status=escalated]
  ESC1 --> ESC2[Telegram<br/>admins]
  ESC2 --> A1[Admin opens]
  A1 --> A2{Decision}
  A2 -->|approve| MFA1
  A2 -->|reject| RJ1
  A2 -->|defer| DF1[UPDATE queue<br/>defer_until=tomorrow]
  DF1 --> EndD([End: deferred])
```

## Ключевые защиты

### 1. block-severity — кнопка Approve физически отсутствует
Когда policy эмитит `reject-older-period` со `severity=block`, UI **не показывает Approve**. Это защита от случайного bypass через UI.

### 2. MFA challenge при approve
Каждое approve требует свежего TOTP. Защита от stolen session.

### 3. Reason ≥ 30 char при большой дельте
Если `|new - old| / old > 0.5` — обязательное поле reviewer_note ≥ 30 символов. Защита от ошибок «accidental approve».

### 4. 5-минутное окно undo
После approve включается таймер. Откатить публикацию можно одним кликом из audit-страницы. После 5 минут — формальная процедура «отзыв публикации».

### 5. Cooldown 1 минута на тот же `metric_identity`
Повторный approve того же metric_identity блокируется на 60 секунд. Защита от двойного клика / race condition.

### 6. Escalation
Если editor не уверен → escalate. admin получает Telegram, видит у себя в queue, может approve/reject/defer.

## SLA

| Метрика | Цель |
|---|---|
| Items в queue → approve/reject | < 4 ч |
| Items с severity=block | review в течение 24 ч |
| Escalated items | < 8 ч |

## Связанные

- Полное описание процесса → [[../06-business-processes#2. Publication review]]
- Editor journey → [[../05-user-journeys#3. Editor]]
- BPMN ingestion → [[bpmn-ingestion]]
