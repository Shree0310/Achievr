"use client"

import { useEffect, useState, useTransition } from "react";
import Board from "./Components/Board/Board";
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import SubHeader from "./Components/SubHeader/SubHeader";
import Stages from "./Components/Stages/Stages";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
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
      // Set demo mode flag in localStorage
      localStorage.setItem('demoMode', 'true');
      
      // Create a demo user object with all required properties
      const demoUser: User = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        user_metadata: {
          name: 'Demo User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString()
      };

      // Update the user state with demo user
      setUser(demoUser);

      // Redirect to the board page
      router.push('/board');
    } catch (error) {
      console.error('Demo login error:', error);
      setError('Failed to start demo mode. Please try again.');
    }
  };

  if (loading && !isDemoMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user && !isDemoMode) {
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
                disabled={isPending}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isPending ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
                <span className="text-sm font-medium">
                  {isPending ? 'Entering demo...' : 'Try Demo Version'}
                </span>
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