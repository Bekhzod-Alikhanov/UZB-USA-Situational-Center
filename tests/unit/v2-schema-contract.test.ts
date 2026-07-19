import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.resolve(
  process.cwd(),
  "database/migrations/2026-07-10-v2-governance-foundation.sql",
);
const migration = fs.readFileSync(migrationPath, "utf8");

describe("V2 governance schema contract", () => {
  it("models the governed publication and bilingual review pipeline", () => {
    for (const table of [
      "source_artifact",
      "fact_claim",
      "translation_bundle",
      "translation_revision",
      "publication_release",
      "publication_release_review",
      "publication_projection",
      "projection_fact_claim",
    ]) {
      expect(migration).toContain(`create table if not exists ${table}`);
    }

    expect(migration).toContain("Every required English and Uzbek Latin field must be independently approved.");
    expect(migration).toContain("Quote-safe headlines require clean verified-official lineage.");
    expect(migration).toContain("reviewer_id <> new.submitted_by");
    expect(migration).toContain("active native Uzbek reviewer qualification");
    expect(migration).toContain("active domain SME reviewer qualification");
  });

  it("models the complete operational relationship spine", () => {
    for (const table of [
      "visit_record",
      "meeting_record",
      "relation_object_record",
      "governed_commitment",
      "action_record",
      "evidence_record",
      "approval_record",
      "escalation_record",
    ]) {
      expect(migration).toContain(`create table if not exists ${table}`);
    }

    expect(migration).toContain("requested_by <> approver_id");
    expect(migration).toContain("accountable_owner_id uuid not null");
    expect(migration).toContain("due_at timestamptz not null");
  });

  it("keeps restricted records disabled and evidence private by default", () => {
    expect(migration).toContain("restricted_enabled boolean not null default false");
    expect(migration).toContain("confidential_files_enabled boolean not null default false");
    expect(migration).toContain("Restricted records are disabled until an accredited enclave is approved.");
    expect(migration).toContain("Confidential evidence is disabled until the launch gate is approved.");
    expect(migration).not.toMatch(/create policy[^;]+on evidence_record/is);
  });

  it("requires actor context and writes append-only audit plus durable outbox records", () => {
    expect(migration).toContain("create table if not exists audit_event");
    expect(migration).toContain("create table if not exists outbox_event");
    expect(migration).toContain("Audited writes require actor, request, session, and reason context.");
    expect(migration).toContain("before update or delete on audit_event");
    expect(migration).toContain("audit_and_enqueue_change");
  });

  it("cannot bypass publication validation by inserting a terminal-state release", () => {
    expect(migration).toContain("before insert or update on publication_release");
    expect(migration).toContain("New publication releases must start in draft state.");
  });

  it("protects both sides of every published-projection mutation", () => {
    expect(migration).toContain("before insert or update or delete on publication_projection");
    expect(migration).toContain("Existing published projection rows are immutable.");
    expect(migration).toContain("Cannot add projection rows to a published release.");
  });

  it("audits and enqueues security-policy changes", () => {
    expect(migration).toMatch(
      /foreach table_name in array array\[[\s\S]*?'platform_security_policy'[\s\S]*?audit_and_enqueue_change\(\)/,
    );
  });
});
