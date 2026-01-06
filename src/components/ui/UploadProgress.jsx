'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Pause, Play } from 'lucide-react';

/**
 * UploadProgress Component
 * Shows progress for image uploads with cancel capability
 * Heuristic #1: Visibility of System Status
 * Heuristic #3: User Control & Freedom (cancel button)
 */
export default function UploadProgress({
    progress = 0,
    fileName = '',
    fileSize = 0,
    status = 'uploading', // 'uploading', 'paused', 'completed', 'error', 'cancelled'
    errorMessage = '',
    onCancel,
    onRetry,
    onPause,
    onResume,
    className = '',
}) {
    const [isVisible, setIsVisible] = useState(true);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'error':
            case 'cancelled':
                return 'bg-red-500';
            case 'paused':
                return 'bg-yellow-500';
            default:
                return 'bg-primary-500';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
            case 'cancelled':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'paused':
                return <Pause className="w-5 h-5 text-yellow-500" />;
            default:
                return <Upload className="w-5 h-5 text-primary-500 animate-pulse" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'completed':
                return 'Selesai diupload';
            case 'error':
                return errorMessage || 'Gagal upload';
            case 'cancelled':
                return 'Dibatalkan';
            case 'paused':
                return 'Dijeda';
            default:
                return `${progress}% selesai`;
        }
    };

    // Auto-hide after completion
    useEffect(() => {
        if (status === 'completed') {
            const timer = setTimeout(() => setIsVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    if (!isVisible) return null;

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm ${className}`}>
            <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                    {getStatusIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* File Name */}
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {fileName}
                    </p>

                    {/* File Size & Status */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatFileSize(fileSize)} • {getStatusText()}
                    </p>

                    {/* Progress Bar */}
                    {(status === 'uploading' || status === 'paused') && (
                        <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${getStatusColor()}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    {/* Pause/Resume Button */}
                    {status === 'uploading' && onPause && (
                        <button
                            onClick={onPause}
                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            title="Jeda upload"
                        >
                            <Pause className="w-4 h-4" />
                        </button>
                    )}

                    {status === 'paused' && onResume && (
                        <button
                            onClick={onResume}
                            className="p-1.5 text-yellow-500 hover:text-yellow-600 transition-colors"
                            title="Lanjutkan upload"
                        >
                            <Play className="w-4 h-4" />
                        </button>
                    )}

                    {/* Retry Button */}
                    {status === 'error' && onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-2 py-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    )}

                    {/* Cancel/Close Button */}
                    {(status === 'uploading' || status === 'paused' || status === 'error') && onCancel && (
                        <button
                            onClick={onCancel}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Batalkan"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * UploadProgressList Component
 * Container for multiple upload progress items
 */
export function UploadProgressList({ uploads = [], onCancel, onRetry, className = '' }) {
    if (uploads.length === 0) return null;

    return (
        <div className={`fixed bottom-4 right-4 z-50 w-80 space-y-2 ${className}`}>
            {uploads.map((upload) => (
                <UploadProgress
                    key={upload.id}
                    {...upload}
                    onCancel={() => onCancel?.(upload.id)}
                    onRetry={() => onRetry?.(upload.id)}
                />
            ))}
        </div>
    );
}
