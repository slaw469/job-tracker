import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Debug logs to verify env wiring (remove in production if desired)
// eslint-disable-next-line no-console
console.log('Supabase URL:', SUPABASE_URL);
// eslint-disable-next-line no-console
console.log('Supabase Anon Key:', SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)
  : null;

export async function connectGmail(): Promise<{ success: boolean; error?: unknown }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'https://www.googleapis.com/auth/gmail.readonly',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      },
      redirectTo: `${window.location.origin}/dashboard`
    }
  });

  if (error) {
    return { success: false, error };
  }
  return { success: true };
}


