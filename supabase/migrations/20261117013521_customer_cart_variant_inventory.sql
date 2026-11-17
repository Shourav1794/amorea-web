create table public.product_inventory (
  product_id integer not null check (product_id between 1 and 6),
  size text not null default '',
  stock integer not null default 0 check (stock >= 0),
  primary key (product_id, size),
  check (
    (product_id in (1, 2) and size in ('S', 'M', 'L', 'XL'))
    or (product_id in (3, 4, 5, 6) and size = '')
  )
);

insert into public.product_inventory (product_id, size, stock)
values
  (1, 'S', 0), (1, 'M', 0), (1, 'L', 0), (1, 'XL', 0),
  (2, 'S', 0), (2, 'M', 0), (2, 'L', 0), (2, 'XL', 0),
  (3, '', 0), (4, '', 0), (5, '', 0), (6, '', 0)
on conflict (product_id, size) do nothing;

alter table public.customer_orders
  drop constraint customer_orders_items_check;

alter table public.customer_orders
  add constraint customer_orders_items_array_check
  check (
    jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) between 1 and 14
  );

alter table public.product_inventory enable row level security;

create policy "Anyone can view product availability"
  on public.product_inventory
  for select
  to anon, authenticated
  using (true);

revoke all on table public.product_inventory from public, anon, authenticated;
grant select on table public.product_inventory to anon, authenticated;

create table public.customer_cart_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id integer not null check (product_id between 1 and 6),
  size text not null default '',
  quantity integer not null check (quantity between 1 and 999),
  primary key (user_id, product_id, size),
  check (
    (product_id in (1, 2) and size in ('S', 'M', 'L', 'XL'))
    or (product_id in (3, 4, 5, 6) and size = '')
  )
);

alter table public.customer_cart_items enable row level security;

create policy "Customers can manage their own cart"
  on public.customer_cart_items
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.customer_cart_items from public, anon, authenticated;
grant select, insert, update, delete on table public.customer_cart_items to authenticated;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.reserve_customer_order_inventory()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  item_record record;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null or new.user_id is distinct from current_user_id then
    raise exception 'An authenticated customer can only order for themselves.'
      using errcode = '42501';
  end if;

  for item_record in
    select
      (item ->> 'productId')::integer as product_id,
      coalesce(item ->> 'size', '') as size,
      sum((item ->> 'quantity')::integer)::integer as quantity
    from jsonb_array_elements(new.items) as order_item(item)
    group by (item ->> 'productId')::integer, coalesce(item ->> 'size', '')
    order by (item ->> 'productId')::integer, coalesce(item ->> 'size', '')
  loop
    update public.product_inventory
    set stock = stock - item_record.quantity
    where product_id = item_record.product_id
      and size = item_record.size
      and stock >= item_record.quantity;

    if not found then
      raise exception 'Insufficient stock for product % (size %).',
        item_record.product_id, item_record.size
        using errcode = '23514';
    end if;
  end loop;

  delete from public.customer_cart_items
  where user_id = current_user_id;

  return new;
end;
$$;

revoke all on function private.reserve_customer_order_inventory() from public, anon, authenticated;

create trigger reserve_customer_order_inventory
  before insert on public.customer_orders
  for each row
  execute function private.reserve_customer_order_inventory();