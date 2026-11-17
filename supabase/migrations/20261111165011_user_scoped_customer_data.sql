create table public.customer_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text not null check (char_length(btrim(customer_name)) between 2 and 120),
  phone text not null check (
    char_length(phone) between 7 and 24
    and phone ~ '^[+0-9[:space:]().-]+$'
  ),
  address text not null check (char_length(btrim(address)) between 5 and 500),
  delivery_zone text not null check (delivery_zone in ('inside', 'outside')),
  items jsonb not null check (
    jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) between 1 and 6
  ),
  subtotal integer not null check (subtotal > 0),
  delivery_charge integer not null check (
    (delivery_zone = 'inside' and delivery_charge = 80)
    or (delivery_zone = 'outside' and delivery_charge = 150)
  ),
  total integer not null check (total = subtotal + delivery_charge),
  created_at timestamptz not null default now()
);

create index customer_orders_user_created_at_idx
  on public.customer_orders (user_id, created_at desc);

alter table public.customer_orders enable row level security;

create policy "Customers can read their own orders"
  on public.customer_orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Customers can create their own orders"
  on public.customer_orders
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and not exists (
      select 1
      from jsonb_array_elements(items) as order_item(item)
      where coalesce((order_item.item ->> 'productId')::integer, 0) not between 1 and 6
        or coalesce((order_item.item ->> 'quantity')::integer, 0) not between 1 and 999
        or coalesce((order_item.item ->> 'unitPrice')::integer, 0) <> case (order_item.item ->> 'productId')::integer
          when 1 then 8500
          when 2 then 12200
          when 3 then 2450
          when 4 then 1850
          when 5 then 3950
          when 6 then 4200
        end
    )
    and subtotal = (
      select sum(
        (order_item.item ->> 'unitPrice')::integer
        * (order_item.item ->> 'quantity')::integer
      )
      from jsonb_array_elements(items) as order_item(item)
    )
  );

create table public.customer_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  sender text not null check (sender in ('user', 'assistant')),
  content text not null check (char_length(btrim(content)) between 1 and 1000),
  language text not null check (language in ('en', 'bn')),
  created_at timestamptz not null default now()
);

create index customer_chat_messages_user_created_at_idx
  on public.customer_chat_messages (user_id, created_at desc);

alter table public.customer_chat_messages enable row level security;

create policy "Customers can read their own chat messages"
  on public.customer_chat_messages
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Customers can create their own chat messages"
  on public.customer_chat_messages
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on table public.customer_orders, public.customer_chat_messages from anon, authenticated;
grant select, insert on table public.customer_orders, public.customer_chat_messages to authenticated;