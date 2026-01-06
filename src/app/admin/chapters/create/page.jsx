'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    Upload,
    X,
    Loader2,
    GripVertical,
    Plus,
    Trash2,
    Languages
} from 'lucide-react';
import adminService from '@/lib/api/services/adminService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';

export default function CreateChapterPage() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [comics, setComics] = useState([]);
    const [loadingComics, setLoadingComics] = useState(true);
    const fileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        comic_id: '',
        number: '',
        title: '',
        is_published: true,
    });

    // Pages state - array of { file, preview, id }
    const [pages, setPages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Fetch comics
    useEffect(() => {
        const fetchComics = async () => {
            try {
                const response = await adminService.getComics({ per_page: 100 });
                setComics(response.data || []);
            } catch (err) {
                console.error('Failed to load comics:', err);
                toast.error('Gagal memuat daftar komik');
            } finally {
                setLoadingComics(false);
            }
        };
        fetchComics();
    }, [toast]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle file selection
    const handleFilesSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newPages = files.map((file, index) => ({
            id: `page-${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file),
        }));

        setPages(prev => [...prev, ...newPages]);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Remove a page
    const removePage = (pageId) => {
        setPages(prev => {
            const page = prev.find(p => p.id === pageId);
            if (page?.preview) {
                URL.revokeObjectURL(page.preview);
            }
            return prev.filter(p => p.id !== pageId);
        });
    };

    // Clear all pages
    const clearAllPages = () => {
        pages.forEach(page => {
            if (page.preview) {
                URL.revokeObjectURL(page.preview);
            }
        });
        setPages([]);
    };

    // Move page up
    const movePageUp = (index) => {
        if (index === 0) return;
        setPages(prev => {
            const newPages = [...prev];
            [newPages[index - 1], newPages[index]] = [newPages[index], newPages[index - 1]];
            return newPages;
        });
    };

    // Move page down
    const movePageDown = (index) => {
        if (index === pages.length - 1) return;
        setPages(prev => {
            const newPages = [...prev];
            [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
            return newPages;
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.comic_id) {
            toast.error('Pilih komik terlebih dahulu');
            return;
        }

        if (!formData.number) {
            toast.error('Nomor chapter harus diisi');
            return;
        }

        if (pages.length === 0) {
            toast.error('Upload minimal 1 halaman');
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            const submitData = new FormData();
            submitData.append('comic_id', formData.comic_id);
            submitData.append('number', formData.number);
            if (formData.title) {
                submitData.append('title', formData.title);
            }
            submitData.append('is_published', formData.is_published ? '1' : '0');

            // Add pages in order
            pages.forEach((page, index) => {
                submitData.append('pages[]', page.file);
            });

            await adminService.createChapter(submitData);

            // Clean up previews
            clearAllPages();

            toast.success(`Chapter ${formData.number} berhasil ditambahkan`);
            router.push('/admin/chapters');
        } catch (err) {
            toast.error(err.message || 'Gagal menambahkan chapter');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    // Selected comic info
    const selectedComic = comics.find(c => c.id === parseInt(formData.comic_id));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/chapters"
                    className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tambah Chapter Baru</h1>
                    <p className="text-[var(--text-secondary)]">Upload halaman komik untuk chapter baru</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Comic & Chapter Info */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                                Informasi Chapter
                            </h2>

                            <div className="space-y-4">
                                {/* Select Comic */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Pilih Komik <span className="text-red-500">*</span>
                                    </label>
                                    {loadingComics ? (
                                        <div className="flex items-center gap-2 py-2">
                                            <Loader2 className="animate-spin" size={16} />
                                            <span className="text-sm text-[var(--text-tertiary)]">Memuat daftar komik...</span>
                                        </div>
                                    ) : (
                                        <select
                                            name="comic_id"
                                            value={formData.comic_id}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                                            required
                                        >
                                            <option value="">-- Pilih Komik --</option>
                                            {comics.map(comic => (
                                                <option key={comic.id} value={comic.id}>
                                                    {comic.title} ({comic.total_chapters || 0} ch)
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Chapter Number & Title */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                            Nomor Chapter <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            placeholder="1"
                                            step="0.5"
                                            min="0"
                                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                            Judul Chapter (opsional)
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Judul chapter"
                                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                        />
                                    </div>
                                </div>

                                {/* Publish checkbox */}
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="is_published"
                                        checked={formData.is_published}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-[var(--border-primary)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                                    />
                                    <span className="text-[var(--text-primary)]">Publikasikan chapter setelah upload</span>
                                </label>
                            </div>
                        </div>

                        {/* Pages Upload */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                                    Halaman ({pages.length})
                                </h2>
                                {pages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearAllPages}
                                        className="text-sm text-red-500 hover:text-red-600"
                                    >
                                        Hapus Semua
                                    </button>
                                )}
                            </div>

                            {/* Upload Area */}
                            <div className="mb-4">
                                <label className="flex flex-col items-center justify-center py-8 rounded-lg border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-tertiary)] cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                                    <Upload size={32} className="text-[var(--text-tertiary)] mb-2" />
                                    <span className="text-sm text-[var(--text-secondary)] font-medium">
                                        Klik atau drag gambar halaman di sini
                                    </span>
                                    <span className="text-xs text-[var(--text-tertiary)] mt-1">
                                        Pilih beberapa gambar sekaligus (max 10MB per gambar)
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFilesSelect}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Pages Grid */}
                            {pages.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                    {pages.map((page, index) => (
                                        <div
                                            key={page.id}
                                            className="relative group aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border-primary)]"
                                        >
                                            <Image
                                                src={page.preview}
                                                alt={`Page ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />

                                            {/* Page number */}
                                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                                                {index + 1}
                                            </div>

                                            {/* Actions overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removePage(page.id)}
                                                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {pages.length === 0 && (
                                <p className="text-center text-[var(--text-tertiary)] py-8">
                                    Belum ada halaman. Upload gambar untuk memulai.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Selected Comic Preview */}
                        {selectedComic && (
                            <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                                    Komik Terpilih
                                </h2>
                                <div className="flex gap-3">
                                    <div className="w-16 h-24 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden flex-shrink-0">
                                        {selectedComic.cover_image && (
                                            <Image
                                                src={selectedComic.cover_image_url}
                                                alt={selectedComic.title}
                                                width={64}
                                                height={96}
                                                className="object-cover w-full h-full"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-[var(--text-primary)] truncate">
                                            {selectedComic.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            {selectedComic.total_chapters || 0} chapter
                                        </p>
                                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${selectedComic.type === 'manga' ? 'bg-red-500/10 text-red-500' :
                                            selectedComic.type === 'manhwa' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-green-500/10 text-green-500'
                                            }`}>
                                            {selectedComic.type?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MTL Info */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                                <Languages size={20} className="text-[var(--primary-500)]" />
                                Machine Translation
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                Setelah chapter diupload, kamu bisa memulai proses MTL dari halaman edit chapter.
                            </p>
                            <div className="p-3 bg-[var(--primary-500)]/10 rounded-lg">
                                <p className="text-sm text-[var(--primary-500)]">
                                    💡 MTL akan mengekstrak teks dari gambar dan menerjemahkan ke Bahasa Indonesia.
                                </p>
                            </div>
                        </div>

                        {/* Upload Progress */}
                        {uploading && (
                            <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                    Mengupload...
                                </h2>
                                <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--primary-500)] transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">
                                    {uploadProgress}% selesai
                                </p>
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                fullWidth
                                disabled={!formData.comic_id || !formData.number || pages.length === 0}
                                className="py-3"
                            >
                                {loading ? 'Mengupload...' : `Upload ${pages.length} Halaman`}
                            </Button>
                            <Link href="/admin/chapters">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    fullWidth
                                    disabled={loading}
                                >
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
