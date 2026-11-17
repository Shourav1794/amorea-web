import { NextResponse } from 'next/server';
import { getProductSize } from '@/utils/cart';
import { createClient } from '@/utils/supabase/server';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function getAuthenticatedClient() {
  const supabase = await createClient();
  if (!supabase) {
    return { response: NextResponse.json({ error: 'Authentication is unavailable right now.' }, { status: 503 }) };
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { response: NextResponse.json({ error: 'Sign in to access your saved cart.' }, { status: 401 }) };
  }

  return { supabase, user };
}

export async function GET() {
  const auth = await getAuthenticatedClient();
  if ('response' in auth) return auth.response;

  const { data, error } = await auth.supabase
    .from('customer_cart_items')
    .select('product_id, size, quantity')
    .eq('user_id', auth.user.id)
    .order('product_id')
    .order('size');

  if (error) {
    console.error('Unable to load the customer cart.', error);
    return NextResponse.json({ error: 'Unable to load your saved cart.' }, { status: 500 });
  }

  return NextResponse.json(
    { items: data },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedClient();
  if ('response' in auth) return auth.response;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'The cart request must contain valid JSON.' }, { status: 400 });
  }
  if (!isRecord(payload)
    || typeof payload.productId !== 'number'
    || !Number.isInteger(payload.productId)
    || typeof payload.quantity !== 'number'
    || !Number.isInteger(payload.quantity)
    || payload.quantity < 1
    || payload.quantity > 999) {
    return NextResponse.json({ error: 'The cart item or quantity is invalid.' }, { status: 400 });
  }

  const size = getProductSize(payload.productId, payload.size);
  if (size === null) {
    return NextResponse.json({ error: 'Choose a valid size for this product.' }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from('customer_cart_items')
    .upsert(
      {
        user_id: auth.user.id,
        product_id: payload.productId,
        size,
        quantity: payload.quantity,
      },
      { onConflict: 'user_id,product_id,size' },
    );

  if (error) {
    console.error('Unable to save a customer cart item.', error);
    return NextResponse.json({ error: 'Unable to save this cart item.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const auth = await getAuthenticatedClient();
  if ('response' in auth) return auth.response;

  const url = new URL(request.url);
  const productId = Number(url.searchParams.get('productId'));
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: 'Choose a valid cart item.' }, { status: 400 });
  }

  const size = getProductSize(productId, url.searchParams.get('size') ?? '');
  if (size === null) {
    return NextResponse.json({ error: 'Choose a valid size for this product.' }, { status: 400 });
  }

  const { error } = await auth.supabase
    .from('customer_cart_items')
    .delete()
    .eq('user_id', auth.user.id)
    .eq('product_id', productId)
    .eq('size', size);

  if (error) {
    console.error('Unable to remove a customer cart item.', error);
    return NextResponse.json({ error: 'Unable to remove this cart item.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
