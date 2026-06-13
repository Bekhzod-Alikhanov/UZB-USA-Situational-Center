export type UserRole = "viewer" | "analyst" | "editor" | "admin" | "executive";

/**
 * Permission taxonomy. Aligned with docs/architecture/03-authentication-rbac.md
 * §"Авторизация · RBAC + ABAC" (lines 156-204). The TO-BE FastAPI gateway uses
 * the same string keys via Pydantic enforcement. Additions to this union should
 * land in both places.
 *
 * Convention: `entity:verb`. `:view` and `:read` are aliases (view = UI surface,
 * read = data access — kept distinct so doc-listed `export:read` survives).
 */
export type Permission =
  // baseline read
  | "dashboard:view"
  | "source:view"
  | "export:read"
  // analyst tier
  | "commitment:edit"
  | "decision:draft"
  | "superset:access"
  | "export:create"
  // editor tier
  | "source:approve"
  | "metric:publish"
  | "review-queue:approve"
  | "review-queue:reject"
  // executive tier
  | "decision:approve"
  | "decision:reject"
  | "comment:create"
  | "notification:configure"
  // admin tier
  | "user:manage"
  | "role:assign"
  | "policy:edit"
  | "audit:export"
  | "admin:view"
  | "ingestion:trigger";

const VIEWER_PERMS: Permission[] = ["dashboard:view", "source:view", "export:read"];

const ANALYST_PERMS: Permission[] = [
  ...VIEWER_PERMS,
  "commitment:edit",
  "decision:draft",
  "superset:access",
  "export:create",
];

const EDITOR_PERMS: Permission[] = [
  ...ANALYST_PERMS,
  "source:approve",
  "metric:publish",
  "review-queue:approve",
  "review-queue:reject",
];

const EXECUTIVE_PERMS: Permission[] = [
  ...VIEWER_PERMS,
  "decision:approve",
  "decision:reject",
  "comment:create",
  "notification:configure",
];

const ADMIN_PERMS: Permission[] = Array.from(
  new Set<Permission>([
    ...EDITOR_PERMS,
    ...EXECUTIVE_PERMS,
    "user:manage",
    "role:assign",
    "policy:edit",
    "audit:export",
    "admin:view",
    "ingestion:trigger",
  ]),
);

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  viewer: VIEWER_PERMS,
  analyst: ANALYST_PERMS,
  editor: EDITOR_PERMS,
  executive: EXECUTIVE_PERMS,
  admin: ADMIN_PERMS,
};

export const routeAccessPolicy: Array<{ pattern: string; permission: Permission }> = [
  { pattern: "/admin", permission: "admin:view" },
  { pattern: "/commitments", permission: "dashboard:view" },
  { pattern: "/prepare", permission: "dashboard:view" },
];

export function roleHasPermission(role: UserRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * UX-guard alias matching the pattern in docs/architecture/03-authentication-rbac.md
 * §"Слой 1 — Frontend (UX-guard)" (lines 252-267). Use to hide UI affordances a
 * user can't actually trigger; never as the sole gate — backend must always
 * re-check. Once next-auth lands, prefer `can(session.user.role, perm)`.
 */
export function can(role: UserRole, permission: Permission) {
  return roleHasPermission(role, permission);
}

export function permissionsForRole(role: UserRole) {
  return ROLE_PERMISSIONS[role];
}
