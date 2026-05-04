-- Production operational schema for the UZ-US Situational Center dashboard.
-- Designed for Postgres/Supabase. Static data/*.ts remains the safe fallback.
-- Guiding rule: live ingestion may create snapshots and review items, but older
-- source periods must never silently replace newer approved dashboard values.

create extension if not exists pgcrypto;

create table if not exists app_user (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null,
  role text not null check (role in ('viewer', 'analyst', 'editor', 'admin', 'executive')),
  agency text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists source_record (
  id text primary key,
  name text not null,
  level text not null check (level in ('A', 'B')),
  url text,
  source_file text,
  fetched_at date not null,
  data_type text not null,
  confidence text not null default 'official',
  owner_agency text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists commitment_record (
  id text primary key,
  title text not null,
  status text not null check (status in ('done', 'progress', 'watch', 'overdue')),
  owner text not null,
  co_owners text[] not null default '{}',
  due_date date not null,
  agreed_on date not null,
  sphere text not null,
  progress_pct integer not null check (progress_pct between 0 and 100),
  linked_visit_id text,
  value_musd numeric,
  source_id text references source_record(id),
  expected_real_source text,
  is_demo boolean not null default false,
  created_by uuid references app_user(id),
  updated_by uuid references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists decision_record (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  context text not null,
  recommendation text not null,
  decision_status text not null check (decision_status in ('draft', 'ready', 'approved', 'rejected', 'deferred')),
  owner text not null,
  due_date date,
  source_ids text[] not null default '{}',
  created_by uuid references app_user(id),
  updated_by uuid references app_user(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists comment_record (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  body text not null,
  created_by uuid references app_user(id),
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references app_user(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists commitment_record_status_idx on commitment_record(status);
create index if not exists commitment_record_due_date_idx on commitment_record(due_date);
create index if not exists audit_log_entity_idx on audit_log(entity_type, entity_id);

create table if not exists source_version_policy (
  connector_id text primary key,
  source_id text not null references source_record(id),
  cadence text not null check (cadence in ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'manual')),
  owner text not null,
  min_relevance_score numeric not null default 0.55,
  allow_auto_publish boolean not null default false,
  replace_rule text not null check (replace_rule in ('never-downgrade-period', 'manual-only', 'append-only')),
  retention_days integer not null default 2555,
  dashboard_use text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ingest_run (
  id text primary key,
  scope text not null,
  mode text not null check (mode in ('dry-run', 'write')),
  started_at timestamptz not null,
  finished_at timestamptz,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists raw_source_snapshot (
  id text primary key,
  run_id text references ingest_run(id),
  connector_id text not null references source_version_policy(connector_id),
  source_id text not null references source_record(id),
  source_url text,
  fetched_at timestamptz not null,
  content_hash text not null,
  row_count integer not null default 0,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  unique (connector_id, content_hash)
);

create table if not exists normalized_observation (
  id text primary key,
  connector_id text not null references source_version_policy(connector_id),
  source_id text not null references source_record(id),
  metric_key text not null,
  label text not null,
  domain text not null,
  value_num numeric,
  value_text text,
  value_bool boolean,
  unit text not null,
  period_start date not null,
  period_end date not null,
  dimensions jsonb not null default '{}'::jsonb,
  source_url text,
  source_published_at date,
  fetched_at timestamptz not null,
  is_preliminary boolean not null default false,
  relevance_score numeric not null default 0,
  recommended_use text not null,
  quality_flags text[] not null default '{}',
  created_at timestamptz not null default now(),
  check (
    (value_num is not null)::integer +
    (value_text is not null)::integer +
    (value_bool is not null)::integer = 1
  )
);

create table if not exists published_metric (
  id text primary key,
  connector_id text not null references source_version_policy(connector_id),
  source_id text not null references source_record(id),
  metric_key text not null,
  label text not null,
  domain text not null,
  value_num numeric,
  value_text text,
  value_bool boolean,
  unit text not null,
  period_start date not null,
  period_end date not null,
  dimensions jsonb not null default '{}'::jsonb,
  source_url text,
  source_published_at date,
  fetched_at timestamptz not null,
  is_preliminary boolean not null default false,
  relevance_score numeric not null default 0,
  recommended_use text not null,
  quality_flags text[] not null default '{}',
  approved_at timestamptz not null,
  approved_by text not null,
  revision_id text not null,
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (value_num is not null)::integer +
    (value_text is not null)::integer +
    (value_bool is not null)::integer = 1
  )
);

create table if not exists data_review_queue (
  id text primary key,
  run_id text references ingest_run(id),
  connector_id text not null references source_version_policy(connector_id),
  source_id text not null references source_record(id),
  metric_identity text not null,
  metric_key text not null,
  action text not null check (
    action in ('publish-candidate', 'manual-review', 'reject-older-period', 'reject-invalid', 'ignore-irrelevant', 'duplicate-current')
  ),
  severity text not null check (severity in ('info', 'watch', 'block')),
  reason text not null,
  observation jsonb not null,
  current_metric_id text references published_metric(id),
  status text not null default 'open' check (status in ('open', 'approved', 'rejected', 'closed')),
  reviewer_id uuid references app_user(id),
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists source_version_policy_source_idx on source_version_policy(source_id);
create index if not exists raw_source_snapshot_connector_idx on raw_source_snapshot(connector_id, fetched_at desc);
create index if not exists normalized_observation_metric_idx on normalized_observation(metric_key, period_end desc);
create index if not exists normalized_observation_domain_idx on normalized_observation(domain, period_end desc);
create index if not exists published_metric_current_idx on published_metric(domain, metric_key, period_end desc) where is_current = true;
create index if not exists published_metric_dimensions_idx on published_metric using gin (dimensions);
create index if not exists data_review_queue_status_idx on data_review_queue(status, severity, created_at desc);
create index if not exists data_review_queue_metric_idx on data_review_queue(metric_identity, created_at desc);

alter table app_user enable row level security;
alter table source_record enable row level security;
alter table commitment_record enable row level security;
alter table decision_record enable row level security;
alter table comment_record enable row level security;
alter table audit_log enable row level security;
alter table source_version_policy enable row level security;
alter table ingest_run enable row level security;
alter table raw_source_snapshot enable row level security;
alter table normalized_observation enable row level security;
alter table published_metric enable row level security;
alter table data_review_queue enable row level security;

drop policy if exists "authenticated read published metrics" on published_metric;
create policy "authenticated read published metrics"
on published_metric for select
to authenticated
using (true);

drop policy if exists "authenticated read source records" on source_record;
create policy "authenticated read source records"
on source_record for select
to authenticated
using (true);

drop policy if exists "authenticated read source policies" on source_version_policy;
create policy "authenticated read source policies"
on source_version_policy for select
to authenticated
using (true);

drop policy if exists "authenticated read review queue" on data_review_queue;
create policy "authenticated read review queue"
on data_review_queue for select
to authenticated
using (true);

drop policy if exists "authenticated read ingest runs" on ingest_run;
create policy "authenticated read ingest runs"
on ingest_run for select
to authenticated
using (true);

-- Writes are intentionally performed server-side with SUPABASE_SERVICE_ROLE_KEY.
-- Do not expose the service role key in browser code. Add narrower insert/update
-- policies only after the approved identity provider and role claims are wired.
