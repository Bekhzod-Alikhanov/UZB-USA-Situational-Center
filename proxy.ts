import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n/config";
import { ADMIN_COOKIE, verifyAdminSessionToken } from "./lib/auth/admin";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

/**
 * Password gate: any request to a protected section (other than the login
 * page) must carry a valid signed auth cookie. The cookie is set by the
 * login server action after the supplied password matches `ADMIN_PASSWORD`.
 * `/prepare` is gated because visit dossiers may carry delegation names and
 * material registries (CLAUDE.md hard rule #8).
 */
const GATED_SECTIONS = new Set(["admin", "prepare"]);

function isGatedPath(pathname: string): boolean {
  // Match /<locale>/<section> or deeper, but not the login page.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) return false;
  if (!GATED_SECTIONS.has(segments[1])) return false;
  // Allow the login page through unauthenticated.
  if (segments[1] === "admin" && segments[2] === "login") return false;
  return true;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isGatedPath(pathname)) {
    const authed = await verifyAdminSessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!authed) {
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
