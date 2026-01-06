'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
    ArrowRight,
    TrendingUp,
    Clock,
    Star,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Languages
} from 'lucide-react';
import comicService from '@/lib/api/services/comicService';
import Skeleton from '@/components/ui/Skeleton';
import clsx from 'clsx';

// Comic Card Component
function ComicCard({ comic, priority = false }) {
    return (
        <Link
            href={`/comics/${comic.slug}`}
            className="group relative bg-[var(--bg-secondary)] rounded-xl overflow-hidden card-hover border border-[var(--border-primary)]"
        >
            {/* Cover */}
            <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                    src={comic.cover_image_url || '/images/placeholders/comic-placeholder.png'}
                    alt={comic.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={priority}
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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
            </div>

            {/* Info */}
            <div className="p-3">
                <h3 className="font-semibold text-sm text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--primary-500)] transition-colors">
                    {comic.title}
                </h3>

                {/* Genres */}
                {comic.genres && comic.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {comic.genres.slice(0, 2).map((genre) => (
                            <span
                                key={genre.slug}
                                className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                )}

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
                            {comic.total_chapters} Ch
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

// Comic Card Skeleton
function ComicCardSkeleton() {
    return (
        <div className="bg-[var(--bg-secondary)] rounded-xl overflow-hidden border border-[var(--border-primary)]">
            <Skeleton className="aspect-[3/4]" />
            <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                </div>
            </div>
        </div>
    );
}

// Hero Section
function HeroSection({ featuredComics }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!featuredComics?.length) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % featuredComics.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [featuredComics?.length]);

    if (!featuredComics?.length) {
        return (
            <section className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--bg-primary)]">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            <span className="gradient-text">KomikoID</span>
                        </h1>
                        <p className="text-xl text-white/80 mb-8">
                            Baca Komik dengan Terjemahan Indonesia
                        </p>
                        <div className="flex items-center justify-center gap-2 text-white/60">
                            <Languages size={20} />
                            <span>Powered by MTL Technology</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const currentComic = featuredComics[currentSlide];

    return (
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <Image
                    src={currentComic.banner_image_url || currentComic.cover_image_url || '/images/banners/default-banner.jpg'}
                    alt={currentComic.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 flex items-center">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={20} className="text-[var(--primary-400)]" />
                        <span className="text-sm font-medium text-[var(--primary-400)]">Featured</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 line-clamp-2">
                        {currentComic.title}
                    </h1>

                    <p className="text-white/80 text-lg mb-6 line-clamp-3">
                        {currentComic.synopsis || 'Tidak ada sinopsis tersedia.'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {currentComic.genres?.slice(0, 4).map((genre) => (
                            <span
                                key={genre.slug}
                                className="px-3 py-1 bg-white/10 backdrop-blur text-white text-sm rounded-full"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={`/comics/${currentComic.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-medium rounded-xl transition-colors"
                        >
                            <BookOpen size={20} />
                            Baca Sekarang
                        </Link>
                        <div className="flex items-center gap-2 text-white/60">
                            <Star size={18} className="text-yellow-400 fill-yellow-400" />
                            <span>{currentComic.rating ? parseFloat(currentComic.rating).toFixed(1) : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Controls */}
            {featuredComics.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredComics.length) % featuredComics.length)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        {featuredComics.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={clsx(
                                    'w-2 h-2 rounded-full transition-all',
                                    idx === currentSlide
                                        ? 'bg-[var(--primary-500)] w-8'
                                        : 'bg-white/40 hover:bg-white/60'
                                )}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredComics.length)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </section>
    );
}

// Section Header
function SectionHeader({ icon: Icon, title, href, linkText = 'Lihat Semua' }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                {Icon && <Icon size={24} className="text-[var(--primary-500)]" />}
                <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
            </div>
            {href && (
                <Link
                    href={href}
                    className="flex items-center gap-1 text-sm font-medium text-[var(--primary-500)] hover:text-[var(--primary-400)] transition-colors"
                >
                    {linkText}
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}

// Main Homepage Component
export default function HomePage() {
    const [featuredComics, setFeaturedComics] = useState([]);
    const [latestComics, setLatestComics] = useState([]);
    const [popularComics, setPopularComics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [featured, latest, popular] = await Promise.all([
                    comicService.getFeatured().catch(() => ({ data: [] })),
                    comicService.getLatest(12).catch(() => ({ data: [] })),
                    comicService.getPopular(12).catch(() => ({ data: [] })),
                ]);

                setFeaturedComics(featured.data || featured || []);
                setLatestComics(latest.data || latest || []);
                setPopularComics(popular.data || popular || []);
            } catch (error) {
                console.error('Failed to fetch comics:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <HeroSection featuredComics={featuredComics} />

            {/* Latest Updates */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        icon={Clock}
                        title="Update Terbaru"
                        href="/latest"
                    />

                    {loading ? (
                        <div className="comic-grid">
                            {[...Array(6)].map((_, i) => (
                                <ComicCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : latestComics.length > 0 ? (
                        <div className="comic-grid">
                            {latestComics.slice(0, 12).map((comic, idx) => (
                                <ComicCard key={comic.uuid || comic.slug} comic={comic} priority={idx < 6} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-[var(--text-tertiary)]">
                            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Belum ada komik tersedia.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Popular Comics */}
            <section className="py-12 md:py-16 bg-[var(--bg-secondary)]">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        icon={TrendingUp}
                        title="Komik Populer"
                        href="/popular"
                    />

                    {loading ? (
                        <div className="comic-grid">
                            {[...Array(6)].map((_, i) => (
                                <ComicCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : popularComics.length > 0 ? (
                        <div className="comic-grid">
                            {popularComics.slice(0, 12).map((comic) => (
                                <ComicCard key={comic.uuid || comic.slug} comic={comic} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-[var(--text-tertiary)]">
                            <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Belum ada komik populer.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* MTL Feature Highlight */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-500)]/10 rounded-full mb-6">
                            <Languages size={20} className="text-[var(--primary-500)]" />
                            <span className="text-sm font-medium text-[var(--primary-500)]">MTL Technology</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
                            Terjemahan Bahasa Indonesia
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                            Nikmati komik favorit Anda dengan terjemahan bahasa Indonesia menggunakan teknologi Machine Translation terbaru.
                            Cepat, akurat, dan mudah digunakan.
                        </p>
                        <Link
                            href="/comics"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white font-medium rounded-xl transition-colors"
                        >
                            Jelajahi Komik
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
