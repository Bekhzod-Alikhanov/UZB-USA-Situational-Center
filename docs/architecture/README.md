---
title: Архитектура UZ–US Situational Center · Map of Content
type: moc
tags:
  - architecture
  - moc
  - index
status: draft
version: 1.0
last_updated: 2026-05-06
owners:
  - Центр ситуационного управления Узбекистан–США
related:
  - "[[../../README]]"
  - "[[../../CLAUDE]]"
---

# Архитектура UZ–US Situational Center

> [!info] Назначение vault
> Эта папка — **полная архитектурная документация** целевого состояния платформы. Используется как при принятии решений, так и при техническом онбординге. Открывается в [Obsidian](https://obsidian.md), но читается и в обычном Markdown-просмотрщике GitHub/VS Code.

> [!warning] Статус документа
> Это **целевая** (target) архитектура, согласованная с заказчиком на этапе пресейла enterprise-перехода. Текущий код в репозитории соответствует **исходному** (as-is) состоянию — см. [[00-overview#As-is vs To-be]].

---

## Быстрая навигация

### Ядро архитектуры

- [[00-overview]] — обзор: AS-IS vs TO-BE, ключевые решения, scope
- [[01-target-architecture]] — целевая архитектура, слои, технологии
- [[02-component-catalog]] — каталог компонентов (что, зачем, на чём)
- [[03-authentication-rbac]] — модель аутентификации, ролей и разрешений
- [[04-data-flow]] — потоки данных, governance, lineage
- [[05-user-journeys]] — пути 5 типов пользователей
- [[06-business-processes]] — BPMN бизнес-процессов

### Решения и риски

- [[07-bottlenecks-and-risks]] — узкие места, тупики, риски
- [[08-migration-roadmap]] — план миграции AS-IS → TO-BE
- [[09-glossary]] — глоссарий терминов

### Визуальная часть

- [[diagrams/README|Каталог диаграмм]] — все .drawio с парными md

---

## Карта диаграмм

```
docs/architecture/
├── README.md ← вы здесь
├── 00-overview.md
├── 01-target-architecture.md
├── 02-component-catalog.md
├── 03-authentication-rbac.md
├── 04-data-flow.md
├── 05-user-journeys.md
├── 06-business-processes.md
├── 07-bottlenecks-and-risks.md
├── 08-migration-roadmap.md
├── 09-glossary.md
└── diagrams/
    ├── README.md
    ├── c4-context.{md,drawio}        — C4 уровень 1: системный контекст
    ├── c4-container.{md,drawio}       — C4 уровень 2: контейнеры
    ├── c4-component.{md,drawio}       — C4 уровень 3: компоненты
    ├── deployment.{md,drawio}         — Топология развёртывания (on-prem РУз)
    ├── data-lineage.{md,drawio}       — Lineage от источников до UI
    ├── auth-sequence.{md,drawio}      — Sequence: OIDC SSO + MFA
    ├── rbac-matrix.{md,drawio}        — Матрица ролей × разрешений
    ├── journey-viewer.{md,drawio}     — Sequence: путь Viewer
    ├── journey-admin.{md,drawio}      — Sequence: путь Admin
    ├── bpmn-ingestion.{md,drawio}     — BPMN: ingestion внешних источников
    ├── bpmn-publication.{md,drawio}   — BPMN: review-публикация метрик
    ├── bpmn-commitment.{md,drawio}    — BPMN: жизненный цикл commitment
    └── uml-data-model.{md,drawio}     — UML: модель данных (классы)
```

---

## Как читать эту документацию

| Если вы…                       | Начните с…                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Заказчик / руководитель Центра | [[00-overview]] → [[07-bottlenecks-and-risks]] → [[08-migration-roadmap]]          |
| Архитектор                     | [[01-target-architecture]] → [[diagrams/c4-container]] → [[02-component-catalog]]  |
| DevOps / SRE                   | [[diagrams/deployment]] → [[01-target-architecture#Развёртывание]]                 |
| Безопасник                     | [[03-authentication-rbac]] → [[diagrams/auth-sequence]] → [[diagrams/rbac-matrix]] |
| Backend-разработчик            | [[02-component-catalog]] → [[04-data-flow]] → [[diagrams/uml-data-model]]          |
| Frontend-разработчик           | [[05-user-journeys]] → [[diagrams/journey-viewer]]                                 |
| Data-инженер                   | [[04-data-flow]] → [[diagrams/bpmn-ingestion]] → [[diagrams/data-lineage]]         |
| Аналитик                       | [[05-user-journeys#Аналитик (analyst)]] → [[06-business-processes]]                |
| Product-менеджер               | [[06-business-processes]] → [[05-user-journeys]]                                   |

---

## Conventions

### Obsidian

- **Wiki-links** `[[...]]` для внутренней навигации
- **Frontmatter** YAML с `tags`, `type`, `status`, `related`
- **Callouts** для разметки рисков (`> [!warning]`), решений (`> [!note]`), tips (`> [!tip]`)
- **Mermaid** блоки внутри MD для inline-схем (рендерятся в Obsidian)
- Парные **`.drawio` + `.md`** файлы в `diagrams/` — XML открывается в [diagrams.net](https://app.diagrams.net) или плагином [Diagrams](https://github.com/zapthedingbat/drawio-obsidian)

### Имена и теги

- Теги: `#architecture/c4`, `#architecture/bpmn`, `#architecture/uml`, `#security/auth`, `#data/governance`, `#process/...`
- Идентификаторы ролей: `viewer`, `analyst`, `editor`, `executive`, `admin`
- Идентификаторы доменов данных: `trade`, `macro`, `assistance`, `finance`, `mobility`, `education`, `security`, `operations`

### Версионирование

- Каждый md файл имеет `version` в frontmatter
- Изменения архитектуры → bump major (1.0 → 2.0)
- Уточнения / опечатки → bump patch (1.0 → 1.0.1)

---

## Принцип «единого источника истины»

| Артефакт            | Источник правды                           |
| ------------------- | ----------------------------------------- |
| Целевая архитектура | этот vault                                |
| Текущий код         | репозиторий (`/app`, `/lib`, `/data`)     |
| Данные операционные | DWH (`marts.*`, `ops.*`)                  |
| Пользователи и роли | Keycloak (IdP)                            |
| Бизнес-процессы     | BPMN-диаграммы в `diagrams/bpmn-*.drawio` |
| Контракт API        | OpenAPI 3.1 (генерируется FastAPI)        |
| Контракт данных     | dbt + Pydantic schema                     |

Если документация и код расходятся — **код первичен** для текущего состояния, **документация первична** для целевого. Расхождение фиксируется в [[07-bottlenecks-and-risks]] до устранения.

---

## Связанные документы из репозитория

- [[../../CLAUDE]] — инструкции для агента (включая жёсткие правила: no PII в visit-prep, no-downgrade)
- [[../../README]] — публичный README с описанием стека
- [[../../DEMO_DATA_REGISTRY]] — реестр демо-данных
- [[../../SOURCE_REGISTRY]] — реестр источников
- [[../../DATA_INVENTORY]] — инвентарь данных
- [[../PROFILE_README]] — профиль для GitHub
