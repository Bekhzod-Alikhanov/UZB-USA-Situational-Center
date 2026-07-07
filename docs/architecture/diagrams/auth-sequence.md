---
title: Auth Sequence · OIDC + MFA полный путь
type: diagram
diagram_type: sequence
tags:
  - architecture/sequence
  - security/auth
status: draft
version: 1.0
last_updated: 2026-05-06
drawio: auth-sequence.drawio
related:
  - "[[../03-authentication-rbac]]"
  - "[[journey-viewer]]"
  - "[[journey-admin]]"
---

# Auth Sequence · стандартная аутентификация (OIDC + MFA)

> [!info] Файл
> [`auth-sequence.drawio`](auth-sequence.drawio)

## Цель

Показать **полный путь логина** пользователя: от первого запроса до первого защищённого API-вызова. Включает MFA, токены, server-side session, RLS-контекст в БД, audit-запись.

## Inline mermaid версия

```mermaid
sequenceDiagram
  autonumber
  actor U as Пользователь
  participant Br as Browser
  participant TR as Traefik+CSP
  participant N as Next.js
  participant K as Keycloak
  participant LDAP as LDAP/AD<br/>(если federation)
  participant F as FastAPI
  participant DB as Postgres
  participant Aud as Audit Log

  U->>Br: открывает https://uzus.gov.uz
  Br->>TR: GET /
  TR->>N: forward
  N->>N: middleware: проверяет session cookie
  N-->>Br: 302 → /api/auth/signin?cb=/

  Br->>K: GET /realms/uzus/protocol/openid-connect/auth<br/>?client_id=uzus-ui&code_challenge=...&state=xyz&response_type=code
  K-->>Br: HTML login form (i18n)

  U->>Br: вводит email + пароль
  Br->>K: POST /login {credentials}

  alt Federation enabled (LDAP)
    K->>LDAP: ldapsearch + bind
    LDAP-->>K: ok + groups (FK→roles)
  else Local user
    K->>K: bcrypt verify password
  end

  K->>K: brute-force counter check (lockout 30min after 5 fails)

  alt MFA required (editor/admin/executive)
    K-->>Br: page: "Введите 6-значный код TOTP"
    U->>Br: вводит из Authenticator
    Br->>K: POST /authenticate {otp}
    K->>K: verify TOTP (RFC 6238)
  end

  K->>K: создаёт SSO session
  K-->>Br: 302 → /api/auth/callback?code=AUTH_CODE&state=xyz

  Br->>N: GET /api/auth/callback
  N->>N: verify state (CSRF)
  N->>K: POST /token<br/>{code, code_verifier, client_secret}
  K-->>N: {access_token (JWT, 15min), refresh_token (8h, rotating), id_token}
  N->>N: создаёт server-side session<br/>(стораж в Redis или encrypted JWT cookie)
  N->>F: GET /api/v1/users/me<br/>Authorization: Bearer <access_token>

  F->>F: middleware: verify_jwt
  F->>K: (cached) GET /protocol/openid-connect/certs<br/>(JWKS, обновляется раз в час)
  K-->>F: public keys
  F->>F: verify signature, exp, aud, iss
  F->>F: extract claims: sub, email, roles[], domains[], agency

  F->>DB: BEGIN<br/>SET LOCAL app.user_id = '<sub>'<br/>SET LOCAL app.user_role = '<role>'<br/>SET LOCAL app.user_domains = '<domains>'
  F->>DB: SELECT preferences FROM ops.user_preferences WHERE user_id=$1
  DB-->>F: {theme, hide_demo, ai_enabled, ...}
  F->>DB: UPDATE auth.app_user SET last_seen_at = now()
  F->>Aud: INSERT audit_log {action: 'auth:login', actor=user, ip=...}<br/>+ Ed25519 signature
  F->>DB: COMMIT
  F-->>N: 200 OK + user payload

  N->>N: кеширует payload в session
  N->>Br: Set-Cookie: session=...; HttpOnly; Secure; SameSite=Lax<br/>302 → /

  Br->>N: GET / (с session cookie)
  N->>N: load session, check exp
  N->>F: GET /api/v1/data/dashboard/overview<br/>+ Bearer
  F->>DB: SET context + SELECT FROM marts.published_metric<br/>(RLS фильтрует по user_domains)
  DB-->>F: rows
  F-->>N: JSON
  N-->>Br: HTML с данными
```

## Ключевые моменты

### Token storage

> [!warning] Tokens НЕ доступны в browser JavaScript
> Access/refresh tokens хранятся **только server-side** в Next.js session storage (Redis или encrypted JWE-cookie). Browser получает только `session_id` в HttpOnly cookie. Это защищает от XSS-кражи токена.

### Refresh flow

После 15 минут access_token истекает:

```
1. Br → N: запрос с истёкшей сессией
2. N → N: detect expired access_token
3. N → K: POST /token grant_type=refresh_token
4. K → K: rotate refresh, invalidate old
5. K → N: new tokens
6. N → DB через FastAPI с новым токеном
```

После 8 часов refresh_token истекает → форс re-login.

### MFA exemption

| Роль      | MFA                                                  |
| --------- | ---------------------------------------------------- |
| viewer    | опционально (может включить себе)                    |
| analyst   | опционально                                          |
| editor    | **обязательно**                                      |
| executive | **обязательно**                                      |
| admin     | **обязательно** + дополнительно при critical actions |

### RLS GUC variables

В Postgres-подключении устанавливаются session-локальные переменные перед каждым запросом:

```sql
SET LOCAL app.user_id = 'a1b2c3...';
SET LOCAL app.user_role = 'editor';
SET LOCAL app.user_domains = 'trade,assistance';
SET LOCAL app.user_agency = 'МИД';
```

RLS-policies используют `current_setting('app.user_domains')` для фильтрации.

> [!note] Почему `LOCAL` важно
> Без `LOCAL` переменные останутся для следующего использования pgBouncer-pool connection — другой пользователь увидит чужой контекст. Это критическая ошибка в RLS-схеме.

### Audit на login

Каждый login пишет в `ops.audit_log`:

- `action: 'auth:login'` или `'auth:login.failed'`
- IP-адрес из `X-Forwarded-For`
- User-Agent
- MFA used (true/false)
- Federation source (`local` / `ldap` / `oneid`)

Этот лог используется для:

- Detection брутфорса
- Compliance отчётов
- Forensics при инцидентах

### Привязка к сессии

`session_id` в Next.js → ключ в Redis с TTL 8 часов (= refresh_token TTL). При logout — удаляется сразу.

## Failure scenarios

### Неправильный пароль

- Keycloak инкрементирует counter
- После 5 попыток — lockout 30 мин
- CrowdSec на edge видит pattern → может block IP

### MFA-код не подходит

- Toleration window ±1 минута
- 3 попытки → block на 5 минут
- 10 ошибок за 24 часа → user-account suspended → admin notification

### Токен compromised (suspected)

- Admin → `/admin/users/{id}/force-logout`
- → POST в Keycloak `/admin/realms/uzus/users/{id}/logout`
- → invalidate refresh tokens
- → Redis session deleted
- Пользователь получает 401 на следующий API call → re-login

## Связанные документы

- Auth/RBAC модель → [[../03-authentication-rbac]]
- Viewer journey → [[journey-viewer]]
- Admin journey → [[journey-admin]]
