'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    BookMarked,
    Trash2,
    Star,
    BookOpen,
    Search,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import bookmarkService from '@/lib/api/services/bookmarkService';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

// Bookmark Card Component
function BookmarkCard({ bookmark, onRemove }) {
    const [removing, setRemoving] = useState(false);
    const comic = bookmark.comic;

    const handleRemove = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setRemoving(true);
        try {
            await onRemove(bookmark.id);
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="relative group bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-primary)] card-hover">
            <Link href={`/comics/${comic.slug}`} className="block">
                {/* Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                        src={comic.cover_image_url || '/images/placeholders/comic-placeholder.png'}
                        alt={comic.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2">
                        <span className={clsx(
                            'px-2 py-1 text-xs font-medium rounded-md',
                            comic.type === 'manga' && 'bg-red-500 text-white',
                            comic.type === 'manhwa' && 'bg-blue-500 text-white',
                            comic.type === 'manhua' && 'bg-green-500 text-white',
                            !['manga', 'manhwa', 'manhua'].includes(comic.type) && 'bg-gray-500 text-white'
                        )}>
                            {comic.type?.toUpperCase() || 'KOMIK'}
                        </span>
                    </div>

                    {/* Rating */}
                    {comic.rating && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-md">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-medium text-white">{parseFloat(comic.rating).toFixed(1)}</span>
                        </div>
                    )}

                    {/* Remove Button Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                            onClick={handleRemove}
                            disabled={removing}
                            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                            title="Hapus dari bookmark"
                        >
                            {removing ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Trash2 size={20} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="p-3">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--primary-500)] transition-colors">
                        {comic.title}
                    </h3>

                    {/* Status */}
                    <div className="flex items-center justify-between mt-2 text-xs text-[var(--text-tertiary)]">
                        <span className={clsx(
                            'px-2 py-0.5 rounded',
                            comic.status === 'ongoing' && 'bg-green-500/10 text-green-500',
                            comic.status === 'completed' && 'bg-blue-500/10 text-blue-500',
                            comic.status === 'hiatus' && 'bg-yellow-500/10 text-yellow-500'
                        )}>
                            {comic.status === 'ongoing' ? 'Ongoing' :
                                comic.status === 'completed' ? 'Tamat' :
                                    comic.status === 'hiatus' ? 'Hiatus' : comic.status}
                        </span>
                        {comic.total_chapters && (
                            <span className="flex items-center gap-1">
                                <BookOpen size={12} />
                                {comic.total_chapters}
                            </span>
                        )}
                    </div>

                    {/* Bookmarked Date */}
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                        Ditambahkan {new Date(bookmark.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </Link>
        </div>
    );
}

// Empty State Component
function EmptyBookmarks() {
    return (
        <div className="text-center py-16">
            <BookMarked size={64} className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-50" />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                Belum Ada Bookmark
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                Anda belum menyimpan komik apapun. Jelajahi koleksi kami dan tambahkan komik favorit ke bookmark.
            </p>
            <Link href="/comics">
                <Button variant="primary" leftIcon={<Search size={18} />}>
                    Jelajahi Komik
                </Button>
            </Link>
        </div>
    );
}

// Main Bookmarks Page
export default function BookmarksPage() {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const toast = useToast();

    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch bookmarks
    const fetchBookmarks = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookmarkService.getBookmarks({ page, per_page: 20 });
            setBookmarks(response.data || []);
            setMeta(response.meta || { current_page: 1, last_page: 1, total: 0 });
        } catch (err) {
            console.error('Failed to fetch bookmarks:', err);
            // Handle different error formats
            let errorMessage = 'Gagal memuat bookmark';
            if (typeof err === 'string') {
                errorMessage = err;
            } else if (err?.message) {
                errorMessage = err.message;
            } else if (err?.status === 401) {
                errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
                router.push('/login');
                return;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBookmarks();
        }
    }, [isAuthenticated, fetchBookmarks]);

    // Remove bookmark
    const handleRemove = async (bookmarkId) => {
        try {
            await bookmarkService.removeBookmark(bookmarkId);
            setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
            setMeta(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
            toast.success('Bookmark dihapus');
        } catch (err) {
            toast.error(err.message || 'Gagal menghapus bookmark');
        }
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="comic-grid">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton.ComicCard key={i} />
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
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary-500)]/10 flex items-center justify-center">
                    <BookMarked size={24} className="text-[var(--primary-500)]" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Bookmark Saya
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        {meta.total > 0 ? `${meta.total} komik tersimpan` : 'Belum ada komik'}
                    </p>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="text-center py-12">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <p className="text-[var(--text-secondary)] mb-4">{error}</p>
                    <Button onClick={() => fetchBookmarks()} variant="outline">
                        Coba Lagi
                    </Button>
                </div>
            )}

            {/* Loading State */}
            {loading && !error && (
                <div className="comic-grid">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton.ComicCard key={i} />
                    ))}
                </div>
            )}

            {/* Bookmarks Grid */}
            {!loading && !error && bookmarks.length > 0 && (
                <>
                    <div className="comic-grid">
                        {bookmarks.map((bookmark) => (
                            <BookmarkCard
                                key={bookmark.id}
                                bookmark={bookmark}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {[...Array(meta.last_page)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => fetchBookmarks(i + 1)}
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
            {!loading && !error && bookmarks.length === 0 && (
                <EmptyBookmarks />
            )}
        </div>
    );
}
