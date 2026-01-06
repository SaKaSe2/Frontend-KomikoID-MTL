'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    Search,
    Menu,
    X,
    Sun,
    Moon,
    User,
    BookMarked,
    History,
    LogOut,
    ChevronDown,
    Home,
    Clock,
    TrendingUp,
    Grid3X3,
    LayoutDashboard
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';

const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/comics', label: 'Daftar Komik' },
    { href: '/popular', label: 'Populer Komik' },
    { href: '/bookmarks', label: 'Bookmark' },
];

export default function Header() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const userMenuRef = useRef(null);
    const searchInputRef = useRef(null);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsUserMenuOpen(false);
    };

    return (
        <>
            <header
                className={clsx(
                    'fixed top-0 left-0 right-0 z-[200] transition-all duration-300',
                    'bg-[var(--bg-primary)] border-b border-[var(--border-primary)]'
                )}
            >
                {/* Golden Navbar Strip */}
                <div className="bg-gradient-to-r from-[#F9A825] to-[#FFEB3B]">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center h-14">
                            {/* Logo with golden background */}
                            <Link href="/" className="flex items-center gap-2 px-4 py-2 -ml-4 bg-[#F9A825] hover:bg-[#E69100] transition-colors">
                                <Image
                                    src="/images/icons/Logo.png"
                                    alt="KomikoID"
                                    width={36}
                                    height={36}
                                    className="rounded"
                                    style={{ width: 'auto', height: 'auto' }}
                                    priority
                                />
                                <span className="text-lg font-bold text-[#1a1a1a] hidden sm:block">
                                    komiko
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center ml-4">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={clsx(
                                                'px-4 py-2 text-sm font-semibold transition-all duration-200',
                                                isActive
                                                    ? 'text-[#1a1a1a] bg-white/20'
                                                    : 'text-[#1a1a1a]/80 hover:text-[#1a1a1a] hover:bg-white/10'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Search Bar */}
                            <form
                                onSubmit={handleSearch}
                                className="hidden md:flex items-center flex-1 max-w-sm ml-auto mr-4"
                            >
                                <div className="relative w-full">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        placeholder="Pencarian"
                                        className="w-full px-4 py-1.5 rounded text-sm bg-white/90 border-0 text-[#1a1a1a] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-0 top-0 bottom-0 px-3 bg-[#1a1a1a] rounded-r flex items-center justify-center hover:bg-[#333] transition-colors"
                                    >
                                        <Search size={16} className="text-white" />
                                    </button>
                                </div>
                            </form>

                            {/* Right Section */}
                            <div className="flex items-center gap-1">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded text-[#1a1a1a]/80 hover:text-[#1a1a1a] hover:bg-white/20 transition-all"
                                    aria-label={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
                                >
                                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                </button>

                                {/* User Menu or Auth Buttons */}
                                {isAuthenticated ? (
                                    <div className="relative" ref={userMenuRef}>
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center gap-2 p-2 rounded hover:bg-white/20 transition-all"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-sm font-medium">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={clsx(
                                                    'text-[#1a1a1a] transition-transform hidden sm:block',
                                                    isUserMenuOpen && 'rotate-180'
                                                )}
                                            />
                                        </button>

                                        {/* Dropdown */}
                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-56 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl shadow-xl animate-slide-down">
                                                <div className="px-4 py-2 border-b border-[var(--border-primary)]">
                                                    <p className="font-medium text-[var(--text-primary)] truncate">
                                                        {user?.name}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-tertiary)] truncate">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                                {/* Admin Dashboard Link */}
                                                {isAdmin && (
                                                    <div className="py-1 border-b border-[var(--border-primary)]">
                                                        <Link
                                                            href="/admin"
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--primary-500)] hover:bg-[var(--primary-500)]/10 transition-all"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            <LayoutDashboard size={18} />
                                                            Dashboard Admin
                                                        </Link>
                                                    </div>
                                                )}
                                                <div className="py-1">
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <User size={18} />
                                                        Profil Saya
                                                    </Link>
                                                    <Link
                                                        href="/bookmarks"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <BookMarked size={18} />
                                                        Bookmark
                                                    </Link>
                                                    <Link
                                                        href="/history"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <History size={18} />
                                                        Riwayat Baca
                                                    </Link>
                                                </div>
                                                <div className="border-t border-[var(--border-primary)] pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <LogOut size={18} />
                                                        Keluar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="hidden sm:flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="px-4 py-1.5 text-sm font-semibold text-[#1a1a1a] bg-[#1a1a1a] text-white rounded hover:bg-[#333] transition-colors flex items-center gap-2"
                                        >
                                            <Sun size={16} />
                                            Masuk
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile Menu Toggle */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="lg:hidden p-2 rounded text-[#1a1a1a] hover:bg-white/20 transition-all"
                                    aria-label="Menu"
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[199] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute top-16 left-0 right-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] shadow-xl animate-slide-down">
                        <div className="container mx-auto p-4">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="mb-4">
                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari komik..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                </div>
                            </form>

                            {/* Mobile Nav Links */}
                            <nav className="space-y-1">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={clsx(
                                                'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all',
                                                isActive
                                                    ? 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]'
                                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                                            )}
                                        >
                                            <Icon size={20} />
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
                                        className="flex-1 py-3 text-center font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)] rounded-xl transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex-1 py-3 text-center font-medium bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white rounded-xl transition-colors"
                                    >
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Spacer for fixed header */}
            <div className="h-16" />
        </>
    );
}
