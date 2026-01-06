'use client';

import { AlertCircle, RefreshCw, WifiOff, ServerOff, FileX, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

/**
 * Error Display - Heuristic #9: Help Users Recognize, Diagnose & Recover from Errors
 * Provides descriptive error messages with suggested solutions
 */

const errorDefinitions = {
    network: {
        icon: WifiOff,
        title: 'Koneksi Gagal',
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        suggestion: 'Coba refresh halaman atau periksa koneksi WiFi/data Anda.',
        actions: ['retry', 'offline'],
    },
    server: {
        icon: ServerOff,
        title: 'Server Error',
        message: 'Terjadi kesalahan pada server. Tim kami sedang menangani masalah ini.',
        suggestion: 'Coba lagi dalam beberapa saat.',
        actions: ['retry'],
    },
    notFound: {
        icon: FileX,
        title: 'Tidak Ditemukan',
        message: 'Halaman atau konten yang Anda cari tidak ditemukan.',
        suggestion: 'Periksa URL atau kembali ke halaman utama.',
        actions: ['home', 'back'],
    },
    unauthorized: {
        icon: ShieldAlert,
        title: 'Akses Ditolak',
        message: 'Anda perlu login untuk mengakses halaman ini.',
        suggestion: 'Silakan login atau daftar akun baru.',
        actions: ['login', 'register'],
    },
    timeout: {
        icon: AlertCircle,
        title: 'Waktu Habis',
        message: 'Koneksi memakan waktu terlalu lama.',
        suggestion: 'Koneksi lambat? Coba lagi atau periksa jaringan Anda.',
        actions: ['retry'],
    },
    validation: {
        icon: AlertCircle,
        title: 'Data Tidak Valid',
        message: 'Terdapat kesalahan pada data yang Anda masukkan.',
        suggestion: 'Periksa kembali form dan perbaiki kesalahan yang ditandai.',
        actions: ['fix'],
    },
    permission: {
        icon: ShieldAlert,
        title: 'Tidak Diizinkan',
        message: 'Anda tidak memiliki izin untuk melakukan aksi ini.',
        suggestion: 'Hubungi admin jika Anda merasa ini adalah kesalahan.',
        actions: ['contact', 'back'],
    },
    rateLimit: {
        icon: AlertCircle,
        title: 'Terlalu Banyak Permintaan',
        message: 'Anda telah mencapai batas permintaan. Silakan tunggu sebentar.',
        suggestion: 'Coba lagi dalam beberapa menit.',
        actions: ['wait'],
    },
    generic: {
        icon: AlertCircle,
        title: 'Terjadi Kesalahan',
        message: 'Sesuatu tidak berjalan sesuai rencana.',
        suggestion: 'Coba refresh halaman atau hubungi dukungan jika masalah berlanjut.',
        actions: ['retry', 'contact'],
    },
};

export function ErrorDisplay({
    type = 'generic',
    title,
    message,
    suggestion,
    onRetry,
    retryText = 'Coba Lagi',
    className,
}) {
    const errorDef = errorDefinitions[type] || errorDefinitions.generic;
    const Icon = errorDef.icon;

    const displayTitle = title || errorDef.title;
    const displayMessage = message || errorDef.message;
    const displaySuggestion = suggestion || errorDef.suggestion;

    return (
        <div className={clsx(
            'flex flex-col items-center justify-center py-12 px-4 text-center',
            className
        )}>
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Icon size={32} className="text-red-500" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {displayTitle}
            </h3>

            {/* Message */}
            <p className="text-[var(--text-secondary)] max-w-md mb-2">
                {displayMessage}
            </p>

            {/* Suggestion */}
            <p className="text-sm text-[var(--text-tertiary)] max-w-md mb-6">
                💡 {displaySuggestion}
            </p>

            {/* Retry Button */}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-medium rounded-lg transition-colors"
                >
                    <RefreshCw size={18} />
                    {retryText}
                </button>
            )}
        </div>
    );
}

/**
 * Inline Error Banner - For smaller error displays
 */
export function ErrorBanner({
    message,
    onRetry,
    onDismiss,
    className,
}) {
    return (
        <div className={clsx(
            'flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg',
            className
        )}>
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="flex-1 text-sm text-red-500">{message}</p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded transition-colors"
                >
                    <RefreshCw size={14} />
                    Retry
                </button>
            )}
        </div>
    );
}

export default ErrorDisplay;
