'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Heart
} from 'lucide-react';

const footerLinks = {
    navigation: [
        { href: '/', label: 'Beranda' },
        { href: '/comics', label: 'Daftar Komik' },
        { href: '/latest', label: 'Terbaru' },
        { href: '/popular', label: 'Populer' },
    ],
    legal: [
        { href: '/about', label: 'Tentang Kami' },
        { href: '/privacy', label: 'Kebijakan Privasi' },
        { href: '/terms', label: 'Syarat & Ketentuan' },
        { href: '/dmca', label: 'DMCA' },
    ],
    social: [
        { href: '#', label: 'Facebook', icon: Facebook },
        { href: '#', label: 'Twitter', icon: Twitter },
        { href: '#', label: 'Instagram', icon: Instagram },
        { href: 'mailto:contact@komiko.id', label: 'Email', icon: Mail },
    ],
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                src="/images/icons/Logo.png"
                                alt="KomikoID"
                                width={48}
                                height={48}
                                className="rounded-lg"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                            <span className="text-xl font-bold gradient-text">
                                KomikoID
                            </span>
                        </Link>
                        <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-xs">
                            Platform baca komik dengan terjemahan bahasa Indonesia berkualitas tinggi menggunakan teknologi MTL terbaru.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {footerLinks.social.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target={social.href.startsWith('http') ? '_blank' : undefined}
                                        rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="p-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--primary-500)] hover:bg-[var(--primary-500)]/10 transition-all"
                                        aria-label={social.label}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                            Navigasi
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-500)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                            Informasi
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-500)] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / CTA */}
                    <div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                            Hubungi Kami
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami.
                        </p>
                        <a
                            href="mailto:contact@komiko.id"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Mail size={16} />
                            Kirim Email
                        </a>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-6 border-t border-[var(--border-primary)]">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-[var(--text-tertiary)] text-center sm:text-left">
                            © {currentYear} KomikoID. Semua hak dilindungi.
                        </p>
                        <p className="text-sm text-[var(--text-tertiary)] flex items-center gap-1">
                            Dibuat dengan <Heart size={14} className="text-red-500" /> di Indonesia
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
