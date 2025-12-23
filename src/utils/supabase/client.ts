"use client"

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Expose to window to avoid "ReferenceError: supabase is not defined" from non-module chunks
if (typeof window !== 'undefined') {
  // @ts-ignore - intentionally attach for legacy/global usage
  window.supabase = supabase
}