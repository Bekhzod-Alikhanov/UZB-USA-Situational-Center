import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyGateSessionToken, type GateRole } from "@/lib/auth/admin";
import { fetchSupabaseTable, insertSupabaseRows } from "@/lib/db/adapter";
import { upcomingVisits, type UpcomingVisit } from "@/data/visit-prep";
import type { VisitMaterialType } from "@/data/visit-prep";

export const dynamic = "force-dynamic";

const BUCKET = "visit-materials";
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.ms-powerpoint",
  "application/vnd.ms-excel",
  "application/zip",
  "image/png",
  "image/jpeg",
]);

interface UploadRow {
  id: string;
  visit_id: string;
  title: string;
  material_type: VisitMaterialType;
  owner_org: string | null;
  storage_path: string;
  file_name: string;
  file_size: number | null;
  content_type: string | null;
  uploaded_by_role: string;
  uploaded_by_name: string | null;
  created_at: string;
}

function supabaseEnv(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

/** Hokimiyat roles may only touch visits linked to their region. */
function roleMayAccessVisit(role: GateRole, visit: UpcomingVisit): boolean {
  if (role === "admin") return true;
  return visit.region === role;
}

async function signedUrl(env: { url: string; key: string }, path: string): Promise<string | null> {
  const response = await fetch(`${env.url}/storage/v1/object/sign/${BUCKET}/${path}`, {
    method: "POST",
    headers: { apikey: env.key, authorization: `Bearer ${env.key}`, "content-type": "application/json" },
    body: JSON.stringify({ expiresIn: 3600 }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { signedURL?: string };
  return data.signedURL ? `${env.url}/storage/v1${data.signedURL}` : null;
}

/** GET ?visit=<id> — uploaded files for one visit, with 1-hour signed links. */
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const role = await verifyGateSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!role) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const visitId = req.nextUrl.searchParams.get("visit") ?? "";
  const visit = upcomingVisits.find((v) => v.id === visitId);
  if (!visit) return NextResponse.json({ error: "unknown visit" }, { status: 404 });
  if (!roleMayAccessVisit(role, visit)) {
    return NextResponse.json({ error: "role cannot access this visit" }, { status: 403 });
  }

  const env = supabaseEnv();
  if (!env) return NextResponse.json({ files: [], backend: "static" }, { headers: { "cache-control": "no-store" } });

  try {
    const rows = await fetchSupabaseTable<UploadRow>(
      "visit_material_upload",
      `select=*&visit_id=eq.${encodeURIComponent(visitId)}&order=created_at.desc`,
    );
    const files = await Promise.all(
      rows.map(async (row) => ({
        id: row.id,
        title: row.title,
        type: row.material_type,
        ownerOrg: row.owner_org,
        fileName: row.file_name,
        fileSize: row.file_size,
        uploadedBy: row.uploaded_by_name || row.uploaded_by_role,
        createdAt: row.created_at,
        url: await signedUrl(env, row.storage_path),
      })),
    );
    return NextResponse.json({ files, backend: "supabase" }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { files: [], backend: "error", message: error instanceof Error ? error.message : "fetch failed" },
      { headers: { "cache-control": "no-store" } },
    );
  }
}

/**
 * POST multipart/form-data — upload one material file to the private bucket
 * and register it. Fields: visitId, title, type, ownerOrg?, authorName?, file.
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const role = await verifyGateSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!role) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const env = supabaseEnv();
  if (!env) return NextResponse.json({ error: "database not configured" }, { status: 503 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "multipart form-data expected" }, { status: 400 });
  }

  const visitId = String(form.get("visitId") ?? "");
  const visit = upcomingVisits.find((v) => v.id === visitId);
  if (!visit) return NextResponse.json({ error: "unknown visit" }, { status: 404 });
  if (!roleMayAccessVisit(role, visit)) {
    return NextResponse.json({ error: "role cannot upload for this visit" }, { status: 403 });
  }

  const title = String(form.get("title") ?? "")
    .trim()
    .slice(0, 200);
  const typeRaw = String(form.get("type") ?? "other");
  const materialType: VisitMaterialType = ["presentation", "speech", "agenda", "briefing", "other"].includes(typeRaw)
    ? (typeRaw as VisitMaterialType)
    : "other";
  const ownerOrg =
    String(form.get("ownerOrg") ?? "")
      .trim()
      .slice(0, 160) || null;
  const authorName =
    String(form.get("authorName") ?? "")
      .trim()
      .slice(0, 120) || null;
  const file = form.get("file");

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "file exceeds 25 MB" }, { status: 413 });
  const contentType = file.type || "application/octet-stream";
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return NextResponse.json({ error: `content type ${contentType} is not allowed` }, { status: 415 });
  }

  // ASCII-safe object key; the original file name is preserved in the table.
  const safeName = (file.name || "file")
    .replace(/[^\w.\-]+/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(-80);
  const storagePath = `${visitId}/${Date.now()}-${safeName}`;

  const uploadResponse = await fetch(`${env.url}/storage/v1/object/${BUCKET}/${storagePath}`, {
    method: "POST",
    headers: {
      apikey: env.key,
      authorization: `Bearer ${env.key}`,
      "content-type": contentType,
      "x-upsert": "false",
    },
    body: Buffer.from(await file.arrayBuffer()),
    cache: "no-store",
  });
  if (!uploadResponse.ok) {
    const detail = await uploadResponse.text().catch(() => "");
    return NextResponse.json({ error: `storage upload failed (${uploadResponse.status}) ${detail}` }, { status: 502 });
  }

  try {
    const inserted = await insertSupabaseRows("visit_material_upload", [
      {
        visit_id: visitId,
        title,
        material_type: materialType,
        owner_org: ownerOrg,
        storage_path: storagePath,
        file_name: file.name || safeName,
        file_size: file.size,
        content_type: contentType,
        uploaded_by_role: role,
        uploaded_by_name: authorName,
      },
    ]);
    await insertSupabaseRows("audit_log", [
      {
        action: "visit-material-upload",
        entity_type: "visit_material",
        entity_id: visitId,
        after_data: { title, material_type: materialType, storage_path: storagePath, uploaded_by_role: role },
      },
    ]).catch(() => undefined);
    return NextResponse.json({ ok: true, id: (inserted[0] as { id?: string })?.id ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "registry insert failed" },
      { status: 502 },
    );
  }
}
