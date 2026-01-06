'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log error to console
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Terjadi Kesalahan
                </h1>

                {/* Description */}
                <p className="text-[var(--text-secondary)] mb-6">
                    Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau kembali ke beranda.
                </p>

                {/* Error Details (only in development) */}
                {process.env.NODE_ENV === 'development' && error?.message && (
                    <div className="mb-6 p-4 bg-red-500/10 rounded-lg text-left">
                        <p className="text-sm text-red-500 font-mono break-words">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        variant="primary"
                        leftIcon={<RefreshCw size={18} />}
                    >
                        Coba Lagi
                    </Button>
                    <Link href="/">
                        <Button
                            variant="outline"
                            leftIcon={<Home size={18} />}
                        >
                            Ke Beranda
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
