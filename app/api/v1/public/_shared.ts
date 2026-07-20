import { createHash, randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { buildPublicApiV1Response, publicApiV1EtagMaterial, type PublicApiV1Domain } from "@/packages/data";

export const PUBLIC_API_CACHE_CONTROL = "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;

function requestId(request: NextRequest): string {
  const supplied = request.headers.get("x-request-id");
  return supplied && REQUEST_ID_PATTERN.test(supplied) ? supplied : randomUUID();
}

export function publicApiV1Etag(domain: PublicApiV1Domain): string {
  const digest = createHash("sha256").update(publicApiV1EtagMaterial(domain)).digest("base64url");
  return `"${digest}"`;
}

function hasMatchingEtag(request: NextRequest, etag: string): boolean {
  const candidates = request.headers
    .get("if-none-match")
    ?.split(",")
    .map((value) => value.trim().replace(/^W\//, ""));
  return candidates?.includes("*") || candidates?.includes(etag) || false;
}

export function servePublicApiV1(request: NextRequest, domain: PublicApiV1Domain): NextResponse {
  const correlationId = requestId(request);
  const etag = publicApiV1Etag(domain);
  const headers = {
    "cache-control": PUBLIC_API_CACHE_CONTROL,
    etag,
    vary: "Accept-Encoding",
    "x-content-type-options": "nosniff",
    "x-request-id": correlationId,
  };

  if (hasMatchingEtag(request, etag)) {
    return new NextResponse(null, { status: 304, headers });
  }

  const response = buildPublicApiV1Response(domain, correlationId);
  const cacheableResponse = {
    data: response.data,
    meta: {
      asOf: response.meta.asOf,
      publishedAt: response.meta.publishedAt,
      publicationRelease: response.meta.publicationRelease,
      sourceIds: response.meta.sourceIds,
      confidence: response.meta.confidence,
      freshness: response.meta.freshness,
      dataMode: response.meta.dataMode,
    },
  };

  return NextResponse.json(cacheableResponse, { headers });
}
