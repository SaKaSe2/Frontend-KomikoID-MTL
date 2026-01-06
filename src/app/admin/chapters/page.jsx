'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    Loader2,
    Languages
} from 'lucide-react';
import adminService from '@/lib/api/services/adminService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import clsx from 'clsx';

// Chapter Table Row
function ChapterRow({ chapter, onDelete, deleting }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <tr className="border-b border-[var(--border-primary)] hover:bg-[var(--surface-hover)]">
            <td className="py-3 px-4">
                <div className="min-w-0">
                    <p className="font-medium text-[var(--text-primary)]">
                        Chapter {chapter.number}
                    </p>
                    {chapter.title && (
                        <p className="text-xs text-[var(--text-tertiary)] truncate">{chapter.title}</p>
                    )}
                </div>
            </td>
            <td className="py-3 px-4">
                <Link
                    href={`/admin/comics/${chapter.comic?.uuid}/edit`}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary-500)]"
                >
                    {chapter.comic?.title || '-'}
                </Link>
            </td>
            <td className="py-3 px-4 text-[var(--text-secondary)]">
                {chapter.total_pages || 0}
            </td>
            <td className="py-3 px-4">
                <span className={clsx(
                    'flex items-center gap-1 w-fit px-2 py-1 text-xs font-medium rounded',
                    chapter.translation_status === 'completed' && 'bg-green-500/10 text-green-500',
                    chapter.translation_status === 'pending' && 'bg-yellow-500/10 text-yellow-500',
                    chapter.translation_status === 'processing' && 'bg-blue-500/10 text-blue-500',
                    !chapter.translation_status && 'bg-gray-500/10 text-gray-500'
                )}>
                    <Languages size={12} />
                    {chapter.translation_status === 'completed' ? 'Selesai' :
                        chapter.translation_status === 'pending' ? 'Menunggu' :
                            chapter.translation_status === 'processing' ? 'Proses' : 'Raw'}
                </span>
            </td>
            <td className="py-3 px-4 text-[var(--text-tertiary)] text-sm">
                {chapter.published_at ? new Date(chapter.published_at).toLocaleDateString('id-ID') : '-'}
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
                                    href={`/comics/${chapter.comic?.slug}/chapter/${chapter.number}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
                                >
                                    <Eye size={14} />
                                    Lihat
                                </Link>
                                <Link
                                    href={`/admin/chapters/${chapter.uuid}/edit`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
                                >
                                    <Edit size={14} />
                                    Edit
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onDelete(chapter.uuid);
                                    }}
                                    disabled={deleting === chapter.uuid}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                                >
                                    {deleting === chapter.uuid ? (
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

// Main Chapters List Page
export default function AdminChaptersPage() {
    const toast = useToast();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [search, setSearch] = useState('');
    const [translationFilter, setTranslationFilter] = useState('');

    // Fetch chapters
    const fetchChapters = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await adminService.getChapters({
                page,
                per_page: 20,
                search: search || undefined,
                translation_status: translationFilter || undefined,
            });
            setChapters(response.data || []);
            setMeta(response.meta || { current_page: 1, last_page: 1, total: 0 });
        } catch (err) {
            toast.error('Gagal memuat data chapter');
        } finally {
            setLoading(false);
        }
    }, [search, translationFilter, toast]);

    useEffect(() => {
        fetchChapters();
    }, [fetchChapters]);

    // Handle delete
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus chapter ini?');
        if (!confirmed) return;

        setDeleting(id);
        try {
            await adminService.deleteChapter(id);
            setChapters(prev => prev.filter(c => c.uuid !== id));
            setMeta(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
            toast.success('Chapter berhasil dihapus');
        } catch (err) {
            toast.error(err.message || 'Gagal menghapus chapter');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manajemen Chapter</h1>
                    <p className="text-[var(--text-secondary)]">{meta.total} chapter terdaftar</p>
                </div>
                <Link href="/admin/chapters/create">
                    <Button variant="primary" leftIcon={<Plus size={18} />}>
                        Tambah Chapter
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-primary)]">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari chapter atau komik..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                        />
                    </div>

                    {/* Translation Status Filter */}
                    <select
                        value={translationFilter}
                        onChange={(e) => setTranslationFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                    >
                        <option value="">Semua Status Terjemahan</option>
                        <option value="completed">Selesai</option>
                        <option value="pending">Menunggu</option>
                        <option value="processing">Proses</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--bg-tertiary)]">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Chapter</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Komik</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Halaman</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Terjemahan</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Terbit</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-[var(--border-primary)]">
                                        <td className="py-3 px-4">
                                            <Skeleton className="h-5 w-24" />
                                        </td>
                                        <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-4 w-8" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-8 w-8" /></td>
                                    </tr>
                                ))
                            ) : chapters.length > 0 ? (
                                chapters.map((chapter) => (
                                    <ChapterRow
                                        key={chapter.uuid}
                                        chapter={chapter}
                                        onDelete={handleDelete}
                                        deleting={deleting}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[var(--text-tertiary)]">
                                        Tidak ada chapter ditemukan
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
                                onClick={() => fetchChapters(meta.current_page - 1)}
                                disabled={meta.current_page <= 1}
                                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-tertiary)] disabled:opacity-50"
                            >
                                Sebelumnya
                            </button>
                            <button
                                onClick={() => fetchChapters(meta.current_page + 1)}
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
