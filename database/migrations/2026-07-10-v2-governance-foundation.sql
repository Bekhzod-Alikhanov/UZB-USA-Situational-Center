-- V2 governed platform foundation. Apply after database/schema.sql.
--
-- This migration is intentionally additive. V1 tables remain available while
-- route-level feature flags and reconciliation gates move traffic to V2.
-- Public applications must read only immutable published projections through
-- a narrowly scoped server-side repository; this migration grants no browser
-- or anonymous access to canonical, operational, or evidence tables.

create extension if not exists pgcrypto;

create table if not exists platform_security_policy (
  singleton boolean primary key default true check (singleton),
  restricted_enabled boolean not null default false,
  confidential_files_enabled boolean not null default false,
  changed_by uuid references app_user(id),
  changed_at timestamptz not null default now(),
  change_reason text not null default 'Initial managed-environment safety lock'
);

insert into platform_security_policy (singleton)
values (true)
on conflict (singleton) do nothing;

create table if not exists organization_record (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null,
  organization_type text not null,
  agency_code text,
  region_code text,
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists team_membership (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(id),
  organization_id uuid references organization_record(id),
  permission_bundle text not null check (permission_bundle in (
    'executive_viewer', 'analyst', 'workflow_owner', 'visit_coordinator',
    'regional_lead', 'data_steward', 'publisher_approver', 'auditor',
    'platform_administrator'
  )),
  region_scope text[] not null default '{}',
  domain_scope text[] not null default '{}',
  classification_ceiling text not null default 'internal'
    check (classification_ceiling in ('public', 'internal', 'confidential', 'restricted')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create table if not exists reviewer_qualification (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app_user(id),
  qualification text not null check (qualification in (
    'native_uzbek', 'english_editor', 'domain_sme',
    'legal_compliance_sme', 'security_reviewer'
  )),
  domain text,
  valid_from date not null default current_date,
  valid_until date,
  approved_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  check (qualification <> 'domain_sme' or domain is not null),
  check (approved_by <> user_id),
  check (valid_until is null or valid_until >= valid_from),
  unique (user_id, qualification, domain, valid_from)
);

create table if not exists source_artifact (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references source_record(id),
  original_language text not null,
  locator text,
  content_hash text not null,
  object_key text,
  media_type text,
  captured_at timestamptz not null,
  classification text not null default 'public'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  immutable boolean not null default true check (immutable),
  created_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  unique (source_id, content_hash)
);

create table if not exists source_text_original (
  id uuid primary key default gen_random_uuid(),
  source_artifact_id uuid not null references source_artifact(id),
  language text not null,
  value text not null,
  locator text,
  content_hash text not null,
  created_at timestamptz not null default now(),
  unique (source_artifact_id, content_hash)
);

create table if not exists fact_claim (
  id uuid primary key default gen_random_uuid(),
  source_artifact_id uuid not null references source_artifact(id),
  domain text not null,
  claim_key text not null,
  value jsonb not null,
  unit text,
  period_start date,
  period_end date,
  as_of date not null,
  methodology text not null,
  locator text,
  confidence text not null check (confidence in (
    'verified_official', 'company_confirmed', 'media_reported',
    'internal_unverified', 'source_needed', 'illustrative_demo'
  )),
  classification text not null default 'public'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  quality_flags text[] not null default '{}',
  created_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  check (period_end is null or period_start is null or period_end >= period_start)
);

create table if not exists translation_bundle (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  revision integer not null check (revision > 0),
  required_fields text[] not null check (cardinality(required_fields) > 0),
  submitted_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, revision)
);

create table if not exists translation_revision (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid not null references translation_bundle(id),
  field_name text not null,
  locale text not null check (locale in ('en', 'uz-latn')),
  value text not null check (length(btrim(value)) > 0),
  state text not null default 'draft' check (state in ('draft', 'reviewed', 'approved')),
  reviewer_id uuid references app_user(id),
  approved_by uuid references app_user(id),
  reviewed_at timestamptz,
  approved_at timestamptz,
  created_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bundle_id, field_name, locale),
  check (state <> 'reviewed' or (reviewer_id is not null and reviewed_at is not null)),
  check (state <> 'approved' or (approved_by is not null and approved_at is not null)),
  check (approved_by is null or approved_by <> created_by)
);

create table if not exists publication_release (
  id uuid primary key default gen_random_uuid(),
  release_key text not null unique,
  target_surface text not null check (target_surface in ('public', 'control')),
  state text not null default 'draft' check (state in (
    'draft', 'in_review', 'approved', 'published', 'superseded',
    'rejected', 'archived'
  )),
  notes text,
  submitted_by uuid not null references app_user(id),
  approved_by uuid references app_user(id),
  published_at timestamptz,
  superseded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (approved_by is null or approved_by <> submitted_by),
  check (state <> 'published' or (approved_by is not null and published_at is not null))
);

create table if not exists publication_release_review (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references publication_release(id),
  review_kind text not null check (review_kind in (
    'domain', 'bilingual_en', 'bilingual_uz', 'publication'
  )),
  review_domain text not null default 'all',
  decision text not null check (decision in ('approved', 'changes_requested', 'rejected')),
  reviewer_id uuid not null references app_user(id),
  reason text not null,
  created_at timestamptz not null default now(),
  check (
    (review_kind = 'domain' and review_domain <> 'all')
    or (review_kind <> 'domain' and review_domain = 'all')
  ),
  unique (release_id, review_kind, review_domain, reviewer_id)
);

create table if not exists publication_projection (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references publication_release(id),
  projection_key text not null,
  domain text not null,
  route_path text not null,
  projection_version integer not null check (projection_version > 0),
  payload jsonb not null,
  content_hash text not null,
  classification text not null default 'public'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  confidence text not null check (confidence in (
    'verified_official', 'company_confirmed', 'media_reported',
    'internal_unverified', 'source_needed', 'illustrative_demo'
  )),
  freshness text not null check (freshness in ('current', 'watch', 'stale')),
  data_mode text not null default 'published' check (data_mode in ('published', 'static-fallback')),
  quote_safe boolean not null default false,
  headline boolean not null default false,
  period_label text not null,
  as_of date not null,
  methodology text not null,
  quality_flags text[] not null default '{}',
  translation_bundle_id uuid references translation_bundle(id),
  created_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  unique (release_id, projection_key),
  check (not (quote_safe or headline) or confidence = 'verified_official'),
  check (not headline or classification = 'public')
);

create table if not exists projection_fact_claim (
  projection_id uuid not null references publication_projection(id) on delete cascade,
  fact_claim_id uuid not null references fact_claim(id),
  primary key (projection_id, fact_claim_id)
);

create table if not exists visit_record (
  id uuid primary key default gen_random_uuid(),
  stable_key text not null unique,
  title_bundle_id uuid not null references translation_bundle(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null check (status in ('planned', 'active', 'completed', 'cancelled', 'archived')),
  health text not null check (health in ('on_track', 'watch', 'at_risk', 'blocked', 'unavailable')),
  accountable_owner_id uuid not null references app_user(id),
  next_action jsonb not null,
  due_at timestamptz not null,
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  record_version integer not null default 1 check (record_version > 0),
  created_by uuid not null references app_user(id),
  updated_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at >= starts_at)
);

create table if not exists meeting_record (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references visit_record(id),
  title_bundle_id uuid not null references translation_bundle(id),
  starts_at timestamptz not null,
  ends_at timestamptz,
  accountable_owner_id uuid not null references app_user(id),
  next_action jsonb not null,
  due_at timestamptz not null,
  health text not null check (health in ('on_track', 'watch', 'at_risk', 'blocked', 'unavailable')),
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  record_version integer not null default 1 check (record_version > 0),
  created_by uuid not null references app_user(id),
  updated_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create table if not exists relation_object_record (
  id uuid primary key default gen_random_uuid(),
  object_kind text not null check (object_kind in ('agreement', 'project')),
  stable_key text not null unique,
  title_bundle_id uuid not null references translation_bundle(id),
  meeting_id uuid references meeting_record(id),
  source_claim_id uuid references fact_claim(id),
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  created_by uuid not null references app_user(id),
  updated_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists governed_commitment (
  id uuid primary key default gen_random_uuid(),
  stable_key text not null unique,
  relation_object_id uuid references relation_object_record(id),
  title_bundle_id uuid not null references translation_bundle(id),
  health text not null check (health in ('on_track', 'watch', 'at_risk', 'blocked', 'unavailable')),
  next_action jsonb not null,
  accountable_owner_id uuid not null references app_user(id),
  due_at timestamptz not null,
  status text not null check (status in ('planned', 'in_progress', 'awaiting_evidence', 'awaiting_approval', 'completed', 'cancelled')),
  completion_policy jsonb not null default '{}'::jsonb,
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  record_version integer not null default 1 check (record_version > 0),
  created_by uuid not null references app_user(id),
  updated_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists action_record (
  id uuid primary key default gen_random_uuid(),
  commitment_id uuid not null references governed_commitment(id),
  title_bundle_id uuid not null references translation_bundle(id),
  health text not null check (health in ('on_track', 'watch', 'at_risk', 'blocked', 'unavailable')),
  next_action jsonb not null,
  accountable_owner_id uuid not null references app_user(id),
  due_at timestamptz not null,
  status text not null check (status in ('todo', 'in_progress', 'blocked', 'submitted', 'approved', 'completed', 'cancelled')),
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  record_version integer not null default 1 check (record_version > 0),
  created_by uuid not null references app_user(id),
  updated_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dependency_record (
  id uuid primary key default gen_random_uuid(),
  action_id uuid not null references action_record(id),
  depends_on_action_id uuid not null references action_record(id),
  status text not null check (status in ('open', 'satisfied', 'waived')),
  owner_id uuid not null references app_user(id),
  due_at timestamptz,
  created_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  check (action_id <> depends_on_action_id),
  unique (action_id, depends_on_action_id)
);

create table if not exists blocker_record (
  id uuid primary key default gen_random_uuid(),
  action_id uuid not null references action_record(id),
  summary_bundle_id uuid not null references translation_bundle(id),
  severity text not null check (severity in ('watch', 'high', 'critical')),
  owner_id uuid not null references app_user(id),
  due_at timestamptz not null,
  status text not null check (status in ('open', 'mitigating', 'resolved', 'accepted')),
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  created_by uuid not null references app_user(id),
  updated_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists risk_record (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  summary_bundle_id uuid not null references translation_bundle(id),
  likelihood smallint not null check (likelihood between 1 and 5),
  impact smallint not null check (impact between 1 and 5),
  owner_id uuid not null references app_user(id),
  next_review_at timestamptz not null,
  status text not null check (status in ('open', 'mitigating', 'accepted', 'closed')),
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  created_by uuid not null references app_user(id),
  updated_by uuid not null references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists evidence_record (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  storage_key text not null unique,
  file_name text not null,
  media_type text not null,
  byte_size bigint not null check (byte_size > 0),
  content_hash text not null,
  quarantine_status text not null default 'pending'
    check (quarantine_status in ('pending', 'quarantined', 'clean', 'rejected')),
  malware_status text not null default 'pending'
    check (malware_status in ('pending', 'clean', 'infected', 'error')),
  dlp_status text not null default 'pending'
    check (dlp_status in ('pending', 'clear', 'flagged', 'error')),
  object_lock_until timestamptz,
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  submitted_by uuid not null references app_user(id),
  created_at timestamptz not null default now()
);

create table if not exists approval_record (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  requested_by uuid not null references app_user(id),
  approver_id uuid not null references app_user(id),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'changes_requested', 'cancelled')),
  reason text not null,
  evidence_ids uuid[] not null default '{}',
  decided_at timestamptz,
  expires_at timestamptz,
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requested_by <> approver_id),
  check (status = 'pending' or decided_at is not null)
);

create table if not exists escalation_record (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  level text not null check (level in ('owner', 'director', 'executive', 'interagency')),
  escalated_by uuid not null references app_user(id),
  assigned_to uuid not null references app_user(id),
  reason text not null,
  due_at timestamptz not null,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved', 'cancelled')),
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists decision_request_record (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  title_bundle_id uuid not null references translation_bundle(id),
  requested_by uuid not null references app_user(id),
  accountable_owner_id uuid not null references app_user(id),
  due_at timestamptz not null,
  status text not null default 'draft' check (status in ('draft', 'ready', 'approved', 'rejected', 'deferred')),
  classification text not null default 'internal'
    check (classification in ('public', 'internal', 'confidential', 'restricted')),
  record_version integer not null default 1 check (record_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists notification_record (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references app_user(id),
  locale text not null check (locale in ('en', 'uz-latn')),
  channel text not null check (channel in ('in_app', 'official_email')),
  localized_summary jsonb not null,
  authenticated_path text not null,
  classification text not null default 'internal'
    check (classification in ('public', 'internal')),
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'read')),
  available_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_event (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references app_user(id),
  delegated_actor_id uuid references app_user(id),
  request_id text not null,
  session_id text not null,
  action text not null,
  reason text not null,
  entity_type text not null,
  entity_id text not null,
  before_hash text,
  after_hash text,
  classification text not null check (classification in ('public', 'internal', 'confidential', 'restricted')),
  safe_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists outbox_event (
  id uuid primary key default gen_random_uuid(),
  aggregate_type text not null,
  aggregate_id text not null,
  event_type text not null,
  payload jsonb not null,
  classification text not null check (classification in ('public', 'internal')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'delivered', 'failed', 'dead_letter')),
  attempts integer not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  delivered_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

create or replace function guard_restricted_classification()
returns trigger
language plpgsql
as $$
declare
  enabled boolean;
begin
  if new.classification = 'restricted' then
    select restricted_enabled into enabled
    from platform_security_policy
    where singleton = true;

    if coalesce(enabled, false) = false then
      raise exception 'Restricted records are disabled until an accredited enclave is approved.';
    end if;
  end if;
  return new;
end;
$$;

create or replace function guard_evidence_classification()
returns trigger
language plpgsql
as $$
declare
  confidential_enabled boolean;
begin
  if new.classification = 'confidential' then
    select confidential_files_enabled into confidential_enabled
    from platform_security_policy
    where singleton = true;

    if coalesce(confidential_enabled, false) = false then
      raise exception 'Confidential evidence is disabled until the launch gate is approved.';
    end if;
  end if;
  return new;
end;
$$;

create or replace function prevent_append_only_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception '% is append-only; % is not permitted.', tg_table_name, tg_op;
end;
$$;

create or replace function lock_publication_release_ids(release_ids uuid[])
returns void
language plpgsql
as $$
declare
  release_id uuid;
begin
  for release_id in
    select distinct candidate
    from unnest(release_ids) as candidate
    where candidate is not null
    order by candidate
  loop
    perform 1
    from publication_release
    where id = release_id
    for update;
  end loop;
end;
$$;

create or replace function public_payload_forbidden_key(document jsonb)
returns text
language plpgsql
immutable
as $$
declare
  member record;
  item jsonb;
  nested_key text;
begin
  if jsonb_typeof(document) = 'object' then
    for member in select key, value from jsonb_each(document) loop
      if lower(member.key) = any(array[
        'owner', 'owners', 'note', 'notes', 'blocker', 'blockers',
        'dependency', 'dependencies', 'evidence', 'approval', 'approvals',
        'escalation', 'escalations', 'comment', 'comments', 'internal',
        'confidential', 'private', 'accountableowner', 'nextaction'
      ]) then
        return member.key;
      end if;
      nested_key := public_payload_forbidden_key(member.value);
      if nested_key is not null then return nested_key; end if;
    end loop;
  elsif jsonb_typeof(document) = 'array' then
    for item in select value from jsonb_array_elements(document) loop
      nested_key := public_payload_forbidden_key(item);
      if nested_key is not null then return nested_key; end if;
    end loop;
  end if;
  return null;
end;
$$;

create or replace function validate_public_projection_payload()
returns trigger
language plpgsql
as $$
declare
  allowed_keys text[];
  invalid_key text;
begin
  if new.classification <> 'public' then return new; end if;

  allowed_keys := case new.domain
    when 'executive' then array['selectionPolicy', 'headlineMetrics', 'disclosure']
    when 'trade' then array['selectionPolicy', 'currency', 'unit', 'summary', 'series', 'methodology']
    when 'investments' then array['selectionPolicy', 'summary', 'projects']
    when 'roadmaps' then array['selectionPolicy', 'summary', 'regions', 'disclosure']
    else null
  end;
  if allowed_keys is null then
    raise exception 'Unsupported public projection payload domain: %.', new.domain;
  end if;

  select key into invalid_key
  from jsonb_object_keys(new.payload) as key
  where not (key = any(allowed_keys))
  limit 1;
  if invalid_key is not null then
    raise exception 'Invalid public projection payload field: %.', invalid_key;
  end if;

  invalid_key := public_payload_forbidden_key(new.payload);
  if invalid_key is not null then
    raise exception 'Forbidden public projection payload field: %.', invalid_key;
  end if;
  return new;
end;
$$;

create or replace function protect_published_projection()
returns trigger
language plpgsql
as $$
declare
  existing_release_state text;
  destination_release_state text;
  release_ids uuid[] := array[]::uuid[];
begin
  if tg_op in ('UPDATE', 'DELETE') then release_ids := array_append(release_ids, old.release_id); end if;
  if tg_op in ('INSERT', 'UPDATE') then release_ids := array_append(release_ids, new.release_id); end if;
  perform lock_publication_release_ids(release_ids);

  if tg_op in ('UPDATE', 'DELETE') then
    select state into existing_release_state
    from publication_release
    where id = old.release_id;

    if existing_release_state in ('published', 'superseded') then
      raise exception 'Existing published projection rows are immutable.';
    end if;
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    select state into destination_release_state
    from publication_release
    where id = new.release_id;

    if destination_release_state in ('published', 'superseded') then
      raise exception 'Cannot add projection rows to a published release.';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create or replace function protect_published_projection_lineage()
returns trigger
language plpgsql
as $$
declare
  projection_ids uuid[] := array[]::uuid[];
  release_ids uuid[];
begin
  if tg_op in ('UPDATE', 'DELETE') then projection_ids := array_append(projection_ids, old.projection_id); end if;
  if tg_op in ('INSERT', 'UPDATE') then projection_ids := array_append(projection_ids, new.projection_id); end if;
  select array_agg(distinct release_id order by release_id) into release_ids
  from publication_projection where id = any(projection_ids);
  perform lock_publication_release_ids(coalesce(release_ids, array[]::uuid[]));

  if tg_op in ('UPDATE', 'DELETE') and exists (
    select 1
    from publication_projection projection
    join publication_release release on release.id = projection.release_id
    where projection.id = old.projection_id
      and release.state in ('published', 'superseded')
  ) then
    raise exception 'Published projection lineage is immutable.';
  end if;

  if tg_op in ('INSERT', 'UPDATE') and exists (
    select 1
    from publication_projection projection
    join publication_release release on release.id = projection.release_id
    where projection.id = new.projection_id
      and release.state in ('published', 'superseded')
  ) then
    raise exception 'Published projection lineage is immutable.';
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function protect_published_fact_claim()
returns trigger
language plpgsql
as $$
declare
  release_ids uuid[];
begin
  select array_agg(distinct release.id order by release.id) into release_ids
  from projection_fact_claim lineage
  join publication_projection projection on projection.id = lineage.projection_id
  join publication_release release on release.id = projection.release_id
  where lineage.fact_claim_id = old.id;
  perform lock_publication_release_ids(coalesce(release_ids, array[]::uuid[]));

  if exists (
    select 1
    from projection_fact_claim lineage
    join publication_projection projection on projection.id = lineage.projection_id
    join publication_release release on release.id = projection.release_id
    where lineage.fact_claim_id = old.id
      and release.state in ('published', 'superseded')
  ) then
    raise exception 'Published fact claims are immutable.';
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function protect_published_translation()
returns trigger
language plpgsql
as $$
declare
  existing_bundle_id uuid;
  destination_bundle_id uuid;
  release_ids uuid[];
begin
  if tg_op in ('UPDATE', 'DELETE') then
    existing_bundle_id := (
      case when tg_table_name = 'translation_bundle' then to_jsonb(old) ->> 'id' else to_jsonb(old) ->> 'bundle_id' end
    )::uuid;
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    destination_bundle_id := (
      case when tg_table_name = 'translation_bundle' then to_jsonb(new) ->> 'id' else to_jsonb(new) ->> 'bundle_id' end
    )::uuid;
  end if;
  select array_agg(distinct release.id order by release.id) into release_ids
  from publication_projection projection
  join publication_release release on release.id = projection.release_id
  where projection.translation_bundle_id = any(array_remove(array[existing_bundle_id, destination_bundle_id], null));
  perform lock_publication_release_ids(coalesce(release_ids, array[]::uuid[]));

  if tg_op in ('UPDATE', 'DELETE') then
    if exists (
      select 1
      from publication_projection projection
      join publication_release release on release.id = projection.release_id
      where projection.translation_bundle_id = existing_bundle_id
        and release.state in ('published', 'superseded')
    ) then
      raise exception 'Published translation bundles are immutable.';
    end if;
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    if exists (
      select 1
      from publication_projection projection
      join publication_release release on release.id = projection.release_id
      where projection.translation_bundle_id = destination_bundle_id
        and release.state in ('published', 'superseded')
    ) then
      raise exception 'Published translation bundles are immutable.';
    end if;
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function protect_published_release_review()
returns trigger
language plpgsql
as $$
declare
  existing_release_id uuid;
  destination_release_id uuid;
begin
  if tg_op in ('UPDATE', 'DELETE') then existing_release_id := old.release_id; end if;
  if tg_op in ('INSERT', 'UPDATE') then destination_release_id := new.release_id; end if;
  perform lock_publication_release_ids(array_remove(array[existing_release_id, destination_release_id], null));

  if tg_op in ('UPDATE', 'DELETE') then
    if exists (
      select 1 from publication_release
      where id = existing_release_id and state in ('published', 'superseded')
    ) then
      raise exception 'Published release reviews are immutable.';
    end if;
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    if exists (
      select 1 from publication_release
      where id = destination_release_id and state in ('published', 'superseded')
    ) then
      raise exception 'Published release reviews are immutable.';
    end if;
  end if;

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function validate_publication_release_transition()
returns trigger
language plpgsql
as $$
declare
  required_review text;
  missing_domain text;
begin
  if tg_op = 'INSERT' then
    if new.state <> 'draft' then
      raise exception 'New publication releases must start in draft state.';
    end if;
    if new.approved_by is not null or new.published_at is not null or new.superseded_at is not null then
      raise exception 'New publication releases cannot contain approval or publication timestamps.';
    end if;
    new.updated_at := now();
    return new;
  end if;

  if old.state in ('superseded', 'archived') then
    raise exception 'Terminal publication releases are immutable.';
  end if;

  if old.state = 'published' then
    if new.state <> 'superseded' then
      raise exception 'A published release may only transition to superseded.';
    end if;
    if (to_jsonb(new) - 'state' - 'superseded_at' - 'updated_at') <>
       (to_jsonb(old) - 'state' - 'superseded_at' - 'updated_at') then
      raise exception 'Published release content and approvals are immutable.';
    end if;
    new.superseded_at := coalesce(new.superseded_at, now());
    return new;
  end if;

  if new.state = 'published' and old.state <> 'approved' then
    raise exception 'Only an approved release may be published.';
  end if;

  if new.state = 'published' then
    if new.approved_by is null or new.approved_by = new.submitted_by then
      raise exception 'Publication requires four-eyes approval.';
    end if;

    if not exists (select 1 from publication_projection where release_id = new.id) then
      raise exception 'Publication release has no projections.';
    end if;

    foreach required_review in array array['bilingual_en', 'bilingual_uz', 'publication'] loop
      if not exists (
        select 1
        from publication_release_review
        where release_id = new.id
          and review_kind = required_review
          and decision = 'approved'
          and reviewer_id <> new.submitted_by
      ) then
        raise exception 'Missing independent % review.', required_review;
      end if;
    end loop;

    if (
      select count(distinct reviewer_id)
      from publication_release_review
      where release_id = new.id and decision = 'approved'
    ) < 2 then
      raise exception 'Publication requires at least two independent reviewers.';
    end if;

    if not exists (
      select 1
      from publication_release_review review
      join reviewer_qualification qualification
        on qualification.user_id = review.reviewer_id
       and qualification.qualification = 'native_uzbek'
       and qualification.valid_from <= current_date
       and (qualification.valid_until is null or qualification.valid_until >= current_date)
      where review.release_id = new.id
        and review.review_kind = 'bilingual_uz'
        and review.decision = 'approved'
    ) then
      raise exception 'Uzbek Latin publication requires an active native Uzbek reviewer qualification.';
    end if;

    select projected_domain.domain into missing_domain
      from (
        select distinct domain
        from publication_projection
        where release_id = new.id
      ) projected_domain
      where not exists (
        select 1
        from publication_release_review review
        join reviewer_qualification qualification
          on qualification.user_id = review.reviewer_id
         and qualification.qualification = 'domain_sme'
         and qualification.domain = projected_domain.domain
         and qualification.valid_from <= current_date
         and (qualification.valid_until is null or qualification.valid_until >= current_date)
        where review.release_id = new.id
          and review.review_kind = 'domain'
          and review.review_domain = projected_domain.domain
          and review.decision = 'approved'
          and review.reviewer_id <> new.submitted_by
      )
    limit 1;

    if missing_domain is not null then
      raise exception 'Publication requires an active domain SME reviewer qualification for %.', missing_domain;
    end if;

    if new.target_surface = 'public' and exists (
      select 1
      from publication_projection
      where release_id = new.id
        and classification <> 'public'
    ) then
      raise exception 'Public releases may contain only public projections.';
    end if;

    if exists (
      select 1
      from publication_projection p
      where p.release_id = new.id
        and not exists (
          select 1 from projection_fact_claim l where l.projection_id = p.id
        )
    ) then
      raise exception 'Every projection requires source claim lineage.';
    end if;

    if exists (
      select 1
      from publication_projection p
      where p.release_id = new.id
        and (p.quote_safe or p.headline)
        and (
          p.confidence <> 'verified_official'
          or cardinality(p.quality_flags) > 0
          or exists (
            select 1
            from projection_fact_claim l
            join fact_claim c on c.id = l.fact_claim_id
            where l.projection_id = p.id
              and (c.confidence <> 'verified_official' or cardinality(c.quality_flags) > 0)
          )
        )
    ) then
      raise exception 'Quote-safe headlines require clean verified-official lineage.';
    end if;

    if exists (
      select 1
      from publication_projection p
      join translation_bundle b on b.id = p.translation_bundle_id
      cross join unnest(b.required_fields) as required_field(field_name)
      cross join (values ('en'), ('uz-latn')) as required_locale(locale)
      where p.release_id = new.id
        and not exists (
          select 1
          from translation_revision tr
          where tr.bundle_id = b.id
            and tr.field_name = required_field.field_name
            and tr.locale = required_locale.locale
            and tr.state = 'approved'
        )
    ) then
      raise exception 'Every required English and Uzbek Latin field must be independently approved.';
    end if;

    if exists (
      select 1 from publication_projection
      where release_id = new.id and translation_bundle_id is null
    ) then
      raise exception 'Every publication projection requires an approved bilingual bundle.';
    end if;

    new.published_at := coalesce(new.published_at, now());
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create or replace function audit_and_enqueue_change()
returns trigger
language plpgsql
as $$
declare
  record_json jsonb;
  entity_key text;
  actor uuid;
  delegated_actor uuid;
  request_key text;
  session_key text;
  mutation_reason text;
  safe_classification text;
  audit_id uuid;
begin
  record_json := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  entity_key := coalesce(record_json ->> 'id', record_json ->> 'stable_key', record_json ->> 'singleton', 'unknown');
  actor := nullif(current_setting('app.actor_id', true), '')::uuid;
  delegated_actor := nullif(current_setting('app.delegated_actor_id', true), '')::uuid;
  request_key := nullif(current_setting('app.request_id', true), '');
  session_key := nullif(current_setting('app.session_id', true), '');
  mutation_reason := nullif(current_setting('app.reason', true), '');
  safe_classification := coalesce(record_json ->> 'classification', 'internal');

  if actor is null or request_key is null or session_key is null or mutation_reason is null then
    raise exception 'Audited writes require actor, request, session, and reason context.';
  end if;

  insert into audit_event (
    actor_id, delegated_actor_id, request_id, session_id, action, reason,
    entity_type, entity_id, before_hash, after_hash, classification, safe_metadata
  ) values (
    actor,
    delegated_actor,
    request_key,
    session_key,
    lower(tg_op),
    mutation_reason,
    tg_table_name,
    entity_key,
    case when tg_op in ('UPDATE', 'DELETE') then encode(digest(to_jsonb(old)::text, 'sha256'), 'hex') end,
    case when tg_op in ('INSERT', 'UPDATE') then encode(digest(to_jsonb(new)::text, 'sha256'), 'hex') end,
    safe_classification,
    jsonb_build_object('requestId', request_key, 'table', tg_table_name)
  ) returning id into audit_id;

  insert into outbox_event (
    aggregate_type, aggregate_id, event_type, payload, classification
  ) values (
    tg_table_name,
    entity_key,
    tg_table_name || '.' || lower(tg_op),
    jsonb_build_object('auditEventId', audit_id, 'entityId', entity_key, 'requestId', request_key),
    case when safe_classification = 'public' then 'public' else 'internal' end
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

drop trigger if exists audit_event_append_only on audit_event;
create trigger audit_event_append_only
before update or delete on audit_event
for each row execute function prevent_append_only_mutation();

drop trigger if exists audit_event_truncate_guard on audit_event;
create trigger audit_event_truncate_guard
before truncate on audit_event
for each statement execute function prevent_append_only_mutation();

revoke truncate on audit_event from public;

drop trigger if exists source_artifact_append_only on source_artifact;
create trigger source_artifact_append_only
before update or delete on source_artifact
for each row execute function prevent_append_only_mutation();

drop trigger if exists source_text_original_append_only on source_text_original;
create trigger source_text_original_append_only
before update or delete on source_text_original
for each row execute function prevent_append_only_mutation();

drop trigger if exists publication_release_transition on publication_release;
create trigger publication_release_transition
before insert or update on publication_release
for each row execute function validate_publication_release_transition();

drop trigger if exists publication_projection_immutable on publication_projection;
create trigger publication_projection_immutable
before insert or update or delete on publication_projection
for each row execute function protect_published_projection();

drop trigger if exists publication_projection_payload_guard on publication_projection;
create trigger publication_projection_payload_guard
before insert or update on publication_projection
for each row execute function validate_public_projection_payload();

drop trigger if exists projection_fact_claim_immutable on projection_fact_claim;
create trigger projection_fact_claim_immutable
before insert or update or delete on projection_fact_claim
for each row execute function protect_published_projection_lineage();

drop trigger if exists fact_claim_publication_immutable on fact_claim;
create trigger fact_claim_publication_immutable
before update or delete on fact_claim
for each row execute function protect_published_fact_claim();

drop trigger if exists translation_bundle_publication_immutable on translation_bundle;
create trigger translation_bundle_publication_immutable
before insert or update or delete on translation_bundle
for each row execute function protect_published_translation();

drop trigger if exists translation_revision_publication_immutable on translation_revision;
create trigger translation_revision_publication_immutable
before insert or update or delete on translation_revision
for each row execute function protect_published_translation();

drop trigger if exists publication_release_review_immutable on publication_release_review;
create trigger publication_release_review_immutable
before insert or update or delete on publication_release_review
for each row execute function protect_published_release_review();

drop trigger if exists evidence_confidential_gate on evidence_record;
create trigger evidence_confidential_gate
before insert or update on evidence_record
for each row execute function guard_evidence_classification();

drop trigger if exists source_artifact_confidential_gate on source_artifact;
create trigger source_artifact_confidential_gate
before insert or update on source_artifact
for each row execute function guard_evidence_classification();

drop trigger if exists app_user_security_audit on app_user;
create trigger app_user_security_audit
after update or delete on app_user
for each row execute function audit_and_enqueue_change();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'organization_record', 'source_artifact', 'fact_claim', 'publication_projection',
    'visit_record', 'meeting_record', 'relation_object_record', 'governed_commitment',
    'action_record', 'blocker_record', 'risk_record', 'evidence_record',
    'approval_record', 'escalation_record', 'decision_request_record'
  ] loop
    execute format('drop trigger if exists %I on %I', table_name || '_restricted_guard', table_name);
    execute format(
      'create trigger %I before insert or update on %I for each row execute function guard_restricted_classification()',
      table_name || '_restricted_guard',
      table_name
    );
  end loop;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'platform_security_policy', 'source_record', 'organization_record', 'team_membership', 'reviewer_qualification', 'source_artifact', 'source_text_original',
    'fact_claim', 'translation_bundle', 'translation_revision', 'publication_release',
    'publication_release_review', 'publication_projection', 'projection_fact_claim',
    'visit_record', 'meeting_record', 'relation_object_record', 'governed_commitment',
    'action_record', 'dependency_record', 'blocker_record', 'risk_record',
    'evidence_record', 'approval_record', 'escalation_record',
    'decision_request_record', 'notification_record'
  ] loop
    execute format('drop trigger if exists %I on %I', table_name || '_audit_outbox', table_name);
    execute format(
      'create trigger %I after insert or update or delete on %I for each row execute function audit_and_enqueue_change()',
      table_name || '_audit_outbox',
      table_name
    );
  end loop;
end;
$$;

create index if not exists team_membership_user_idx on team_membership(user_id, ends_at);
create index if not exists reviewer_qualification_user_idx on reviewer_qualification(user_id, qualification, valid_until);
create index if not exists source_artifact_source_idx on source_artifact(source_id, captured_at desc);
create index if not exists fact_claim_domain_idx on fact_claim(domain, as_of desc);
create index if not exists translation_revision_bundle_idx on translation_revision(bundle_id, locale, state);
create index if not exists publication_release_state_idx on publication_release(target_surface, state, published_at desc);
create index if not exists publication_projection_release_idx on publication_projection(release_id, domain, projection_key);
create index if not exists visit_record_timeline_idx on visit_record(starts_at, status);
create index if not exists action_record_owner_idx on action_record(accountable_owner_id, status, due_at);
create index if not exists action_record_commitment_idx on action_record(commitment_id, status);
create index if not exists blocker_record_action_idx on blocker_record(action_id, status, severity);
create index if not exists evidence_record_entity_idx on evidence_record(entity_type, entity_id, created_at desc);
create index if not exists approval_record_approver_idx on approval_record(approver_id, status, created_at desc);
create index if not exists escalation_record_assignee_idx on escalation_record(assigned_to, status, due_at);
create index if not exists notification_record_recipient_idx on notification_record(recipient_id, status, available_at);
create index if not exists audit_event_entity_idx on audit_event(entity_type, entity_id, created_at desc);
create index if not exists audit_event_request_idx on audit_event(request_id, created_at desc);
create index if not exists outbox_event_delivery_idx on outbox_event(status, available_at, created_at);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'platform_security_policy', 'organization_record', 'team_membership', 'reviewer_qualification',
    'source_artifact', 'source_text_original', 'fact_claim', 'translation_bundle',
    'translation_revision', 'publication_release', 'publication_release_review',
    'publication_projection', 'projection_fact_claim', 'visit_record', 'meeting_record',
    'relation_object_record', 'governed_commitment', 'action_record',
    'dependency_record', 'blocker_record', 'risk_record', 'evidence_record',
    'approval_record', 'escalation_record', 'decision_request_record',
    'notification_record', 'audit_event', 'outbox_event'
  ] loop
    execute format('alter table %I enable row level security', table_name);
  end loop;
end;
$$;

-- No public/authenticated policies are created here. The public deployment must
-- use a dedicated repository that can select only approved, published projection
-- rows. Internal access policies are added only after approved IdP claims and the
-- full authorization matrix are connected and tested.
