'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronRight, BookOpen, MessageCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

/**
 * Help Button & Panel - Heuristic #10: Help & Documentation
 * Provides quick access to help and FAQ
 */

const helpTopics = [
    {
        id: 'reading',
        icon: BookOpen,
        title: 'Cara Membaca Komik',
        answer: 'Pilih komik yang ingin dibaca, lalu pilih chapter. Gunakan tombol panah atau swipe untuk berpindah halaman. Tekan F untuk fullscreen.',
    },
    {
        id: 'bookmark',
        icon: BookOpen,
        title: 'Menyimpan Bookmark',
        answer: 'Klik ikon bookmark pada halaman komik untuk menyimpannya. Bookmark dapat diakses melalui menu Bookmark di navigasi.',
    },
    {
        id: 'translation',
        icon: BookOpen,
        title: 'Terjemahan MTL',
        answer: 'MTL (Machine Translation) adalah terjemahan otomatis menggunakan AI. Kualitas mungkin bervariasi tergantung kompleksitas teks.',
    },
    {
        id: 'shortcuts',
        icon: BookOpen,
        title: 'Pintasan Keyboard',
        answer: 'Tekan Ctrl+K untuk pencarian cepat, F untuk fullscreen saat membaca, dan ? untuk melihat semua pintasan keyboard.',
    },
    {
        id: 'offline',
        icon: BookOpen,
        title: 'Mode Offline',
        answer: 'Beberapa chapter yang pernah dibaca tersimpan di cache browser dan bisa diakses saat offline. Fitur ini terbatas.',
    },
];

const faqItems = [
    {
        id: 'faq-account',
        question: 'Apakah harus login untuk membaca?',
        answer: 'Tidak. Anda bisa membaca tanpa login. Login diperlukan untuk bookmark dan fitur personal lainnya.',
    },
    {
        id: 'faq-quality',
        question: 'Bagaimana cara mengganti kualitas gambar?',
        answer: 'Klik ikon pengaturan saat membaca chapter untuk mengatur kualitas gambar sesuai koneksi Anda.',
    },
    {
        id: 'faq-report',
        question: 'Bagaimana cara melaporkan masalah?',
        answer: 'Gunakan tombol "Hubungi Kami" di bawah atau klik ikon flag pada halaman yang bermasalah.',
    },
];

const onboardingSteps = [
    { step: 1, title: 'Cari Komik', desc: 'Gunakan pencarian atau jelajahi katalog' },
    { step: 2, title: 'Pilih Chapter', desc: 'Klik komik lalu pilih chapter yang ingin dibaca' },
    { step: 3, title: 'Baca & Nikmati', desc: 'Swipe atau gunakan tombol untuk navigasi' },
    { step: 4, title: 'Bookmark', desc: 'Simpan komik favorit untuk akses cepat' },
];

export function HelpButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    return (
        <>
            {/* Floating Help Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                aria-label="Bantuan"
            >
                <HelpCircle size={24} />
            </button>

            {/* Help Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => {
                            setIsOpen(false);
                            setSelectedTopic(null);
                        }}
                    />

                    {/* Panel */}
                    <div className="relative bg-[var(--bg-elevated)] rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                                {selectedTopic ? selectedTopic.title : 'Pusat Bantuan'}
                            </h3>
                            <button
                                onClick={() => {
                                    if (selectedTopic) {
                                        setSelectedTopic(null);
                                    } else {
                                        setIsOpen(false);
                                    }
                                }}
                                className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            {selectedTopic ? (
                                <div>
                                    <p className="text-[var(--text-secondary)]">
                                        {selectedTopic.answer}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {/* Quick Help Topics */}
                                    <p className="text-sm font-medium text-[var(--text-tertiary)] mb-3">
                                        Pertanyaan Umum
                                    </p>
                                    {helpTopics.map((topic) => {
                                        const Icon = topic.icon;
                                        return (
                                            <button
                                                key={topic.id}
                                                onClick={() => setSelectedTopic(topic)}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface-hover)] text-left transition-colors"
                                            >
                                                <Icon size={20} className="text-[var(--primary-500)]" />
                                                <span className="flex-1 text-[var(--text-primary)]">
                                                    {topic.title}
                                                </span>
                                                <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
                                            </button>
                                        );
                                    })}

                                    {/* Contact Support */}
                                    <div className="border-t border-[var(--border-primary)] pt-4 mt-4">
                                        <p className="text-sm font-medium text-[var(--text-tertiary)] mb-3">
                                            Butuh bantuan lebih?
                                        </p>
                                        <Link
                                            href="/contact"
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                                        >
                                            <MessageCircle size={20} className="text-[var(--primary-500)]" />
                                            <span className="flex-1 text-[var(--text-primary)]">
                                                Hubungi Kami
                                            </span>
                                            <ExternalLink size={16} className="text-[var(--text-tertiary)]" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HelpButton;
