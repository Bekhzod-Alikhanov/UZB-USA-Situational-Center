import { NextResponse } from "next/server";
import { loadPublishedMetrics } from "@/lib/data-governance/published";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await loadPublishedMetrics("mobility");
  return NextResponse.json({
    domain: "mobility",
    ...result,
    guardrail: "Values are approved/current only. Static fallback is used if the operational database is unavailable.",
  });
}
