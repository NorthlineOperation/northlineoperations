create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new',
  contact jsonb not null,
  property jsonb not null,
  cleaning_needs jsonb not null,
  additional_info jsonb not null,
  selected_services text[] not null default '{}',
  floor_plan_path text,
  estimated_min integer,
  estimated_max integer,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

create index if not exists quote_requests_status_submitted_at_idx
on public.quote_requests (status, submitted_at desc);

create index if not exists quote_requests_selected_services_idx
on public.quote_requests using gin (selected_services);

create or replace function public.update_quote_requests_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_quote_requests_updated_at on public.quote_requests;

create trigger set_quote_requests_updated_at
before update on public.quote_requests
for each row
execute function public.update_quote_requests_updated_at();

insert into storage.buckets (id, name, public)
values ('quote-files', 'quote-files', false)
on conflict (id) do update
set public = excluded.public;
