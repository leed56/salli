-- Onboarding RLS fix.
--
-- The base RLS policies (002) intentionally restrict writes on tenants /
-- tenant_members / subscriptions to existing tenant owners. That creates a
-- chicken-and-egg deadlock for first-time onboarding: a brand-new user is not
-- yet an owner of any tenant, so they cannot insert the tenant, their owner
-- membership, or the initial subscription. There is also no INSERT policy on
-- tenants at all, so direct inserts are always denied.
--
-- Fix: a SECURITY DEFINER function that atomically creates the tenant, the
-- caller's owner membership, and a trial subscription. It runs with elevated
-- privileges (bypassing RLS for these inserts) but is safe because it always
-- binds the membership to auth.uid() and only creates a fresh tenant.

create or replace function public.create_tenant_with_owner(
  p_name text,
  p_vat_number text default null,
  p_quarter_start_month integer default 4,
  p_language text default 'en'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_tenant_id uuid;
begin
  if v_user_id is null then
    raise exception 'You must sign in before creating a shop.';
  end if;

  insert into tenants (name, vat_number, quarter_start_month, language)
  values (
    p_name,
    nullif(p_vat_number, ''),
    coalesce(p_quarter_start_month, 4),
    coalesce(p_language, 'en')
  )
  returning id into v_tenant_id;

  insert into tenant_members (tenant_id, user_id, role)
  values (v_tenant_id, v_user_id, 'owner');

  insert into subscriptions (tenant_id, plan, status)
  values (v_tenant_id, 'free', 'trial');

  return v_tenant_id;
end;
$$;

grant execute on function public.create_tenant_with_owner(text, text, integer, text) to authenticated;
