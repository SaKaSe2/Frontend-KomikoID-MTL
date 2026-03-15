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

// Comic Card Component - Horizontal Layout like Komikcast
function ComicCard({ comic, priority = false }) {
    // Get chapters from various possible API response formats
    let chapters = [];
    if (comic.chapters && comic.chapters.length > 0) {
        chapters = comic.chapters;
    } else if (comic.latest_chapters && comic.latest_chapters.length > 0) {
        chapters = comic.latest_chapters;
    } else if (comic.latest_chapter) {
        // If only latest_chapter object exists, create array from it
        chapters = [comic.latest_chapter];
    }

    return (
        <div className="flex bg-[var(--bg-card)] rounded-lg overflow-hidden hover:bg-[var(--bg-tertiary)] transition-colors">
            {/* Cover - Left Side */}
            <Link href={`/comics/${comic.slug}`} className="relative w-20 h-28 flex-shrink-0">
                <Image
                    src={comic.cover_image_url || '/images/placeholders/comic-placeholder.png'}
                    alt={comic.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                    priority={priority}
                />
                {/* HOT Badge */}
                <span className="absolute top-0 left-0 px-1.5 py-0.5 text-[8px] font-bold uppercase bg-red-500 text-white">
                    HOT
                </span>
            </Link>

            {/* Info - Right Side */}
            <div className="flex-1 p-2 min-w-0">
                {/* Title */}
                <Link href={`/comics/${comic.slug}`}>
                    <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 hover:text-[var(--primary-500)] transition-colors">
                        {comic.title}
                    </h3>
                </Link>

                {/* Chapter List - Only show if chapters exist, max 2 */}
                {chapters.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                        {chapters.slice(0, 2).map((ch, idx) => (
                            <Link
                                key={idx}
                                href={`/comics/${comic.slug}/chapter/${ch.number || ch.chapter_number}`}
                                className="flex items-center justify-between text-xs group"
                            >
                                <span className="text-[var(--text-secondary)] group-hover:text-[var(--primary-500)] transition-colors">
                                    Ch. {ch.number || ch.chapter_number}
                                </span>
                                <span className="text-[var(--text-tertiary)] text-[10px]">
                                    {ch.time_ago || ch.published_at || ch.created_at || 'Baru'}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


// Comic Card Skeleton - Horizontal
function ComicCardSkeleton() {
    return (
        <div className="flex bg-[var(--bg-card)] rounded-lg overflow-hidden">
            <div className="w-20 h-28 bg-[var(--bg-tertiary)] animate-pulse flex-shrink-0" />
            <div className="flex-1 p-2 space-y-2">
                <div className="h-4 bg-[var(--bg-tertiary)] rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                <div className="h-3 bg-[var(--bg-tertiary)] rounded animate-pulse" />
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
            <section className="relative h-[400px] sm:h-[500px] md:h-[550px] bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--bg-primary)]">
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
        <section className="relative h-[400px] sm:h-[500px] md:h-[550px] overflow-hidden">
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
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-gray-900 font-semibold rounded-xl transition-colors"
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

// Section Header - Like reference sites with bottom border
function SectionHeader({ icon: Icon, title, href, linkText = 'Lihat Semua' }) {
    return (
        <div className="section-header">
            <div className="section-title">
                {Icon && <Icon size={20} className="icon" />}
                <h2>{title}</h2>
            </div>
            {href && (
                <Link href={href} className="section-link">
                    {linkText}
                    <ArrowRight size={14} />
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
            <section className="py-8 sm:py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        icon={Clock}
                        title="Update Terbaru"
                        href="/latest"
                    />

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => (
                                <ComicCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : latestComics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {latestComics.slice(0, 9).map((comic, idx) => (
                                <ComicCard key={comic.uuid || comic.slug} comic={comic} priority={idx < 3} />
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
            <section className="py-8 sm:py-12 md:py-16 bg-[var(--bg-secondary)]">
                <div className="container mx-auto px-4">
                    <SectionHeader
                        icon={TrendingUp}
                        title="Komik Populer"
                        href="/popular"
                    />

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => (
                                <ComicCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : popularComics.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {popularComics.slice(0, 9).map((comic) => (
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
        </div>
    );
}


