'use client';

import Spinner from '@/components/ui/Spinner';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-[var(--text-secondary)] animate-pulse">Memuat...</p>
            </div>
        </div>
    );
}
