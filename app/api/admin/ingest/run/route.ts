import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminCookieValue, verifyCronSecretHeader } from "@/lib/auth/admin";
import { runGovernedIngestion } from "@/lib/data-governance/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isAuthorized(req: NextRequest) {
  if (verifyCronSecretHeader(req.headers.get("authorization"))) return true;
  return verifyAdminCookieValue(req.cookies.get(ADMIN_COOKIE)?.value);
}

async function handle(req: NextRequest, write: boolean) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scope = req.nextUrl.searchParams.get("scope") ?? "scheduled";
  const result = await runGovernedIngestion({ scope, write });
  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  return handle(req, false);
}

export async function POST(req: NextRequest) {
  let write = false;
  try {
    const body = (await req.json()) as { write?: unknown };
    write = body.write === true;
  } catch {
    write = false;
  }
  return handle(req, write);
}
