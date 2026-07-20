export const ADMIN_COOKIE = "uzus_admin_auth";

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const SESSION_PURPOSE = "uzus-admin";

/**
 * Who is behind the password gate. "admin" is the Center (full access);
 * the region roles are hokimiyat editors limited to their own roadmap and
 * their region's visit materials (stage-2 access model chosen by the owner).
 */
export type GateRole = "admin" | "samarkand" | "khorezm";

interface AdminSessionPayload {
  exp: number;
  iat: number;
  purpose: typeof SESSION_PURPOSE;
  /** v1 tokens predate roles and are treated as admin until they expire. */
  v: 1 | 2;
  role?: GateRole;
}

function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim() || undefined;
}

const REGION_PASSWORD_ENV: Record<Exclude<GateRole, "admin">, string> = {
  samarkand: "REGION_PASSWORD_SAMARKAND",
  khorezm: "REGION_PASSWORD_KHOREZM",
};

function getRegionPassword(role: Exclude<GateRole, "admin">): string | undefined {
  return process.env[REGION_PASSWORD_ENV[role]]?.trim() || undefined;
}

function isWeakSecret(secret: string): boolean {
  return secret.length < 32 || /^(admin|password|changeme|change-me|secret|test)$/i.test(secret);
}

function getSigningSecret(): string | undefined {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (process.env.NODE_ENV === "production") {
    return explicit && !isWeakSecret(explicit) ? explicit : undefined;
  }
  return explicit || getAdminPassword();
}

function constantTimeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  const max = Math.max(left.length, right.length, 1);
  let diff = left.length ^ right.length;
  for (let i = 0; i < max; i += 1) {
    const leftByte = left.length ? left[i % left.length] : 0;
    const rightByte = right.length ? right[i % right.length] : 0;
    diff |= leftByte ^ rightByte;
  }
  return diff === 0;
}

function encodeBase64Url(input: string | Uint8Array): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function decodeBase64UrlText(input: string): string {
  return new TextDecoder().decode(decodeBase64Url(input));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function hmacKey(secret: string, usage: KeyUsage) {
  return crypto.subtle.importKey(
    "raw",
    toArrayBuffer(new TextEncoder().encode(secret)),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await hmacKey(secret, "sign");
  const signature = await crypto.subtle.sign("HMAC", key, toArrayBuffer(new TextEncoder().encode(payload)));
  return encodeBase64Url(new Uint8Array(signature));
}

async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const key = await hmacKey(secret, "verify");
    return await crypto.subtle.verify(
      "HMAC",
      key,
      toArrayBuffer(decodeBase64Url(signature)),
      toArrayBuffer(new TextEncoder().encode(payload)),
    );
  } catch {
    return false;
  }
}

export function requireAdminPassword(): string {
  const password = getAdminPassword();
  if (!password) {
    throw new Error("ADMIN_PASSWORD is required before the admin area can be used.");
  }
  return password;
}

export async function createGateSessionToken(role: GateRole, now = Date.now()): Promise<string> {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error("A strong ADMIN_SESSION_SECRET is required to sign admin sessions in production.");
  }

  const payload: AdminSessionPayload = {
    exp: now + SESSION_TTL_SECONDS * 1000,
    iat: now,
    purpose: SESSION_PURPOSE,
    v: 2,
    role,
  };
  const body = encodeBase64Url(JSON.stringify(payload));
  const signature = await signPayload(body, secret);
  return `${body}.${signature}`;
}

export async function createAdminSessionToken(now = Date.now()): Promise<string> {
  return createGateSessionToken("admin", now);
}

/** Verify a gate cookie and return the caller's role, or null when invalid. */
export async function verifyGateSessionToken(token: string | undefined, now = Date.now()): Promise<GateRole | null> {
  if (!token) return null;
  const secret = getSigningSecret();
  if (!secret) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  if (!(await verifySignature(body, signature, secret))) return null;

  try {
    const payload = JSON.parse(decodeBase64UrlText(body)) as Partial<AdminSessionPayload>;
    if (payload.purpose !== SESSION_PURPOSE || typeof payload.exp !== "number" || payload.exp <= now) return null;
    if (payload.v === 1) return "admin";
    if (payload.v === 2 && (payload.role === "admin" || payload.role === "samarkand" || payload.role === "khorezm")) {
      return payload.role;
    }
    return null;
  } catch {
    return null;
  }
}

export async function verifyAdminSessionToken(token: string | undefined, now = Date.now()): Promise<boolean> {
  return (await verifyGateSessionToken(token, now)) === "admin";
}

export async function verifyAdminCookieValue(cookieValue: string | undefined): Promise<boolean> {
  return verifyAdminSessionToken(cookieValue);
}

export function verifyCronSecretHeader(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  return Boolean(secret && authHeader && constantTimeEqual(authHeader, `Bearer ${secret}`));
}

export function verifyAdminPassword(candidate: string): boolean {
  return constantTimeEqual(candidate, requireAdminPassword());
}

/**
 * Match a submitted password against the admin password and the per-region
 * hokimiyat passwords. Always runs every configured comparison so timing does
 * not reveal which password (if any) matched.
 */
export function verifyGatePassword(candidate: string): GateRole | null {
  let matched: GateRole | null = null;
  const admin = getAdminPassword();
  if (admin && constantTimeEqual(candidate, admin)) matched = "admin";
  for (const role of ["samarkand", "khorezm"] as const) {
    const password = getRegionPassword(role);
    if (password && constantTimeEqual(candidate, password) && matched === null) matched = role;
  }
  if (!admin && !getRegionPassword("samarkand") && !getRegionPassword("khorezm")) {
    throw new Error("ADMIN_PASSWORD is required before the admin area can be used.");
  }
  return matched;
}

export function isSafeAdminRedirect(from: string, locale: string): boolean {
  // Only same-locale paths inside the password-gated sections (see
  // GATED_SECTIONS in proxy.ts) are valid post-login targets.
  if (
    !from.startsWith(`/${locale}/admin`) &&
    !from.startsWith(`/${locale}/prepare`) &&
    !from.startsWith(`/${locale}/today`)
  )
    return false;
  if (from.includes("//")) return false;
  return !from.startsWith(`/${locale}/admin/login`);
}

export const adminSessionMaxAge = SESSION_TTL_SECONDS;
