import { NextResponse } from 'next/server';
import { products } from '@/utils/catalog';
import { getProductSize, type ProductSize } from '@/utils/cart';
import { createClient } from '@/utils/supabase/server';

type RequestedItem = {
  id: number;
  size?: unknown;
  quantity: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRequestedItem(value: unknown): value is RequestedItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'number'
    && Number.isInteger(item.id)
    && typeof item.quantity === 'number'
    && Number.isInteger(item.quantity);
}

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Authentication is unavailable right now.' }, { status: 503 });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Sign in to view your orders.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('customer_orders')
    .select('id, customer_name, delivery_zone, items, subtotal, delivery_charge, total, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Unable to load customer orders.', error);
    return NextResponse.json({ error: 'Unable to load orders.' }, { status: 500 });
  }

  return NextResponse.json(
    { orders: data },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Authentication is unavailable right now.' }, { status: 503 });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Sign in before placing an order.' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'The order request must contain valid JSON.' }, { status: 400 });
  }
  if (!isRecord(payload)) {
    return NextResponse.json({ error: 'The order request must be a JSON object.' }, { status: 400 });
  }

  const customerName = typeof payload.customerName === 'string' ? payload.customerName.trim() : '';
  const customerPhone = typeof payload.customerPhone === 'string' ? payload.customerPhone.trim() : '';
  const customerAddress = typeof payload.customerAddress === 'string' ? payload.customerAddress.trim() : '';
  const deliveryZone = payload.deliveryZone;

  if (customerName.length < 2 || customerName.length > 120) {
    return NextResponse.json({ error: 'Enter a name between 2 and 120 characters.' }, { status: 400 });
  }
  if (customerPhone.length < 7 || customerPhone.length > 24 || !/^[+\d\s().-]+$/.test(customerPhone)) {
    return NextResponse.json({ error: 'Enter a valid phone number.' }, { status: 400 });
  }
  if (customerAddress.length < 5 || customerAddress.length > 500) {
    return NextResponse.json({ error: 'Enter a delivery address between 5 and 500 characters.' }, { status: 400 });
  }
  if (deliveryZone !== 'inside' && deliveryZone !== 'outside') {
    return NextResponse.json({ error: 'Choose a valid delivery area.' }, { status: 400 });
  }
  const inputItems = payload.items;
  if (!Array.isArray(inputItems) || inputItems.length < 1 || inputItems.length > 14) {
    return NextResponse.json({ error: 'Your cart is empty or invalid.' }, { status: 400 });
  }

  const requestedItems = inputItems.filter(isRequestedItem);
  if (requestedItems.length !== inputItems.length) {
    return NextResponse.json({ error: 'Your cart contains an invalid item.' }, { status: 400 });
  }

  const quantities = new Map<string, { id: number; size: ProductSize; quantity: number }>();
  for (const item of requestedItems) {
    const size = getProductSize(item.id, item.size);
    if (size === null || item.quantity < 1 || item.quantity > 999) {
      return NextResponse.json({ error: 'Your cart contains an invalid item quantity.' }, { status: 400 });
    }
    const key = `${item.id}:${size}`;
    const quantity = (quantities.get(key)?.quantity ?? 0) + item.quantity;
    if (quantity > 999) {
      return NextResponse.json({ error: 'Your cart contains an invalid item quantity.' }, { status: 400 });
    }
    quantities.set(key, { id: item.id, size, quantity });
  }

  const orderItems = [...quantities.values()].map(({ id, size, quantity }) => {
    const product = products.find((candidate) => candidate.id === id);
    if (!product) throw new Error(`Catalog product ${id} disappeared during order creation.`);
    return {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      size,
      quantity,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryCharge = deliveryZone === 'inside' ? 80 : 150;
  const { data, error } = await supabase
    .from('customer_orders')
    .insert({
      user_id: user.id,
      customer_name: customerName,
      phone: customerPhone,
      address: customerAddress,
      delivery_zone: deliveryZone,
      items: orderItems,
      subtotal,
      delivery_charge: deliveryCharge,
      total: subtotal + deliveryCharge,
    })
    .select('id, total, created_at')
    .single();

  if (error) {
    console.error('Unable to save customer order.', error);
    if (error.code === '23514' && error.message.includes('Insufficient stock')) {
      return NextResponse.json(
        { error: 'One or more items no longer have enough stock. Update your cart and try again.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Unable to save your order. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ order: data }, { status: 201 });
}
