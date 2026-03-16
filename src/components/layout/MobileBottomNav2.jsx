'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, BookMarked, History, User } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { href: '/', icon: Home, label: 'Beranda' },
    { href: '/comics', icon: Grid3X3, label: 'Komik' },
    { href: '/bookmarks', icon: BookMarked, label: 'Bookmark' },
    { href: '/history', icon: History, label: 'Riwayat' },
    { href: '/profile', icon: User, label: 'Profil' },
];

export default function MobileBottomNav() {
    const pathname = usePathname();

    // Don't show on admin pages or reader pages
    if (pathname?.startsWith('/admin') || pathname?.includes('/chapter/')) {
        return null;
    }

    return (
        <nav className="mobile-nav">
            {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href ||
                    (href !== '/' && pathname?.startsWith(href));

                return (
                    <Link
                        key={href}
                        href={href}
                        className={clsx('mobile-nav-item', isActive && 'active')}
                    >
                        <Icon />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
