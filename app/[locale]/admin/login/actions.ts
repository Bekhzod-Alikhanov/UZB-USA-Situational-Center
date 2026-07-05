"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  adminSessionMaxAge,
  createGateSessionToken,
  isSafeAdminRedirect,
  verifyGatePassword,
  type GateRole,
} from "@/lib/auth/admin";

/**
 * Verify the supplied password against the gate passwords: ADMIN_PASSWORD →
 * "admin", REGION_PASSWORD_SAMARKAND / REGION_PASSWORD_KHOREZM → hokimiyat
 * editor roles. On success, set a signed, short-lived httpOnly cookie carrying
 * the role and redirect to the requested gated path (region roles are never
 * sent into /admin — the proxy would bounce them back here in a loop).
 */
export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "");
  const locale = String(formData.get("locale") ?? "en");

  let role: GateRole | null = null;
  try {
    role = verifyGatePassword(password);
  } catch {
    redirect(`/${locale}/admin/login?error=config${from ? `&from=${encodeURIComponent(from)}` : ""}`);
  }
  if (!role) {
    redirect(`/${locale}/admin/login?error=1${from ? `&from=${encodeURIComponent(from)}` : ""}`);
  }

  const cookieStore = await cookies();
  let token: string;
  try {
    token = await createGateSessionToken(role);
  } catch {
    redirect(`/${locale}/admin/login?error=config${from ? `&from=${encodeURIComponent(from)}` : ""}`);
  }
  cookieStore.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: adminSessionMaxAge,
    path: "/",
  });

  // Redirect to the originally-requested gated path when the role may enter
  // it; hokimiyat editors default to the visit-preparation workspace.
  const fromIsSafe = from && isSafeAdminRedirect(from, locale);
  const fromIsAdmin = from.startsWith(`/${locale}/admin`);
  const target =
    role === "admin"
      ? fromIsSafe
        ? from
        : `/${locale}/admin`
      : fromIsSafe && !fromIsAdmin
        ? from
        : `/${locale}/prepare`;
  redirect(target);
}

export async function logout(formData: FormData): Promise<void> {
  const locale = String(formData.get("locale") ?? "en");
  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  redirect(`/${locale}/admin/login`);
}
