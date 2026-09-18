-- ============================================================================
-- Kohn Security & Transportation — Supabase schema (v2)
-- Run this whole file in: Supabase Dashboard → SQL Editor → New query → Run
-- It is safe to run again on an existing database (it upgrades v1 in place).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Packages table
-- ---------------------------------------------------------------------------
create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  tracking_id text not null unique,

  -- the admin account that registered this package
  owner_id uuid references auth.users (id) on delete set null,

  name text not null,
  description text,
  image_url text,
  weight_kg numeric(10, 2),

  sender_name text not null,
  sender_address text,
  sender_email text,
  sender_phone text,

  recipient_name text not null,
  recipient_address text,
  recipient_email text,
  recipient_phone text,

  current_location text,
  transport_mode text not null default 'truck'
    check (transport_mode in ('ship', 'airplane', 'truck', 'fedex', 'usps')),

  payment_status text not null default 'unpaid',
  clearance_status text not null default 'not_cleared'
    check (clearance_status in ('cleared', 'not_cleared')),

  fee numeric(10, 2) not null default 0,
  currency text not null default 'USD',

  -- per-package crypto payment details, supplied by the owning admin
  btc_address text,
  btc_qr_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade path for databases created with v1 of this file -------------------
alter table public.packages
  add column if not exists owner_id uuid references auth.users (id) on delete set null,
  add column if not exists btc_address text,
  add column if not exists btc_qr_url text;

alter table public.packages
  drop constraint if exists packages_payment_status_check;

alter table public.packages
  add constraint packages_payment_status_check
  check (payment_status in ('paid', 'unpaid', 'under_review'));

create index if not exists packages_created_at_idx
  on public.packages (created_at desc);
create index if not exists packages_owner_idx
  on public.packages (owner_id);

-- ---------------------------------------------------------------------------
-- 2. Keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists packages_set_updated_at on public.packages;
create trigger packages_set_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Stamp the creating admin automatically
-- ---------------------------------------------------------------------------
create or replace function public.set_package_owner()
returns trigger
language plpgsql
as $$
begin
  if new.owner_id is null then
    new.owner_id = auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists packages_set_owner on public.packages;
create trigger packages_set_owner
  before insert on public.packages
  for each row execute function public.set_package_owner();

-- ---------------------------------------------------------------------------
-- 4. Row level security
--    Visitors (anon) may look up ANY package on the public tracking page.
--    A signed-in admin may only see and change the packages HE registered.
-- ---------------------------------------------------------------------------
alter table public.packages enable row level security;

drop policy if exists "packages_public_read" on public.packages;
create policy "packages_public_read"
  on public.packages for select
  to anon
  using (true);

drop policy if exists "packages_owner_read" on public.packages;
create policy "packages_owner_read"
  on public.packages for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "packages_admin_insert" on public.packages;
create policy "packages_admin_insert"
  on public.packages for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "packages_admin_update" on public.packages;
create policy "packages_admin_update"
  on public.packages for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "packages_admin_delete" on public.packages;
create policy "packages_admin_delete"
  on public.packages for delete
  to authenticated
  using (owner_id = auth.uid());

-- Existing rows created before owner_id existed have no owner and would be
-- invisible to everyone in the console. Claim them for one admin by email:
--   update public.packages
--      set owner_id = (select id from auth.users where email = 'you@example.com')
--    where owner_id is null;

-- ---------------------------------------------------------------------------
-- 5. Public payment submission
--    Visitors cannot write to the table. This function is the only write path
--    open to them and it can ONLY move a package into 'under_review'.
--    Confirming the payment as received stays an admin action.
-- ---------------------------------------------------------------------------
drop function if exists public.mark_package_paid(text);

create or replace function public.submit_package_payment(p_tracking_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.packages
     set payment_status = 'under_review'
   where upper(tracking_id) = upper(p_tracking_id)
     and payment_status <> 'paid';
end;
$$;

grant execute on function public.submit_package_payment(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 6. Storage bucket for package pictures and BTC QR codes
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('package-images', 'package-images', true)
on conflict (id) do update set public = true;

drop policy if exists "package_images_public_read" on storage.objects;
create policy "package_images_public_read"
  on storage.objects for select
  using (bucket_id = 'package-images');

drop policy if exists "package_images_admin_write" on storage.objects;
create policy "package_images_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'package-images');

drop policy if exists "package_images_admin_update" on storage.objects;
create policy "package_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'package-images');

drop policy if exists "package_images_admin_delete" on storage.objects;
create policy "package_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'package-images');

-- ---------------------------------------------------------------------------
-- 7. Create your admin users
--    Authentication → Users → Add user (tick "Auto Confirm User").
--    Each admin signs in at /admin and only sees his own packages.
--    Authentication → Providers → Email → turn OFF signups so nobody
--    can register themselves.
-- ---------------------------------------------------------------------------
