import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase auth is not configured. Authentication is temporarily unavailable.');
    return null;
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
