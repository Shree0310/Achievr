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
    
    // Get the current site URL dynamically
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback?provider=google`,
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
    
    // Set demo mode in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoUser', JSON.stringify({
        id: 'demo-user-id',
        email: 'demo@example.com',
        user_metadata: {
          name: 'Demo User'
        }
      }));
    }

    console.log('Demo session created successfully!');
    return { success: true, url: '/' };
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