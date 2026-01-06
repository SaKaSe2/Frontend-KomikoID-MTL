'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, Trash2, X, Check } from 'lucide-react';
import clsx from 'clsx';

/**
 * Confirm Dialog - Heuristic #3: User Control & Freedom
 * Allows users to cancel destructive actions
 */

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [state, setState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Konfirmasi',
        cancelText: 'Batal',
        variant: 'danger', // danger, warning, info
        onConfirm: null,
        onCancel: null,
    });

    const confirm = useCallback(({
        title,
        message,
        confirmText = 'Konfirmasi',
        cancelText = 'Batal',
        variant = 'danger',
    }) => {
        return new Promise((resolve) => {
            setState({
                isOpen: true,
                title,
                message,
                confirmText,
                cancelText,
                variant,
                onConfirm: () => {
                    setState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setState(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                },
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog {...state} />
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
}

function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    variant,
    onConfirm,
    onCancel
}) {
    if (!isOpen) return null;

    const iconColors = {
        danger: 'text-red-500 bg-red-500/10',
        warning: 'text-yellow-500 bg-yellow-500/10',
        info: 'text-blue-500 bg-blue-500/10',
    };

    const buttonColors = {
        danger: 'bg-red-500 hover:bg-red-600',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-black',
        info: 'bg-blue-500 hover:bg-blue-600',
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-[var(--bg-elevated)] rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
                <div className="p-6">
                    {/* Icon */}
                    <div className={clsx(
                        'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
                        iconColors[variant]
                    )}>
                        {variant === 'danger' && <Trash2 size={24} />}
                        {variant === 'warning' && <AlertTriangle size={24} />}
                        {variant === 'info' && <AlertTriangle size={24} />}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] text-center mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-[var(--text-secondary)] text-center mb-6">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2.5 px-4 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors font-medium"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={clsx(
                                'flex-1 py-2.5 px-4 rounded-lg text-white transition-colors font-medium',
                                buttonColors[variant]
                            )}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
