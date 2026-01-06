'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import useKeyboardShortcuts, { KeyboardShortcutsHelp } from '@/hooks/useKeyboardShortcuts';
import NetworkStatus from '@/components/ui/NetworkStatus';

/**
 * GlobalProviders Component
 * Provides global keyboard shortcuts and system status
 * Combines multiple heuristics implementations
 */
export default function GlobalProviders({ children }) {
    const router = useRouter();
    const { toggleTheme } = useTheme();
    const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const handlers = {
        openSearch: useCallback(() => {
            // Focus search input or open search modal
            const searchInput = document.querySelector('input[type="text"][placeholder*="Pencarian"]');
            if (searchInput) {
                searchInput.focus();
            } else {
                setShowSearch(true);
            }
        }, []),

        closeModal: useCallback(() => {
            setShowShortcutsHelp(false);
            setShowSearch(false);
        }, []),

        goHome: useCallback(() => {
            router.push('/');
        }, [router]),

        goBookmarks: useCallback(() => {
            router.push('/bookmark');
        }, [router]),

        goPopular: useCallback(() => {
            router.push('/popular');
        }, [router]),

        toggleDarkMode: useCallback(() => {
            toggleTheme?.();
        }, [toggleTheme]),

        showHelp: useCallback(() => {
            setShowShortcutsHelp(true);
        }, []),
    };

    useKeyboardShortcuts(handlers);

    return (
        <>
            {/* Network Status - Fixed position */}
            <div className="fixed top-20 right-4 z-40">
                <NetworkStatus />
            </div>

            {/* Main Content */}
            {children}

            {/* Keyboard Shortcuts Help Modal */}
            <KeyboardShortcutsHelp
                isOpen={showShortcutsHelp}
                onClose={() => setShowShortcutsHelp(false)}
            />
        </>
    );
}
