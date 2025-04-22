import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);

// Initialize the store by checking for an existing session
export async function initializeAuth() {
  const { data } = await supabase.auth.getSession();
  
  if (data.session) {
    user.set(data.session.user);
  }
  
  loading.set(false);
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      user.set(session.user);
    } else {
      user.set(null);
    }
  });
}

export async function signOut() {
  await supabase.auth.signOut();
  user.set(null);
}