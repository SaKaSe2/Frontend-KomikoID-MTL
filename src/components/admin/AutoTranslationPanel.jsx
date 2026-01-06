'use client';

import { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Loader2,
    AlertCircle,
    Zap,
    Image as ImageIcon
} from 'lucide-react';
import clsx from 'clsx';

/**
 * AutoTranslationPanel - Enhanced UI for automatic translation with Local/Cotrans API
 * 
 * @param {Array} pages - Array of chapter pages
 * @param {Function} onTranslate - Callback to trigger translation
 * @param {Function} onTranslateAll - Callback to trigger batch translation
 * @param {boolean} isTranslating - Whether translation is in progress
 * @param {Object} translationProgress - Progress data { current, total, status }
 */
export default function AutoTranslationPanel({
    pages = [],
    onTranslate,
    onTranslateAll,
    isTranslating = false,
    translationProgress = null
}) {
    const [selectedPages, setSelectedPages] = useState(new Set());
    const [showPreview, setShowPreview] = useState(false);

    // Get page status
    const getPageStatus = (page) => {
        if (page.translated_image || page.translated_image_url) {
            return 'completed';
        }
        if (translationProgress?.currentPage === page.page_number) {
            return 'processing';
        }
        return 'pending';
    };

    // Count status
    const statusCounts = {
        completed: pages.filter(p => p.translated_image || p.translated_image_url).length,
        pending: pages.filter(p => !p.translated_image && !p.translated_image_url).length,
        total: pages.length
    };

    const progressPercentage = statusCounts.total > 0
        ? Math.round((statusCounts.completed / statusCounts.total) * 100)
        : 0;

    // Toggle page selection
    const togglePageSelection = (pageId) => {
        const newSelection = new Set(selectedPages);
        if (newSelection.has(pageId)) {
            newSelection.delete(pageId);
        } else {
            newSelection.add(pageId);
        }
        setSelectedPages(newSelection);
    };

    // Select/deselect all
    const toggleSelectAll = () => {
        if (selectedPages.size === pages.length) {
            setSelectedPages(new Set());
        } else {
            setSelectedPages(new Set(pages.map(p => p.id || p.uuid)));
        }
    };

    return (
        <div className="space-y-4">
            {/* Header & Action Buttons */}
            <div className="bg-gradient-to-r from-[var(--primary-500)]/10 to-transparent border border-[var(--primary-500)]/20 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={20} className="text-[var(--primary-500)]" />
                            <h3 className="font-semibold text-[var(--text-primary)]">
                                Auto Translation
                            </h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-3">
                            AI Translator akan otomatis mendeteksi text, menerjemahkan, dan menghapus text original dalam satu proses. <span className="text-green-400 font-medium">Unlimited & tanpa watermark!</span>
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-[var(--text-tertiary)]">
                                    Completed: <span className="font-medium text-[var(--text-primary)]">{statusCounts.completed}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400" />
                                <span className="text-[var(--text-tertiary)]">
                                    Pending: <span className="font-medium text-[var(--text-primary)]">{statusCounts.pending}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[var(--text-tertiary)]">
                                    Total: <span className="font-medium text-[var(--text-primary)]">{statusCounts.total} pages</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => onTranslateAll()}
                            disabled={isTranslating || statusCounts.pending === 0}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isTranslating ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Translating...
                                </>
                            ) : (
                                <>
                                    <Play size={18} />
                                    Translate All
                                </>
                            )}
                        </button>

                        {/* Force Re-translate when all completed */}
                        {statusCounts.completed > 0 && statusCounts.pending === 0 && !isTranslating && (
                            <button
                                onClick={() => onTranslateAll(true)} // Pass true for force
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg text-sm font-medium transition-colors"
                            >
                                <RotateCcw size={16} />
                                Force Re-translate
                            </button>
                        )}

                        {selectedPages.size > 0 && (
                            <button
                                onClick={() => onTranslate(Array.from(selectedPages))}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                <Play size={16} />
                                Translate {selectedPages.size} Selected
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                {(isTranslating || progressPercentage > 0) && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-1">
                            <span>Translation Progress</span>
                            <span className="font-medium">{progressPercentage}%</span>
                        </div>
                        <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        {translationProgress && (
                            <div className="mt-2 text-xs text-[var(--text-tertiary)]">
                                {translationProgress.message || `Processing page ${translationProgress.current} of ${translationProgress.total}`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Page List with Status */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={selectedPages.size === pages.length && pages.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-[var(--border-primary)]"
                        />
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                            Pages ({pages.length})
                        </span>
                    </div>
                    {selectedPages.size > 0 && (
                        <span className="text-xs text-[var(--text-tertiary)]">
                            {selectedPages.size} selected
                        </span>
                    )}
                </div>

                {/* Page List */}
                <div className="divide-y divide-[var(--border-primary)] max-h-96 overflow-y-auto">
                    {pages.length === 0 ? (
                        <div className="p-8 text-center">
                            <ImageIcon size={48} className="mx-auto mb-3 text-[var(--text-tertiary)] opacity-50" />
                            <p className="text-[var(--text-tertiary)]">No pages uploaded yet</p>
                        </div>
                    ) : (
                        pages.map((page) => {
                            const status = getPageStatus(page);
                            const isSelected = selectedPages.has(page.id || page.uuid);

                            return (
                                <div
                                    key={page.id || page.uuid}
                                    className={clsx(
                                        'p-3 flex items-center gap-3 transition-colors',
                                        isSelected && 'bg-[var(--primary-500)]/5'
                                    )}
                                >
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => togglePageSelection(page.id || page.uuid)}
                                        className="w-4 h-4 rounded border-[var(--border-primary)]"
                                    />

                                    {/* Page Number */}
                                    <div className="w-12 text-center">
                                        <span className="text-sm font-medium text-[var(--text-primary)]">
                                            #{page.page_number}
                                        </span>
                                    </div>

                                    {/* Preview Thumbnail */}
                                    {page.original_image_url && (
                                        <div className="w-12 h-16 rounded bg-[var(--bg-tertiary)] overflow-hidden flex-shrink-0">
                                            <img
                                                src={page.original_image_url}
                                                alt={`Page ${page.page_number}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {status === 'completed' && (
                                                <>
                                                    <CheckCircle2 size={16} className="text-green-500" />
                                                    <span className="text-sm text-green-500">Completed</span>
                                                </>
                                            )}
                                            {status === 'processing' && (
                                                <>
                                                    <Loader2 size={16} className="text-[var(--primary-500)] animate-spin" />
                                                    <span className="text-sm text-[var(--primary-500)]">Processing...</span>
                                                </>
                                            )}
                                            {status === 'pending' && (
                                                <>
                                                    <AlertCircle size={16} className="text-gray-400" />
                                                    <span className="text-sm text-gray-400">Pending</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Action */}
                                    {status === 'pending' && !isTranslating && (
                                        <button
                                            onClick={() => onTranslate([page.id || page.uuid])}
                                            className="px-3 py-1.5 text-xs bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-lg transition-colors"
                                        >
                                            Translate
                                        </button>
                                    )}
                                    {status === 'completed' && (
                                        <button
                                            onClick={() => window.open(page.translated_image_url, '_blank')}
                                            className="px-3 py-1.5 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] rounded-lg transition-colors"
                                        >
                                            View
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Tips */}
            {statusCounts.pending > 0 && !isTranslating && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-400">
                            <p className="font-medium mb-1">Tip:</p>
                            <p className="text-xs opacity-90">
                                Click "Translate All" untuk menerjemahkan semua halaman sekaligus, atau pilih halaman tertentu dan klik "Translate Selected".
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
