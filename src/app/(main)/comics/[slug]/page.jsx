'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Star,
    BookOpen,
    Clock,
    Eye,
    Bookmark,
    BookMarked,
    ChevronDown,
    ChevronUp,
    Languages,
    Share2,
    AlertCircle,
    ArrowUpDown,
    Loader2
} from 'lucide-react';
import comicService from '@/lib/api/services/comicService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import useBookmark from '@/hooks/useBookmark';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

// Chapter Item Component
function ChapterItem({ chapter, comicSlug }) {
    const hasTranslation = chapter.translation_status === 'completed';

    return (
        <Link
            href={`/comics/${comicSlug}/chapter/${chapter.number}`}
            className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] rounded-lg transition-all group"
        >
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-500)] transition-colors">
                        Chapter {chapter.number}
                    </span>
                    {chapter.title && chapter.title !== `Chapter ${chapter.number}` && (
                        <span className="text-sm text-[var(--text-tertiary)] truncate">
                            - {chapter.title}
                        </span>
                    )}
                </div>
                {chapter.published_at && (
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        {new Date(chapter.published_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                )}
            </div>

            {/* Translation Badge */}
            <div className={clsx(
                'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
                hasTranslation
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-yellow-500/10 text-yellow-500'
            )}>
                <Languages size={12} />
                {hasTranslation ? 'ID' : 'Raw'}
            </div>
        </Link>
    );
}

// Chapter List Skeleton
function ChapterListSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-12 rounded" />
                </div>
            ))}
        </div>
    );
}

