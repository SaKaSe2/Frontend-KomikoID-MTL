'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    History,
    Trash2,
    BookOpen,
    Clock,
    AlertCircle,
    Loader2,
    Search
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import historyService from '@/lib/api/services/historyService';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

// History Card Component
function HistoryCard({ entry, onDelete }) {
    const [deleting, setDeleting] = useState(false);
    const comic = entry.comic;
    const chapter = entry.chapter;

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDeleting(true);
        try {
            await onDelete(entry.id);
        } finally {
            setDeleting(false);
        }
    };

    // Format relative time
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays < 7) return `${diffDays} hari lalu`;

        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="group bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] overflow-hidden hover:border-[var(--primary-500)] transition-all">
            <Link href={`/comics/${comic.slug}/chapter/${chapter.number}`} className="flex gap-4 p-4">
                {/* Cover */}
                <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                        src={comic.cover_image_url || '/images/placeholders/comic-placeholder.png'}
                        alt={comic.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--primary-500)] transition-colors">
                        {comic.title}
                    </h3>

                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Chapter {chapter.number}
                        {chapter.title && chapter.title !== `Chapter ${chapter.number}` && (
                            <span className="text-[var(--text-tertiary)]"> - {chapter.title}</span>
                        )}
                    </p>

                    {/* Progress & Time */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-tertiary)]">
                        {entry.page_number && (
                            <span className="flex items-center gap-1">
                                <BookOpen size={12} />
                                Halaman {entry.page_number}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatRelativeTime(entry.read_at || entry.updated_at)}
                        </span>
                    </div>
                </div>

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="self-center p-2 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Hapus dari riwayat"
                >
                    {deleting ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Trash2 size={18} />
                    )}
                </button>
            </Link>

            {/* Continue Button */}
            <div className="px-4 pb-4 pt-0">
                <Link
                    href={`/comics/${comic.slug}/chapter/${chapter.number}${entry.page_number ? `?page=${entry.page_number}` : ''}`}
                    className="block w-full text-center py-2 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Lanjutkan Membaca
                </Link>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyHistory() {
    return (
        <div className="text-center py-16">
            <History size={64} className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-50" />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                Belum Ada Riwayat
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                Anda belum membaca komik apapun. Mulai membaca untuk menyimpan riwayat bacaan.
            </p>
            <Link href="/comics">
                <Button variant="primary" leftIcon={<Search size={18} />}>
                    Jelajahi Komik
                </Button>
            </Link>
        </div>
    );
}

// Main History Page
export default function HistoryPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const toast = useToast();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [clearing, setClearing] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch history
    const fetchHistory = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await historyService.getHistory({ page, per_page: 20 });
            setHistory(response.data || []);
            setMeta(response.meta || { current_page: 1, last_page: 1, total: 0 });
        } catch (err) {
            console.error('Failed to fetch history:', err);
            setError(err.message || 'Gagal memuat riwayat');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchHistory();
        }
    }, [isAuthenticated, fetchHistory]);

    // Delete single entry
    const handleDelete = async (entryId) => {
        try {
            await historyService.deleteEntry(entryId);
            setHistory(prev => prev.filter(h => h.id !== entryId));
            setMeta(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
            toast.success('Riwayat dihapus');
        } catch (err) {
            toast.error(err.message || 'Gagal menghapus riwayat');
        }
    };

    // Clear all history
    const handleClearAll = async () => {
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus semua riwayat baca?');
        if (!confirmed) return;

        setClearing(true);
        try {
            await historyService.clearAll();
            setHistory([]);
            setMeta({ current_page: 1, last_page: 1, total: 0 });
            toast.success('Semua riwayat berhasil dihapus');
        } catch (err) {
            toast.error(err.message || 'Gagal menghapus riwayat');
        } finally {
            setClearing(false);
        }
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl">
                            <Skeleton className="w-16 h-20 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <History size={24} className="text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Riwayat Baca
                        </h1>
                        <p className="text-[var(--text-secondary)]">
                            {meta.total > 0 ? `${meta.total} komik dibaca` : 'Belum ada riwayat'}
                        </p>
                    </div>
                </div>

                {/* Clear All Button */}
                {history.length > 0 && (
                    <Button
                        onClick={handleClearAll}
                        variant="outline"
                        loading={clearing}
                        leftIcon={<Trash2 size={18} />}
                        className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                    >
                        Hapus Semua
                    </Button>
                )}
            </div>

            {/* Error State */}
            {error && (
                <div className="text-center py-12">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <p className="text-[var(--text-secondary)] mb-4">{error}</p>
                    <Button onClick={() => fetchHistory()} variant="outline">
                        Coba Lagi
                    </Button>
                </div>
            )}

            {/* Loading State */}
            {loading && !error && (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl">
                            <Skeleton className="w-16 h-20 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* History List */}
            {!loading && !error && history.length > 0 && (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        {history.map((entry) => (
                            <HistoryCard
                                key={entry.id}
                                entry={entry}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {[...Array(meta.last_page)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => fetchHistory(i + 1)}
                                    className={clsx(
                                        'w-10 h-10 rounded-lg text-sm transition-colors',
                                        meta.current_page === i + 1
                                            ? 'bg-[var(--primary-500)] text-white'
                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!loading && !error && history.length === 0 && (
                <EmptyHistory />
            )}
        </div>
    );
}
