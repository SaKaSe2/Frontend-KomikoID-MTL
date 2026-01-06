'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    User,
    Mail,
    Camera,
    Save,
    BookMarked,
    History,
    MessageSquare,
    Star,
    Settings,
    Lock,
    Trash2,
    LogOut,
    ChevronRight,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import userService from '@/lib/api/services/userService';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import clsx from 'clsx';

// Stats Card Component
function StatCard({ icon: Icon, label, value, color = 'primary' }) {
    const colors = {
        primary: 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]',
        blue: 'bg-blue-500/10 text-blue-500',
        green: 'bg-green-500/10 text-green-500',
        yellow: 'bg-yellow-500/10 text-yellow-500',
    };

    return (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-primary)]">
            <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center mb-3', colors[color])}>
                <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-sm text-[var(--text-tertiary)]">{label}</p>
        </div>
    );
}

// Profile Edit Form
function ProfileEditForm({ user, onUpdate }) {
    const toast = useToast();
    const fileInputRef = useRef(null);

    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
    const [loading, setLoading] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 2MB');
                return;
            }
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', name);
            if (avatar) {
                formData.append('avatar', avatar);
            }

            const updatedUser = await userService.updateProfile(formData);
            onUpdate(updatedUser);
            toast.success('Profil berhasil diperbarui');
        } catch (error) {
            toast.error(error.message || 'Gagal memperbarui profil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--bg-tertiary)]">
                        {avatarPreview ? (
                            <Image
                                src={avatarPreview}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[var(--primary-500)]">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] transition-colors"
                    >
                        <Camera size={14} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
                <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Klik ikon kamera untuk mengganti foto
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                        JPG, PNG. Maksimal 2MB.
                    </p>
                </div>
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Nama Lengkap
                </label>
                <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] transition-all"
                    />
                </div>
            </div>

            {/* Email (Read-only) */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Email
                </label>
                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-tertiary)] opacity-60 cursor-not-allowed"
                    />
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Email tidak dapat diubah
                </p>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                variant="primary"
                loading={loading}
                leftIcon={<Save size={18} />}
            >
                Simpan Perubahan
            </Button>
        </form>
    );
}

// Change Password Form
function ChangePasswordForm() {
    const toast = useToast();
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validation
        if (formData.password.length < 8) {
            setErrors({ password: 'Password minimal 8 karakter' });
            return;
        }
        if (formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: 'Konfirmasi password tidak cocok' });
            return;
        }

        setLoading(true);
        try {
            await userService.changePassword(formData);
            toast.success('Password berhasil diubah');
            setFormData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
            } else {
                toast.error(error.message || 'Gagal mengubah password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Password Saat Ini
                </label>
                <input
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                />
                {errors.current_password && (
                    <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Password Baru
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Konfirmasi Password Baru
                </label>
                <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                />
                {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                )}
            </div>

            <Button
                type="submit"
                variant="primary"
                loading={loading}
                leftIcon={<Lock size={18} />}
            >
                Ubah Password
            </Button>
        </form>
    );
}

// Menu Item Component
function MenuItem({ icon: Icon, label, description, href, onClick, danger = false }) {
    const Component = href ? 'a' : 'button';

    return (
        <Component
            href={href}
            onClick={onClick}
            className={clsx(
                'w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left',
                danger
                    ? 'hover:bg-red-500/10 text-red-500'
                    : 'hover:bg-[var(--surface-hover)] text-[var(--text-primary)]'
            )}
        >
            <div className={clsx(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                danger ? 'bg-red-500/10' : 'bg-[var(--bg-tertiary)]'
            )}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <p className="font-medium">{label}</p>
                {description && (
                    <p className="text-sm text-[var(--text-tertiary)]">{description}</p>
                )}
            </div>
            <ChevronRight size={18} className="text-[var(--text-tertiary)]" />
        </Component>
    );
}

// Main Profile Page
export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading, logout, updateUser } = useAuth();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch profile data
    useEffect(() => {
        async function fetchProfile() {
            if (!isAuthenticated) return;

            try {
                const data = await userService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                // Use user from auth context as fallback
                setProfile(user);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [isAuthenticated, user]);

    // Handle profile update
    const handleProfileUpdate = (updatedUser) => {
        setProfile(updatedUser);
        updateUser(updatedUser);
    };

    // Handle logout
    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    // Handle delete account
    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.'
        );
        if (!confirmed) return;

        const password = window.prompt('Masukkan password Anda untuk konfirmasi:');
        if (!password) return;

        try {
            await userService.deleteAccount(password);
            toast.success('Akun berhasil dihapus');
            await logout();
            router.push('/');
        } catch (error) {
            toast.error(error.message || 'Gagal menghapus akun');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-64 space-y-4">
                            <Skeleton className="h-24 rounded-xl" />
                            <Skeleton className="h-12 rounded-lg" />
                            <Skeleton className="h-12 rounded-lg" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-64 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const stats = profile?.stats || user?.stats || {
        bookmarks_count: 0,
        comments_count: 0,
        ratings_count: 0,
    };

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'security', label: 'Keamanan', icon: Lock },
        { id: 'menu', label: 'Menu', icon: Settings },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-primary)] mb-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
                            {profile?.avatar ? (
                                <Image
                                    src={profile.avatar}
                                    alt={profile.name}
                                    width={80}
                                    height={80}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[var(--primary-500)]">
                                    {profile?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-xl font-bold text-[var(--text-primary)]">
                                {profile?.name || 'User'}
                            </h1>
                            <p className="text-[var(--text-secondary)]">{profile?.email}</p>
                            <p className="text-sm text-[var(--text-tertiary)] mt-1">
                                Bergabung sejak {profile?.created_at
                                    ? new Date(profile.created_at).toLocaleDateString('id-ID', {
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                    : '-'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <StatCard icon={BookMarked} label="Bookmark" value={stats.bookmarks_count} color="primary" />
                    <StatCard icon={MessageSquare} label="Komentar" value={stats.comments_count} color="blue" />
                    <StatCard icon={Star} label="Rating" value={stats.ratings_count} color="yellow" />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                                    activeTab === tab.id
                                        ? 'bg-[var(--primary-500)] text-white'
                                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                )}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-primary)]">
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                                Edit Profil
                            </h2>
                            <ProfileEditForm user={profile} onUpdate={handleProfileUpdate} />
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
                                Ubah Password
                            </h2>
                            <ChangePasswordForm />
                        </div>
                    )}

                    {activeTab === 'menu' && (
                        <div className="space-y-2">
                            <MenuItem
                                icon={BookMarked}
                                label="Bookmark Saya"
                                description="Lihat komik yang disimpan"
                                href="/bookmarks"
                            />
                            <MenuItem
                                icon={History}
                                label="Riwayat Baca"
                                description="Lihat riwayat bacaan"
                                href="/history"
                            />
                            <div className="border-t border-[var(--border-primary)] my-4" />
                            <MenuItem
                                icon={LogOut}
                                label="Keluar"
                                description="Keluar dari akun"
                                onClick={handleLogout}
                            />
                            <MenuItem
                                icon={Trash2}
                                label="Hapus Akun"
                                description="Hapus akun secara permanen"
                                onClick={handleDeleteAccount}
                                danger
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
