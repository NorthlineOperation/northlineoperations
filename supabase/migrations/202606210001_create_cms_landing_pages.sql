create table if not exists public.cms_landing_pages (
  slug text primary key,
  content jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.cms_landing_pages enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_cms_landing_pages_updated_at on public.cms_landing_pages;

create trigger set_cms_landing_pages_updated_at
before update on public.cms_landing_pages
for each row
execute function public.set_updated_at();

create index if not exists cms_landing_pages_updated_at_idx
on public.cms_landing_pages (updated_at desc);

-- Admin access is enforced in Next.js route handlers with Supabase Auth.
-- RLS remains enabled; service-role server code bypasses RLS for controlled reads/writes.

insert into storage.buckets (id, name, public)
values ('cms-files', 'cms-files', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Admin CMS storage access" on storage.objects;

create policy "Admin CMS storage access"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'cms-files'
  and (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    or auth.jwt() -> 'app_metadata' -> 'roles' ? 'admin'
  )
)
with check (
  bucket_id = 'cms-files'
  and (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    or auth.jwt() -> 'app_metadata' -> 'roles' ? 'admin'
  )
);
