import { NextRequest, NextResponse } from "next/server";
import { externalDataConnectors } from "@/data/external-data";
import { sourceVersionPolicies } from "@/data/source-policies";
import { ADMIN_COOKIE, verifyAdminCookieValue, verifyCronSecretHeader } from "@/lib/auth/admin";
import { databaseHealth, fetchSupabaseTable } from "@/lib/db/adapter";
import { staticPublishedMetrics } from "@/lib/data-governance/static-baseline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IngestRunRow {
  id: string;
  scope: string;
  mode: string;
  started_at: string;
  finished_at: string;
  summary: unknown;
}

async function isAuthorized(req: NextRequest) {
  if (verifyCronSecretHeader(req.headers.get("authorization"))) return true;
  return verifyAdminCookieValue(req.cookies.get(ADMIN_COOKIE)?.value);
}

export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = databaseHealth();
  let recentRuns: IngestRunRow[] = [];
  if (db.writable) {
    try {
      recentRuns = await fetchSupabaseTable<IngestRunRow>("ingest_run", "select=*&order=started_at.desc&limit=10");
    } catch {
      recentRuns = [];
    }
  }

  return NextResponse.json({
    database: db,
    connectors: externalDataConnectors,
    policies: sourceVersionPolicies,
    staticBaselineCount: staticPublishedMetrics().length,
    recentRuns,
    guardrails: [
      "Raw snapshots are stored before normalization.",
      "Older source periods cannot replace newer approved values.",
      "All live observations enter the review queue before publication.",
      "Static TypeScript data remains the fallback when DB/API sources fail.",
    ],
  });
}
