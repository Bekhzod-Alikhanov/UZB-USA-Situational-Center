import fs from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { afterEach, describe, expect, it } from "vitest";

const baseSchema = fs.readFileSync(path.resolve(process.cwd(), "database/schema.sql"), "utf8");
const migration = fs.readFileSync(
  path.resolve(process.cwd(), "database/migrations/2026-07-10-v2-governance-foundation.sql"),
  "utf8",
);

const databases: PGlite[] = [];

async function createDatabase(): Promise<PGlite> {
  const database = new PGlite({ extensions: { pgcrypto } });
  databases.push(database);
  await database.exec("create role authenticated;");
  await database.exec(baseSchema);
  await database.exec(migration);
  return database;
}

async function createUser(database: PGlite, email: string): Promise<string> {
  const result = await database.query<{ id: string }>(
    "insert into app_user (email, display_name, role) values ($1, $2, 'admin') returning id",
    [email, email],
  );
  return result.rows[0]!.id;
}

async function setAuditContext(database: PGlite, actorId: string, reason = "Governance migration test") {
  await database.query("select set_config('app.actor_id', $1, false)", [actorId]);
  await database.query("select set_config('app.request_id', $1, false)", [`req-${crypto.randomUUID()}`]);
  await database.query("select set_config('app.session_id', $1, false)", [`session-${crypto.randomUUID()}`]);
  await database.query("select set_config('app.reason', $1, false)", [reason]);
}

async function createDraftProjectionFixture(database: PGlite) {
  const submitter = await createUser(database, `submitter-${crypto.randomUUID()}@example.test`);
  const approver = await createUser(database, `approver-${crypto.randomUUID()}@example.test`);
  await setAuditContext(database, submitter);
  await database.query(
    "insert into source_record (id, name, level, fetched_at, data_type) values ('test-source', 'Test source', 'B', current_date, 'Test facts')",
  );
  const artifact = await database.query<{ id: string }>(
    `insert into source_artifact
      (source_id, original_language, content_hash, captured_at, created_by)
     values ('test-source', 'en', $1, now(), $2)
     returning id`,
    [`artifact-${crypto.randomUUID()}`, submitter],
  );
  const claim = await database.query<{ id: string }>(
    `insert into fact_claim
      (source_artifact_id, domain, claim_key, value, as_of, methodology, confidence, created_by)
     values ($1, 'trade', 'test-claim', '{"value": 1}'::jsonb, current_date, 'Test methodology',
       'verified_official', $2)
     returning id`,
    [artifact.rows[0]!.id, submitter],
  );
  const bundle = await database.query<{ id: string }>(
    `insert into translation_bundle (entity_type, entity_id, revision, required_fields, submitted_by)
     values ('projection', $1, 1, array['title'], $2)
     returning id`,
    [`projection-${crypto.randomUUID()}`, submitter],
  );
  const release = await database.query<{ id: string }>(
    `insert into publication_release (release_key, target_surface, submitted_by)
     values ($1, 'public', $2)
     returning id`,
    [`release-${crypto.randomUUID()}`, submitter],
  );
  const projection = await database.query<{ id: string }>(
    `insert into publication_projection
      (release_id, projection_key, domain, route_path, projection_version, payload, content_hash,
       confidence, freshness, quote_safe, headline, period_label, as_of, methodology,
       translation_bundle_id, created_by)
     values ($1, 'trade-summary', 'trade', '/trade', 1,
       '{"selectionPolicy":"verified_official_only","summary":{"value":1}}'::jsonb, $2,
       'verified_official', 'current', true, true, '2026', current_date, 'Test methodology', $3, $4)
     returning id`,
    [release.rows[0]!.id, `projection-${crypto.randomUUID()}`, bundle.rows[0]!.id, submitter],
  );
  await database.query("insert into projection_fact_claim (projection_id, fact_claim_id) values ($1, $2)", [
    projection.rows[0]!.id,
    claim.rows[0]!.id,
  ]);

  return {
    submitter,
    approver,
    artifactId: artifact.rows[0]!.id,
    claimId: claim.rows[0]!.id,
    bundleId: bundle.rows[0]!.id,
    releaseId: release.rows[0]!.id,
    projectionId: projection.rows[0]!.id,
  };
}

