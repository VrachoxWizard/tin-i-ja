-- DealFlow Supabase source of truth
-- Target project ref for MCP alignment: uygdnniouyeqvmysghbu
-- Apply this contract via Supabase MCP or the Supabase SQL editor.

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create table public.users (
  id uuid references auth.users(id) primary key,
  role text check (role in ('buyer', 'seller', 'broker', 'admin')) not null,
  full_name text not null,
  email text not null,
  created_at timestamptz default now() not null
);

create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  public_code text unique,
  owner_id uuid references public.users(id) not null,
  company_name text not null,
  status text check (
    status in (
      'draft',
      'teaser_generated',
      'seller_review',
      'active',
      'under_nda',
      'closed'
    )
  ) default 'draft' not null,
  industry_nkd text not null,
  region text not null,
  year_founded int not null,
  employees int not null,
  revenue_eur numeric not null,
  ebitda_eur numeric not null,
  sde_eur numeric not null,
  asking_price_eur numeric not null,
  owner_dependency_score int check (owner_dependency_score between 1 and 5) not null,
  digital_maturity int check (digital_maturity between 1 and 5) not null,
  is_exclusive boolean default true not null,
  reason_for_sale text,
  transition_support text,
  blind_teaser text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.buyer_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null unique,
  target_industries text[] not null,
  target_regions text[] not null,
  target_ev_min numeric,
  target_ev_max numeric,
  target_revenue_min numeric,
  target_revenue_max numeric,
  transaction_type text check (transaction_type in ('individual', 'strategic', 'financial')) not null,
  investment_thesis text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.ndas (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) not null,
  buyer_id uuid references public.users(id) not null,
  status text check (status in ('pending', 'signed', 'rejected')) default 'pending' not null,
  signed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (listing_id, buyer_id)
);

create table public.deal_room_files (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) not null,
  file_path text not null,
  file_url text,
  doc_type text check (doc_type in ('financial', 'legal', 'asset')) not null,
  uploaded_at timestamptz default now() not null
);

create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) not null,
  buyer_profile_id uuid references public.buyer_profiles(id) not null,
  match_score numeric not null,
  status text check (status in ('new', 'viewed', 'interested')) default 'new' not null,
  ai_narrative text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (listing_id, buyer_profile_id)
);

create table public.rate_limits (
  key_hash text not null,
  route text not null,
  window_started_at timestamptz default now() not null,
  request_count integer default 0 not null,
  updated_at timestamptz default now() not null,
  primary key (key_hash, route)
);

