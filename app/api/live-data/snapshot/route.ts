import { NextRequest, NextResponse } from "next/server";
import { fetchCensusTradeSnapshot } from "@/lib/live-data/census";
import { fetchEximAuthorizationsObservations } from "@/lib/live-data/exim";
import { fetchForeignAssistanceUzbekistan } from "@/lib/live-data/foreign-assistance";
import { fetchWorldBankLatest } from "@/lib/live-data/worldbank";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestedTime = req.nextUrl.searchParams.get("time");
  if (requestedTime && !/^\d{4}-\d{2}$/.test(requestedTime)) {
    return NextResponse.json({ error: "time must use YYYY-MM format." }, { status: 400 });
  }

  const time = requestedTime ?? "2025-12";
  const results = await Promise.allSettled([
    fetchCensusTradeSnapshot(time),
    fetchWorldBankLatest("UZB"),
    fetchForeignAssistanceUzbekistan(),
    fetchEximAuthorizationsObservations(),
  ]);

  const [census, worldBank, foreignAssistance, exim] = results.map((result) =>
    result.status === "fulfilled"
      ? { ok: true, data: result.value }
      : { ok: false, error: result.reason instanceof Error ? result.reason.message : "Request failed" },
  );

  return NextResponse.json({
    fetchedAt: new Date().toISOString(),
    time,
    census,
    worldBank,
    foreignAssistance,
    exim,
  });
}
