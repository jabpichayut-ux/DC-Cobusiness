-- Users (LINE users who added the OA)
create table users (
  id uuid primary key default gen_random_uuid(),
  line_user_id text unique not null,
  display_name text,
  picture_url text,
  tags text[] default '{}',  -- ['tenant', 'gold_customer', 'vip', 'family_customer']
  apartment_unit text,        -- if tenant
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Promotions
create table promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  business_type text not null,  -- 'apartment', 'gold', 'property', 'all'
  target_tags text[] default '{}',  -- empty = all users
  is_active boolean default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- Announcements
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  business_type text not null,  -- 'apartment', 'gold', 'property', 'all'
  target_tags text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Repair requests (apartment)
create table repair_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  line_user_id text not null,
  apartment_unit text not null,
  issue_type text not null,  -- 'electrical', 'plumbing', 'ac', 'other'
  description text not null,
  status text default 'pending',  -- 'pending', 'in_progress', 'resolved'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Gold prices (admin updates manually or via API)
create table gold_prices (
  id uuid primary key default gen_random_uuid(),
  buy_price decimal(10,2) not null,
  sell_price decimal(10,2) not null,
  gold_type text default '96.5%',
  updated_at timestamptz default now()
);

-- Broadcast logs
create table broadcast_logs (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  target_tags text[] default '{}',
  sent_count int default 0,
  created_at timestamptz default now()
);

-- RLS Policies
alter table users enable row level security;
alter table promotions enable row level security;
alter table announcements enable row level security;
alter table repair_requests enable row level security;
alter table gold_prices enable row level security;
alter table broadcast_logs enable row level security;

-- Allow service role full access (used in API routes)
create policy "service_role_all_users" on users for all using (true);
create policy "service_role_all_promotions" on promotions for all using (true);
create policy "service_role_all_announcements" on announcements for all using (true);
create policy "service_role_all_repair_requests" on repair_requests for all using (true);
create policy "service_role_all_gold_prices" on gold_prices for all using (true);
create policy "service_role_all_broadcast_logs" on broadcast_logs for all using (true);

-- Updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_users_updated_at before update on users
  for each row execute procedure update_updated_at_column();

create trigger update_repair_requests_updated_at before update on repair_requests
  for each row execute procedure update_updated_at_column();

-- Seed initial gold price
insert into gold_prices (buy_price, sell_price, gold_type) values (32500, 32700, '96.5%');
