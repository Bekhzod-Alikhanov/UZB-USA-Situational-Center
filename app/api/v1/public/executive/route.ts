import { NextRequest } from "next/server";
import { servePublicApiV1 } from "../_shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return servePublicApiV1(request, "executive");
}
