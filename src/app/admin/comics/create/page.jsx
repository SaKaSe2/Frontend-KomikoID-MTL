'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    Upload,
    X,
    Loader2,
    BookOpen,
    ImageIcon
} from 'lucide-react';
import adminService from '@/lib/api/services/adminService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';

export default function CreateComicPage() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        alternative_title: '',
        synopsis: '',
        author: '',
        artist: '',
        status: 'ongoing',
        type: 'manga',
        original_language: 'ja',
        release_year: new Date().getFullYear(),
        is_featured: false,
        is_published: true,
        genres: [],
    });
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await adminService.getGenres();
                setGenres(response.data || []);
            } catch (err) {
                console.error('Failed to load genres:', err);
            } finally {
                setLoadingGenres(false);
            }
        };
        fetchGenres();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle genre toggle
    const handleGenreToggle = (genreId) => {
        setFormData(prev => ({
            ...prev,
            genres: prev.genres.includes(genreId)
                ? prev.genres.filter(id => id !== genreId)
                : [...prev.genres, genreId],
        }));
    };

    // Handle cover image
    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    // Handle banner image
    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerImage(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Judul komik harus diisi');
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();

            // Add text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'genres') {
                    value.forEach(genreId => submitData.append('genres[]', genreId));
                } else if (typeof value === 'boolean') {
                    submitData.append(key, value ? '1' : '0');
                } else if (value) {
                    submitData.append(key, value);
                }
            });

            // Add images
            if (coverImage) {
                submitData.append('cover_image', coverImage);
            }
            if (bannerImage) {
                submitData.append('banner_image', bannerImage);
            }

            await adminService.createComic(submitData);
            toast.success('Komik berhasil ditambahkan');
            router.push('/admin/comics');
        } catch (err) {
            toast.error(err.message || 'Gagal menambahkan komik');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/comics"
                    className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tambah Komik Baru</h1>
                    <p className="text-[var(--text-secondary)]">Isi informasi komik yang ingin ditambahkan</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <BookOpen size={20} className="text-[var(--primary-500)]" />
                                Informasi Dasar
                            </h2>

                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Judul Komik <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Masukkan judul komik"
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                        required
                                    />
                                </div>

                                {/* Alternative Title */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Judul Alternatif
                                    </label>
                                    <input
                                        type="text"
                                        name="alternative_title"
                                        value={formData.alternative_title}
                                        onChange={handleChange}
                                        placeholder="Judul dalam bahasa asli atau lainnya"
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>

                                {/* Synopsis */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Sinopsis
                                    </label>
                                    <textarea
                                        name="synopsis"
                                        value={formData.synopsis}
                                        onChange={handleChange}
                                        placeholder="Deskripsi singkat tentang komik..."
                                        rows={5}
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-none"
                                    />
                                </div>

                                {/* Author & Artist */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                            Penulis
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            placeholder="Nama penulis"
                                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                            Ilustrator
                                        </label>
                                        <input
                                            type="text"
                                            name="artist"
                                            value={formData.artist}
                                            onChange={handleChange}
                                            placeholder="Nama ilustrator"
                                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Detail Komik</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Tipe
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                                    >
                                        <option value="manga">Manga</option>
                                        <option value="manhwa">Manhwa</option>
                                        <option value="manhua">Manhua</option>
                                        <option value="comic">Comic</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                                    >
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="hiatus">Hiatus</option>
                                        <option value="dropped">Dropped</option>
                                    </select>
                                </div>

                                {/* Original Language */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Bahasa Asli
                                    </label>
                                    <select
                                        name="original_language"
                                        value={formData.original_language}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                                    >
                                        <option value="ja">Jepang</option>
                                        <option value="ko">Korea</option>
                                        <option value="zh">China</option>
                                        <option value="en">Inggris</option>
                                    </select>
                                </div>

                                {/* Release Year */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Tahun Rilis
                                    </label>
                                    <input
                                        type="number"
                                        name="release_year"
                                        value={formData.release_year}
                                        onChange={handleChange}
                                        min="1900"
                                        max="2100"
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Genres Card */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Genre</h2>

                            {loadingGenres ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="animate-spin text-[var(--primary-500)]" size={24} />
                                </div>
                            ) : genres.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {genres.map(genre => (
                                        <button
                                            key={genre.id}
                                            type="button"
                                            onClick={() => handleGenreToggle(genre.id)}
                                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${formData.genres.includes(genre.id)
                                                    ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]'
                                                    : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--primary-500)]'
                                                }`}
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[var(--text-tertiary)] text-center py-4">
                                    Belum ada genre. <Link href="/admin/genres" className="text-[var(--primary-500)]">Tambah genre</Link>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-[var(--primary-500)]" />
                                Cover Image
                            </h2>

                            <div className="relative">
                                {coverPreview ? (
                                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
                                        <Image
                                            src={coverPreview}
                                            alt="Cover preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCoverImage(null);
                                                setCoverPreview(null);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-[2/3] rounded-lg border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-tertiary)] cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                                        <Upload size={32} className="text-[var(--text-tertiary)] mb-2" />
                                        <span className="text-sm text-[var(--text-tertiary)]">Upload Cover</span>
                                        <span className="text-xs text-[var(--text-muted)] mt-1">Max 5MB</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Banner Image */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Banner Image</h2>

                            <div className="relative">
                                {bannerPreview ? (
                                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
                                        <Image
                                            src={bannerPreview}
                                            alt="Banner preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBannerImage(null);
                                                setBannerPreview(null);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-[16/9] rounded-lg border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-tertiary)] cursor-pointer hover:border-[var(--primary-500)] transition-colors">
                                        <Upload size={24} className="text-[var(--text-tertiary)] mb-2" />
                                        <span className="text-sm text-[var(--text-tertiary)]">Upload Banner</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Publish Settings */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pengaturan</h2>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="is_published"
                                        checked={formData.is_published}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-[var(--border-primary)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                                    />
                                    <span className="text-[var(--text-primary)]">Publikasikan</span>
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-[var(--border-primary)] text-[var(--primary-500)] focus:ring-[var(--primary-500)]"
                                    />
                                    <span className="text-[var(--text-primary)]">Tampilkan di Featured</span>
                                </label>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                fullWidth
                                className="py-3"
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Komik'}
                            </Button>
                            <Link href="/admin/comics">
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
