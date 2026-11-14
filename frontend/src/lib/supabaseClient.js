import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or fallback to demo placeholder
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-kshetram.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const isSupabaseLive = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'https://demo-kshetram.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

