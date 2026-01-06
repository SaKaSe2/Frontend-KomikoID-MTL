'use client';

import { useState } from 'react';
import { Edit3, Loader2, Eraser, Languages, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import ImageEditor from './ImageEditor';
import clsx from 'clsx';

/**
 * ManualEditorPanel - UI for manual text masking and translation
 * 
 * @param {Array} pages - Chapter pages
 * @param {Function} onApplyMask - Callback to apply mask and erase
 * @param {Function} onTranslate - Callback to translate erased page
 * @param {boolean} isProcessing - Whether processing is in progress
 */
export default function ManualEditorPanel({
    pages = [],
    onApplyMask,
    onTranslate,
    isProcessing = false
}) {
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [maskData, setMaskData] = useState(null);
    const [currentStep, setCurrentStep] = useState('select'); // 'select', 'masking', 'erased', 'translated'

    const selectedPage = pages.find(p => (p.id || p.uuid) === selectedPageId);

    // Handle mask application
    const handleApplyMask = async (maskDataUrl) => {
        if (!selectedPageId || !maskDataUrl) return;

        setMaskData(maskDataUrl);
        setCurrentStep('processing');

        const success = await onApplyMask(selectedPageId, maskDataUrl);

        if (success) {
            setCurrentStep('erased');
        } else {
            setCurrentStep('masking');
        }
    };

    // Handle translation after erase
    const handleTranslate = async () => {
        if (!selectedPageId) return;

        setCurrentStep('translating');
        const success = await onTranslate(selectedPageId);

        if (success) {
            setCurrentStep('translated');
        } else {
            setCurrentStep('erased');
        }
    };

    // Reset to select new page
    const handleSelectNewPage = () => {
        setSelectedPageId(null);
        setMaskData(null);
        setCurrentStep('select');
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Edit3 size={20} className="text-orange-500" />
                            <h3 className="font-semibold text-[var(--text-primary)]">
                                Manual Mode - Precise Text Masking
                            </h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Gambar manual area text yang ingin dihapus, lalu terjemahkan dengan precision tinggi.
                        </p>
                    </div>

                    {selectedPageId && (
                        <button
                            onClick={handleSelectNewPage}
                            className="px-3 py-1.5 text-sm bg-[var(--bg-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] rounded-lg transition-colors"
                        >
                            Select New Page
                        </button>
                    )}
                </div>
            </div>

            {/* Page Selection */}
            {!selectedPageId && (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                        Select Page to Edit
                    </h4>

                    {pages.length === 0 ? (
                        <div className="p-8 text-center">
                            <ImageIcon size={48} className="mx-auto mb-3 text-[var(--text-tertiary)] opacity-50" />
                            <p className="text-[var(--text-tertiary)]">No pages uploaded yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {pages.map((page) => (
                                <button
                                    key={page.id || page.uuid}
                                    onClick={() => {
                                        setSelectedPageId(page.id || page.uuid);
                                        setCurrentStep('masking');
                                    }}
                                    className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)] hover:border-orange-500 transition-colors group"
                                >
                                    {page.original_image_url && (
                                        <img
                                            src={page.original_image_url}
                                            alt={`Page ${page.page_number}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-medium">Edit</span>
                                    </div>
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                                        #{page.page_number}
                                    </div>
                                    {page.erased_image && (
                                        <div className="absolute bottom-1 right-1 p-1 bg-orange-500/80 text-white rounded" title="Has erased version">
                                            <Eraser size={10} />
                                        </div>
                                    )}
                                    {page.translated_image_url && (
                                        <div className="absolute bottom-1 left-1 p-1 bg-green-500/80 text-white rounded" title="Translated">
                                            <Check size={10} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Image Editor */}
            {selectedPageId && selectedPage && currentStep === 'masking' && (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                            Drawing Mask - Page #{selectedPage.page_number}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Gunakan brush untuk menandai area text yang ingin dihapus
                        </p>
                    </div>

                    <ImageEditor
                        imageSrc={selectedPage.original_image_url}
                        onApplyEraser={handleApplyMask}
                        isProcessing={isProcessing}
                    />
                </div>
            )}

            {/* Processing State */}
            {currentStep === 'processing' && (
                <div className="bg-[var(--bg-secondary)] border border-orange-500/30 rounded-xl p-8 text-center">
                    <Loader2 size={48} className="mx-auto mb-3 text-orange-500 animate-spin" />
                    <p className="text-[var(--text-primary)] font-medium mb-1">
                        Applying LaMa Inpainting...
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Menghapus text dari area yang ditandai
                    </p>
                </div>
            )}

            {/* Erased State */}
            {currentStep === 'erased' && selectedPage?.erased_image_url && (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                            ✅ Text Erased Successfully - Page #{selectedPage.page_number}
                        </h4>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Preview hasil erasing, lalu klik Translate untuk menerjemahkan
                        </p>
                    </div>

                    {/* Before/After Preview */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] mb-1">Original</p>
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
                                <img
                                    src={selectedPage.original_image_url}
                                    alt="Original"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] mb-1">Erased</p>
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
                                <img
                                    src={selectedPage.erased_image_url}
                                    alt="Erased"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleTranslate}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Languages size={18} />
                        Terjemahkan Sekarang
                    </button>
                </div>
            )}

            {/* Translating State */}
            {currentStep === 'translating' && (
                <div className="bg-[var(--bg-secondary)] border border-orange-500/30 rounded-xl p-8 text-center">
                    <Loader2 size={48} className="mx-auto mb-3 text-orange-500 animate-spin" />
                    <p className="text-[var(--text-primary)] font-medium mb-1">
                        Translating with Cotrans API...
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Menerjemahkan text menggunakan AI
                    </p>
                </div>
            )}

            {/* Translated State */}
            {currentStep === 'translated' && selectedPage?.translated_image_url && (
                <div className="bg-[var(--bg-secondary)] border border-green-500/30 rounded-xl p-4">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Check size={18} className="text-green-500" />
                            <h4 className="text-sm font-medium text-[var(--text-primary)]">
                                ✅ Translation Complete - Page #{selectedPage.page_number}
                            </h4>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                            Terjemahan selesai! Preview hasil akhir di bawah
                        </p>
                    </div>

                    {/* Final Result */}
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[var(--bg-tertiary)] mb-4">
                        <img
                            src={selectedPage.translated_image_url}
                            alt="Translated"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSelectNewPage}
                            className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--surface-hover)] border border-[var(--border-primary)] rounded-lg transition-colors"
                        >
                            Edit Another Page
                        </button>
                        <a
                            href={`/comics/${selectedPage.chapter?.comic?.slug}/chapter/${selectedPage.chapter?.number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-center rounded-lg transition-colors"
                        >
                            View in Reader
                        </a>
                    </div>
                </div>
            )}

            {/* Tips */}
            {currentStep === 'select' && pages.length > 0 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-400">
                            <p className="font-medium mb-1">Manual Mode Tips:</p>
                            <ul className="text-xs opacity-90 space-y-1 list-disc list-inside">
                                <li>Pilih page yang ada text ter-lewat dari Auto Mode</li>
                                <li>Gunakan brush untuk mark area text yang ingin dihapus</li>
                                <li>LaMa akan hapus text sambil preserve background</li>
                                <li>Cotrans akan translate hasil erased image</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