create index listings_owner_id_idx on public.listings (owner_id);
-- Replaced full index with partial because 'status' is low cardinality
create index idx_listings_status_active on public.listings (status) where status = 'active';
create index idx_ndas_buyer_signed on public.ndas (buyer_id) where status = 'signed';
create index idx_ndas_listing_signed on public.ndas (listing_id) where status = 'signed';
create index deal_room_files_listing_id_idx on public.deal_room_files (listing_id);
create index matches_buyer_profile_id_idx on public.matches (buyer_profile_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

create or replace function public.assign_listing_public_code()
returns trigger as $$
declare
  generated_code text;
begin
  if new.public_code is not null then
    return new;
  end if;

  loop
    generated_code := 'DF-' || upper(substr(encode(gen_random_bytes(6), 'base64'), 1, 6));
    generated_code := regexp_replace(generated_code, '[^A-Z0-9-]', 'X', 'g');

    exit when not exists (
      select 1
      from public.listings
      where public_code = generated_code
    );
  end loop;

  new.public_code = generated_code;
  return new;
end;
$$ language plpgsql set search_path = public;

create trigger set_listing_updated_at
  before update on public.listings
  for each row execute procedure public.handle_updated_at();

create trigger set_buyer_profile_updated_at
  before update on public.buyer_profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_nda_updated_at
  before update on public.ndas
  for each row execute procedure public.handle_updated_at();

create trigger set_match_updated_at
  before update on public.matches
  for each row execute procedure public.handle_updated_at();

create trigger set_rate_limit_updated_at
  before update on public.rate_limits
  for each row execute procedure public.handle_updated_at();

create trigger assign_public_code_before_insert
  before insert on public.listings
  for each row execute procedure public.assign_listing_public_code();

alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.buyer_profiles enable row level security;
alter table public.ndas enable row level security;
alter table public.deal_room_files enable row level security;
alter table public.matches enable row level security;
alter table public.rate_limits enable row level security;

create policy "Users can read own data" on public.users
  for select using ((select auth.uid()) = id);

create policy "Users can update own data" on public.users
  for update using ((select auth.uid()) = id);

-- ─── listings ─────────────────────────────────────────────────────────────────
-- Single SELECT policy covering all access patterns (optimized: no per-row auth.uid() re-eval)
create policy "listings_select_policy" on public.listings
  for select using (
    status in ('active', 'under_nda')
    or owner_id = (select auth.uid())
    or broker_id = (select auth.uid())
    or exists (
      select 1 from public.ndas
      where ndas.listing_id = listings.id
        and ndas.buyer_id = (select auth.uid())
        and ndas.status = 'signed'
    )
    or exists (
      select 1 from public.users
      where id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Sellers can insert own listings" on public.listings
  for insert with check (owner_id = (select auth.uid()));

create policy "Sellers can update own listings" on public.listings
  for update using (owner_id = (select auth.uid()));

create policy "Sellers can delete own listings" on public.listings
  for delete using (owner_id = (select auth.uid()));

-- ─── buyer_profiles ────────────────────────────────────────────────────────────
create policy "Buyers can manage own profile" on public.buyer_profiles
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ─── ndas ──────────────────────────────────────────────────────────────────────
-- Single SELECT policy covering buyer, seller, broker, and admin access
create policy "ndas_select_policy" on public.ndas
  for select using (
    buyer_id = (select auth.uid())
    or listing_id in (
      select id from public.listings where owner_id = (select auth.uid())
    )
    or listing_id in (
      select id from public.listings where broker_id = (select auth.uid())
    )
    or exists (
      select 1 from public.users where id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Buyers can request ndas" on public.ndas
  for insert with check (buyer_id = (select auth.uid()) and status = 'pending');

create policy "Sellers can update ndas for own listings" on public.ndas
  for update using (
    exists (
      select 1
      from public.listings
      where listings.id = ndas.listing_id
        and listings.owner_id = (select auth.uid())
    )
  );

-- ─── deal_room_files ───────────────────────────────────────────────────────────
-- Single SELECT policy covering seller, signed-NDA buyer, broker, and admin
create policy "deal_room_files_select_policy" on public.deal_room_files
  for select using (
    listing_id in (
      select id from public.listings where owner_id = (select auth.uid())
    )
    or listing_id in (
      select ndas.listing_id from public.ndas
      where ndas.buyer_id = (select auth.uid()) and ndas.status = 'signed'
    )
    or listing_id in (
      select id from public.listings where broker_id = (select auth.uid())
    )
    or exists (
      select 1 from public.users where id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Sellers can insert own deal room files" on public.deal_room_files
  for insert with check (
    listing_id in (
      select id from public.listings where owner_id = (select auth.uid())
    )
  );

create policy "Sellers can delete own deal room files" on public.deal_room_files
  for delete using (
    listing_id in (
      select id from public.listings where owner_id = (select auth.uid())
    )
  );

-- ─── matches ───────────────────────────────────────────────────────────────────
-- Single SELECT policy covering buyer profile owner, listing seller, and admin
create policy "matches_select_policy" on public.matches
  for select using (
    buyer_profile_id in (
      select id from public.buyer_profiles where user_id = (select auth.uid())
    )
    or listing_id in (
      select id from public.listings where owner_id = (select auth.uid())
    )
    or exists (
      select 1 from public.users where id = (select auth.uid()) and role = 'admin'
    )
  );

-- ─── audit_logs ────────────────────────────────────────────────────────────────
alter table public.audit_logs enable row level security;
create policy "Admins can view audit logs" on public.audit_logs
  for select using (
    exists (
      select 1 from public.users
      where id = (select auth.uid()) and role = 'admin'
    )
  );


create policy "No direct access to rate limits" on public.rate_limits
  for all using (false)
  with check (false);

insert into storage.buckets (id, name, public)
values ('deal-room-files', 'deal-room-files', false)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

create policy "Sellers can upload deal room storage objects" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'deal-room-files'
    and exists (
      select 1
      from public.listings
      where listings.id::text = (storage.foldername(name))[1]
        and listings.owner_id = (select auth.uid())
    )
  );

create policy "Sellers can update deal room storage objects" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'deal-room-files'
    and exists (
      select 1
      from public.listings
      where listings.id::text = (storage.foldername(name))[1]
        and listings.owner_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'deal-room-files'
    and exists (
      select 1
      from public.listings
      where listings.id::text = (storage.foldername(name))[1]
        and listings.owner_id = (select auth.uid())
    )
  );

create policy "Sellers can delete deal room storage objects" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'deal-room-files'
    and exists (
      select 1
      from public.listings
      where listings.id::text = (storage.foldername(name))[1]
        and listings.owner_id = (select auth.uid())
    )
  );

create policy "Authorized users can read deal room storage objects" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'deal-room-files'
    and (
      exists (
        select 1
        from public.listings
        where listings.id::text = (storage.foldername(name))[1]
          and listings.owner_id = (select auth.uid())
      )
      or exists (
        select 1
        from public.ndas
        where ndas.listing_id::text = (storage.foldername(name))[1]
          and ndas.buyer_id = (select auth.uid())
          and ndas.status = 'signed'
      )
    )
  );

create or replace function public.get_active_teasers()
returns table (
  listing_id uuid,
  public_code text,
  industry_nkd text,
  region text,
  revenue_eur numeric,
  ebitda_eur numeric,
  asking_price_eur numeric,
  blind_teaser text,
  updated_at timestamptz
) language sql security definer set search_path = public as $$
  select
    id,
    public_code,
    industry_nkd,
    region,
    revenue_eur,
    ebitda_eur,
    asking_price_eur,
    blind_teaser,
    updated_at
  from public.listings
  where status = 'active';
$$;

create or replace function public.check_rate_limit(
  p_key_hash text,
  p_route text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_record public.rate_limits%rowtype;
begin
  select *
  into current_record
  from public.rate_limits
  where key_hash = p_key_hash and route = p_route;

  if current_record.key_hash is null then
    insert into public.rate_limits (key_hash, route, request_count)
    values (p_key_hash, p_route, 1);
    return true;
  end if;

  if current_record.window_started_at < now() - make_interval(secs => p_window_seconds) then
    update public.rate_limits
    set request_count = 1, window_started_at = now()
    where key_hash = p_key_hash and route = p_route;
    return true;
  end if;

  if current_record.request_count >= p_limit then
    return false;
  end if;

  update public.rate_limits
  set request_count = request_count + 1
  where key_hash = p_key_hash and route = p_route;

  return true;
end;
$$;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, role, full_name, email)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role'), 'buyer'),
    coalesce((new.raw_user_meta_data->>'full_name'), ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.admin_overview()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if not exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Forbidden';
  end if;

  select json_build_object(
    'total_listings', (select count(*) from public.listings),
    'active_listings', (select count(*) from public.listings where status in ('active', 'under_nda')),
    'total_buyers', (select count(*) from public.buyer_profiles),
    'total_ndas', (select count(*) from public.ndas),
    'pending_ndas', (select count(*) from public.ndas where status = 'pending'),
    'total_matches', (select count(*) from public.matches),
    'total_users', (select count(*) from public.users),
    'recent_listings', (
      select coalesce(json_agg(row_to_json(l)), '[]'::json)
      from (
        select id, public_code, company_name, industry_nkd, region, status, created_at
        from public.listings
        order by created_at desc
        limit 10
      ) l
    ),
    'recent_users', (
      select coalesce(json_agg(row_to_json(u)), '[]'::json)
      from (
        select id, full_name, email, role, created_at
        from public.users
        order by created_at desc
        limit 10
      ) u
    )
  ) into result;

  return result;
end;
$$;
