"use client"

import { useEffect, useState } from "react";
import Board from "./Components/Board/Board";
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import SubHeader from "./Components/SubHeader/SubHeader";
import Stages from "./Components/Stages/Stages";
import Link from "next/link";
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

// Extend the Supabase User type
type ExtendedUser = User & {
    isDemo?: boolean;
};

export default function Home() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();

  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setError('Failed to check authentication status');
        }
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    getSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user || null);
      }
    );
    
    return () => {
      // Clean up the subscription when the component unmounts
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the current URL origin
      const origin = window.location.origin;
      
      // Sign in anonymously or create new demo user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo123456'
      });

      if (signInError) {
        // If demo user doesn't exist, create one
        if (signInError.message.includes('Invalid login credentials')) {
          const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
            email: 'demo@example.com',
            password: 'demo123456',
            options: {
              data: {
                is_demo: true
              }
            }
          });

          if (signUpError) throw signUpError;
          if (!newUser) throw new Error('Failed to create demo user');
        } else {
          throw signInError;
        }
      }

      // Set demo user state
      setUser({
        id: 'demo-user-id',
        email: 'demo@example.com',
        isDemo: true
      } as ExtendedUser);

      // Redirect to board page using the current origin
      router.push(`${origin}/board`);
    } catch (error) {
      console.error('Demo login error:', error);
      setError('Failed to start demo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-[1.01]">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">Welcome to Achievr</h1>
              <p className="text-gray-600">Please sign in to access your tasks and cycles</p>
            </div>
            
            {error && (
              <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <div className="w-full space-y-4">
              <button
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center space-x-3 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium">Try Demo Version</span>
              </button>

              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Sign In
                </Link>
                
                <span className="text-gray-500">or</span>
                
                <Link 
                  href="/auth"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Create Account
                </Link>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Navbar */}
      <div className="relative w-full md:w-auto md:h-screen">
        <div className="h-auto md:h-full flex-shrink-0">
          <Navbar />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* Fixed header area */}
        <div className="flex-shrink-0">
          <Header user={user} />
          <SubHeader />
          <Board />
        </div>
        
        {/* Stages component - explicitly take all remaining space */}
        <div className="flex-1 overflow-hidden">
          <Stages />
        </div>
      </div>
    </div>
  );
}