'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    // Error message patterns to suppress (external API errors)
    const suppressedPatterns = [
        '[fakey]',
        'all connection attempts failed',
        'cotrans',
        'connection refused',
        'network error',
        'task failed'
    ];

    // Check if message should be suppressed
    const shouldSuppressMessage = (message, type) => {
        if (type !== 'error') return false;
        if (!message) return false;

        const lowerMessage = message.toLowerCase();
        return suppressedPatterns.some(pattern => lowerMessage.includes(pattern));
    };

    // Add toast
    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        // Filter out confusing external API error messages
        if (shouldSuppressMessage(message, type)) {
            console.warn('Suppressed error toast:', message);
            return null;
        }

        const id = ++toastId;

        const toast = {
            id,
            message,
            type, // 'success' | 'error' | 'warning' | 'info'
            duration,
        };

        setToasts((prev) => [...prev, toast]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    // Remove toast
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Clear all toasts
    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    // Convenience methods
    const success = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const error = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    const info = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    const value = {
        toasts,
        addToast,
        removeToast,
        clearToasts,
        success,
        error,
        warning,
        info,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[600] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

// Individual Toast Component
function ToastItem({ toast, onRemove }) {
    const typeStyles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white',
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div
            className={`
        ${typeStyles[toast.type] || typeStyles.info}
        px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-3
        animate-slide-up pointer-events-auto
        cursor-pointer
      `}
            onClick={() => onRemove(toast.id)}
            role="alert"
        >
            <span className="text-lg">{icons[toast.type]}</span>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(toast.id);
                }}
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Tutup"
            >
                ✕
            </button>
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export default ToastContext;
