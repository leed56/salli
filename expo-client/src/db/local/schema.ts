export const localSchemaStatements = [
  `create table if not exists sync_queue (
    id text primary key,
    entity text not null,
    operation text not null,
    payload text not null,
    status text not null default 'pending',
    attempts integer not null default 0,
    last_error text,
    created_at text not null,
    updated_at text not null
  );`,
  `create table if not exists local_products (
    id text primary key,
    tenant_id text not null,
    name text not null,
    barcode text,
    sell_price real not null default 0,
    stock_qty real not null default 0,
    updated_at text not null
  );`,
  `create table if not exists local_sales (
    id text primary key,
    tenant_id text not null,
    subtotal real not null default 0,
    vat_amount real not null default 0,
    total real not null default 0,
    payment_type text not null,
    sync_status text not null default 'pending',
    created_at text not null
  );`,
  `create table if not exists local_purchases (
    id text primary key,
    tenant_id text not null,
    supplier_name text not null,
    subtotal real not null default 0,
    vat_amount real not null default 0,
    total real not null default 0,
    confidence real not null default 0,
    sync_status text not null default 'pending',
    created_at text not null
  );`,
  `create table if not exists local_purchase_items (
    id text primary key,
    purchase_id text not null,
    name text not null,
    qty real not null default 0,
    unit_cost real not null default 0,
    line_total real not null default 0,
    vat_amount real not null default 0,
    stock_status text not null default 'pending',
    foreign key (purchase_id) references local_purchases(id)
  );`,
];
