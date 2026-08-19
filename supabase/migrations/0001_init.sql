-- CELICOR La Castellana — backend V1
-- Catálogo, clientes, inventario, delivery, promociones y pedidos seguros.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  birth_date date,
  role text not null default 'customer' check (role in ('customer','admin','staff','driver')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Casa',
  address_line text not null,
  reference text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  active boolean not null default true
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  active boolean not null default true
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  size text,
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2) check (sale_price is null or sale_price >= 0),
  box_qty int check (box_qty is null or box_qty > 0),
  box_price numeric(12,2) check (box_price is null or box_price >= 0),
  stock int not null default 0 check (stock >= 0),
  image_url text,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on public.products(category_id);
create index products_brand_idx on public.products(brand_id);
create index products_active_idx on public.products(active);
create index products_featured_idx on public.products(featured);

create table public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  fee numeric(12,2) not null default 0 check (fee >= 0),
  min_order numeric(12,2) not null default 0 check (min_order >= 0),
  active boolean not null default true,
  sort_order int not null default 0
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  min_order numeric(12,2) not null default 0,
  max_uses int,
  uses_count int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  user_id uuid not null references public.profiles(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  delivery_zone_id uuid references public.delivery_zones(id) on delete set null,
  delivery_zone_name text,
  delivery_address text,
  delivery_reference text,
  fulfillment_type text not null check (fulfillment_type in ('delivery','pickup')),
  status text not null default 'pending' check (status in ('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled')),
  payment_method text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending','reported','paid','failed','refunded')),
  subtotal numeric(12,2) not null default 0,
  delivery_fee numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  coupon_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  size text,
  unit_price numeric(12,2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create index order_items_order_idx on public.order_items(order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.store_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

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

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','staff'));
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if new.role is distinct from old.role and not public.is_staff() then
    raise exception 'Role changes require staff privileges';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role_before_update
before update on public.profiles
for each row execute function public.protect_profile_role();

create or replace function public.track_order_status()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.order_status_history(order_id,status,changed_by)
    values(new.id,new.status,auth.uid());
  end if;
  return new;
end;
$$;

create trigger track_order_status_after_update
after update of status on public.orders
for each row execute function public.track_order_status();

create or replace function public.create_order(
  p_fulfillment_type text,
  p_zone_name text,
  p_address text,
  p_reference text,
  p_payment_method text,
  p_notes text,
  p_coupon_code text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_user uuid := auth.uid();
  v_subtotal numeric(12,2) := 0;
  v_delivery_fee numeric(12,2) := 0;
  v_discount numeric(12,2) := 0;
  v_total numeric(12,2) := 0;
  v_zone public.delivery_zones%rowtype;
  v_coupon public.coupons%rowtype;
  v_product public.products%rowtype;
  v_item jsonb;
  v_qty int;
  v_order_id uuid;
  v_order_number bigint;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if p_fulfillment_type not in ('delivery','pickup') then raise exception 'Invalid fulfillment type'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items)=0 then raise exception 'Cart is empty'; end if;

  if p_fulfillment_type='delivery' then
    if nullif(trim(coalesce(p_address,'')),'') is null then raise exception 'Delivery address required'; end if;
    select * into v_zone from public.delivery_zones where name=p_zone_name and active=true;
    if not found then raise exception 'Delivery zone unavailable'; end if;
    v_delivery_fee := v_zone.fee;
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := greatest(1,coalesce((v_item->>'quantity')::int,1));
    select * into v_product from public.products
      where source_key=(v_item->>'product_id') and active=true
      for update;
    if not found then raise exception 'Product unavailable'; end if;
    if v_product.stock < v_qty then raise exception 'Insufficient stock for %',v_product.name; end if;
    v_subtotal := v_subtotal + coalesce(v_product.sale_price,v_product.price)*v_qty;
  end loop;

  if p_fulfillment_type='delivery' and v_subtotal < v_zone.min_order then
    raise exception 'Minimum order for this zone is %',v_zone.min_order;
  end if;

  if nullif(trim(coalesce(p_coupon_code,'')),'') is not null then
    select * into v_coupon from public.coupons
      where upper(code)=upper(trim(p_coupon_code)) and active=true
        and (starts_at is null or starts_at<=now())
        and (ends_at is null or ends_at>=now())
        and (max_uses is null or uses_count<max_uses)
      for update;
    if not found then raise exception 'Invalid coupon'; end if;
    if v_subtotal < v_coupon.min_order then raise exception 'Coupon minimum not reached'; end if;
    if v_coupon.discount_type='percent' then
      v_discount := round(v_subtotal*least(v_coupon.discount_value,100)/100,2);
    else
      v_discount := least(v_coupon.discount_value,v_subtotal);
    end if;
  end if;

  v_total := greatest(0,v_subtotal-v_discount+v_delivery_fee);

  insert into public.orders(
    user_id,delivery_zone_id,delivery_zone_name,delivery_address,delivery_reference,
    fulfillment_type,payment_method,subtotal,delivery_fee,discount,total,coupon_code,notes
  ) values (
    v_user,case when p_fulfillment_type='delivery' then v_zone.id else null end,
    case when p_fulfillment_type='delivery' then v_zone.name else 'Retiro en tienda' end,
    case when p_fulfillment_type='delivery' then trim(p_address) else 'Av. Blandín con Calle Mata de Coco, La Castellana, Caracas' end,
    nullif(trim(coalesce(p_reference,'')),''),p_fulfillment_type,p_payment_method,
    v_subtotal,v_delivery_fee,v_discount,v_total,nullif(trim(coalesce(p_coupon_code,'')),''),nullif(trim(coalesce(p_notes,'')),'')
  ) returning id,order_number into v_order_id,v_order_number;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := greatest(1,coalesce((v_item->>'quantity')::int,1));
    select * into v_product from public.products where source_key=(v_item->>'product_id');
    insert into public.order_items(order_id,product_id,product_name,size,unit_price,quantity,line_total)
    values(v_order_id,v_product.id,
      concat_ws(' ',(select name from public.brands where id=v_product.brand_id),v_product.name),
      v_product.size,coalesce(v_product.sale_price,v_product.price),v_qty,
      coalesce(v_product.sale_price,v_product.price)*v_qty);
    update public.products set stock=stock-v_qty where id=v_product.id;
  end loop;

  if v_coupon.id is not null then update public.coupons set uses_count=uses_count+1 where id=v_coupon.id; end if;
  insert into public.order_status_history(order_id,status,changed_by) values(v_order_id,'pending',v_user);

  return jsonb_build_object('id',v_order_id,'order_number',v_order_number,'subtotal',v_subtotal,'delivery_fee',v_delivery_fee,'discount',v_discount,'total',v_total);
end;
$$;

revoke all on function public.create_order(text,text,text,text,text,text,text,jsonb) from public;
grant execute on function public.create_order(text,text,text,text,text,text,text,jsonb) to authenticated;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.delivery_zones enable row level security;
alter table public.promotions enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.favorites enable row level security;
alter table public.notifications enable row level security;
alter table public.store_settings enable row level security;

create policy profiles_select on public.profiles for select using(id=auth.uid() or public.is_staff());
create policy profiles_update on public.profiles for update using(id=auth.uid() or public.is_staff()) with check(id=auth.uid() or public.is_staff());
create policy addresses_own on public.addresses for all using(user_id=auth.uid() or public.is_staff()) with check(user_id=auth.uid() or public.is_staff());
create policy categories_read on public.categories for select using(active=true or public.is_staff());
create policy categories_staff on public.categories for all using(public.is_staff()) with check(public.is_staff());
create policy brands_read on public.brands for select using(active=true or public.is_staff());
create policy brands_staff on public.brands for all using(public.is_staff()) with check(public.is_staff());
create policy products_read on public.products for select using(active=true or public.is_staff());
create policy products_staff on public.products for all using(public.is_staff()) with check(public.is_staff());
create policy zones_read on public.delivery_zones for select using(active=true or public.is_staff());
create policy zones_staff on public.delivery_zones for all using(public.is_staff()) with check(public.is_staff());
create policy promotions_read on public.promotions for select using(active=true or public.is_staff());
create policy promotions_staff on public.promotions for all using(public.is_staff()) with check(public.is_staff());
create policy coupons_staff on public.coupons for all using(public.is_staff()) with check(public.is_staff());
create policy orders_read on public.orders for select using(user_id=auth.uid() or public.is_staff());
create policy orders_staff_update on public.orders for update using(public.is_staff()) with check(public.is_staff());
create policy order_items_read on public.order_items for select using(exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.is_staff())));
create policy order_items_staff on public.order_items for all using(public.is_staff()) with check(public.is_staff());
create policy history_read on public.order_status_history for select using(exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.is_staff())));
create policy history_staff on public.order_status_history for all using(public.is_staff()) with check(public.is_staff());
create policy favorites_own on public.favorites for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy notifications_read on public.notifications for select using(user_id=auth.uid() or public.is_staff());
create policy notifications_update on public.notifications for update using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy notifications_staff_insert on public.notifications for insert with check(public.is_staff());
create policy settings_read on public.store_settings for select using(true);
create policy settings_staff on public.store_settings for all using(public.is_staff()) with check(public.is_staff());

insert into public.categories(name,slug,sort_order) values
('Ron','ron',1),('Whisky','whisky',2),('Vodka','vodka',3),('Tequila','tequila',4),('Vino','vino',5),('Cerveza','cerveza',6),('Otros','otros',7);

insert into public.delivery_zones(name,fee,min_order,sort_order) values
('La Castellana',2,0,1),('Altamira',2,0,2),('Los Palos Grandes',2,0,3),('Chacao',3,0,4),('El Rosal',3,0,5),('Las Mercedes',4,0,6);

insert into public.store_settings(key,value) values
('business',jsonb_build_object('name','CELICOR La Castellana','currency','USD','whatsapp','584242583500','phone','+582122634948','address','Av. Blandín con Calle Mata de Coco, La Castellana, Caracas'));
