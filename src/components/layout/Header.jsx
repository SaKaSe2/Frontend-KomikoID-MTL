'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search,
    Menu,
    X,
    Sun,
    Moon,
    User,
    LogOut,
    ChevronDown,
    LayoutDashboard
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';

const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/comics', label: 'Daftar Komik' },
    { href: '/popular', label: 'Populer' },
];

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const userMenuRef = useRef(null);

    // Close user menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsUserMenuOpen(false);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[200] bg-[var(--bg-elevated)] border-b border-[var(--border-primary)]">
                <div className="container mx-auto px-3">
                    <div className="flex items-center justify-between h-14 gap-3">

                        {/* Left: Logo + Nav */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/images/icons/Logo.png"
                                    alt="KomikoID"
                                    width={32}
                                    height={32}
                                    className="rounded"
                                    priority
                                />
                                <span className="text-base font-bold text-[var(--primary-500)] hidden sm:block">
                                    KomikoID
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={clsx(
                                                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                                                isActive
                                                    ? 'text-[var(--primary-500)] bg-[var(--primary-500)]/10'
                                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Center: Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari komik..."
                                    className="w-full h-9 px-4 pr-10 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-500)] transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-full transition-colors"
                                >
                                    <Search size={14} />
                                </button>
                            </div>
                        </form>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Mobile Search Button */}
                            <Link
                                href="/search"
                                className="sm:hidden p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                            >
                                <Search size={20} />
                            </Link>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
                                aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            {/* User Menu */}
                            {isAuthenticated ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-1 p-1 rounded-md hover:bg-[var(--surface-hover)] transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[var(--primary-500)] flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                user?.name?.charAt(0).toUpperCase() || 'U'
                                            )}
                                        </div>
                                        <ChevronDown
                                            size={14}
                                            className={clsx(
                                                'text-[var(--text-tertiary)] transition-transform hidden sm:block',
                                                isUserMenuOpen && 'rotate-180'
                                            )}
                                        />
                                    </button>

                                    {/* Dropdown */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 py-1 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg shadow-xl animate-fade-in">
                                            <div className="px-3 py-2 border-b border-[var(--border-primary)]">
                                                <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-[var(--text-tertiary)] truncate">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--surface-hover)]"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <LayoutDashboard size={16} />
                                                    Dashboard Admin
                                                </Link>
                                            )}

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <User size={16} />
                                                Profil
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                                            >
                                                <LogOut size={16} />
                                                Keluar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden sm:flex items-center px-4 py-1.5 bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-gray-900 text-sm font-semibold rounded-md transition-colors"
                                >
                                    Masuk
                                </Link>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[199] md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute top-14 left-0 right-0 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] shadow-lg">
                        <div className="p-4">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari komik..."
                                        className="w-full h-10 px-4 pr-10 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary-500)]"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            </form>

                            {/* Mobile Nav Links */}
                            <nav className="space-y-1">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={clsx(
                                                'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Mobile Auth */}
                            {!isAuthenticated && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border-primary)]">
                                    <Link
                                        href="/login"
                                        className="flex-1 py-2.5 text-center text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-primary)] rounded-lg hover:bg-[var(--surface-hover)]"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex-1 py-2.5 text-center text-sm font-semibold bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-gray-900 rounded-lg"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer */}
            <div className="h-14" />
        </>
    );
}
