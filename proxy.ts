import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n/config";
import { legacyRussianRedirectPath } from "./lib/i18n/routing";
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
 * hokimiyat editors. `/today` and `/prepare` are open to any authenticated
 * role; `/admin` stays admin-only.
 */
type GatedSection = "admin" | "prepare" | "today";

const GATED_SECTIONS = new Set<GatedSection>(["admin", "prepare", "today"]);

function gatedSection(pathname: string): GatedSection | null {
  // Match /<locale>/<section> or deeper, but not the login page.
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  const section = segments[1] as GatedSection;
  if (!GATED_SECTIONS.has(section)) return null;
  // Allow the login page through unauthenticated.
  if (segments[1] === "admin" && segments[2] === "login") return null;
  return section;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Russian UI routes were retired for V2. Keep old bookmarks and shared
  // links useful with a permanent, route-for-route redirect to Uzbek Latin.
  // Cloning the incoming URL preserves its complete query string.
  const legacyRedirectPath = legacyRussianRedirectPath(pathname);
  if (legacyRedirectPath) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = legacyRedirectPath;
    return NextResponse.redirect(redirectUrl, 308);
  }

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
