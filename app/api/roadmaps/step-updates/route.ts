import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyGateSessionToken } from "@/lib/auth/admin";
import { fetchSupabaseTable, insertSupabaseRows } from "@/lib/db/adapter";
import { allRoadmapSteps, type RoadmapStepState } from "@/data/roadmaps";

export const dynamic = "force-dynamic";

/** Journal row shape (see database/migrations/2026-07-stage2-hokimiyat.sql). */
interface StepUpdateRow {
  step_id: string;
  project_id: string;
  region: string;
  new_state: "done" | "in-progress" | "reset" | null;
  note: string | null;
  author_role: string;
  author_name: string | null;
  created_at: string;
}

export interface StepOverride {
  state?: RoadmapStepState;
  note?: string;
  updatedAt?: string;
  author?: string;
}

function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * GET — current per-step overrides, reduced from the append-only journal:
 * for each step the newest state-bearing row wins the state, the newest
 * note-bearing row wins the note ("reset" clears the manual state back to
 * the document baseline). Public: the same states are shown on /roadmaps.
 * Returns {} when Supabase is not configured, so static deploys stay whole.
 */
export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json({ updates: {}, backend: "static" }, { headers: { "cache-control": "no-store" } });
  }
  try {
    const rows = await fetchSupabaseTable<StepUpdateRow>(
      "roadmap_step_update",
      "select=step_id,new_state,note,author_role,author_name,created_at&order=created_at.asc",
    );
    const updates: Record<string, StepOverride> = {};
    for (const row of rows) {
      const current = updates[row.step_id] ?? {};
      if (row.new_state === "reset") current.state = null;
      else if (row.new_state) current.state = row.new_state;
      if (row.note !== null && row.note !== undefined) current.note = row.note;
      current.updatedAt = row.created_at;
      current.author = row.author_name ? `${row.author_name}` : row.author_role;
      updates[row.step_id] = current;
    }
    return NextResponse.json({ updates, backend: "supabase" }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { updates: {}, backend: "error", message: error instanceof Error ? error.message : "fetch failed" },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  }
}

/**
 * POST — append one journal row. Body: { stepId, state?: "done"|"in-progress"|
 * "reset", note?, authorName? }. Requires the gate cookie; hokimiyat roles may
 * only touch steps of their own region's roadmap.
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const role = await verifyGateSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!role) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "database not configured" }, { status: 503 });

  let body: { stepId?: unknown; state?: unknown; note?: unknown; authorName?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const stepId = typeof body.stepId === "string" ? body.stepId : "";
  const state = body.state === "done" || body.state === "in-progress" || body.state === "reset" ? body.state : null;
  const note = typeof body.note === "string" && body.note.trim() ? body.note.trim().slice(0, 2000) : null;
  const authorName =
    typeof body.authorName === "string" && body.authorName.trim() ? body.authorName.trim().slice(0, 120) : null;

  if (!state && !note) return NextResponse.json({ error: "state or note is required" }, { status: 400 });

  const target = allRoadmapSteps().find(({ step }) => step.id === stepId);
  if (!target) return NextResponse.json({ error: "unknown step" }, { status: 404 });
  if (role !== "admin" && role !== target.project.region) {
    return NextResponse.json({ error: "role cannot edit this region" }, { status: 403 });
  }

  try {
    const inserted = await insertSupabaseRows("roadmap_step_update", [
      {
        step_id: target.step.id,
        project_id: target.project.id,
        region: target.project.region,
        new_state: state,
        note,
        author_role: role,
        author_name: authorName,
      },
    ]);
    // The journal is itself the audit trail; mirror into audit_log so the
    // admin audit view sees roadmap edits alongside everything else.
    await insertSupabaseRows("audit_log", [
      {
        action: state ? `roadmap-step-${state}` : "roadmap-step-note",
        entity_type: "roadmap_step",
        entity_id: target.step.id,
        after_data: { state, note, author_role: role, author_name: authorName },
      },
    ]).catch(() => undefined);
    return NextResponse.json({ ok: true, id: (inserted[0] as { id?: string })?.id ?? null });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "insert failed" }, { status: 502 });
  }
}
