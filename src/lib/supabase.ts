import { createClient } from '@supabase/supabase-js';

// These will need to be replaced with your actual Supabase URL and anon key
// You can find these in your Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);