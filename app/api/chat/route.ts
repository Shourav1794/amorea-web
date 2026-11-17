import { NextResponse } from 'next/server';
import { getStylistReplyKey } from '@/utils/stylist';
import { createClient } from '@/utils/supabase/server';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Authentication is unavailable right now.' }, { status: 503 });
  }
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Sign in to view your chat history.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('customer_chat_messages')
    .select('id, sender, content, language, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Unable to load chat history.', error);
    return NextResponse.json({ error: 'Unable to load chat history.' }, { status: 500 });
  }

  return NextResponse.json(
    { messages: data.reverse() },
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
    return NextResponse.json({ error: 'Sign in before sending a message.' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'The message request must contain valid JSON.' }, { status: 400 });
  }
  if (!isRecord(payload)) {
    return NextResponse.json({ error: 'The message request must be a JSON object.' }, { status: 400 });
  }

  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const language = payload.language;
  if (message.length < 1 || message.length > 1000) {
    return NextResponse.json({ error: 'Messages must be between 1 and 1000 characters.' }, { status: 400 });
  }
  if (language !== 'en' && language !== 'bn') {
    return NextResponse.json({ error: 'Choose a supported language.' }, { status: 400 });
  }

  const replyKey = getStylistReplyKey(message);
  const { error } = await supabase.from('customer_chat_messages').insert([
    { user_id: user.id, sender: 'user', content: message, language },
    { user_id: user.id, sender: 'assistant', content: replyKey, language },
  ]);

  if (error) {
    console.error('Unable to save chat messages.', error);
    return NextResponse.json({ error: 'Unable to save your message. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ replyKey });
}
