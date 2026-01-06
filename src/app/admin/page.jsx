'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    FileStack,
    Users,
    Eye,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    Clock
} from 'lucide-react';
import adminService from '@/lib/api/services/adminService';
import Skeleton from '@/components/ui/Skeleton';
import clsx from 'clsx';

// Stat Card Component
function StatCard({ icon: Icon, label, value, change, changeType = 'positive', href, color = 'primary' }) {
    const colors = {
        primary: 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]',
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-green-500/10 text-green-500',
        yellow: 'bg-yellow-500/10 text-yellow-500',
        red: 'bg-red-500/10 text-red-500',
    };

    return (
        <Link
            href={href || '#'}
            className="block bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border-primary)] hover:border-[var(--primary-500)] transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', colors[color])}>
                    <Icon size={24} />
                </div>
                {change !== undefined && (
                    <div className={clsx(
                        'flex items-center gap-1 text-sm font-medium',
                        changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                    )}>
                        {changeType === 'positive' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {change}%
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p className="text-sm text-[var(--text-tertiary)]">{label}</p>
        </Link>
    );
}

// Recent Activity Item
function ActivityItem({ type, title, description, time }) {
    const icons = {
        comic: BookOpen,
        chapter: FileStack,
        user: Users,
    };
    const Icon = icons[type] || BookOpen;

    return (
        <div className="flex items-start gap-3 py-3 border-b border-[var(--border-primary)] last:border-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)]">
                <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{title}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{description}</p>
            </div>
            <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">{time}</span>
        </div>
    );
}

// Quick Action Button
function QuickAction({ icon: Icon, label, href, color = 'primary' }) {
    const colors = {
        primary: 'bg-[var(--primary-500)] hover:bg-[var(--primary-600)]',
        blue: 'bg-blue-500 hover:bg-blue-600',
        green: 'bg-green-500 hover:bg-green-600',
    };

    return (
        <Link
            href={href}
            className={clsx(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors',
                colors[color]
            )}
        >
            <Icon size={18} />
            {label}
        </Link>
    );
}

// Main Dashboard Page
export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const data = await adminService.getDashboard();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch dashboard:', err);
                setError(err.message);
                // Set fallback stats
                setStats({
                    total_comics: 0,
                    total_chapters: 0,
                    total_users: 0,
                    total_views: 0,
                    recent_activities: [],
                });
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-5">
                            <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                            <Skeleton className="h-8 w-20 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-80 rounded-xl lg:col-span-2" />
                    <Skeleton className="h-80 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
                    <p className="text-[var(--text-secondary)]">Selamat datang di Admin Panel KomikoID</p>
                </div>
                <div className="flex gap-2">
                    <QuickAction icon={BookOpen} label="Tambah Komik" href="/admin/comics/create" />
                    <QuickAction icon={FileStack} label="Tambah Chapter" href="/admin/chapters/create" color="blue" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={BookOpen}
                    label="Total Komik"
                    value={stats?.total_comics || 0}
                    change={stats?.comics_change}
                    changeType={stats?.comics_change >= 0 ? 'positive' : 'negative'}
                    href="/admin/comics"
                    color="primary"
                />
                <StatCard
                    icon={FileStack}
                    label="Total Chapter"
                    value={stats?.total_chapters || 0}
                    change={stats?.chapters_change}
                    changeType={stats?.chapters_change >= 0 ? 'positive' : 'negative'}
                    href="/admin/chapters"
                    color="blue"
                />
                <StatCard
                    icon={Users}
                    label="Total Pengguna"
                    value={stats?.total_users || 0}
                    change={stats?.users_change}
                    changeType={stats?.users_change >= 0 ? 'positive' : 'negative'}
                    href="/admin/users"
                    color="green"
                />
                <StatCard
                    icon={Eye}
                    label="Total Views"
                    value={stats?.total_views || 0}
                    change={stats?.views_change}
                    changeType={stats?.views_change >= 0 ? 'positive' : 'negative'}
                    color="yellow"
                />
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Placeholder */}
                <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold text-[var(--text-primary)]">Statistik Pengunjung</h2>
                        <select className="px-3 py-1.5 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)]">
                            <option>7 Hari Terakhir</option>
                            <option>30 Hari Terakhir</option>
                            <option>3 Bulan Terakhir</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center text-[var(--text-tertiary)]">
                        <div className="text-center">
                            <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Grafik akan ditampilkan di sini</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-[var(--text-primary)]">Aktivitas Terbaru</h2>
                        <Clock size={18} className="text-[var(--text-tertiary)]" />
                    </div>

                    {stats?.recent_activities?.length > 0 ? (
                        <div className="space-y-0">
                            {stats.recent_activities.slice(0, 5).map((activity, i) => (
                                <ActivityItem
                                    key={i}
                                    type={activity.type}
                                    title={activity.title}
                                    description={activity.description}
                                    time={activity.time}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-[var(--text-tertiary)]">
                            <Clock size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Belum ada aktivitas</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Comics */}
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-[var(--text-primary)]">Komik Terbaru</h2>
                        <Link href="/admin/comics" className="text-sm text-[var(--primary-500)] hover:underline">
                            Lihat Semua
                        </Link>
                    </div>
                    {stats?.recent_comics?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recent_comics.slice(0, 5).map((comic) => (
                                <div key={comic.uuid} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                                    <div className="w-10 h-14 rounded bg-[var(--bg-tertiary)]" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{comic.title}</p>
                                        <p className="text-xs text-[var(--text-tertiary)]">{comic.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4 text-[var(--text-tertiary)] text-sm">Belum ada komik</p>
                    )}
                </div>

                {/* Recent Users */}
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-[var(--text-primary)]">Pengguna Terbaru</h2>
                        <Link href="/admin/users" className="text-sm text-[var(--primary-500)] hover:underline">
                            Lihat Semua
                        </Link>
                    </div>
                    {stats?.recent_users?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recent_users.slice(0, 5).map((user) => (
                                <div key={user.uuid} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-hover)]">
                                    <div className="w-10 h-10 rounded-full bg-[var(--primary-500)]/10 flex items-center justify-center text-[var(--primary-500)] font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user.name}</p>
                                        <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4 text-[var(--text-tertiary)] text-sm">Belum ada pengguna</p>
                    )}
                </div>
            </div>
        </div>
    );
}
