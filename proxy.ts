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
 * Admin gate: any request to `/[locale]/admin*` (other than the login page)
 * must carry a valid signed auth cookie. The cookie is set by the login
 * server action after the supplied password matches `ADMIN_PASSWORD`.
 */
function isAdminPath(pathname: string): boolean {
  // Match /<locale>/admin or /<locale>/admin/<anything>, but not the login page.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) return false;
  if (segments[1] !== "admin") return false;
  // Allow the login page through unauthenticated.
  if (segments[2] === "login") return false;
  return true;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isAdminPath(pathname)) {
    const authed = await verifyAdminSessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!authed) {
      const segments = pathname.split("/").filter(Boolean);
      const locale = locales.includes(segments[0] as (typeof locales)[number])
        ? segments[0]
        : defaultLocale;
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
