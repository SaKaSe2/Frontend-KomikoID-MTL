'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, RefreshCw, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ChapterError({ error, reset }) {
    const params = useParams();
    const comicSlug = params.slug;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Gagal Memuat Chapter
                </h1>

                <p className="text-[var(--text-secondary)] mb-6">
                    Terjadi kesalahan saat memuat chapter. Silakan coba lagi.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        variant="primary"
                        leftIcon={<RefreshCw size={18} />}
                    >
                        Coba Lagi
                    </Button>
                    <Link href={`/comics/${comicSlug}`}>
                        <Button
                            variant="outline"
                            leftIcon={<BookOpen size={18} />}
                        >
                            Kembali ke Komik
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
