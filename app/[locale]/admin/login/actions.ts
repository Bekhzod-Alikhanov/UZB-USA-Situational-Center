"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE = "uzus_admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

/**
 * Verify the supplied password against `ADMIN_PASSWORD`. If correct, set a
 * short-lived httpOnly cookie and redirect back to wherever the user came
 * from (or /[locale]/admin by default). If wrong, redirect back to the
 * login page with an error flag.
 */
export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "");
  const locale = String(formData.get("locale") ?? "en");

  const expected = process.env.ADMIN_PASSWORD ?? "uzus2026";

  if (password !== expected) {
    redirect(`/${locale}/admin/login?error=1${from ? `&from=${encodeURIComponent(from)}` : ""}`);
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  // Redirect to the originally-requested admin path, or default admin home.
  const target = from && from.startsWith("/") ? from : `/${locale}/admin`;
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
