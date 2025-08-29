"use client"
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    return context;
}

export const ThemeProvider = () => {
    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[]);

    useEffect(() => {
        if(mounted) {
            const savedTheme = localStorage.getItem('theme');
            console.log("current saved theme", savedTheme);
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const initialTheme = savedTheme || systemTheme;

            setTheme(initialTheme);
            applyTheme(initialTheme);
        }

    },[mounted])

    const applyTheme = (newTheme) => {
        const root = document.documentElement;
        
        if(newTheme === 'Dark'){
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark': 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    }

    //For setting light theme specifically
    const setLightTheme = () => {
        setTheme('light');
        localStorage.setItem('theme', 'light' );
        applyTheme('light');
    }

    //For setting dark theme specifically
    const setDarkTheme = () => {
        setTheme('dark');
        localStorage.setItem('theme', 'dark');
        applyTheme('dark');
    }

    // Set system theme (follows OS preference)
    const setSystemTheme = () => {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
        localStorage.removeItem('theme'); // Remove saved preference to use system
        applyTheme(systemTheme);
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return <div style={{ visibility: 'hidden' }}>{children}</div>;
    }

    const value = {
        theme,
        applyTheme,
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        setSystemTheme,
        mounted
    }

    return (
        <ThemeProvider.Provider value={value}>
            {children}
        </ThemeProvider.Provider>
    )
}