afterEach(async () => {
  await Promise.all(databases.splice(0).map((database) => database.close()));
});

describe("V2 governance migration on PostgreSQL", () => {
  it("applies after the production base schema", async () => {
    const database = await createDatabase();
    const result = await database.query<{ name: string }>(
      "select relname as name from pg_class where relkind = 'r' and relname = 'publication_release'",
    );
    expect(result.rows).toEqual([{ name: "publication_release" }]);
  });

  it("rejects non-draft release insertion and unaudited security-policy changes", async () => {
    const database = await createDatabase();
    const submitter = await createUser(database, `submitter-${crypto.randomUUID()}@example.test`);
    await expect(
      database.query(
        `insert into publication_release
          (release_key, target_surface, state, submitted_by, approved_by, published_at)
         values ($1, 'public', 'published', $2, $2, now())`,
        [`release-${crypto.randomUUID()}`, submitter],
      ),
    ).rejects.toThrow(/must start in draft state/);
    await expect(
      database.query("update platform_security_policy set change_reason = 'Unapproved change' where singleton"),
    ).rejects.toThrow(/Audited writes require actor, request, session, and reason context/);
  });

  it("locks claims, lineage, and translations once a release is published", async () => {
    const database = await createDatabase();
    const fixture = await createDraftProjectionFixture(database);
    await database.exec("alter table publication_release disable trigger publication_release_transition");
    await database.query(
      "update publication_release set state = 'published', approved_by = $1, published_at = now() where id = $2",
      [fixture.approver, fixture.releaseId],
    );
    await database.exec("alter table publication_release enable trigger publication_release_transition");

    await expect(
      database.query("delete from projection_fact_claim where projection_id = $1 and fact_claim_id = $2", [
        fixture.projectionId,
        fixture.claimId,
      ]),
    ).rejects.toThrow(/Published projection lineage is immutable/);
    await expect(
      database.query("update fact_claim set methodology = 'Changed after publication' where id = $1", [
        fixture.claimId,
      ]),
    ).rejects.toThrow(/Published fact claims are immutable/);
    await expect(
      database.query(
        `insert into translation_revision
          (bundle_id, field_name, locale, value, state, approved_by, approved_at, created_by)
         values ($1, 'title', 'en', 'Changed after publication', 'approved', $2, now(), $3)`,
        [fixture.bundleId, fixture.approver, fixture.submitter],
      ),
    ).rejects.toThrow(/Published translation bundles are immutable/);
  });

  it("requires a domain reviewer qualified for every projected domain", async () => {
    const database = await createDatabase();
    const fixture = await createDraftProjectionFixture(database);
    const englishReviewer = await createUser(database, `english-${crypto.randomUUID()}@example.test`);
    const uzbekReviewer = await createUser(database, `uzbek-${crypto.randomUUID()}@example.test`);
    const publicationReviewer = await createUser(database, `publisher-${crypto.randomUUID()}@example.test`);
    const domainReviewer = await createUser(database, `domain-${crypto.randomUUID()}@example.test`);

    await database.query(
      `insert into reviewer_qualification (user_id, qualification, valid_from, approved_by)
       values ($1, 'native_uzbek', current_date, $2)`,
      [uzbekReviewer, fixture.approver],
    );
    await database.query(
      `insert into reviewer_qualification (user_id, qualification, domain, valid_from, approved_by)
       values ($1, 'domain_sme', 'investments', current_date, $2)`,
      [domainReviewer, fixture.approver],
    );
    for (const [kind, reviewer, domain] of [
      ["bilingual_en", englishReviewer, "all"],
      ["bilingual_uz", uzbekReviewer, "all"],
      ["publication", publicationReviewer, "all"],
      ["domain", domainReviewer, "trade"],
    ] as const) {
      await database.query(
        `insert into publication_release_review
          (release_id, review_kind, review_domain, decision, reviewer_id, reason)
         values ($1, $2, $3, 'approved', $4, 'Approved for migration test')`,
        [fixture.releaseId, kind, domain, reviewer],
      );
    }
    for (const [locale, reviewer, value] of [
      ["en", englishReviewer, "Trade"],
      ["uz-latn", uzbekReviewer, "Savdo"],
    ] as const) {
      await database.query(
        `insert into translation_revision
          (bundle_id, field_name, locale, value, state, reviewer_id, approved_by, reviewed_at, approved_at, created_by)
         values ($1, 'title', $2, $3, 'approved', $4, $4, now(), now(), $5)`,
        [fixture.bundleId, locale, value, reviewer, fixture.submitter],
      );
    }
    await database.query("update publication_release set state = 'approved', approved_by = $1 where id = $2", [
      fixture.approver,
      fixture.releaseId,
    ]);

    await expect(
      database.query("update publication_release set state = 'published' where id = $1", [fixture.releaseId]),
    ).rejects.toThrow(/active domain SME reviewer qualification for trade/);
    await database.query("update reviewer_qualification set domain = 'trade' where user_id = $1", [domainReviewer]);
    await expect(
      database.query("update publication_release set state = 'published' where id = $1", [fixture.releaseId]),
    ).resolves.toBeDefined();
  });

  it("keeps confidential source files disabled until the security gate is approved", async () => {
    const database = await createDatabase();
    const actor = await createUser(database, `actor-${crypto.randomUUID()}@example.test`);
    await setAuditContext(database, actor);
    await database.query(
      "insert into source_record (id, name, level, fetched_at, data_type) values ('confidential-source', 'Confidential source', 'A', current_date, 'Evidence')",
    );

    const insertConfidentialArtifact = () =>
      database.query(
        `insert into source_artifact
          (source_id, original_language, content_hash, object_key, media_type, captured_at, classification, created_by)
         values ('confidential-source', 'en', $1, 'private/source.pdf', 'application/pdf', now(), 'confidential', $2)`,
        [`artifact-${crypto.randomUUID()}`, actor],
      );

    await expect(insertConfidentialArtifact()).rejects.toThrow(/Confidential.*disabled/i);
    await database.query(
      "update platform_security_policy set confidential_files_enabled = true, changed_by = $1, change_reason = 'Approved test gate' where singleton",
      [actor],
    );
    await expect(insertConfidentialArtifact()).resolves.toBeDefined();
  });

  it("rejects operational fields anywhere inside a public projection payload", async () => {
    const database = await createDatabase();
    const fixture = await createDraftProjectionFixture(database);
    await expect(
      database.query(
        `update publication_projection
         set payload = '{"selectionPolicy":"verified_official_only","summary":{"value":1,"owner":"Private owner"}}'::jsonb
         where id = $1`,
        [fixture.projectionId],
      ),
    ).rejects.toThrow(/public projection payload/i);
  });

  it("audits canonical source changes and prevents truncating append-only audit history", async () => {
    const database = await createDatabase();
    const fixture = await createDraftProjectionFixture(database);
    await database.query("update source_record set name = 'Updated governed source' where id = 'test-source'");
    const sourceAudit = await database.query<{ count: number }>(
      "select count(*)::int as count from audit_event where entity_type = 'source_record' and action = 'update'",
    );
    expect(sourceAudit.rows[0]?.count).toBe(1);
    await expect(database.exec("truncate table audit_event")).rejects.toThrow(/append-only/i);
    expect(fixture.releaseId).toBeTruthy();
  });
});
