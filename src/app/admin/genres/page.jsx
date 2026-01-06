'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Tags,
    Loader2,
    X,
    Check
} from 'lucide-react';
import adminService from '@/lib/api/services/adminService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import clsx from 'clsx';

// Genre Form Modal
function GenreModal({ genre, onClose, onSave }) {
    const [name, setName] = useState(genre?.name || '');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Nama genre wajib diisi');
            return;
        }

        setLoading(true);
        try {
            if (genre) {
                await adminService.updateGenre(genre.uuid, { name });
                toast.success('Genre berhasil diperbarui');
            } else {
                await adminService.createGenre({ name });
                toast.success('Genre berhasil ditambahkan');
            }
            onSave();
            onClose();
        } catch (err) {
            toast.error(err.message || 'Gagal menyimpan genre');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-[var(--bg-secondary)] rounded-xl p-6 w-full max-w-md border border-[var(--border-primary)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--surface-hover)]"
                >
                    <X size={18} />
                </button>

                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                    {genre ? 'Edit Genre' : 'Tambah Genre'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Nama Genre
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Action, Romance, Comedy"
                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={onClose}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            leftIcon={<Check size={18} />}
                        >
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Main Genres Page
export default function AdminGenresPage() {
    const toast = useToast();
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);

    // Fetch genres
    const fetchGenres = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getGenres({ per_page: 100 });
            setGenres(response.data || []);
        } catch (err) {
            toast.error('Gagal memuat data genre');
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    // Handle delete
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus genre ini?');
        if (!confirmed) return;

        setDeleting(id);
        try {
            await adminService.deleteGenre(id);
            setGenres(prev => prev.filter(g => g.uuid !== id));
            toast.success('Genre berhasil dihapus');
        } catch (err) {
            toast.error(err.message || 'Gagal menghapus genre');
        } finally {
            setDeleting(null);
        }
    };

    // Open edit modal
    const handleEdit = (genre) => {
        setEditingGenre(genre);
        setShowModal(true);
    };

    // Open add modal
    const handleAdd = () => {
        setEditingGenre(null);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manajemen Genre</h1>
                    <p className="text-[var(--text-secondary)]">{genres.length} genre terdaftar</p>
                </div>
                <Button variant="primary" leftIcon={<Plus size={18} />} onClick={handleAdd}>
                    Tambah Genre
                </Button>
            </div>

            {/* Genres Grid */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-16 rounded-lg" />
                        ))}
                    </div>
                ) : genres.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {genres.map((genre) => (
                            <div
                                key={genre.uuid}
                                className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)] group hover:border-[var(--primary-500)] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Tags size={18} className="text-[var(--primary-500)]" />
                                    <span className="font-medium text-[var(--text-primary)]">{genre.name}</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(genre)}
                                        className="p-1.5 rounded hover:bg-[var(--surface-hover)]"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(genre.uuid)}
                                        disabled={deleting === genre.uuid}
                                        className="p-1.5 rounded text-red-500 hover:bg-red-500/10"
                                    >
                                        {deleting === genre.uuid ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-[var(--text-tertiary)]">
                        <Tags size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Belum ada genre</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <GenreModal
                    genre={editingGenre}
                    onClose={() => setShowModal(false)}
                    onSave={fetchGenres}
                />
            )}
        </div>
    );
}
