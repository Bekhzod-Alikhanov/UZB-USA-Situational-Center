import { NextRequest, NextResponse } from "next/server";
import { verifyCronSecretHeader } from "@/lib/auth/admin";
import { runGovernedIngestion } from "@/lib/data-governance/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!verifyCronSecretHeader(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  }

  const result = await runGovernedIngestion({ scope: "scheduled", write: true });
  return NextResponse.json(result);
}
