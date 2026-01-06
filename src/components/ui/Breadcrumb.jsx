'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useMemo } from 'react';

/**
 * Breadcrumb Component
 * Navigation breadcrumb for recognition over recall
 * Heuristic #6: Recognition Rather Than Recall
 */

const pathLabels = {
    '': 'Beranda',
    'comics': 'Daftar Komik',
    'comic': 'Komik',
    'chapter': 'Chapter',
    'bookmark': 'Bookmark',
    'popular': 'Populer',
    'search': 'Pencarian',
    'profile': 'Profil',
    'settings': 'Pengaturan',
    'admin': 'Admin',
    'dashboard': 'Dashboard',
    'users': 'Pengguna',
    'genres': 'Genre',
    'chapters': 'Chapters',
    'translations': 'Terjemahan',
};

export default function Breadcrumb({
    items = [], // Optional custom items override [{label, href}]
    showHome = true,
    className = ''
}) {
    const pathname = usePathname();

    const breadcrumbItems = useMemo(() => {
        // If custom items provided, use them
        if (items.length > 0) {
            return items;
        }

        // Auto-generate from pathname
        const segments = pathname.split('/').filter(Boolean);
        const generatedItems = segments.map((segment, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/');

            // Check if segment is a UUID or ID (skip labeling)
            const isId = segment.match(/^[0-9a-f-]{36}$|^\d+$/i);

            // Get label from predefined labels or capitalize segment
            let label = pathLabels[segment.toLowerCase()];
            if (!label) {
                if (isId) {
                    label = 'Detail';
                } else {
                    // Convert kebab-case to Title Case
                    label = segment
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                }
            }

            return { label, href };
        });

        return generatedItems;
    }, [pathname, items]);

    // Don't show breadcrumb on home page
    if (pathname === '/' && breadcrumbItems.length === 0) {
        return null;
    }

    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center text-sm ${className}`}
        >
            <ol className="flex items-center flex-wrap gap-1">
                {/* Home Link */}
                {showHome && (
                    <li className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span className="sr-only sm:not-sr-only">Beranda</span>
                        </Link>
                    </li>
                )}

                {/* Breadcrumb Items */}
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;

                    return (
                        <li key={item.href} className="flex items-center">
                            {/* Separator */}
                            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />

                            {/* Link or Current Page */}
                            {isLast ? (
                                <span
                                    className="font-medium text-gray-900 dark:text-white"
                                    aria-current="page"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

/**
 * BreadcrumbItem - For use with Breadcrumb when passing custom items
 */
export function createBreadcrumbItem(label, href) {
    return { label, href };
}
