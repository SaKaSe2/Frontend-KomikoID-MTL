'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * SyncStatus Component
 * Displays online/offline status with sync indicator
 * Heuristic #1: Visibility of System Status
 */
export default function SyncStatus({ className = '' }) {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(null);
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        // Check initial online status
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            setSyncError(null);
            // Trigger sync when coming back online
            triggerSync();
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const triggerSync = async () => {
        if (!isOnline || isSyncing) return;

        setIsSyncing(true);
        setSyncError(null);

        try {
            // Simulate sync operation - replace with actual sync logic
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLastSynced(new Date());
        } catch (error) {
            setSyncError('Gagal sinkronisasi. Coba lagi.');
        } finally {
            setIsSyncing(false);
        }
    };

    const formatLastSynced = () => {
        if (!lastSynced) return null;
        const now = new Date();
        const diff = Math.floor((now - lastSynced) / 1000);

        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        return lastSynced.toLocaleDateString('id-ID');
    };

    return (
        <div className={`flex items-center gap-2 text-sm ${className}`}>
            {/* Online/Offline Status */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors ${isOnline
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                {isOnline ? (
                    <Wifi className="w-3.5 h-3.5" />
                ) : (
                    <WifiOff className="w-3.5 h-3.5" />
                )}
                <span className="font-medium text-xs">
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            </div>

            {/* Sync Status */}
            {isOnline && (
                <div className="flex items-center gap-1.5">
                    {isSyncing ? (
                        <div className="flex items-center gap-1 text-primary-500">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span className="text-xs">Menyinkronkan...</span>
                        </div>
                    ) : syncError ? (
                        <button
                            onClick={triggerSync}
                            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                        >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="text-xs">{syncError}</span>
                        </button>
                    ) : lastSynced ? (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs">Disinkronkan {formatLastSynced()}</span>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
