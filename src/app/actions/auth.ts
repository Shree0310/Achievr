'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set(name, value, options)
        },
        remove(name, options) {
          cookieStore.set(name, '', { ...options, maxAge: -1 })
        },
      },
    }
  )
}

export async function signInWithGoogle() {
  try {
    const supabase = await createClient();
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  } catch (error) {
    console.error('Google sign in error:', error);
    return { 
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

export async function demoLogin() {
  try {
    console.log('Starting demo session...');
    const supabase = await createClient();
    
    // Sign in anonymously
    const { error } = await supabase.auth.signInWithPassword({
      email: 'demo@example.com',
      password: 'demo123',
    });

    if (error) {
      // If sign in fails, create a new demo user
      const { error: signUpError } = await supabase.auth.signUp({
        email: 'demo@example.com',
        password: 'demo123',
        options: {
          data: {
            name: 'Demo User',
          },
        },
      });

      if (signUpError) {
        console.error('Failed to create demo user:', signUpError);
        throw signUpError;
      }

      // Try to sign in again with the newly created user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo123',
      });

      if (signInError) {
        console.error('Failed to sign in with demo user:', signInError);
        throw signInError;
      }
    }

    console.log('Demo session created successfully!');
    return { success: true, url: 'http://localhost:3000/' };
  } catch (error) {
    console.error('Demo login error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      details: error 
    };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true, url: '/auth' };
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
} 