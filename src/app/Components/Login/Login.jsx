"use client"

import { demoLogin } from "@/app/actions/auth";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check authentication state on mounting
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    // User is already authenticated, redirect to board
                    router.push('/board');
                    return;
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
            } finally {
                setIsCheckingAuth(false);
            }
        };
        
        checkAuth();
    }, [router]);

    // Handle error parameters from URL
    useEffect(() => {
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('description');
        
        if (errorParam) {
            switch (errorParam) {
                case 'authentication_failed':
                    setError('Authentication failed. Please try again.');
                    break;
                case 'no_session':
                    setError('Session creation failed. Please try again.');
                    break;
                case 'unexpected_error':
                    setError('An unexpected error occurred. Please try again.');
                    break;
                case 'no_code':
                    setError('Invalid authentication request. Please try again.');
                    break;
                case 'oauth_error':
                    setError(errorDescription || 'OAuth authentication failed. Please try again.');
                    break;
                default:
                    setError('An error occurred during sign in. Please try again.');
            }
        }
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Get the current site URL dynamically
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                           (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
            
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${siteUrl}/auth/callback?provider=google`
                }
            });

            if (error) {
                throw error;
            }
            // Don't set loading to false here as the page will redirect
        } catch (error) {
            console.error("Google sign in error:", error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsDemoLoading(true);
        setError('');
        try {
            // Set demo mode in localStorage directly
            localStorage.setItem('demoMode', 'true');
            localStorage.setItem('demoUser', JSON.stringify({
                id: 'demo-user-id',
                email: 'demo@example.com',
                user_metadata: {
                    name: 'Demo User'
                }
            }));
            
            // Navigate to the board page
            router.push('/board');
        } catch (error) {
            console.error("Demo login error:", error);
            setError(error.message);
        } finally {
            setIsDemoLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            {isCheckingAuth ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-[1.01]">
                    {/* Logo and App Name */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative h-16 w-16">
                            <Image
                                src="/logo.svg"
                                alt="Achievr Logo"
                                width={64}
                                height={64}
                                className="h-16 w-16"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Welcome to Achievr</h1>
                        <p className="text-center text-gray-600">Your personal task management and productivity companion</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Sign In Options */}
                    <div className="space-y-4">
                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            )}
                            <span className="text-sm font-medium">
                                {isLoading ? 'Signing in...' : 'Sign in with Google'}
                            </span>
                        </button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or</span>
                            </div>
                        </div>

                        {/* Demo Login Button */}
                        <button
                            onClick={handleDemoLogin}
                            disabled={isDemoLoading}
                            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isDemoLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isDemoLoading ? (
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
                                {isDemoLoading ? 'Entering demo...' : 'Try Demo Version'}
                            </span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500">
                        <p>By continuing, you agree to Achievr's Terms of Service and Privacy Policy</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;