'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
    TrendingUp,
    Eye,
    Clock,
    BookOpen
} from 'lucide-react';
import comicService from '@/lib/api/services/comicService';

// Format view count
function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'jt';
    }
    if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'rb';
    }
    return views?.toString() || '0';
}

// Popular Comic Card - Komiku Style
function PopularComicCard({ comic, rank }) {
    const firstChapter = comic.first_chapter || { number: '1' };
    const latestChapter = comic.chapters?.[0] || comic.latest_chapter || null;

    // Get type label and genre
    const typeLabel = comic.type ? comic.type.charAt(0).toUpperCase() + comic.type.slice(1) : 'Komik';
    const genres = comic.genres?.slice(0, 2).map(g => g.name).join(' ') || '';

    return (
        <div className="flex gap-4 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--primary-500)] transition-colors">
            {/* Cover with UP Badge */}
            <Link href={`/comics/${comic.slug}`} className="relative flex-shrink-0">
                <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={comic.cover_image_url || '/images/placeholders/comic-placeholder.png'}
                        alt={comic.title}
                        fill
                        sizes="(max-width: 640px) 144px, 176px"
                        className="object-cover"
                    />

                    {/* UP Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                        UP {rank}
                    </div>

                    {/* Type & Genre Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="text-white text-xs font-medium">
                            {typeLabel} {genres && `• ${genres}`}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Info Section */}
            <div className="flex-1 min-w-0 py-1">
                {/* Title */}
                <Link href={`/comics/${comic.slug}`}>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-2 hover:text-[var(--primary-500)] transition-colors">
                        {comic.title}
                    </h3>
                </Link>

                {/* Stats */}
                <div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span className="font-medium">{formatViews(comic.total_views)}</span>
                        <span>x</span>
                    </div>
                    {comic.updated_at && (
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{comic.time_ago || 'Baru'}</span>
                        </div>
                    )}
                    {comic.is_colored && (
                        <span className="text-[var(--primary-500)]">• Berwarna</span>
                    )}
                </div>

                {/* Synopsis */}
                <p className="mt-2 text-sm text-[var(--text-tertiary)] line-clamp-2">
                    {comic.synopsis || 'Tidak ada sinopsis.'}
                </p>

                {/* Chapter Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                        href={`/comics/${comic.slug}/chapter/1`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-[var(--border-primary)] rounded-lg text-sm hover:border-[var(--primary-500)] hover:text-[var(--primary-500)] transition-colors"
                    >
                        <span className="text-[var(--text-tertiary)]">Awal:</span>
                        <span className="font-semibold text-[var(--text-primary)]">Chapter 1</span>
                    </Link>

                    {latestChapter && (
                        <Link
                            href={`/comics/${comic.slug}/chapter/${latestChapter.number}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-[var(--border-primary)] rounded-lg text-sm hover:border-[var(--primary-500)] hover:text-[var(--primary-500)] transition-colors"
                        >
                            <span className="text-[var(--text-tertiary)]">Terbaru:</span>
                            <span className="font-semibold text-[var(--text-primary)]">Chapter {latestChapter.number}</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

// Skeleton
function PopularComicSkeleton() {
    return (
        <div className="flex gap-4 p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] animate-pulse">
            <div className="w-36 h-48 sm:w-44 sm:h-56 bg-[var(--bg-tertiary)] rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3 py-2">
                <div className="h-6 bg-[var(--bg-tertiary)] rounded w-3/4" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-2/3" />
                <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-[var(--bg-tertiary)] rounded w-28" />
                    <div className="h-8 bg-[var(--bg-tertiary)] rounded w-32" />
                </div>
            </div>
        </div>
    );
}

export default function PopularPage() {
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPopular() {
            try {
                const data = await comicService.getPopular(50);
                setComics(data || []);
            } catch (err) {
                console.error('Error fetching popular comics:', err);
                setError(err.message || 'Gagal memuat data');
            } finally {
                setLoading(false);
            }
        }
        fetchPopular();
    }, []);

    return (
        <div className="min-h-screen py-6 sm:py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                        Terpopuler
                    </h1>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Komik terpopuler berdasarkan jumlah pembaca di KomikoID.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                        Error: {error}
                    </div>
                )}

                {/* Comic List */}
                <div className="space-y-4">
                    {loading ? (
                        [...Array(5)].map((_, i) => <PopularComicSkeleton key={i} />)
                    ) : comics.length > 0 ? (
                        comics.map((comic, idx) => (
                            <PopularComicCard
                                key={comic.uuid || comic.slug}
                                comic={comic}
                                rank={idx + 1}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <TrendingUp size={64} className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-50" />
                            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                Belum Ada Komik Populer
                            </h2>
                            <p className="text-[var(--text-secondary)]">
                                Komik populer akan muncul di sini berdasarkan jumlah pembaca.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
