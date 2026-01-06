'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    BookOpen,
    FileStack,
    Users,
    Tags,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Spinner from '@/components/ui/Spinner';
import clsx from 'clsx';
import { useState } from 'react';

// Sidebar Navigation Items
const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/comics', label: 'Komik', icon: BookOpen },
    { href: '/admin/chapters', label: 'Chapter', icon: FileStack },
    { href: '/admin/users', label: 'Pengguna', icon: Users },
    { href: '/admin/genres', label: 'Genre', icon: Tags },
    { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

// Sidebar Component
function Sidebar({ isOpen, onClose, onToggle }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                'fixed top-0 left-0 h-full w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] z-50 transition-transform duration-300',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-primary)]">
                    <Link href="/admin" className="flex items-center gap-2">
                        <Image
                            src="/images/icons/Logo.png"
                            alt="KomikoID"
                            width={32}
                            height={32}
                            className="rounded-lg"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                        <span className="font-bold text-[var(--text-primary)]">Admin</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-hover)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 160px)' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={clsx(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-[var(--primary-500)] text-white'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-primary)]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-500)]/10 flex items-center justify-center text-[var(--primary-500)] font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {user?.name || 'Admin'}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                        >
                            <ChevronLeft size={16} />
                            Website
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Desktop Toggle Button */}
            <button
                onClick={onToggle}
                className={clsx(
                    'hidden lg:flex fixed top-20 z-50 items-center justify-center w-8 h-12 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-r-lg shadow-lg hover:bg-[var(--surface-hover)] transition-all duration-300',
                    isOpen ? 'left-64' : 'left-0'
                )}
                title={isOpen ? 'Tutup sidebar' : 'Buka sidebar'}
            >
                {isOpen ? (
                    <ChevronLeft size={16} className="text-[var(--text-secondary)]" />
                ) : (
                    <ChevronRight size={16} className="text-[var(--text-secondary)]" />
                )}
            </button>
        </>
    );
}

// Admin Layout
export default function AdminLayout({ children }) {
    const router = useRouter();
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const toast = useToast();
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default true for desktop

    // Check authentication and admin role
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isAdmin) {
                toast.error('Anda tidak memiliki akses ke halaman ini');
                router.push('/');
            }
        }
    }, [loading, isAuthenticated, isAdmin, router, toast]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Main Content */}
            <div className={clsx(
                'transition-all duration-300',
                sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
            )}>
                {/* Top Bar */}
                <header className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] flex items-center px-4 lg:px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-hover)] mr-4"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                        Admin Panel
                    </h1>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
