'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

/**
 * Network Status Indicator - Heuristic #1: Visibility of System Status
 * Shows online/offline status to users
 */
export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(true);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Set initial state
        setIsOnline(navigator.onLine);

        const handleOnline = () => {
            setIsOnline(true);
            setShowBanner(true);
            // Auto-hide after 3 seconds when back online
            setTimeout(() => setShowBanner(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showBanner && isOnline) return null;

    return (
        <div
            className={clsx(
                'fixed top-14 left-0 right-0 z-[199] py-2 px-4 text-center text-sm font-medium transition-all duration-300',
                isOnline
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
            )}
        >
            <div className="flex items-center justify-center gap-2">
                {isOnline ? (
                    <>
                        <Wifi size={16} />
                        <span>Koneksi kembali tersedia</span>
                    </>
                ) : (
                    <>
                        <WifiOff size={16} />
                        <span>Tidak ada koneksi internet - Mode offline</span>
                    </>
                )}
            </div>
        </div>
    );
}
