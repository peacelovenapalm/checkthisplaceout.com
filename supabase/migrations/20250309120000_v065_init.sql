-- v0.65 core schema for CheckThisPlaceOut.com

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  handle text,
  role text not null check (role in ('admin', 'bartender')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description_short text,
  story text,
  signature_move text,
  best_time text,
  warnings text[],
  area text,
  categories text[] not null default '{}',
  vibes text[] not null default '{}',
  price text not null default '' check (price in ('', '$', '$$', '$$$')),
  lat numeric,
  lng numeric,
  links jsonb not null default '{}'::jsonb,
  images jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'approved', 'rejected', 'archived')),
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete cascade,
  vote text not null check (vote in ('yes', 'no')),
  created_at timestamptz not null default now(),
  unique (place_id, voter_id)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_places_updated_at
before update on public.places
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.votes enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

-- Profiles policies

drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles
  for select
  using (id = auth.uid());

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles
  for select
  using (public.is_admin());

drop policy if exists "Admins can insert profiles" on public.profiles;
create policy "Admins can insert profiles"
  on public.profiles
  for insert
  with check (public.is_admin());

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
  on public.profiles
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Places policies

drop policy if exists "Public can read approved places" on public.places;
create policy "Public can read approved places"
  on public.places
  for select
  using (status = 'approved');

drop policy if exists "Members can read submitted and own drafts" on public.places;
create policy "Members can read submitted and own drafts"
  on public.places
  for select
  using (
    exists (
      select 1
      from public.profiles as p
      where p.id = auth.uid()
        and p.is_active = true
        and p.role in ('admin', 'bartender')
    )
    and (
      status = 'approved'
      or status = 'submitted'
      or (created_by = auth.uid() and status in ('draft', 'rejected'))
    )
  );

drop policy if exists "Members can insert own drafts" on public.places;
create policy "Members can insert own drafts"
  on public.places
  for insert
  with check (
    exists (
      select 1
      from public.profiles as p
      where p.id = auth.uid()
        and p.is_active = true
        and p.role in ('admin', 'bartender')
    )
    and created_by = auth.uid()
    and status = 'draft'
  );

drop policy if exists "Members can update own drafts and submissions" on public.places;
create policy "Members can update own drafts and submissions"
  on public.places
  for update
  using (
    exists (
      select 1
      from public.profiles as p
      where p.id = auth.uid()
        and p.is_active = true
        and p.role in ('admin', 'bartender')
    )
    and created_by = auth.uid()
    and status in ('draft', 'submitted')
  )
  with check (
    exists (
      select 1
      from public.profiles as p
      where p.id = auth.uid()
        and p.is_active = true
        and p.role in ('admin', 'bartender')
    )
    and created_by = auth.uid()
    and status in ('draft', 'submitted')
  );

drop policy if exists "Admins can manage places" on public.places;
create policy "Admins can manage places"
  on public.places
  for all
  using (
    exists (
      select 1
      from public.profiles as p
      where p.id = auth.uid()
        and p.role = 'admin'
        and p.is_active = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles as p
      where p.id = auth.uid()
        and p.role = 'admin'
        and p.is_active = true
    )
  );

-- Votes policies

drop policy if exists "Members can read votes" on public.votes;
create policy "Members can read votes"
  on public.votes
  for select
  using (
    exists (
      select 1
      from public.profiles as p
      where p.id = auth.uid()
        and p.is_active = true
        and p.role in ('admin', 'bartender')
    )
  );

drop policy if exists "Members can vote on submitted places" on public.votes;
create policy "Members can vote on submitted places"
  on public.votes
  for insert
  with check (
    exists (
      select 1
      from public.profiles as p
      where p.id = auth.uid()
        and p.is_active = true
        and p.role in ('admin', 'bartender')
    )
    and voter_id = auth.uid()
    and exists (
      select 1
      from public.places as pl
      where pl.id = place_id
        and pl.status = 'submitted'
    )
  );

-- Seed the initial admin profile (run manually after creating the auth user)
-- insert into public.profiles (id, display_name, handle, role, is_active)
-- values ('<auth_user_uuid>', 'Admin', 'admin', 'admin', true);
