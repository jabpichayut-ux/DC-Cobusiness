-- Drop existing tables if any (safe reset)
drop table if exists broadcast_logs cascade;
drop table if exists gold_prices cascade;
drop table if exists repair_requests cascade;
drop table if exists announcements cascade;
drop table if exists promotions cascade;
drop table if exists users cascade;

-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  line_user_id text unique not null,
  display_name text,
  picture_url text,
  tags text[] default '{}',
  apartment_unit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Promotions
create table promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  business_type text not null check (business_type in ('apartment', 'gold', 'warehouse', 'furniture', 'all')),
  target_tags text[] default '{}',
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
  business_type text not null check (business_type in ('apartment', 'gold', 'warehouse', 'furniture', 'all')),
  target_tags text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Repair requests
create table repair_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  line_user_id text not null,
  apartment_unit text not null,
  issue_type text not null check (issue_type in ('electrical', 'plumbing', 'ac', 'other')),
  description text not null,
  status text default 'pending' check (status in ('pending', 'in_progress', 'resolved')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Gold prices
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

-- RLS
alter table users enable row level security;
alter table promotions enable row level security;
alter table announcements enable row level security;
alter table repair_requests enable row level security;
alter table gold_prices enable row level security;
alter table broadcast_logs enable row level security;

create policy "service_role_all_users" on users for all using (true);
create policy "service_role_all_promotions" on promotions for all using (true);
create policy "service_role_all_announcements" on announcements for all using (true);
create policy "service_role_all_repair_requests" on repair_requests for all using (true);
create policy "service_role_all_gold_prices" on gold_prices for all using (true);
create policy "service_role_all_broadcast_logs" on broadcast_logs for all using (true);

-- updated_at trigger
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

-- Seed: gold price
insert into gold_prices (buy_price, sell_price, gold_type)
values (32500.00, 32700.00, '96.5%');

-- Seed: promotions
insert into promotions (title, description, business_type, is_active) values
  ('ส่วนลดค่าเช่าเดือนแรก 10%', 'สำหรับผู้เช่าใหม่ที่ทำสัญญาตั้งแต่ 6 เดือนขึ้นไป', 'apartment', true),
  ('ลดค่ากำเหน็จ 10% ทุกวันเสาร์', 'ซื้อทองรูปพรรณทุกชนิด ลดค่ากำเหน็จ 10% เฉพาะวันเสาร์', 'gold', true),
  ('เช่าโกดัง 3 เดือนแรก ราคาพิเศษ', 'สำหรับลูกค้าใหม่ที่เช่าพื้นที่ตั้งแต่ 100 ตร.ม. ขึ้นไป', 'warehouse', true),
  ('ซื้อเฟอร์นิเจอร์ครบ 10,000 บาท รับส่วนลด 500 บาท', 'สำหรับการสั่งซื้อในแต่ละครั้ง ไม่จำกัดจำนวนครั้ง', 'furniture', true),
  ('สิทธิพิเศษลูกค้า VIP ส่วนลด 15% ทุกบริการ', 'เฉพาะลูกค้า VIP ของ DC Co-Business เท่านั้น', 'all', true);

-- Seed: announcements
insert into announcements (title, content, business_type, is_active) values
  ('แจ้งปิดปรับปรุงพื้นที่จอดรถ', 'วันที่ 10-12 มิ.ย. นี้ จะปิดปรับปรุงพื้นที่จอดรถชั้น B1 ขออภัยในความไม่สะดวก', 'apartment', true),
  ('ราคาทองปรับขึ้น', 'ราคาทองคำวันนี้ปรับขึ้นตามราคาตลาดโลก กรุณาตรวจสอบราคาล่าสุดก่อนซื้อขาย', 'gold', true),
  ('เปิดพื้นที่โกดังใหม่ ชั้น 2', 'เปิดให้เช่าพื้นที่โกดังชั้น 2 ขนาด 50-200 ตร.ม. ติดต่อสอบถามได้เลย', 'warehouse', true);
