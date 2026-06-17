-- Extend sale recording to support credit sales tied to a customer.
--
-- Replaces record_sale with a version that accepts a customer id; for credit
-- sales it increments the customer's outstanding balance. Cash sales pass a null
-- customer. Still SECURITY DEFINER + tenant-member authorized.

drop function if exists public.record_sale(uuid, text, numeric, numeric, numeric, jsonb);

create or replace function public.record_sale(
  p_tenant_id uuid,
  p_payment_type text,
  p_customer_id uuid,
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
  v_sale_id uuid;
  v_item jsonb;
  v_product_id uuid;
begin
  if v_user_id is null or not public.is_tenant_member(p_tenant_id) then
    raise exception 'Not authorized for this shop.';
  end if;

  if p_payment_type not in ('cash', 'credit') then
    raise exception 'Invalid payment type.';
  end if;

  insert into sales (tenant_id, customer_id, payment_type, subtotal, vat_amount, total, created_by)
  values (p_tenant_id, p_customer_id, p_payment_type, p_subtotal, p_vat_amount, p_total, v_user_id)
  returning id into v_sale_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := nullif(v_item->>'product_id', '')::uuid;

    insert into sale_items (tenant_id, sale_id, product_id, name, qty, unit_price, vat_amount, line_total)
    values (
      p_tenant_id,
      v_sale_id,
      v_product_id,
      v_item->>'name',
      (v_item->>'qty')::numeric,
      (v_item->>'unit_price')::numeric,
      (v_item->>'vat_amount')::numeric,
      (v_item->>'line_total')::numeric
    );

    if v_product_id is not null then
      update products
        set stock_qty = stock_qty - (v_item->>'qty')::numeric,
            updated_at = now()
      where id = v_product_id and tenant_id = p_tenant_id;
    end if;
  end loop;

  if p_payment_type = 'credit' and p_customer_id is not null then
    update customers
      set balance = balance + p_total,
          updated_at = now()
    where id = p_customer_id and tenant_id = p_tenant_id;
  end if;

  return v_sale_id;
end;
$$;

grant execute on function public.record_sale(uuid, text, uuid, numeric, numeric, numeric, jsonb) to authenticated;
