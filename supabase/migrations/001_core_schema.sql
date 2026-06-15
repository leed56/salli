create extension if not exists pgcrypto;

create type user_role as enum ('owner', 'cashier');
create type subscription_plan as enum ('free', 'standard', 'pro');
create type subscription_status as enum ('trial', 'active', 'past_due', 'cancelled');

create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vat_number text,
  quarter_start_month integer not null default 4,
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tenant_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role user_role not null default 'cashier',
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  plan subscription_plan not null default 'free',
  status subscription_status not null default 'trial',
  current_period_start date,
  current_period_end date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  barcode text,
  cost_price numeric(12,2) not null default 0,
  sell_price numeric(12,2) not null default 0,
  stock_qty numeric(12,3) not null default 0,
  reorder_level numeric(12,3) not null default 0,
  vat_inclusive boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  phone text,
  balance numeric(12,2) not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table suppliers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  phone text,
  balance numeric(12,2) not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sales (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  customer_id uuid references customers(id),
  sale_no text,
  subtotal numeric(12,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_type text not null check (payment_type in ('cash', 'credit')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sale_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  sale_id uuid not null references sales(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  qty numeric(12,3) not null,
  unit_price numeric(12,2) not null,
  vat_amount numeric(12,2) not null default 0,
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table purchases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  supplier_id uuid references suppliers(id),
  supplier_name text,
  bill_photo_path text,
  status text not null default 'draft' check (status in ('draft', 'confirmed', 'void')),
  subtotal numeric(12,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_by uuid references auth.users(id),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table purchase_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  purchase_id uuid not null references purchases(id) on delete cascade,
  product_id uuid references products(id),
  name text not null,
  qty numeric(12,3) not null,
  unit_cost numeric(12,2) not null,
  vat_amount numeric(12,2) not null default 0,
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  category text not null,
  note text,
  amount numeric(12,2) not null,
  vat_amount numeric(12,2) not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table cash_drawer_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  expected_cash numeric(12,2) not null default 0,
  counted_cash numeric(12,2) not null default 0,
  variance numeric(12,2) not null default 0,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table vat_periods (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  output_vat numeric(12,2) not null default 0,
  input_vat numeric(12,2) not null default 0,
  net_payable numeric(12,2) not null default 0,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, period_start, period_end)
);
