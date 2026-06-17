-- Atomic supplier-bill recording with stock movement (self-building catalogue).
--
-- Confirming a supplier bill must insert the purchase + items AND increase stock:
-- each line is matched to an existing product by name (case-insensitive); if none
-- exists, a product is created (cost + sell price seeded from the bill). Runs as a
-- SECURITY DEFINER function restricted to tenant owners (bills are owner-only).

create or replace function public.record_purchase(
  p_tenant_id uuid,
  p_supplier_name text,
  p_subtotal numeric,
  p_vat_amount numeric,
  p_total numeric,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_purchase_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_name text;
  v_qty numeric;
  v_cost numeric;
begin
  if v_user_id is null or not public.is_tenant_owner(p_tenant_id) then
    raise exception 'Not authorized for this shop.';
  end if;

  insert into purchases (tenant_id, supplier_name, status, subtotal, vat_amount, total, created_by, confirmed_at)
  values (p_tenant_id, nullif(p_supplier_name, ''), 'confirmed', p_subtotal, p_vat_amount, p_total, v_user_id, now())
  returning id into v_purchase_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_name := v_item->>'name';
    v_qty := (v_item->>'qty')::numeric;
    v_cost := (v_item->>'unit_cost')::numeric;

    select id into v_product_id
    from products
    where tenant_id = p_tenant_id and lower(name) = lower(v_name)
    limit 1;

    if v_product_id is null then
      insert into products (tenant_id, name, cost_price, sell_price, stock_qty, vat_inclusive, created_by)
      values (p_tenant_id, v_name, v_cost, v_cost, v_qty, true, v_user_id)
      returning id into v_product_id;
    else
      update products
        set stock_qty = stock_qty + v_qty,
            cost_price = v_cost,
            updated_at = now()
      where id = v_product_id;
    end if;

    insert into purchase_items (tenant_id, purchase_id, product_id, name, qty, unit_cost, vat_amount, line_total)
    values (
      p_tenant_id,
      v_purchase_id,
      v_product_id,
      v_name,
      v_qty,
      v_cost,
      (v_item->>'vat_amount')::numeric,
      (v_item->>'line_total')::numeric
    );
  end loop;

  return v_purchase_id;
end;
$$;

grant execute on function public.record_purchase(uuid, text, numeric, numeric, numeric, jsonb) to authenticated;