// Main Comic Detail Page
export default function ComicDetailPage() {
    const params = useParams();
    const slug = params.slug;

    const { isAuthenticated } = useAuth();
    const toast = useToast();

    const [comic, setComic] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chaptersLoading, setChaptersLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFullSynopsis, setShowFullSynopsis] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first

    // Bookmark hook - use comic uuid when available
    const { isBookmarked, loading: bookmarkLoading, toggle: toggleBookmark } = useBookmark(comic?.uuid || comic?.slug);

    // Fetch comic detail
    useEffect(() => {
        async function fetchComic() {
            setLoading(true);
            setError(null);
            try {
                const data = await comicService.getComic(slug);
                setComic(data);
            } catch (err) {
                console.error('Failed to fetch comic:', err);
                setError(err.message || 'Gagal memuat komik');
            } finally {
                setLoading(false);
            }
        }

        if (slug) {
            fetchComic();
        }
    }, [slug]);

    // Fetch chapters
    useEffect(() => {
        async function fetchChapters() {
            if (!comic?.slug) return;

            setChaptersLoading(true);
            try {
                const response = await comicService.getChapters(comic.slug, {
                    order: sortOrder,
                    per_page: 100
                });
                setChapters(response.data || response || []);
            } catch (err) {
                console.error('Failed to fetch chapters:', err);
            } finally {
                setChaptersLoading(false);
            }
        }

        fetchChapters();
    }, [comic?.slug, sortOrder]);

    // Handle bookmark toggle
    const handleBookmark = async () => {
        if (!isAuthenticated) {
            toast.info('Silakan login untuk menyimpan bookmark');
            return;
        }

        const result = await toggleBookmark();
        if (result.success) {
            toast.success(result.isBookmarked ? 'Ditambahkan ke bookmark' : 'Bookmark dihapus');
        } else if (result.error) {
            toast.error(result.error);
        }
    };

    // Handle share
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: comic.title,
                    text: comic.synopsis,
                    url: window.location.href,
                });
            } catch (err) {
                // User cancelled
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link disalin ke clipboard');
        }
    };

    // Toggle sort order
    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                {/* Hero Skeleton */}
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    <Skeleton className="w-64 h-80 rounded-xl flex-shrink-0 mx-auto lg:mx-0" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <div className="flex gap-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-8 w-20 rounded-full" />
                            ))}
                        </div>
                        <Skeleton.Text lines={4} />
                    </div>
                </div>

                <ChapterListSkeleton />
            </div>
        );
    }

    if (error || !comic) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Komik Tidak Ditemukan
                </h1>
                <p className="text-[var(--text-secondary)] mb-6">
                    {error || 'Maaf, komik yang Anda cari tidak tersedia.'}
                </p>
                <Link href="/comics">
                    <Button variant="primary">
                        Kembali ke Daftar Komik
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <div className="relative">
                {/* Background */}
                <div className="absolute inset-0 h-[400px] overflow-hidden">
                    <Image
                        src={comic.banner_image_url || comic.cover_image_url || '/images/banners/default-banner.jpg'}
                        alt=""
                        fill
                        className="object-cover blur-sm opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />
                </div>

                {/* Content */}
                <div className="relative container mx-auto px-4 pt-12 pb-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cover */}
                        <div className="relative w-56 h-72 mx-auto lg:mx-0 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl">
                            <Image
                                src={comic.cover_image_url || '/images/placeholders/comic-placeholder.png'}
                                alt={comic.title}
                                fill
                                sizes="224px"
                                className="object-cover"
                                priority
                            />
                            {/* Type Badge */}
                            <div className="absolute top-2 left-2">
                                <span className={clsx(
                                    'px-2 py-1 text-xs font-medium rounded',
                                    comic.type === 'manga' && 'bg-red-500 text-white',
                                    comic.type === 'manhwa' && 'bg-blue-500 text-white',
                                    comic.type === 'manhua' && 'bg-green-500 text-white',
                                    !['manga', 'manhwa', 'manhua'].includes(comic.type) && 'bg-gray-500 text-white'
                                )}>
                                    {comic.type?.toUpperCase() || 'KOMIK'}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2">
                                {comic.title}
                            </h1>

                            {comic.alternative_title && (
                                <p className="text-lg text-[var(--text-secondary)] mb-4">
                                    {comic.alternative_title}
                                </p>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4 text-sm">
                                {comic.rating && (
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium text-[var(--text-primary)]">
                                            {parseFloat(comic.rating).toFixed(1)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                    <BookOpen size={16} />
                                    <span>{comic.total_chapters || chapters.length} Chapter</span>
                                </div>
                                {comic.total_views && (
                                    <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                        <Eye size={16} />
                                        <span>{comic.total_views.toLocaleString()} Views</span>
                                    </div>
                                )}
                                <div className={clsx(
                                    'flex items-center gap-1 px-2 py-0.5 rounded',
                                    comic.status === 'ongoing' && 'bg-green-500/10 text-green-500',
                                    comic.status === 'completed' && 'bg-blue-500/10 text-blue-500',
                                    comic.status === 'hiatus' && 'bg-yellow-500/10 text-yellow-500'
                                )}>
                                    <Clock size={14} />
                                    {comic.status === 'ongoing' ? 'Ongoing' :
                                        comic.status === 'completed' ? 'Tamat' :
                                            comic.status === 'hiatus' ? 'Hiatus' : comic.status}
                                </div>
                            </div>

                            {/* Author/Artist */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4 text-sm text-[var(--text-secondary)]">
                                {comic.author && (
                                    <span>Author: <strong className="text-[var(--text-primary)]">{comic.author}</strong></span>
                                )}
                                {comic.artist && comic.artist !== comic.author && (
                                    <span>Artist: <strong className="text-[var(--text-primary)]">{comic.artist}</strong></span>
                                )}
                            </div>

                            {/* Genres */}
                            {comic.genres && comic.genres.length > 0 && (
                                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                                    {comic.genres.map((genre) => (
                                        <Link
                                            key={genre.slug}
                                            href={`/comics?genre=${genre.slug}`}
                                            className="px-3 py-1 bg-[var(--bg-tertiary)] hover:bg-[var(--primary-500)]/10 hover:text-[var(--primary-500)] text-sm rounded-full transition-colors"
                                        >
                                            {genre.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                {chapters.length > 0 && (
                                    <Link href={`/comics/${comic.slug}/chapter/${chapters[chapters.length - 1]?.number || 1}`}>
                                        <Button variant="primary" size="lg" leftIcon={<BookOpen size={18} />}>
                                            Mulai Baca
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant={isBookmarked ? "secondary" : "outline"}
                                    size="lg"
                                    onClick={handleBookmark}
                                    leftIcon={isBookmarked ? <BookMarked size={18} /> : <Bookmark size={18} />}
                                >
                                    {isBookmarked ? 'Disimpan' : 'Bookmark'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={handleShare}
                                    leftIcon={<Share2 size={18} />}
                                >
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Synopsis */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Sinopsis</h2>
                    <div className={clsx(
                        'text-[var(--text-secondary)] leading-relaxed',
                        !showFullSynopsis && 'line-clamp-4'
                    )}>
                        {comic.synopsis || 'Tidak ada sinopsis tersedia.'}
                    </div>
                    {comic.synopsis && comic.synopsis.length > 300 && (
                        <button
                            onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                            className="flex items-center gap-1 mt-3 text-sm font-medium text-[var(--primary-500)] hover:text-[var(--primary-400)]"
                        >
                            {showFullSynopsis ? (
                                <>
                                    <ChevronUp size={16} /> Sembunyikan
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={16} /> Baca Selengkapnya
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Chapter List */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                            Daftar Chapter ({chapters.length})
                        </h2>
                        <button
                            onClick={toggleSort}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--bg-secondary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                        >
                            <ArrowUpDown size={16} />
                            {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}
                        </button>
                    </div>

                    {chaptersLoading ? (
                        <ChapterListSkeleton />
                    ) : chapters.length > 0 ? (
                        <div className="space-y-2">
                            {chapters.map((chapter) => (
                                <ChapterItem
                                    key={chapter.uuid || chapter.slug || chapter.number}
                                    chapter={chapter}
                                    comicSlug={comic.slug}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl">
                            <BookOpen size={48} className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-50" />
                            <p className="text-[var(--text-secondary)]">Belum ada chapter tersedia.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
