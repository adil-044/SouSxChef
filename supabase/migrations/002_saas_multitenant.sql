-- SousXChef multi-tenant SaaS platform
-- Apply after 001_init.sql. Membership-aware RLS for many restaurants.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Organizations (billing / admin boundary)
-- ---------------------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'manager', 'staff')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists memberships_user_id_idx on public.memberships (user_id);
create index if not exists memberships_org_id_idx on public.memberships (organization_id);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  plan text not null default 'line' check (plan in ('line', 'pass', 'house')),
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role text not null default 'staff' check (role in ('owner', 'manager', 'staff')),
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid references auth.users (id) on delete set null,
  accepted_at timestamptz,
  expires_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now()
);

create index if not exists invites_org_id_idx on public.invites (organization_id);
create index if not exists invites_token_idx on public.invites (token);

-- ---------------------------------------------------------------------------
-- Elevate restaurants to org-scoped locations
-- ---------------------------------------------------------------------------
alter table public.restaurants
  add column if not exists organization_id uuid references public.organizations (id) on delete cascade;

alter table public.restaurants
  add column if not exists deleted_at timestamptz;

alter table public.restaurants
  add column if not exists updated_at timestamptz default now();

alter table public.restaurants
  add column if not exists timezone text default 'America/Toronto';

alter table public.restaurants
  add column if not exists skus text[] default '{}';

-- Backfill: one org per legacy restaurant that lacks organization_id
do $$
declare
  r record;
  new_org uuid;
begin
  for r in
    select id, name, owner_id
    from public.restaurants
    where organization_id is null
  loop
    insert into public.organizations (name)
    values (coalesce(nullif(r.name, ''), 'Kitchen') || ' Org')
    returning id into new_org;

    update public.restaurants
    set organization_id = new_org
    where id = r.id;

    if r.owner_id is not null then
      insert into public.memberships (organization_id, user_id, role)
      values (new_org, r.owner_id, 'owner')
      on conflict (organization_id, user_id) do nothing;

      insert into public.subscriptions (organization_id, plan, status)
      values (new_org, 'line', 'trialing')
      on conflict (organization_id) do nothing;
    end if;
  end loop;
end $$;

create index if not exists restaurants_org_id_idx on public.restaurants (organization_id);
create index if not exists restaurants_owner_id_idx on public.restaurants (owner_id);

-- ---------------------------------------------------------------------------
-- Domain table hardening
-- ---------------------------------------------------------------------------
alter table public.inventory_items
  add column if not exists created_by uuid references auth.users (id) on delete set null;

alter table public.inventory_logs
  add column if not exists created_by uuid references auth.users (id) on delete set null;

alter table public.schedules
  add column if not exists created_by uuid references auth.users (id) on delete set null;

alter table public.messages
  add column if not exists external_id text;

alter table public.telegram_links
  add column if not exists expires_at timestamptz default (now() + interval '7 days');

alter table public.telegram_links
  add column if not exists linked_by uuid references auth.users (id) on delete set null;

create unique index if not exists telegram_links_chat_id_uidx
  on public.telegram_links (chat_id)
  where chat_id is not null;

create index if not exists inventory_items_restaurant_updated_idx
  on public.inventory_items (restaurant_id, updated_at desc);

create index if not exists inventory_logs_restaurant_created_idx
  on public.inventory_logs (restaurant_id, created_at desc);

create index if not exists schedules_restaurant_idx on public.schedules (restaurant_id);

create index if not exists messages_restaurant_created_idx
  on public.messages (restaurant_id, created_at desc);

create index if not exists forecast_hints_restaurant_idx
  on public.forecast_hints (restaurant_id);

-- ---------------------------------------------------------------------------
-- Audit + idempotency
-- ---------------------------------------------------------------------------
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete set null,
  restaurant_id uuid references public.restaurants (id) on delete set null,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_restaurant_created_idx
  on public.audit_events (restaurant_id, created_at desc);

create index if not exists audit_events_org_created_idx
  on public.audit_events (organization_id, created_at desc);

create table if not exists public.idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null,
  route text not null,
  response jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, key, route)
);

-- ---------------------------------------------------------------------------
-- Profiles: prefer org membership over single restaurant_id
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists active_restaurant_id uuid references public.restaurants (id) on delete set null;

alter table public.profiles
  add column if not exists active_organization_id uuid references public.organizations (id) on delete set null;

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_org_member(org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org and m.user_id = auth.uid()
  );
