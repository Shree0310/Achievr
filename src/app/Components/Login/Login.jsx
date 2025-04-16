"use client"

import { demoLogin } from "@/app/actions/auth";
import { useState } from "react";
import Image from "next/image";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);

    const handleDemoLogin = async () => {
        setIsDemoLoading(true);
        try {
            await demoLogin();
        } catch (error) {
            console.error("Demo login error:", error);
            setIsDemoLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
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

                {/* Sign In Options */}
                <div className="space-y-6">
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

                    {/* Coming Soon Section */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">More options coming soon</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    <p>By continuing, you agree to Achievr's Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
}

export default Login;