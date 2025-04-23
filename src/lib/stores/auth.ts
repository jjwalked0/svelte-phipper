import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);

// Initialize the store by checking for an existing session
export async function initializeAuth() {
  console.log('Initializing auth store...');
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      loading.set(false);
      return;
    }
    
    console.log('Session data retrieved:', data.session ? 'Session exists' : 'No active session');
    
    if (data.session) {
      console.log('User authenticated:', data.session.user.email);
      user.set(data.session.user);
    } else {
      console.log('No authenticated user');
      user.set(null);
    }
  } catch (err) {
    console.error('Unexpected error during auth initialization:', err);
  } finally {
    loading.set(false);
  }
  
  // Listen for auth state changes
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state change event:', event);
    
    if (session && session.user) {
      console.log('User authenticated via state change:', session.user.email);
      user.set(session.user);
    } else {
      console.log('User signed out or session expired');
      user.set(null);
    }
  });
  
  return () => {
    data.subscription.unsubscribe();
  };
}

export async function signOut() {
  console.log('Signing out user...');
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      console.log('User signed out successfully');
      user.set(null);
    }
  } catch (err) {
    console.error('Unexpected error during sign out:', err);
  }
}