$$;

create or replace function public.org_role(org uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select m.role from public.memberships m
  where m.organization_id = org and m.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.can_manage_org(org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org
      and m.user_id = auth.uid()
      and m.role in ('owner', 'manager')
  );
$$;

create or replace function public.can_access_restaurant(rest uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurants r
    join public.memberships m on m.organization_id = r.organization_id
    where r.id = rest
      and r.deleted_at is null
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_restaurant(rest uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurants r
    join public.memberships m on m.organization_id = r.organization_id
    where r.id = rest
      and r.deleted_at is null
      and m.user_id = auth.uid()
      and m.role in ('owner', 'manager')
  );
$$;

-- ---------------------------------------------------------------------------
-- Replace owner-only policies with membership policies
-- ---------------------------------------------------------------------------
drop policy if exists "owners manage restaurants" on public.restaurants;
drop policy if exists "owners manage own profile" on public.profiles;
drop policy if exists "owners inventory" on public.inventory_items;
drop policy if exists "owners inventory logs" on public.inventory_logs;
drop policy if exists "owners schedules" on public.schedules;
drop policy if exists "owners messages" on public.messages;
drop policy if exists "owners forecast" on public.forecast_hints;
drop policy if exists "owners telegram links" on public.telegram_links;

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invites enable row level security;
alter table public.audit_events enable row level security;
alter table public.idempotency_keys enable row level security;

-- Organizations
create policy "members read orgs"
  on public.organizations for select
  using (public.is_org_member(id));

create policy "managers update orgs"
  on public.organizations for update
  using (public.can_manage_org(id))
  with check (public.can_manage_org(id));

create policy "authenticated insert orgs"
  on public.organizations for insert
  with check (auth.uid() is not null);

-- Memberships
create policy "members read memberships"
  on public.memberships for select
  using (public.is_org_member(organization_id) or user_id = auth.uid());

create policy "owners manage memberships"
  on public.memberships for all
  using (
    exists (
      select 1 from public.memberships m
      where m.organization_id = memberships.organization_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  )
  with check (
    exists (
      select 1 from public.memberships m
      where m.organization_id = memberships.organization_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
    or user_id = auth.uid()
  );

-- Allow bootstrap insert of self as owner (onboarding)
create policy "user insert own membership"
  on public.memberships for insert
  with check (user_id = auth.uid());

-- Subscriptions
create policy "members read subscriptions"
  on public.subscriptions for select
  using (public.is_org_member(organization_id));

create policy "owners manage subscriptions"
  on public.subscriptions for all
  using (
    exists (
      select 1 from public.memberships m
      where m.organization_id = subscriptions.organization_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  )
  with check (
    exists (
      select 1 from public.memberships m
      where m.organization_id = subscriptions.organization_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

-- Invites
create policy "managers invites"
  on public.invites for all
  using (public.can_manage_org(organization_id))
  with check (public.can_manage_org(organization_id));

-- Restaurants
create policy "members read restaurants"
  on public.restaurants for select
  using (
    deleted_at is null
    and (
      public.is_org_member(organization_id)
      or owner_id = auth.uid()
    )
  );

create policy "managers insert restaurants"
  on public.restaurants for insert
  with check (
    public.can_manage_org(organization_id)
    or owner_id = auth.uid()
  );

create policy "managers update restaurants"
  on public.restaurants for update
  using (public.can_manage_restaurant(id) or owner_id = auth.uid())
  with check (public.can_manage_restaurant(id) or owner_id = auth.uid());

-- Profiles
create policy "users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Inventory
create policy "members inventory"
  on public.inventory_items for all
  using (public.can_access_restaurant(restaurant_id))
  with check (public.can_manage_restaurant(restaurant_id) or public.can_access_restaurant(restaurant_id));

create policy "members inventory logs"
  on public.inventory_logs for all
  using (public.can_access_restaurant(restaurant_id))
  with check (public.can_access_restaurant(restaurant_id));

create policy "members schedules"
  on public.schedules for all
  using (public.can_access_restaurant(restaurant_id))
  with check (public.can_access_restaurant(restaurant_id));

create policy "members messages"
  on public.messages for all
  using (public.can_access_restaurant(restaurant_id))
  with check (public.can_access_restaurant(restaurant_id));

create policy "members forecast"
  on public.forecast_hints for all
  using (public.can_access_restaurant(restaurant_id))
  with check (public.can_access_restaurant(restaurant_id));

create policy "managers telegram links"
  on public.telegram_links for all
  using (public.can_manage_restaurant(restaurant_id))
  with check (public.can_manage_restaurant(restaurant_id));

-- Audit: members read; inserts via service role or members
create policy "members read audit"
  on public.audit_events for select
  using (
    (organization_id is not null and public.is_org_member(organization_id))
    or (restaurant_id is not null and public.can_access_restaurant(restaurant_id))
  );

create policy "members insert audit"
  on public.audit_events for insert
  with check (
    actor_id = auth.uid()
    and (
      (organization_id is not null and public.is_org_member(organization_id))
      or (restaurant_id is not null and public.can_access_restaurant(restaurant_id))
      or (organization_id is null and restaurant_id is null)
    )
  );

create policy "users own idempotency"
  on public.idempotency_keys for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Onboarding RPC: org + restaurant + owner membership + trial sub
-- ---------------------------------------------------------------------------
create or replace function public.onboard_restaurant(
  p_name text,
  p_location text default '',
  p_seats int default 0,
  p_pains text[] default '{}',
  p_channels text[] default '{}',
  p_categories text[] default '{}',
  p_skus text[] default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  org_id uuid;
  rest_id uuid;
  link_code text;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'name required';
  end if;

  insert into public.organizations (name)
  values (trim(p_name))
  returning id into org_id;

  insert into public.memberships (organization_id, user_id, role)
  values (org_id, uid, 'owner');

  insert into public.subscriptions (organization_id, plan, status)
  values (org_id, 'line', 'trialing');

  insert into public.restaurants (
    owner_id, organization_id, name, location, seats, pains, channels, categories, skus
  ) values (
    uid, org_id, trim(p_name), coalesce(p_location, ''), coalesce(p_seats, 0),
    coalesce(p_pains, '{}'), coalesce(p_channels, '{}'), coalesce(p_categories, '{}'),
    coalesce(p_skus, '{}')
  )
  returning id into rest_id;

  -- seed SKUs as inventory rows when provided
  if p_skus is not null and array_length(p_skus, 1) is not null then
    insert into public.inventory_items (restaurant_id, name, category, unit, qty, par, high_value, created_by)
    select rest_id, s, coalesce(p_categories[1], 'General'), 'kg', 0, 1, false, uid
    from unnest(p_skus) as s;
  end if;

  link_code := 'link_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  insert into public.telegram_links (restaurant_id, link_code)
  values (rest_id, link_code);

  insert into public.profiles (id, full_name, restaurant_id, active_restaurant_id, active_organization_id, onboarding_complete)
  values (uid, null, rest_id, rest_id, org_id, true)
  on conflict (id) do update set
    restaurant_id = excluded.restaurant_id,
    active_restaurant_id = excluded.active_restaurant_id,
    active_organization_id = excluded.active_organization_id,
    onboarding_complete = true;

  insert into public.audit_events (organization_id, restaurant_id, actor_id, action, entity_type, entity_id)
  values (org_id, rest_id, uid, 'restaurant.onboarded', 'restaurant', rest_id::text);

  return jsonb_build_object(
    'organization_id', org_id,
    'restaurant_id', rest_id,
    'telegram_link_code', link_code
  );
end;
$$;

revoke all on function public.onboard_restaurant from public;
grant execute on function public.onboard_restaurant to authenticated;

-- Add location under existing org (managers+)
create or replace function public.add_restaurant_location(
  p_organization_id uuid,
  p_name text,
  p_location text default '',
  p_seats int default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  rest_id uuid;
  link_code text;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  if not public.can_manage_org(p_organization_id) then
    raise exception 'forbidden';
  end if;

  insert into public.restaurants (
    owner_id, organization_id, name, location, seats
  ) values (
    uid, p_organization_id, trim(p_name), coalesce(p_location, ''), coalesce(p_seats, 0)
  )
  returning id into rest_id;

  link_code := 'link_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  insert into public.telegram_links (restaurant_id, link_code)
  values (rest_id, link_code);

  insert into public.audit_events (organization_id, restaurant_id, actor_id, action, entity_type, entity_id)
  values (p_organization_id, rest_id, uid, 'restaurant.created', 'restaurant', rest_id::text);

  return jsonb_build_object(
    'restaurant_id', rest_id,
    'telegram_link_code', link_code
  );
end;
$$;

revoke all on function public.add_restaurant_location from public;
grant execute on function public.add_restaurant_location to authenticated;
