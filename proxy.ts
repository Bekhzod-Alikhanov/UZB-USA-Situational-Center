import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n/config";
import { ADMIN_COOKIE, verifyGateSessionToken } from "./lib/auth/admin";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

/**
 * Password gate: any request to a protected section (other than the login
 * page) must carry a valid signed auth cookie. The cookie is set by the
 * login server action; since stage 2 the password decides the ROLE:
 * ADMIN_PASSWORD → "admin" (Center, full access), REGION_PASSWORD_* →
 * hokimiyat editors. `/prepare` is open to any authenticated role (visit
 * dossiers, CLAUDE.md hard rule #8); `/admin` stays admin-only.
 */
const GATED_SECTIONS = new Set(["admin", "prepare"]);

function gatedSection(pathname: string): "admin" | "prepare" | null {
  // Match /<locale>/<section> or deeper, but not the login page.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  if (!GATED_SECTIONS.has(segments[1])) return null;
  // Allow the login page through unauthenticated.
  if (segments[1] === "admin" && segments[2] === "login") return null;
  return segments[1] as "admin" | "prepare";
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const section = gatedSection(pathname);
  if (section) {
    const role = await verifyGateSessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    const allowed = section === "admin" ? role === "admin" : role !== null;
    if (!allowed) {
      const segments = pathname.split("/").filter(Boolean);
      const locale = locales.includes(segments[0] as (typeof locales)[number]) ? segments[0] : defaultLocale;
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = `/${locale}/admin/login`;
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|favicon.ico|icon.svg|.*\\.).*)"],
};
