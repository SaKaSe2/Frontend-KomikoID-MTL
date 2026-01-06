'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '@/lib/api/services/authService';
import { isAuthenticated, removeAuthToken } from '@/lib/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated()) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                } catch (err) {
                    // Silently handle auth errors (401, 403) - token is invalid/expired
                    // Only log unexpected errors for debugging
                    if (err.response?.status !== 401 && err.response?.status !== 403) {
                        console.warn('Auth check failed:', err.message || err);
                    }
                    removeAuthToken();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Login
    const login = useCallback(async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const { user: userData } = await authService.login(email, password);
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message || 'Login gagal');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Register
    const register = useCallback(async (data) => {
        setError(null);
        setLoading(true);
        try {
            const { user: userData } = await authService.register(data);
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message || 'Registrasi gagal');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout
    const logout = useCallback(async () => {
        setLoading(true);
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setLoading(false);
        }
    }, []);

    // Update user data
    const updateUser = useCallback((updates) => {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
    }, []);

    // Refresh user data from server
    const refreshUser = useCallback(async () => {
        if (isAuthenticated()) {
            try {
                const userData = await authService.getMe();
                setUser(userData);
                return userData;
            } catch (err) {
                console.error('Refresh user failed:', err);
            }
        }
        return null;
    }, []);

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
