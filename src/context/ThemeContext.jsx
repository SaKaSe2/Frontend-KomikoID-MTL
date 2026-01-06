'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const THEME_KEY = 'komiko-theme';

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark'); // default dark
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        setMounted(true);

        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(THEME_KEY, theme);
        }
    }, [theme, mounted]);

    // Toggle theme
    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    // Set specific theme
    const setThemeMode = useCallback((mode) => {
        if (mode === 'dark' || mode === 'light') {
            setTheme(mode);
        }
    }, []);

    const value = {
        theme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        toggleTheme,
        setTheme: setThemeMode,
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return (
            <ThemeContext.Provider value={value}>
                <div style={{ visibility: 'hidden' }}>{children}</div>
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export default ThemeContext;
