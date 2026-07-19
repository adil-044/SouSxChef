-- SousXChef initial schema
-- Apply in Supabase SQL editor when credentials are ready.

create extension if not exists "pgcrypto";

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null,
  location text,
  seats int default 0,
  pains text[] default '{}',
  channels text[] default '{}',
  categories text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  restaurant_id uuid references public.restaurants (id) on delete set null,
  onboarding_complete boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  name text not null,
  category text,
  unit text default 'kg',
  qty numeric default 0,
  par numeric default 0,
  high_value boolean default false,
  updated_at timestamptz default now()
);

create table if not exists public.inventory_logs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  item_id uuid references public.inventory_items (id) on delete set null,
  source text default 'photo',
  note text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  day text not null,
  role text,
  staff_name text,
  start_time text,
  end_time text
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  channel text default 'telegram',
  direction text check (direction in ('inbound', 'outbound')),
  author text,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists public.forecast_hints (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  day text not null,
  covers int default 0,
  note text
);

create table if not exists public.telegram_links (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  link_code text unique not null,
  chat_id text,
  linked_at timestamptz,
  created_at timestamptz default now()
);

alter table public.restaurants enable row level security;
alter table public.profiles enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.schedules enable row level security;
alter table public.messages enable row level security;
alter table public.forecast_hints enable row level security;
alter table public.telegram_links enable row level security;

create policy "owners manage restaurants"
  on public.restaurants for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "owners manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "owners inventory"
  on public.inventory_items for all
  using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  )
  with check (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

create policy "owners inventory logs"
  on public.inventory_logs for all
  using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  )
  with check (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

create policy "owners schedules"
  on public.schedules for all
  using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  )
  with check (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

create policy "owners messages"
  on public.messages for all
  using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  )
  with check (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

create policy "owners forecast"
  on public.forecast_hints for all
  using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  )
  with check (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );

create policy "owners telegram links"
  on public.telegram_links for all
  using (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  )
  with check (
    restaurant_id in (select id from public.restaurants where owner_id = auth.uid())
  );
