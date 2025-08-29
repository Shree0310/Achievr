import  {useTheme}  from '@/app/contexts/ThemeContext';
import { useState } from 'react';

const ToggleTheme  = () => {
    const {theme, toggleTheme} = useTheme();
    return<div>
        <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-full
        bg-gray-100 dark:bg-gray-800
        border-2 border-gray-200 dark:border-gray-700
        text-gray-800 dark:text-gray-200
        hover:bg-gray-200 dark:hover:bg-gray-700
        hover:border-blue-400 dark:hover:border-blue-500
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
      "
      aria-label="Toggle dark/light mode"
    >
        <div className="w-6 h-6 flex items-center justify-center">
        {theme === 'light' ? (
          // Moon icon for switching to dark mode
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="transform transition-transform duration-300 hover:rotate-12"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="currentColor"
            />
          </svg>
        ) : (
          // Sun icon for switching to light mode
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            className="transform transition-transform duration-300 hover:rotate-45"
          >
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
            <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </div>
    </button>

    </div>
}
export default ToggleTheme;