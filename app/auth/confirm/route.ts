import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type');
  const requestedNext = request.nextUrl.searchParams.get('next');
  const nextPath = requestedNext?.startsWith('/') && !requestedNext.startsWith('//')
    ? requestedNext
    : '/';

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(new URL('/?authError=confirmation', request.url));
  }

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type === 'email'
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error('The email confirmation link is incomplete.') };
  if (error) {
    console.error('Unable to confirm the new customer email.', error);
    return NextResponse.redirect(new URL('/?authError=confirmation', request.url));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
