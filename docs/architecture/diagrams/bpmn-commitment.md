---
title: BPMN · Commitment lifecycle
type: diagram
diagram_type: bpmn
tags:
  - architecture/bpmn
  - process/commitment
status: draft
version: 1.0
last_updated: 2026-05-06
drawio: bpmn-commitment.drawio
related:
  - "[[../06-business-processes#3. Commitment lifecycle]]"
---

# BPMN · Commitment lifecycle

> [!info] Файл
> [`bpmn-commitment.drawio`](bpmn-commitment.drawio)

## Цель

Описать **жизненный цикл commitment** — обязательства, договорённости, чек-листа выполнения. От draft до done или cancelled. Используется при разработке UI и при определении SLA по конкретным обязательствам.

## State machine

```mermaid
stateDiagram-v2
  [*] --> draft: Analyst создал
  draft --> agreed: stakeholders одобрили (editor + executive co-sign)
  agreed --> in_progress: запуск работы (owner)
  in_progress --> watch: исполнитель сообщил риск
  watch --> in_progress: риск снят
  watch --> overdue: due_date пройдено
  in_progress --> overdue: due_date пройдено
  in_progress --> done: готово, акт принят (owner + editor co-sign)
  overdue --> done: догнали
  overdue --> cancelled: отменено решением exec
  watch --> cancelled
  done --> [*]
  cancelled --> [*]
```

## Inline mermaid · процесс

```mermaid
flowchart TD
  Start([Analyst создаёт commitment]) --> S1[INSERT ops.commitment_record<br/>status=draft]
  S1 --> N1[Email + Telegram<br/>co-owners]
  N1 --> S2[Editor + Executive review]
  S2 --> G1{Согласованы?}
  G1 -->|no| S3[UPDATE status=cancelled<br/>reason ≥ 50 char]
  S3 --> EndC([End: cancelled])
  G1 -->|yes| S4[UPDATE status=agreed<br/>+ both signatures in audit]
  S4 --> S5[Owner начинает работу<br/>UPDATE status=in_progress]
  S5 --> Loop[Daily nightly job]

  Loop --> G2{due_date<br/>< today?}
  G2 -->|yes, status active| O1[UPDATE status=overdue]
  O1 --> N2[Telegram + email<br/>owner + exec]
  G2 -->|no| G3{owner reported<br/>risk?}
  G3 -->|yes| W1[UPDATE status=watch]
  W1 --> N3[Telegram owner]
  N3 --> Loop
  G3 -->|no| Loop

  S5 --> P1[Owner reports progress<br/>через UI]
  P1 --> G4{progress<br/>= 100%?}
  G4 -->|no| Loop
  G4 -->|yes| S6[Editor co-sign required]
  S6 --> G5{Approved?}
  G5 -->|yes| S7[UPDATE status=done<br/>attach proof file MinIO]
  S7 --> N4[Email все co-owners + exec]
  N4 --> EndD([End: done])
  G5 -->|no| Loop

  O1 --> G6{Catch up?}
  G6 -->|yes, owner cleared| S5
  G6 -->|no, exec кэнсельнул| S3
```

## Особенности

### Co-sign на критические переходы

| Переход | Кто подписывает |
|---|---|
| draft → agreed | editor + executive |
| in_progress → done | owner + editor |
| any → cancelled | executive (только) |

Co-sign реализован как **двух-шаговая процедура**: первый actor отмечает «готов», второй approve в течение 24 часов. После 24 ч — отменяется.

### Автоматический переход в `overdue`

Nightly job (Dagster sensor):
```sql
UPDATE ops.commitment_record
SET status = 'overdue'
WHERE due_date < CURRENT_DATE
  AND status NOT IN ('done', 'cancelled', 'overdue');
```

При переходе → Telegram + email.

### Уведомления

| Событие | Канал | Получатели |
|---|---|---|
| Created | Email + Telegram | All co-owners |
| Status changed | Telegram | Owner |
| 7 дней до overdue | Telegram + email | Owner + co-owners |
| Overdue | Telegram + email | Owner + executive домена |
| Done | Email | All co-owners + executive |
| Cancelled | Email | All co-owners + executive |

### Связи с остальной системой

- `commitment.linked_visit_id` → отслеживание исполнения договорённостей визита
- `commitment.value_musd` + `done` → дополняет агригат на `/agreements`
- При просрочке → запись в `Risk Radar` (overview page)

### PII boundary

> [!warning] Что НЕ хранится в commitment_record
> - Конкретные тексты документов
> - Финансовые подробности (только агрегат `value_musd`)
> - Личные данные исполнителей (только role-slot, не ФИО)
>
> Эти артефакты живут в отдельной операционной системе. См. [[../06-business-processes#5. Visit-prep coordination]].

## Связанные

- Полное описание процесса → [[../06-business-processes#3. Commitment lifecycle]]
- UML данных → [[uml-data-model]]
