import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log out the Supabase URL being used (excluding the key for security)
console.log('Supabase URL being used:', supabaseUrl);
console.log('Using real Supabase credentials:', supabaseUrl !== 'https://placeholder-project.supabase.co');

// Create a Supabase client with debug options in development
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});