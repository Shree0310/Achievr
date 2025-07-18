"use client";

import UserName from "../UserName/UserName";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

const Header = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Check demo mode status on client side
    const checkDemoMode = () => {
      if (typeof window !== "undefined") {
        setIsDemoMode(
          user?.email === "demo@example.com" ||
            localStorage.getItem("demoMode") === "true"
        );
      }
    };
    checkDemoMode();
  }, [user]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Clear local storage only if it's available
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      try {
        // Attempt to sign out from Supabase, but don't block on errors
        await supabase.auth.signOut();
      } catch (error) {
        console.log(
          "Supabase sign out failed, but continuing with cleanup:",
          error
        );
      }

      // Force a hard refresh to the auth page
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, redirect to auth page
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {currentMonth} {currentYear}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {!isDemoMode && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              )}
              {isLoading ? "Signing out..." : "Sign out"}
            </button>
          )}
          {isDemoMode ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Demo Mode</span>
              <UserName user={user} position="right" />
            </div>
          ) : (
            <UserName user={user} position="right" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
