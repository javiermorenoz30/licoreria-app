-- CELICOR La Castellana — backend inicial
-- Aplicar en el proyecto Supabase antes de activar pedidos sincronizados.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  birth_date date,
  role text not null default 'customer' check (role in ('customer','admin','staff','driver')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Casa',
  address_line text not null,
  reference text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  active boolean not null default true
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  size text,
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2) check (sale_price is null or sale_price >= 0),
  box_qty int,
  box_price numeric(12,2),
  stock int not null default 0 check (stock >= 0),
  image_url text,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  fee numeric(12,2) not null default 0,
  min_order numeric(12,2) not null default 0,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  user_id uuid not null references public.profiles(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  delivery_zone_id uuid references public.delivery_zones(id) on delete set null,
  fulfillment_type text not null check (fulfillment_type in ('delivery','pickup')),
  status text not null default 'pending' check (status in ('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')),
  payment_method text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending','reported','paid','failed','refunded')),
  subtotal numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text,
  unit_price numeric(12,2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(12,2) not null
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id, full_name, phone)
  values(new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.phone,new.raw_user_meta_data->>'phone'))
  on conflict(id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','staff'));
$$;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.promotions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;
alter table public.store_settings enable row level security;

create policy "profiles own read" on public.profiles for select using (id=auth.uid() or public.is_staff());
create policy "profiles own update" on public.profiles for update using (id=auth.uid() or public.is_staff()) with check (id=auth.uid() or public.is_staff());
create policy "addresses own" on public.addresses for all using (user_id=auth.uid() or public.is_staff()) with check (user_id=auth.uid() or public.is_staff());
create policy "categories read" on public.categories for select using (active=true or public.is_staff());
create policy "categories staff" on public.categories for all using (public.is_staff()) with check (public.is_staff());
create policy "brands read" on public.brands for select using (active=true or public.is_staff());
create policy "brands staff" on public.brands for all using (public.is_staff()) with check (public.is_staff());
create policy "products read" on public.products for select using (active=true or public.is_staff());
create policy "products staff" on public.products for all using (public.is_staff()) with check (public.is_staff());
create policy "zones read" on public.delivery_zones for select using (active=true or public.is_staff());
create policy "zones staff" on public.delivery_zones for all using (public.is_staff()) with check (public.is_staff());
create policy "promotions read" on public.promotions for select using (active=true or public.is_staff());
create policy "promotions staff" on public.promotions for all using (public.is_staff()) with check (public.is_staff());
create policy "orders own read" on public.orders for select using (user_id=auth.uid() or public.is_staff());
create policy "orders staff update" on public.orders for update using (public.is_staff()) with check (public.is_staff());
create policy "order items read" on public.order_items for select using (exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.is_staff())));
create policy "favorites own" on public.favorites for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "settings read" on public.store_settings for select using (true);
create policy "settings staff" on public.store_settings for all using (public.is_staff()) with check (public.is_staff());
