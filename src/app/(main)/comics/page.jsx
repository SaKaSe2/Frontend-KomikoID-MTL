'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Filter,
    Grid3X3,
    List,
    Star,
    BookOpen,
    ChevronDown,
    X,
    Search
} from 'lucide-react';
import comicService from '@/lib/api/services/comicService';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

// Types for comics
const TYPES = [
    { value: '', label: 'Semua Tipe' },
    { value: 'manga', label: 'Manga' },
    { value: 'manhwa', label: 'Manhwa' },
    { value: 'manhua', label: 'Manhua' },
];

const STATUSES = [
    { value: '', label: 'Semua Status' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Tamat' },
    { value: 'hiatus', label: 'Hiatus' },
];

const SORT_OPTIONS = [
    { value: 'updated_at', label: 'Terbaru Update' },
    { value: 'created_at', label: 'Terbaru Ditambahkan' },
    { value: 'title', label: 'Judul A-Z' },
    { value: 'rating', label: 'Rating Tertinggi' },
];

// Comic Card Component
function ComicCard({ comic, viewMode = 'grid' }) {
    if (viewMode === 'list') {
        return (
            <Link
                href={`/comics/${comic.slug}`}
                className="flex gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] hover:border-[var(--primary-500)] transition-all"
            >
                {/* Cover */}
                <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                        src={comic.cover_image_url || '/images/placeholders/comic-placeholder.png'}
                        alt={comic.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                    />
                    {/* Type Badge */}
                    <div className="absolute top-1 left-1">
                        <span className={clsx(
                            'px-1.5 py-0.5 text-[10px] font-medium rounded',
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
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1 hover:text-[var(--primary-500)] transition-colors">
                        {comic.title}
                    </h3>

                    {comic.alternative_title && (
                        <p className="text-xs text-[var(--text-tertiary)] line-clamp-1 mt-0.5">
                            {comic.alternative_title}
                        </p>
                    )}

                    {/* Genres */}
                    {comic.genres && comic.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {comic.genres.slice(0, 3).map((genre) => (
                                <span
                                    key={genre.slug}
                                    className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-tertiary)]">
                        {comic.rating && (
                            <span className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                {parseFloat(comic.rating).toFixed(1)}
                            </span>
                        )}
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
                                {comic.total_chapters} Chapter
                            </span>
                        )}
                    </div>

                    {/* Synopsis */}
                    {comic.synopsis && (
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-2">
                            {comic.synopsis}
                        </p>
                    )}
                </div>
            </Link>
        );
    }

    // Grid view
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
            </div>
        </Link>
    );
}

// Filter Dropdown
function FilterDropdown({ label, options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-sm hover:border-[var(--primary-500)] transition-colors"
            >
                <span className="text-[var(--text-tertiary)]">{label}:</span>
                <span className="text-[var(--text-primary)]">{selectedOption.label}</span>
                <ChevronDown size={16} className={clsx('transition-transform', isOpen && 'rotate-180')} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 w-48 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl shadow-xl z-20 py-1 animate-slide-down">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    'w-full px-4 py-2 text-sm text-left transition-colors',
                                    option.value === value
                                        ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = useMemo(() => {
        const items = [];
        const maxVisible = 5;

        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            items.push(i);
        }
        return items;
    }, [currentPage, totalPages]);

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--primary-500)] transition-colors"
            >
                Prev
            </button>

            {pages[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm hover:border-[var(--primary-500)] transition-colors"
                    >
                        1
                    </button>
                    {pages[0] > 2 && <span className="text-[var(--text-tertiary)]">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={clsx(
                        'w-10 h-10 rounded-lg text-sm transition-colors',
                        page === currentPage
                            ? 'bg-[var(--primary-500)] text-white'
                            : 'bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--primary-500)]'
                    )}
                >
                    {page}
                </button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && <span className="text-[var(--text-tertiary)]">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm hover:border-[var(--primary-500)] transition-colors"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--primary-500)] transition-colors"
            >
                Next
            </button>
        </div>
    );
}

// Main Comics List Page
export default function ComicsListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Filters from URL
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sort_by') || 'updated_at';
    const search = searchParams.get('search') || '';

    // Update URL with filters
    const updateFilters = useCallback((newFilters) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        // Reset page when filters change
        if (!('page' in newFilters)) {
            params.set('page', '1');
        }

        router.push(`/comics?${params.toString()}`);
    }, [searchParams, router]);

    // Fetch comics
    useEffect(() => {
        async function fetchComics() {
            setLoading(true);
            try {
                const response = await comicService.getComics({
                    page,
                    per_page: 20,
                    type: type || undefined,
                    status: status || undefined,
                    sort_by: sortBy,
                    search: search || undefined,
                });

                setComics(response.data || []);
                setMeta(response.meta || { current_page: 1, last_page: 1, total: 0 });
            } catch (error) {
                console.error('Failed to fetch comics:', error);
                setComics([]);
            } finally {
                setLoading(false);
            }
        }

        fetchComics();
    }, [page, type, status, sortBy, search]);

    // Active filters count
    const activeFiltersCount = [type, status].filter(Boolean).length;

    // Clear all filters
    const clearFilters = () => {
        router.push('/comics');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
                    Daftar Komik
                </h1>
                <p className="text-[var(--text-secondary)]">
                    {meta.total > 0 ? `${meta.total.toLocaleString()} komik tersedia` : 'Memuat...'}
                </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-sm"
                >
                    <Filter size={16} />
                    Filter
                    {activeFiltersCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[var(--primary-500)] text-white text-xs flex items-center justify-center">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {/* Desktop Filters */}
                <div className={clsx(
                    'flex flex-wrap gap-3',
                    showFilters ? 'flex' : 'hidden lg:flex'
                )}>
                    <FilterDropdown
                        label="Tipe"
                        options={TYPES}
                        value={type}
                        onChange={(v) => updateFilters({ type: v })}
                    />
                    <FilterDropdown
                        label="Status"
                        options={STATUSES}
                        value={status}
                        onChange={(v) => updateFilters({ status: v })}
                    />
                    <FilterDropdown
                        label="Urut"
                        options={SORT_OPTIONS}
                        value={sortBy}
                        onChange={(v) => updateFilters({ sort_by: v })}
                    />
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <X size={16} />
                        Reset Filter
                    </button>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* View Mode Toggle */}
                <div className="flex items-center bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg overflow-hidden">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={clsx(
                            'p-2 transition-colors',
                            viewMode === 'grid'
                                ? 'bg-[var(--primary-500)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                        )}
                        aria-label="Grid view"
                    >
                        <Grid3X3 size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={clsx(
                            'p-2 transition-colors',
                            viewMode === 'list'
                                ? 'bg-[var(--primary-500)] text-white'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                        )}
                        aria-label="List view"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Active Search */}
            {search && (
                <div className="mb-6 flex items-center gap-2">
                    <Search size={16} className="text-[var(--text-tertiary)]" />
                    <span className="text-[var(--text-secondary)]">Hasil pencarian untuk:</span>
                    <span className="font-medium text-[var(--text-primary)]">"{search}"</span>
                    <button
                        onClick={() => updateFilters({ search: '' })}
                        className="ml-2 p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)]"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Comics Grid/List */}
            {loading ? (
                <div className={viewMode === 'grid' ? 'comic-grid' : 'space-y-4'}>
                    {[...Array(12)].map((_, i) => (
                        viewMode === 'grid' ? (
                            <Skeleton.ComicCard key={i} />
                        ) : (
                            <div key={i} className="flex gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl">
                                <Skeleton className="w-24 h-32 rounded-lg flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        )
                    ))}
                </div>
            ) : comics.length > 0 ? (
                <>
                    <div className={viewMode === 'grid' ? 'comic-grid' : 'space-y-4'}>
                        {comics.map((comic) => (
                            <ComicCard
                                key={comic.uuid || comic.slug}
                                comic={comic}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={meta.current_page}
                        totalPages={meta.last_page}
                        onPageChange={(p) => updateFilters({ page: p.toString() })}
                    />
                </>
            ) : (
                <div className="text-center py-16">
                    <BookOpen size={64} className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-50" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                        Tidak Ada Komik
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        {search
                            ? 'Coba gunakan kata kunci yang berbeda.'
                            : 'Belum ada komik yang tersedia dengan filter ini.'
                        }
                    </p>
                    {(search || activeFiltersCount > 0) && (
                        <Button onClick={clearFilters} variant="outline">
                            Reset Filter
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
