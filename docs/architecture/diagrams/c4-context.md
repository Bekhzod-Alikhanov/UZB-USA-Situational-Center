---
title: C4 Context · Системный контекст
type: diagram
diagram_type: c4
diagram_level: 1
tags:
  - architecture/c4
  - architecture/context
status: draft
version: 1.0
last_updated: 2026-05-06
drawio: c4-context.drawio
related:
  - "[[../01-target-architecture]]"
  - "[[c4-container]]"
---

# C4 Context · Системный контекст

> [!info] Файл
> [`c4-context.drawio`](c4-context.drawio)

## Цель диаграммы

Показать **границы системы** UZ–US Situational Center: какие категории пользователей с ней работают, к каким внешним системам она обращается. Это самый высокий уровень — без деталей внутреннего устройства.

## Как читать

1. **Центральный прямоугольник** — наша платформа. Без внутренней структуры — это «чёрный ящик».
2. **Слева** — категории пользователей (акторы).
3. **Справа** — внешние системы и API.
4. **Стрелки** — направление потока (кто кого вызывает).
5. **Подписи на стрелках** — суть взаимодействия.

## Inline mermaid версия

```mermaid
C4Context
  title Системный контекст · UZ-US Situational Center

  Person(advisor, "Советник Президента", "Просмотр KPI и брифов")
  Person(minister, "Министр / гос. служащий")
  Person(analyst, "Аналитик Центра")
  Person(editor, "Редактор данных")
  Person(admin, "Сис. администратор")
  Person_Ext(business, "Бизнес-пользователь", "AUCC, представители")

  System(platform, "UZ-US Situational Platform", "Аналитический портал, governance,<br/>ingestion, AI-помощник, документооборот")

  System_Ext(census, "US Census Bureau API", "Goods trade")
  System_Ext(bea, "BEA API", "Macro / services")
  System_Ext(exim, "EXIM API", "Export finance")
  System_Ext(wb, "World Bank WDI", "Macro indicators")
  System_Ext(fa, "ForeignAssistance.gov", "USAID obligations")
  System_Ext(oneid, "OneID РУз", "SSO граждан")
  System_Ext(eimzo, "E-IMZO", "Цифровая подпись")
  System_Ext(mfa, "MFA Provider", "Telegram/SMS")
  System_Ext(smtp, "SMTP relay", "Email уведомления")
  System_Ext(anth, "Anthropic API", "Claude AI")

  Rel(advisor, platform, "HTTPS · браузер")
  Rel(minister, platform, "HTTPS")
  Rel(analyst, platform, "HTTPS + Superset")
  Rel(editor, platform, "HTTPS + MFA")
  Rel(admin, platform, "HTTPS + bastion + MFA")
  Rel(business, platform, "HTTPS · публичные KPI")

  Rel(platform, census, "Pull / daily")
  Rel(platform, bea, "Pull / weekly")
  Rel(platform, exim, "Pull / weekly")
  Rel(platform, wb, "Pull / daily")
  Rel(platform, fa, "Pull / daily")
  Rel(platform, oneid, "OIDC federation")
  Rel(platform, eimzo, "PKCS#7 verify")
  Rel(platform, mfa, "TOTP / push")
  Rel(platform, smtp, "Send mail")
  Rel(platform, anth, "AI streaming")
```

## Легенда

| Элемент | Что значит |
|---|---|
| 👤 Person (синий) | Внутренний пользователь Центра / правительства |
| 👤 Person Ext (серый) | Внешний пользователь (бизнес) |
| 📦 System (зелёный) | Наша система |
| 📦 System Ext (синий) | Внешняя система / API |
| → Стрелка | Направление вызова / запроса |

## Принципиальные узлы

### Платформа = чёрный ящик

На этом уровне неважно, из чего состоит платформа. Важно зафиксировать:
- Кто с ней общается
- К чему она обращается
- Какие границы

### Все внешние API — в США

Это создаёт необходимость **outbound egress proxy** (squid) в нашей сети с allowlist FQDN. Подробнее → [[../01-target-architecture#Развёртывание]].

### OneID — единственный канал внешней идентификации

Бизнес-пользователи (AUCC) логинятся не через локальные учётки, а через OneID РУз. Это снимает с нас ответственность за authentication внешних людей.

### E-IMZO — обязательно для подписи

Без E-IMZO нет легитимных подписанных решений → нет workflow для executive. См. [[../05-user-journeys#4. Executive]].

## Что выясняется из диаграммы

> [!warning] Outbound dependency на US-инфраструктуре
> 5 источников + Anthropic — все в США. При гео-блокировке (на стороне US gov или прокси-провайдера РУз) — degradation. Mitigation: cache в `raw.*`, static fallback.

> [!note] OneID не критичен для core функций
> Внутренние пользователи логинятся через AD federation (LDAP) → если OneID лежит, бизнес-канал отключается, но Центр продолжает работу.

## Связанные документы

- Целевая архитектура → [[../01-target-architecture]]
- Уровень контейнеров → [[c4-container]]
- Развёртывание → [[deployment]]
- Bottlenecks по outbound API → [[../07-bottlenecks-and-risks#1.3]]
