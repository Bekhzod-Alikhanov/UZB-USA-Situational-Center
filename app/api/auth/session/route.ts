import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyGateSessionToken } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

/**
 * Who is behind the gate cookie right now: {"role":"admin"|"samarkand"|
 * "khorezm"|null}. Client components use this to decide whether to render
 * the stage-2 edit forms; every write is re-checked server-side.
 */
export async function GET() {
  const cookieStore = await cookies();
  const role = await verifyGateSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  return NextResponse.json({ role }, { headers: { "cache-control": "no-store" } });
}
