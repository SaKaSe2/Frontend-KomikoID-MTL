'use client';

import { useEffect, useCallback, useRef } from 'react';

/**
 * useKeyboardShortcuts Hook
 * Provides keyboard shortcuts for efficiency
 * Heuristic #7: Flexibility & Efficiency of Use
 */

// Default shortcuts configuration
const defaultShortcuts = {
    // Search
    'ctrl+k': { action: 'openSearch', description: 'Buka pencarian' },
    'cmd+k': { action: 'openSearch', description: 'Buka pencarian' },
    '/': { action: 'openSearch', description: 'Buka pencarian', skipInInput: true },

    // Navigation
    'g h': { action: 'goHome', description: 'Ke beranda' },
    'g b': { action: 'goBookmarks', description: 'Ke bookmark' },
    'g p': { action: 'goPopular', description: 'Ke populer' },

    // Actions
    'Escape': { action: 'closeModal', description: 'Tutup modal/popup' },
    'ctrl+shift+d': { action: 'toggleDarkMode', description: 'Toggle dark mode' },
    'cmd+shift+d': { action: 'toggleDarkMode', description: 'Toggle dark mode' },

    // Reader shortcuts
    'ArrowLeft': { action: 'prevPage', description: 'Halaman sebelumnya', context: 'reader' },
    'ArrowRight': { action: 'nextPage', description: 'Halaman berikutnya', context: 'reader' },
    'ArrowUp': { action: 'prevChapter', description: 'Chapter sebelumnya', context: 'reader' },
    'ArrowDown': { action: 'nextChapter', description: 'Chapter berikutnya', context: 'reader' },
    'f': { action: 'toggleFullscreen', description: 'Fullscreen', context: 'reader' },

    // Help
    '?': { action: 'showHelp', description: 'Tampilkan bantuan shortcut' },
};

export default function useKeyboardShortcuts(handlers = {}, options = {}) {
    const {
        enabled = true,
        context = 'global',
        preventDefault = true,
    } = options;

    const sequenceRef = useRef('');
    const sequenceTimeoutRef = useRef(null);

    const handleKeyDown = useCallback((event) => {
        if (!enabled) return;

        // Skip if typing in input/textarea
        const tagName = event.target.tagName.toLowerCase();
        const isInputField = tagName === 'input' || tagName === 'textarea' || event.target.isContentEditable;

        // Build key combination string
        const keys = [];
        if (event.ctrlKey) keys.push('ctrl');
        if (event.metaKey) keys.push('cmd');
        if (event.altKey) keys.push('alt');
        if (event.shiftKey) keys.push('shift');

        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        keys.push(key);

        const keyCombo = keys.join('+');

        // Handle sequence shortcuts (like 'g h')
        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            // Clear previous sequence timeout
            if (sequenceTimeoutRef.current) {
                clearTimeout(sequenceTimeoutRef.current);
            }

            // Build sequence
            if (sequenceRef.current) {
                sequenceRef.current += ' ' + key;
            } else {
                sequenceRef.current = key;
            }

            // Set timeout to reset sequence
            sequenceTimeoutRef.current = setTimeout(() => {
                sequenceRef.current = '';
            }, 1000);

            // Check if sequence matches any shortcut
            const sequenceShortcut = defaultShortcuts[sequenceRef.current];
            if (sequenceShortcut) {
                if (sequenceShortcut.context && sequenceShortcut.context !== context) return;
                if (isInputField && sequenceShortcut.skipInInput !== false) return;

                if (handlers[sequenceShortcut.action]) {
                    if (preventDefault) event.preventDefault();
                    handlers[sequenceShortcut.action](event);
                    sequenceRef.current = '';
                }
                return;
            }
        }

        // Check single key combo
        const shortcut = defaultShortcuts[keyCombo] || defaultShortcuts[key];
        if (!shortcut) return;

        // Check context
        if (shortcut.context && shortcut.context !== context) return;

        // Skip if in input field (unless shortcut specifically allows it)
        if (isInputField && shortcut.skipInInput !== false) return;

        // Execute handler if available
        if (handlers[shortcut.action]) {
            if (preventDefault) event.preventDefault();
            handlers[shortcut.action](event);
        }
    }, [enabled, context, handlers, preventDefault]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (sequenceTimeoutRef.current) {
                clearTimeout(sequenceTimeoutRef.current);
            }
        };
    }, [handleKeyDown]);

    return {
        shortcuts: defaultShortcuts,
    };
}

/**
 * KeyboardShortcutsHelp Component
 * Displays available keyboard shortcuts
 */
export function KeyboardShortcutsHelp({ isOpen, onClose }) {
    if (!isOpen) return null;

    const shortcutGroups = {
        'Navigasi': [
            { keys: ['G', 'H'], description: 'Ke beranda' },
            { keys: ['G', 'B'], description: 'Ke bookmark' },
            { keys: ['G', 'P'], description: 'Ke populer' },
        ],
        'Pencarian': [
            { keys: ['Ctrl', 'K'], description: 'Buka pencarian' },
            { keys: ['/'], description: 'Buka pencarian (cepat)' },
        ],
        'Tampilan': [
            { keys: ['Ctrl', 'Shift', 'D'], description: 'Toggle dark mode' },
            { keys: ['Esc'], description: 'Tutup modal/popup' },
        ],
        'Pembaca Komik': [
            { keys: ['←'], description: 'Halaman sebelumnya' },
            { keys: ['→'], description: 'Halaman berikutnya' },
            { keys: ['↑'], description: 'Chapter sebelumnya' },
            { keys: ['↓'], description: 'Chapter berikutnya' },
            { keys: ['F'], description: 'Toggle fullscreen' },
        ],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-auto"
                role="dialog"
                aria-label="Keyboard Shortcuts"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Pintasan Keyboard
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <span className="sr-only">Tutup</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(shortcutGroups).map(([group, shortcuts]) => (
                            <div key={group}>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    {group}
                                </h3>
                                <div className="space-y-2">
                                    {shortcuts.map((shortcut, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2"
                                        >
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {shortcut.description}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, keyIndex) => (
                                                    <span key={keyIndex}>
                                                        <kbd className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600">
                                                            {key}
                                                        </kbd>
                                                        {keyIndex < shortcut.keys.length - 1 && (
                                                            <span className="mx-0.5 text-gray-400">+</span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Tekan <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">?</kbd> kapan saja untuk menampilkan bantuan ini
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
