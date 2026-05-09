---
title: Каталог диаграмм
type: moc
tags:
  - architecture
  - diagrams
  - moc
status: draft
version: 1.0
last_updated: 2026-05-06
related:
  - "[[../README]]"
---

# Каталог диаграмм

> [!info] Формат
> Каждая диаграмма — пара файлов:
> - **`*.drawio`** — XML, открывается в [diagrams.net](https://app.diagrams.net), [Obsidian Diagrams plugin](https://github.com/zapthedingbat/drawio-obsidian), VS Code [Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)
> - **`*.md`** — описание: цель, легенда, как читать, связанные документы, inline-mermaid версия (рендерится в Obsidian без drawio)

---

## Архитектурные (C4-нотация)

| # | Диаграмма | Описание |
|---|---|---|
| 01 | [[c4-context]] | Системный контекст · акторы и внешние системы |
| 02 | [[c4-container]] | Контейнеры платформы · все сервисы и связи |
| 03 | [[c4-component]] | Компоненты внутри FastAPI · модули и зависимости |
| 04 | [[deployment]] | Топология on-prem развёртывания · k3s, data-cluster, DMZ |

## Данные

| # | Диаграмма | Описание |
|---|---|---|
| 05 | [[data-lineage]] | Lineage от источников до UI · raw → staging → marts |
| 13 | [[uml-data-model]] | UML-классы основной модели данных |

## Безопасность

| # | Диаграмма | Описание |
|---|---|---|
| 06 | [[auth-sequence]] | Sequence: OIDC + MFA полный путь логина |
| 07 | [[rbac-matrix]] | Матрица ролей × разрешений × доменов |

## Пути пользователей (sequence)

| # | Диаграмма | Описание |
|---|---|---|
| 08 | [[journey-viewer]] | Sequence: Viewer открывает дашборд |
| 09 | [[journey-admin]] | Sequence: Admin управляет платформой |

## Бизнес-процессы (BPMN)

| # | Диаграмма | Описание |
|---|---|---|
| 10 | [[bpmn-ingestion]] | Получение данных из внешних API |
| 11 | [[bpmn-publication]] | Review-публикация метрик |
| 12 | [[bpmn-commitment]] | Жизненный цикл commitment |

---

## Соглашения

### Цветовая палитра

| Тип элемента | Цвет |
|---|---|
| Внешний актор / система | `#1976d2` (синий) |
| Наш сервис | `#388e3c` (зелёный) |
| База данных / сторадж | `#7b1fa2` (фиолетовый) |
| Безопасность / защита | `#d32f2f` (красный) |
| Внешний API | `#f57c00` (оранжевый) |
| Состояние / событие | `#5d4037` (коричневый) |

### Иконки и стили

- Прямоугольник со скруглёнными углами — сервис
- Цилиндр — БД
- Прямоугольник с фигурой — компонент
- Стрелка с подписью — связь типа «использует»
- Пунктирная стрелка — асинхронная / опциональная
- Двойная линия — сильная связь / синхронный canonical путь

### Версионирование диаграмм

- Изменение в `.drawio` → обновить `last_updated` и `version` в парном `.md`
- Major-релиз — bump `version` (1.0 → 2.0)
- В commit-сообщении упомянуть имя диаграммы

---

## Как редактировать

### Вариант 1 · diagrams.net (web)

1. Откройте https://app.diagrams.net
2. File → Open → выберите `.drawio` файл локально
3. После правок: File → Save As → перезапишите файл

### Вариант 2 · Obsidian + плагин

1. Установите плагин [Diagrams](https://github.com/zapthedingbat/drawio-obsidian) или [Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin) (если переключитесь на Excalidraw)
2. Откройте `.drawio` файл прямо в Obsidian
3. Правки сохраняются автоматически

### Вариант 3 · VS Code

1. Установите [Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)
2. Откройте `.drawio` файл — встроенный редактор

---

## Дальше

- Все архитектурные документы → [[../README]]
- Целевая архитектура → [[../01-target-architecture]]
- Узкие места → [[../07-bottlenecks-and-risks]]
