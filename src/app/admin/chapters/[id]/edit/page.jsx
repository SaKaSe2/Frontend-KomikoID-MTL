'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    Upload,
    X,
    Loader2,
    Languages,
    Play,
    CheckCircle,
    AlertCircle,
    Clock,
    Trash2,
    Plus,
    Eye,
    Edit3
} from 'lucide-react';
import adminService from '@/lib/api/services/adminService';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import TranslationModeSelector from '@/components/admin/TranslationModeSelector';
import AutoTranslationPanel from '@/components/admin/AutoTranslationPanel';
import ManualEditorPanel from '@/components/admin/ManualEditorPanel';
import ImageEditor from '@/components/admin/ImageEditor';
import clsx from 'clsx';

export default function EditChapterPage() {
    const router = useRouter();
    const params = useParams();
    const toast = useToast();
    const chapterId = params.id;
    const fileInputRef = useRef(null);

    // States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [chapter, setChapter] = useState(null);
    const [formData, setFormData] = useState({
        number: '',
        title: '',
        is_published: true,
    });

    // Pages state
    const [pages, setPages] = useState([]);
    const [newPages, setNewPages] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Translation state
    const [translating, setTranslating] = useState(false);
    const [translationStatus, setTranslationStatus] = useState(null);
    const [translationMode, setTranslationMode] = useState('auto'); // 'auto' or 'manual'
    const [translationProgress, setTranslationProgress] = useState(null);

    // Fetch chapter data
    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const data = await adminService.getChapter(chapterId);
                setChapter(data);
                setFormData({
                    number: data.number || '',
                    title: data.title || '',
                    is_published: data.is_published ?? true,
                });
                setPages(data.pages || []);
                setTranslationStatus(data.translation_status);
            } catch (err) {
                toast.error('Gagal memuat data chapter');
                router.push('/admin/chapters');
            } finally {
                setLoading(false);
            }
        };

        if (chapterId) {
            fetchChapter();
        }
    }, [chapterId, toast, router]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle new files selection
    const handleFilesSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newPagesData = files.map((file, index) => ({
            id: `new-${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file),
        }));

        setNewPages(prev => [...prev, ...newPagesData]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Remove new page
    const removeNewPage = (pageId) => {
        setNewPages(prev => {
            const page = prev.find(p => p.id === pageId);
            if (page?.preview) {
                URL.revokeObjectURL(page.preview);
            }
            return prev.filter(p => p.id !== pageId);
        });
    };

    // Upload new pages
    const handleUploadPages = async () => {
        if (newPages.length === 0) return;

        setUploading(true);
        try {
            const files = newPages.map(p => p.file);
            const updatedChapter = await adminService.addChapterPages(chapterId, files);

            // Update pages list
            setPages(updatedChapter.pages || []);

            // Clear new pages
            newPages.forEach(p => URL.revokeObjectURL(p.preview));
            setNewPages([]);

            toast.success(`${files.length} halaman berhasil ditambahkan`);
        } catch (err) {
            toast.error(err.message || 'Gagal mengupload halaman');
        } finally {
            setUploading(false);
        }
    };

    // Update chapter info
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminService.updateChapter(chapterId, formData);
            toast.success('Chapter berhasil diperbarui');
        } catch (err) {
            toast.error(err.message || 'Gagal memperbarui chapter');
        } finally {
            setSaving(false);
        }
    };

    // Poll translation status
    const pollTranslationStatus = async () => {
        const pollInterval = setInterval(async () => {
            try {
                const data = await adminService.getChapter(chapterId);
                setTranslationStatus(data.translation_status);

                if (data.translation_status === 'completed') {
                    clearInterval(pollInterval);
                    toast.success('Terjemahan selesai!');
                    setPages(data.pages || []);
                } else if (data.translation_status === 'failed') {
                    clearInterval(pollInterval);
                    toast.error('Terjemahan gagal. Periksa log server untuk detailnya.');
                }
            } catch (e) {
                clearInterval(pollInterval);
            }
        }, 5000); // Poll every 5 seconds

        // Stop polling after 10 minutes max
        setTimeout(() => clearInterval(pollInterval), 600000);
    };

    // Trigger MTL translation
    const handleTriggerTranslation = async (force = false) => {
        setTranslating(true);
        try {
            const result = await adminService.triggerTranslation(chapterId, 'id', force);
            toast.success(result.message || 'Proses terjemahan dimulai');
            setTranslationStatus('processing');

            // Start polling for status updates
            pollTranslationStatus();
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error(err.response.data?.message || 'Chapter sedang diproses atau sudah diterjemahkan');
            } else if (err.response?.status === 500) {
                toast.error('Server error: Pastikan Tesseract OCR sudah terinstall dan TESSERACT_PATH benar di .env');
            } else {
                toast.error(err.message || 'Gagal memulai terjemahan');
            }
        } finally {
            setTranslating(false);
        }
    };

    // Translate selected pages
    const handleTranslatePages = async (pageIds) => {
        if (!pageIds || pageIds.length === 0) return;

        toast.info(`Translating ${pageIds.length} selected page(s)...`);
        // For now, trigger translation for the entire chapter
        // TODO: Add backend endpoint for selective page translation
        await handleTriggerTranslation(false);
    };

    // Manual Mode: Apply mask and erase
    const handleApplyMask = async (pageId, maskDataUrl) => {
        try {
            const response = await fetch(`/api/v1/admin/pages/${pageId}/apply-mask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ mask_data: maskDataUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to apply mask');
            }

            const data = await response.json();

            // Update pages with erased image URL
            setPages(prevPages =>
                prevPages.map(p =>
                    (p.id || p.uuid) === pageId
                        ? { ...p, erased_image_url: data.erased_image_url }
                        : p
                )
            );

            toast.success('Text erased successfully!');
            return true;
        } catch (err) {
            toast.error(err.message || 'Failed to apply mask');
            return false;
        }
    };

    // Manual Mode: Translate after erase
    const handleTranslateAfterErase = async (pageId) => {
        try {
            const response = await fetch(`/api/v1/admin/pages/${pageId}/translate-after-erase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to translate');
            }

            const data = await response.json();

            // Update pages with translated image URL
            setPages(prevPages =>
                prevPages.map(p =>
                    (p.id || p.uuid) === pageId
                        ? { ...p, translated_image_url: data.translated_image_url }
                        : p
                )
            );

            toast.success('Translation completed!');
            return true;
        } catch (err) {
            toast.error(err.message || 'Failed to translate');
            return false;
        }
    };

    // Get translation status display
    const getTranslationStatusDisplay = () => {
        switch (translationStatus) {
            case 'completed':
                return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Terjemahan Selesai' };
            case 'processing':
                return { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Sedang Proses', spinning: true };
            case 'pending':
                return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Menunggu' };
            case 'failed':
                return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Gagal' };
            default:
                return { icon: Languages, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Belum Diterjemahkan' };
        }
    };

    const statusDisplay = getTranslationStatusDisplay();
    const StatusIcon = statusDisplay.icon;

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-96" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        Edit Chapter {chapter?.number}
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        {chapter?.comic?.title}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chapter Info Form */}
                    <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                            Informasi Chapter
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Nomor Chapter
                                    </label>
                                    <input
                                        type="number"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        step="0.5"
                                        min="0"
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                        Judul Chapter
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Judul chapter (opsional)"
                                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>
                            </div>

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

                            <Button
                                type="submit"
                                variant="primary"
                                loading={saving}
                            >
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>

                    {/* Existing Pages */}
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                                Halaman ({pages.length})
                            </h2>
                            <Link
                                href={`/comics/${chapter?.comic?.slug}/chapter/${chapter?.number}`}
                                target="_blank"
                                className="flex items-center gap-1 text-sm text-[var(--primary-500)] hover:underline"
                            >
                                <Eye size={14} /> Lihat Chapter
                            </Link>
                        </div>

                        {pages.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                {pages.map((page, index) => (
                                    <div
                                        key={page.id || page.uuid || index}
                                        className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center"
                                    >
                                        <Image
                                            src={page.original_image_url || page.original_image}
                                            alt={`Page ${page.page_number}`}
                                            width={120}
                                            height={180}
                                            className="object-contain w-full h-full"
                                            unoptimized
                                        />
                                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                                            {page.page_number}
                                        </div>
                                        {page.translated_image_url && (
                                            <div className="absolute bottom-1 right-1 p-1 bg-green-500/80 text-white rounded">
                                                <Languages size={10} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-[var(--text-tertiary)] py-8">
                                Tidak ada halaman
                            </p>
                        )}
                    </div>

                    {/* Add More Pages */}
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                            Tambah Halaman Baru
                        </h2>

                        <label className="flex flex-col items-center justify-center py-6 rounded-lg border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-tertiary)] cursor-pointer hover:border-[var(--primary-500)] transition-colors mb-4">
                            <Upload size={24} className="text-[var(--text-tertiary)] mb-2" />
                            <span className="text-sm text-[var(--text-secondary)]">
                                Pilih gambar untuk ditambahkan
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

                        {newPages.length > 0 && (
                            <>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4">
                                    {newPages.map((page, index) => (
                                        <div
                                            key={page.id}
                                            className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border-primary)] group"
                                        >
                                            <Image
                                                src={page.preview}
                                                alt={`New page ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewPage(page.id)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[var(--primary-500)] text-white text-xs rounded">
                                                +{index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleUploadPages}
                                    loading={uploading}
                                    leftIcon={<Plus size={18} />}
                                >
                                    Upload {newPages.length} Halaman
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Comic Info */}
                    {chapter?.comic && (
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                                Komik
                            </h2>
                            <div className="flex gap-3">
                                <div className="w-16 h-24 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden flex-shrink-0">
                                    {(chapter.comic.cover_image_url || chapter.comic.cover_image) && (
                                        <Image
                                            src={chapter.comic.cover_image_url || chapter.comic.cover_image}
                                            alt={chapter.comic.title}
                                            width={64}
                                            height={96}
                                            className="object-cover w-full h-full"
                                            unoptimized
                                        />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-medium text-[var(--text-primary)] truncate">
                                        {chapter.comic.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {chapter.comic.total_chapters || 0} chapter
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Translation Mode Selector */}
                    <TranslationModeSelector
                        mode={translationMode}
                        onModeChange={setTranslationMode}
                        disabled={translating}
                    />

                    {/* Auto Mode */}
                    {translationMode === 'auto' && (
                        <AutoTranslationPanel
                            pages={pages}
                            onTranslate={(pageIds) => handleTranslatePages(pageIds)}
                            onTranslateAll={(force = false) => handleTriggerTranslation(force)}
                            isTranslating={translating || translationStatus === 'processing'}
                            translationProgress={translationProgress}
                        />
                    )}

                    {/* Manual Mode */}
                    {translationMode === 'manual' && (
                        <ManualEditorPanel
                            pages={pages}
                            onApplyMask={handleApplyMask}
                            onTranslate={handleTranslateAfterErase}
                            isProcessing={translating || uploading}
                        />
                    )}

                    {/* Info */}
                    <div className="bg-[var(--primary-500)]/10 rounded-xl p-4 border border-[var(--primary-500)]/20">
                        <p className="text-sm text-[var(--primary-500)]">
                            💡 Proses MTL membutuhkan waktu beberapa menit tergantung jumlah halaman dan kompleksitas teks.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
