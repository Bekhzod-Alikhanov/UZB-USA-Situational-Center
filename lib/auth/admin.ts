export const ADMIN_COOKIE = "uzus_admin_auth";

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const SESSION_PURPOSE = "uzus-admin";

interface AdminSessionPayload {
  exp: number;
  iat: number;
  purpose: typeof SESSION_PURPOSE;
  v: 1;
}

function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim() || undefined;
}

function getSigningSecret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPassword();
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

export async function createAdminSessionToken(now = Date.now()): Promise<string> {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error("ADMIN_PASSWORD or ADMIN_SESSION_SECRET is required to sign admin sessions.");
  }

  const payload: AdminSessionPayload = {
    exp: now + SESSION_TTL_SECONDS * 1000,
    iat: now,
    purpose: SESSION_PURPOSE,
    v: 1,
  };
  const body = encodeBase64Url(JSON.stringify(payload));
  const signature = await signPayload(body, secret);
  return `${body}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined, now = Date.now()): Promise<boolean> {
  if (!token) return false;
  const secret = getSigningSecret();
  if (!secret) return false;

  const [body, signature] = token.split(".");
  if (!body || !signature) return false;
  if (!(await verifySignature(body, signature, secret))) return false;

  try {
    const payload = JSON.parse(decodeBase64UrlText(body)) as Partial<AdminSessionPayload>;
    return (
      payload.v === 1 && payload.purpose === SESSION_PURPOSE && typeof payload.exp === "number" && payload.exp > now
    );
  } catch {
    return false;
  }
}

export async function verifyAdminCookieValue(cookieValue: string | undefined): Promise<boolean> {
  return verifyAdminSessionToken(cookieValue);
}

export function verifyCronSecretHeader(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  return Boolean(secret && authHeader === `Bearer ${secret}`);
}

export function isSafeAdminRedirect(from: string, locale: string): boolean {
  if (!from.startsWith(`/${locale}/admin`)) return false;
  if (from.includes("//")) return false;
  return !from.startsWith(`/${locale}/admin/login`);
}

export const adminSessionMaxAge = SESSION_TTL_SECONDS;
