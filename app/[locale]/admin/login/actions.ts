"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  adminSessionMaxAge,
  createAdminSessionToken,
  isSafeAdminRedirect,
  verifyAdminPassword,
} from "@/lib/auth/admin";

/**
 * Verify the supplied password against `ADMIN_PASSWORD`. If correct, set a
 * signed, short-lived httpOnly cookie and redirect to the requested admin path.
 * If wrong or not configured, redirect back to the login page with an error flag.
 */
export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "");
  const locale = String(formData.get("locale") ?? "en");

  let authorized = false;
  try {
    authorized = verifyAdminPassword(password);
  } catch {
    redirect(`/${locale}/admin/login?error=config${from ? `&from=${encodeURIComponent(from)}` : ""}`);
  }
  if (!authorized) {
    redirect(`/${locale}/admin/login?error=1${from ? `&from=${encodeURIComponent(from)}` : ""}`);
  }

  const cookieStore = await cookies();
  let token: string;
  try {
    token = await createAdminSessionToken();
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

  // Redirect to the originally-requested admin path, or default admin home.
  const target = from && isSafeAdminRedirect(from, locale) ? from : `/${locale}/admin`;
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
