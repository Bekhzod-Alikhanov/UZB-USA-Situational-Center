export type UserRole = "viewer" | "analyst" | "editor" | "admin" | "executive";

export type Permission =
  | "dashboard:view"
  | "source:view"
  | "source:approve"
  | "commitment:edit"
  | "decision:approve"
  | "admin:view"
  | "user:manage";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  viewer: ["dashboard:view", "source:view"],
  analyst: ["dashboard:view", "source:view", "commitment:edit"],
  editor: ["dashboard:view", "source:view", "commitment:edit", "source:approve"],
  executive: ["dashboard:view", "source:view", "decision:approve"],
  admin: ["dashboard:view", "source:view", "source:approve", "commitment:edit", "decision:approve", "admin:view", "user:manage"],
};

export const routeAccessPolicy: Array<{ pattern: string; permission: Permission }> = [
  { pattern: "/admin", permission: "admin:view" },
  { pattern: "/commitments", permission: "dashboard:view" },
  { pattern: "/prepare", permission: "dashboard:view" },
  { pattern: "/assistant", permission: "dashboard:view" },
];

export function roleHasPermission(role: UserRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function permissionsForRole(role: UserRole) {
  return ROLE_PERMISSIONS[role];
}
