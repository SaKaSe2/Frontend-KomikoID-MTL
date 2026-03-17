'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Clock, BookOpen } from 'lucide-react';
import comicService from '@/lib/api/services/comicService';

// Comic Card Component - Horizontal Layout
function ComicCard({ comic, priority = false }) {
    // Get chapters from various possible API response formats
    let chapters = [];
    if (comic.chapters && comic.chapters.length > 0) {
        chapters = comic.chapters;
    } else if (comic.latest_chapters && comic.latest_chapters.length > 0) {
        chapters = comic.latest_chapters;
    } else if (comic.latest_chapter) {
        chapters = [comic.latest_chapter];
    }

    return (
        <div className="flex bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-primary)] hover:border-[var(--primary-500)] hover:bg-[var(--bg-tertiary)] transition-colors">
            {/* Cover - Left Side */}
            <Link href={`/comics/${comic.slug}`} className="relative w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0">
                <Image
                    src={comic.cover_image_url || '/images/placeholders/comic-placeholder.png'}
                    alt={comic.title}
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover"
                    priority={priority}
                    unoptimized
                />
            </Link>

            {/* Info - Right Side */}
            <div className="flex-1 p-3 min-w-0 flex flex-col">
                {/* Title */}
                <Link href={`/comics/${comic.slug}`}>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2 hover:text-[var(--primary-500)] transition-colors">
                        {comic.title}
                    </h3>
                </Link>

                {/* Type & Status */}
                <div className="flex items-center gap-2 mt-1 mb-2">
                     <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        comic.type === 'manga' ? 'bg-red-500/10 text-red-500' :
                        comic.type === 'manhwa' ? 'bg-blue-500/10 text-blue-500' :
                        comic.type === 'manhua' ? 'bg-green-500/10 text-green-500' :
                        'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                    }`}>
                        {comic.type?.toUpperCase() || 'KOMIK'}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] truncate">
                        {comic.genres?.slice(0, 2).map(g => g.name).join(', ')}
                    </span>
                </div>

                <div className="flex-1" />

                {/* Chapter List - max 2 */}
                {chapters.length > 0 ? (
                    <div className="space-y-1.5">
                        {chapters.slice(0, 2).map((ch, idx) => (
                            <Link
                                key={idx}
                                href={`/comics/${comic.slug}/chapter/${ch.number || ch.chapter_number}`}
                                className="flex items-center justify-between text-sm group bg-[var(--bg-tertiary)] px-2 py-1.5 rounded hover:bg-[var(--surface-hover)] transition-colors"
                            >
                                <span className="font-medium text-[var(--text-secondary)] group-hover:text-[var(--primary-500)] transition-colors">
                                    Chapter {ch.number || ch.chapter_number}
                                </span>
                                <span className="text-[var(--text-tertiary)] text-[11px] flex items-center gap-1">
                                    <Clock size={10} />
                                    {ch.time_ago || ch.published_at || ch.created_at || 'Baru'}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-xs text-[var(--text-tertiary)] italic">
                        Belum ada chapter
                    </div>
                )}
            </div>
        </div>
    );
}


// Comic Card Skeleton - Horizontal
function ComicCardSkeleton() {
    return (
        <div className="flex bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-primary)] animate-pulse">
            <div className="w-24 h-32 sm:w-28 sm:h-36 bg-[var(--bg-tertiary)] flex-shrink-0" />
            <div className="flex-1 p-3 space-y-3 flex flex-col">
                <div className="space-y-2">
                    <div className="h-5 bg-[var(--bg-tertiary)] rounded w-3/4" />
                    <div className="h-5 bg-[var(--bg-tertiary)] rounded w-1/2" />
                </div>
                <div className="flex-1" />
                <div className="space-y-2">
                    <div className="h-7 bg-[var(--bg-tertiary)] rounded w-full" />
                    <div className="h-7 bg-[var(--bg-tertiary)] rounded w-full" />
                </div>
            </div>
        </div>
    );
}

export default function LatestPage() {
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLatest() {
            try {
                // Fetch up to 30 latest comics
                const data = await comicService.getLatest(30);
                setComics(data.data || data || []);
            } catch (err) {
                console.error('Error fetching latest comics:', err);
                setError(err.message || 'Gagal memuat data');
            } finally {
                setLoading(false);
            }
        }
        fetchLatest();
    }, []);

    return (
        <div className="min-h-screen py-6 sm:py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="p-2.5 bg-[var(--primary-500)]/10 text-[var(--primary-500)] rounded-lg">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                            Update Terbaru
                        </h1>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            Daftar chapter komik yang baru saja diupdate.
                        </p>
                    </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(12)].map((_, i) => <ComicCardSkeleton key={i} />)}
                        </div>
                    ) : comics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {comics.map((comic, idx) => (
                                <ComicCard
                                    key={comic.uuid || comic.slug}
                                    comic={comic}
                                    priority={idx < 4}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <BookOpen size={64} className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-50" />
                            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                Belum Ada Update
                            </h2>
                            <p className="text-[var(--text-secondary)]">
                                Belum ada komik terbaru saat ini. Silakan kembali lagi nanti.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
