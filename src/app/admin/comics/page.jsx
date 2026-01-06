'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    Filter,
    ArrowUpDown,
    Loader2
} from 'lucide-react';
import adminService from '@/lib/api/services/adminService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import clsx from 'clsx';

// Comics Table Row
function ComicRow({ comic, onDelete, deleting }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <tr className="border-b border-[var(--border-primary)] hover:bg-[var(--surface-hover)]">
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-14 rounded bg-[var(--bg-tertiary)] overflow-hidden flex-shrink-0">
                        {(comic.cover_image_url || comic.cover_image) && (
                            <Image
                                src={comic.cover_image_url || comic.cover_image}
                                alt={comic.title}
                                width={40}
                                height={56}
                                className="object-cover"
                                unoptimized
                            />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">{comic.title}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{comic.author}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className={clsx(
                    'px-2 py-1 text-xs font-medium rounded',
                    comic.type === 'manga' && 'bg-red-500/10 text-red-500',
                    comic.type === 'manhwa' && 'bg-blue-500/10 text-blue-500',
                    comic.type === 'manhua' && 'bg-green-500/10 text-green-500'
                )}>
                    {comic.type?.toUpperCase()}
                </span>
            </td>
            <td className="py-3 px-4">
                <span className={clsx(
                    'px-2 py-1 text-xs font-medium rounded',
                    comic.status === 'ongoing' && 'bg-green-500/10 text-green-500',
                    comic.status === 'completed' && 'bg-blue-500/10 text-blue-500',
                    comic.status === 'hiatus' && 'bg-yellow-500/10 text-yellow-500'
                )}>
                    {comic.status}
                </span>
            </td>
            <td className="py-3 px-4 text-[var(--text-secondary)]">
                {comic.total_chapters || 0}
            </td>
            <td className="py-3 px-4 text-[var(--text-secondary)]">
                {comic.total_views?.toLocaleString() || 0}
            </td>
            <td className="py-3 px-4">
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-20 py-1">
                                <Link
                                    href={`/comics/${comic.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
                                >
                                    <Eye size={14} />
                                    Lihat
                                </Link>
                                <Link
                                    href={`/admin/comics/${comic.uuid}/edit`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
                                >
                                    <Edit size={14} />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onDelete(comic.uuid);
                                    }}
                                    disabled={deleting === comic.uuid}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                                >
                                    {deleting === comic.uuid ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={14} />
                                    )}
                                    Hapus
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}

// Main Comics List Page
export default function AdminComicsPage() {
    const toast = useToast();
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ type: '', status: '' });

    // Fetch comics
    const fetchComics = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await adminService.getComics({
                page,
                per_page: 15,
                search: search || undefined,
                type: filters.type || undefined,
                status: filters.status || undefined,
            });
            setComics(response.data || []);
            setMeta(response.meta || { current_page: 1, last_page: 1, total: 0 });
        } catch (err) {
            toast.error('Gagal memuat data komik');
        } finally {
            setLoading(false);
        }
    }, [search, filters, toast]);

    useEffect(() => {
        fetchComics();
    }, [fetchComics]);

    // Handle delete
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus komik ini?');
        if (!confirmed) return;

        setDeleting(id);
        try {
            await adminService.deleteComic(id);
            setComics(prev => prev.filter(c => c.uuid !== id));
            setMeta(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
            toast.success('Komik berhasil dihapus');
        } catch (err) {
            toast.error(err.message || 'Gagal menghapus komik');
        } finally {
            setDeleting(null);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchComics(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manajemen Komik</h1>
                    <p className="text-[var(--text-secondary)]">{meta.total} komik terdaftar</p>
                </div>
                <Link href="/admin/comics/create">
                    <Button variant="primary" leftIcon={<Plus size={18} />}>
                        Tambah Komik
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-primary)]">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul, author..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                            />
                        </div>
                    </form>

                    {/* Type Filter */}
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="manga">Manga</option>
                        <option value="manhwa">Manhwa</option>
                        <option value="manhua">Manhua</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                    >
                        <option value="">Semua Status</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="hiatus">Hiatus</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--bg-tertiary)]">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Komik</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Tipe</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Chapter</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Views</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-[var(--border-primary)]">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="w-10 h-14 rounded" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-20" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-4 w-8" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-4 w-12" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-8 w-8" /></td>
                                    </tr>
                                ))
                            ) : comics.length > 0 ? (
                                comics.map((comic) => (
                                    <ComicRow
                                        key={comic.uuid}
                                        comic={comic}
                                        onDelete={handleDelete}
                                        deleting={deleting}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[var(--text-tertiary)]">
                                        Tidak ada komik ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-primary)]">
                        <p className="text-sm text-[var(--text-tertiary)]">
                            Halaman {meta.current_page} dari {meta.last_page}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchComics(meta.current_page - 1)}
                                disabled={meta.current_page <= 1}
                                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-tertiary)] disabled:opacity-50"
                            >
                                Sebelumnya
                            </button>
                            <button
                                onClick={() => fetchComics(meta.current_page + 1)}
                                disabled={meta.current_page >= meta.last_page}
                                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-tertiary)] disabled:opacity-50"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
