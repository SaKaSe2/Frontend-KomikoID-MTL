'use client';

import { useState, useCallback, useEffect } from 'react';
import { Undo2, X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Undo Toast - Heuristic #3: User Control & Freedom
 * Shows undo option for delete operations
 */

export function UndoToast({
    message,
    onUndo,
    duration = 5000,
    onClose
}) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                onClose?.();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onClose]);

    const handleUndo = () => {
        onUndo?.();
        onClose?.();
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl shadow-xl overflow-hidden animate-slide-up">
            {/* Progress bar */}
            <div className="h-1 bg-[var(--bg-secondary)]">
                <div
                    className="h-full bg-[var(--primary-500)] transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-4 flex items-center gap-3">
                <p className="flex-1 text-sm text-[var(--text-primary)]">
                    {message}
                </p>

                <button
                    onClick={handleUndo}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-500)] hover:bg-[var(--primary-500)]/10 rounded-lg transition-colors"
                >
                    <Undo2 size={16} />
                    Urungkan
                </button>

                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

/**
 * useUndo Hook - Provides undo functionality
 */
export function useUndo() {
    const [undoState, setUndoState] = useState(null);

    const showUndo = useCallback((message, undoAction, duration = 5000) => {
        setUndoState({ message, undoAction, duration });
    }, []);

    const hideUndo = useCallback(() => {
        setUndoState(null);
    }, []);

    const UndoComponent = undoState ? (
        <UndoToast
            message={undoState.message}
            onUndo={undoState.undoAction}
            duration={undoState.duration}
            onClose={hideUndo}
        />
    ) : null;

    return { showUndo, hideUndo, UndoComponent };
}

export default UndoToast;
