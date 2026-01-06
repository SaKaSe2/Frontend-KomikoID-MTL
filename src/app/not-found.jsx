import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Visual */}
                <div className="relative mb-8">
                    <span className="text-[150px] font-bold text-[var(--bg-tertiary)] leading-none select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FileQuestion size={64} className="text-[var(--primary-500)]" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Halaman Tidak Ditemukan
                </h1>

                {/* Description */}
                <p className="text-[var(--text-secondary)] mb-8">
                    Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-medium rounded-lg transition-colors"
                    >
                        <Home size={18} />
                        Ke Beranda
                    </Link>
                    <Link
                        href="/comics"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--border-secondary)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] font-medium rounded-lg transition-colors"
                    >
                        <Search size={18} />
                        Cari Komik
                    </Link>
                </div>
            </div>
        </div>
    );
}
