-- Stage 2 (hokimiyat operations) migration. Run once in the Supabase SQL
-- Editor after database/schema.sql.
--
-- Adds:
--  1. roadmap_step_update — append-only journal of hokimiyat/Center marks on
--     roadmap tasks ("отметить исполнено" + "примечание"). The CURRENT state
--     of a step is the newest row that carries that field; the journal itself
--     is the audit trail. Static data/roadmaps.ts step.state remains the
--     baseline when no rows exist.
--  2. visit_material_upload — registry of files uploaded to the private
--     "visit-materials" Storage bucket for the password-gated /prepare page.
--
-- Writes are performed server-side with SUPABASE_SERVICE_ROLE_KEY only
-- (same rule as schema.sql); RLS stays enabled with no public policies.

create extension if not exists pgcrypto;

create table if not exists roadmap_step_update (
  id uuid primary key default gen_random_uuid(),
  step_id text not null,
  project_id text not null,
  region text not null check (region in ('samarkand', 'khorezm')),
  -- null = note-only update; 'reset' clears a previous manual state.
  new_state text check (new_state in ('done', 'in-progress', 'reset')),
  note text check (char_length(note) <= 2000),
  author_role text not null check (author_role in ('admin', 'samarkand', 'khorezm')),
  author_name text check (char_length(author_name) <= 120),
  created_at timestamptz not null default now(),
  check (new_state is not null or note is not null)
);

create index if not exists roadmap_step_update_step_idx on roadmap_step_update(step_id, created_at desc);
create index if not exists roadmap_step_update_region_idx on roadmap_step_update(region, created_at desc);

create table if not exists visit_material_upload (
  id uuid primary key default gen_random_uuid(),
  visit_id text not null,
  title text not null check (char_length(title) <= 200),
  material_type text not null check (material_type in ('presentation', 'speech', 'agenda', 'briefing', 'other')),
  owner_org text check (char_length(owner_org) <= 160),
  storage_path text not null unique,
  file_name text not null,
  file_size integer,
  content_type text,
  uploaded_by_role text not null check (uploaded_by_role in ('admin', 'samarkand', 'khorezm')),
  uploaded_by_name text check (char_length(uploaded_by_name) <= 120),
  created_at timestamptz not null default now()
);

create index if not exists visit_material_upload_visit_idx on visit_material_upload(visit_id, created_at desc);

alter table roadmap_step_update enable row level security;
alter table visit_material_upload enable row level security;

-- No policies on purpose: only the server (service role) reads and writes.
