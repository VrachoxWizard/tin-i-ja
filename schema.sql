-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users(id) primary key,
  role text check (role in ('buyer', 'seller', 'broker', 'admin')) not null,
  full_name text not null,
  email text not null,
  created_at timestamptz default now() not null
);

-- 2. Listings (Sell-side)
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users(id) not null,
  status text check (status in ('draft', 'active', 'under_nda', 'closed')) default 'draft' not null,
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
  blind_teaser text, -- AI generated anonymous teaser
  created_at timestamptz default now() not null
);

-- 3. Buyer Profiles (Buy-side)
create table public.buyer_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  target_industries text[] not null,
  target_regions text[] not null,
  min_revenue numeric,
  max_ev numeric,
  transaction_type text not null,
  created_at timestamptz default now() not null
);

-- 4. NDAs
create table public.ndas (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) not null,
  buyer_id uuid references public.users(id) not null,
  status text check (status in ('pending', 'signed', 'rejected')) default 'pending' not null,
  signed_at timestamptz,
  created_at timestamptz default now() not null,
  unique(listing_id, buyer_id)
);

-- 5. Deal Room Files
create table public.deal_room_files (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) not null,
  file_url text not null,
  doc_type text check (doc_type in ('financial', 'legal', 'asset')) not null,
  uploaded_at timestamptz default now() not null
);

-- 6. Matches
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) not null,
  buyer_profile_id uuid references public.buyer_profiles(id) not null,
  match_score numeric not null,
  status text check (status in ('new', 'viewed', 'interested')) default 'new' not null,
  ai_narrative text not null,
  created_at timestamptz default now() not null,
  unique(listing_id, buyer_profile_id)
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.buyer_profiles enable row level security;
alter table public.ndas enable row level security;
alter table public.deal_room_files enable row level security;
alter table public.matches enable row level security;

-- Row Level Security Policies

-- Users: Can read their own data, Admins can read all
create policy "Users can read own data" on public.users 
  for select using (auth.uid() = id);

-- Listings: Sellers can read/update their own
create policy "Sellers can manage own listings" on public.listings
  for all using (auth.uid() = owner_id);

-- Listings: Buyers can ONLY read full listings if an NDA is signed
create policy "Buyers can see full listings with signed NDA" on public.listings
  for select using (
    exists (
      select 1 from public.ndas
      where ndas.listing_id = listings.id
      and ndas.buyer_id = auth.uid()
      and ndas.status = 'signed'
    )
  );

-- Buyer Profiles: Buyers can manage own profile
create policy "Buyers can manage own profile" on public.buyer_profiles
  for all using (auth.uid() = user_id);

-- NDAs: Buyers and Sellers can read NDAs they are involved in
create policy "Users can see their NDAs" on public.ndas
  for select using (
    buyer_id = auth.uid() or 
    exists (
      select 1 from public.listings
      where listings.id = ndas.listing_id
      and listings.owner_id = auth.uid()
    )
  );

-- NDAs: Buyers can insert pending NDAs
create policy "Buyers can request NDAs" on public.ndas
  for insert with check (buyer_id = auth.uid() and status = 'pending');

-- NDAs: Sellers can update NDAs for their listings
create policy "Sellers can update NDAs" on public.ndas
  for update using (
    exists (
      select 1 from public.listings
      where listings.id = ndas.listing_id
      and listings.owner_id = auth.uid()
    )
  );

-- Deal Room Files: Sellers can manage files for their listings
create policy "Sellers can manage their deal room files" on public.deal_room_files
  for all using (
    exists (
      select 1 from public.listings
      where listings.id = deal_room_files.listing_id
      and listings.owner_id = auth.uid()
    )
  );

-- Deal Room Files: Buyers can read files if NDA is signed
create policy "Buyers can view files with signed NDA" on public.deal_room_files
  for select using (
    exists (
      select 1 from public.ndas
      where ndas.listing_id = deal_room_files.listing_id
      and ndas.buyer_id = auth.uid()
      and ndas.status = 'signed'
    )
  );

-- Matches: Buyer can see their own matches
create policy "Buyers can see their matches" on public.matches
  for select using (
    exists (
      select 1 from public.buyer_profiles
      where buyer_profiles.id = matches.buyer_profile_id
      and buyer_profiles.user_id = auth.uid()
    )
  );

-- Matches: Sellers can see matches for their listings
create policy "Sellers can see matches for their listings" on public.matches
  for select using (
    exists (
      select 1 from public.listings
      where listings.id = matches.listing_id
      and listings.owner_id = auth.uid()
    )
  );

-- Function for Buyers to get Blind Teasers without triggering RLS on listings
-- This function runs with elevated privileges but ONLY returns non-sensitive teaser data
create or replace function get_active_teasers()
returns table (
  listing_id uuid,
  industry_nkd text,
  region text,
  revenue_eur numeric,
  ebitda_eur numeric,
  asking_price_eur numeric,
  blind_teaser text
) language sql security definer as $$
  select id, industry_nkd, region, revenue_eur, ebitda_eur, asking_price_eur, blind_teaser
  from public.listings
  where status = 'active';
$$;

-- Trigger to sync auth.users with public.users
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
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
