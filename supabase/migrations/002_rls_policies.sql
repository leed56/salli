alter table tenants enable row level security;
alter table tenant_members enable row level security;
alter table subscriptions enable row level security;
alter table products enable row level security;
alter table customers enable row level security;
alter table suppliers enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;
alter table purchases enable row level security;
alter table purchase_items enable row level security;
alter table expenses enable row level security;
alter table cash_drawer_logs enable row level security;
alter table vat_periods enable row level security;

create or replace function public.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from tenant_members tm
    where tm.tenant_id = target_tenant_id
      and tm.user_id = auth.uid()
  );
$$;

create or replace function public.is_tenant_owner(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from tenant_members tm
    where tm.tenant_id = target_tenant_id
      and tm.user_id = auth.uid()
      and tm.role = 'owner'
  );
$$;

create policy tenants_member_select
on tenants for select
using (public.is_tenant_member(id));

create policy tenants_owner_update
on tenants for update
using (public.is_tenant_owner(id))
with check (public.is_tenant_owner(id));

create policy tenant_members_member_select
on tenant_members for select
using (public.is_tenant_member(tenant_id));

create policy tenant_members_owner_write
on tenant_members for all
using (public.is_tenant_owner(tenant_id))
with check (public.is_tenant_owner(tenant_id));

create policy subscriptions_owner_select
on subscriptions for select
using (public.is_tenant_owner(tenant_id));

create policy subscriptions_owner_write
on subscriptions for all
using (public.is_tenant_owner(tenant_id))
with check (public.is_tenant_owner(tenant_id));

create policy products_member_select
on products for select
using (public.is_tenant_member(tenant_id));

create policy products_owner_write
on products for all
using (public.is_tenant_owner(tenant_id))
with check (public.is_tenant_owner(tenant_id));

create policy customers_member_select
on customers for select
using (public.is_tenant_member(tenant_id));

create policy customers_member_write
on customers for all
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy suppliers_owner_select
on suppliers for select
using (public.is_tenant_owner(tenant_id));

create policy suppliers_owner_write
on suppliers for all
using (public.is_tenant_owner(tenant_id))
with check (public.is_tenant_owner(tenant_id));

create policy sales_member_select
on sales for select
using (public.is_tenant_member(tenant_id));

create policy sales_member_write
on sales for all
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy sale_items_member_select
on sale_items for select
using (public.is_tenant_member(tenant_id));

create policy sale_items_member_write
on sale_items for all
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create policy purchases_owner_select
on purchases for select
using (public.is_tenant_owner(tenant_id));

create policy purchases_owner_write
on purchases for all
using (public.is_tenant_owner(tenant_id))
with check (public.is_tenant_owner(tenant_id));

create policy purchase_items_owner_select
on purchase_items for select
using (public.is_tenant_owner(tenant_id));

create policy purchase_items_owner_write
on purchase_items for all
using (public.is_tenant_owner(tenant_id))
with check (public.is_tenant_owner(tenant_id));

create policy expenses_owner_select
on expenses for select
using (public.is_tenant_owner(tenant_id));

create policy expenses_owner_write
on expenses for all
using (public.is_tenant_owner(tenant_id))
with check (public.is_tenant_owner(tenant_id));

create policy cash_drawer_logs_owner_select
on cash_drawer_logs for select
using (public.is_tenant_owner(tenant_id));

create policy cash_drawer_logs_member_insert
on cash_drawer_logs for insert
with check (public.is_tenant_member(tenant_id));

create policy vat_periods_owner_select
on vat_periods for select
using (public.is_tenant_owner(tenant_id));

create policy vat_periods_owner_write
on vat_periods for all
using (public.is_tenant_owner(tenant_id))
with check (public.is_tenant_owner(tenant_id));
