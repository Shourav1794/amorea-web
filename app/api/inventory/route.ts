import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Inventory is unavailable right now.' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('product_inventory')
    .select('product_id, size, stock')
    .order('product_id')
    .order('size');

  if (error) {
    console.error('Unable to load product inventory.', error);
    return NextResponse.json({ error: 'Unable to load product availability.' }, { status: 500 });
  }

  return NextResponse.json(
    { items: data },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
