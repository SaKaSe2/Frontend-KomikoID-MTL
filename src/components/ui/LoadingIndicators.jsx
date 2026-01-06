'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, CheckCircle, AlertCircle, CloudUpload, X } from 'lucide-react';
import clsx from 'clsx';

/**
 * Progress Indicator - Heuristic #1: Visibility of System Status
 * Shows upload progress for admin image uploads
 */
export function UploadProgress({ progress, fileName, onCancel, status = 'uploading' }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl shadow-xl overflow-hidden">
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {status === 'uploading' && (
                            <CloudUpload size={20} className="text-[var(--primary-500)]" />
                        )}
                        {status === 'success' && (
                            <CheckCircle size={20} className="text-green-500" />
                        )}
                        {status === 'error' && (
                            <AlertCircle size={20} className="text-red-500" />
                        )}
                        <span className="font-medium text-sm text-[var(--text-primary)]">
                            {status === 'uploading' && 'Mengupload...'}
                            {status === 'success' && 'Upload selesai!'}
                            {status === 'error' && 'Upload gagal'}
                        </span>
                    </div>
                    {onCancel && status === 'uploading' && (
                        <button
                            onClick={onCancel}
                            className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)]"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <p className="text-xs text-[var(--text-tertiary)] mb-2 truncate">
                    {fileName}
                </p>

                {status === 'uploading' && (
                    <>
                        <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--primary-500)] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1 text-right">
                            {Math.round(progress)}%
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

/**
 * Loading State - Consistent loading indicator
 */
export function LoadingSpinner({ size = 24, className = '' }) {
    return (
        <Loader2
            size={size}
            className={clsx('animate-spin text-[var(--primary-500)]', className)}
        />
    );
}

/**
 * Page Loading Overlay
 */
export function PageLoader({ message = 'Memuat...' }) {
    return (
        <div className="fixed inset-0 z-[500] bg-[var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size={48} className="mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">{message}</p>
            </div>
        </div>
    );
}

export default { UploadProgress, LoadingSpinner, PageLoader };
