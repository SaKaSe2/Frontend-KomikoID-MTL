'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    User,
    Mail,
    Camera,
    Save,
    BookMarked,
    History,
    MessageSquare,
    Star,
    Lock,
    Trash2,
    LogOut,
    ChevronRight,
    Shield,
    Edit3,
    Calendar,
    Eye,
    EyeOff,
    X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import userService from '@/lib/api/services/userService';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';

// Simple Stats Item
function StatItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)]">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/10 flex items-center justify-center">
                <Icon size={18} className="text-[var(--primary-500)]" />
            </div>
            <div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
            </div>
        </div>
    );
}

// Menu Item
function MenuItem({ icon: Icon, label, description, onClick, href, danger = false }) {
    const Component = href ? Link : 'button';

    return (
        <Component
            href={href}
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${danger
                ? 'hover:bg-red-500/10 text-red-500'
                : 'hover:bg-[var(--surface-hover)] text-[var(--text-primary)]'
                }`}
        >
            <Icon size={18} className={danger ? 'text-red-500' : 'text-[var(--text-tertiary)]'} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{label}</p>
                {description && <p className="text-xs text-[var(--text-tertiary)]">{description}</p>}
            </div>
            <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
        </Component>
    );
}

// Profile Edit Form
function ProfileEditForm({ user, onUpdate, onClose }) {
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
            onClose?.();
        } catch (error) {
            toast.error(error.message || 'Gagal memperbarui profil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--bg-tertiary)] border-2 border-[var(--border-primary)]">
                        {avatarPreview ? (
                            <Image
                                src={avatarPreview}
                                alt="Avatar"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[var(--primary-500)]">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] transition-colors"
                    >
                        <Camera size={12} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-2">Maks. 2MB</p>
            </div>

            {/* Name */}
            <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Nama</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                />
            </div>

            {/* Email (Read-only) */}
            <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Email</label>
                <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-tertiary)] text-sm opacity-60 cursor-not-allowed"
                />
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full">
                <Save size={16} className="mr-2" />
                Simpan
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
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (formData.password.length < 8) {
            setErrors({ password: 'Password minimal 8 karakter' });
            return;
        }
        if (formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: 'Password tidak cocok' });
            return;
        }

        setLoading(true);
        try {
            await userService.changePassword(formData);
            toast.success('Password berhasil diubah');
            setFormData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error) {
            toast.error(error.message || 'Gagal mengubah password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Password Lama</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.current_password}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_password: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                />
            </div>
            <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Password Baru</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Min. 8 karakter"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1.5">Konfirmasi Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                />
                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
                Tampilkan password
            </label>

            <Button type="submit" variant="primary" loading={loading} className="w-full">
                <Lock size={16} className="mr-2" />
                Ubah Password
            </Button>
        </form>
    );
}

// Main Profile Page
export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading, logout, updateUser } = useAuth();
    const toast = useToast();

    const [activeModal, setActiveModal] = useState(null); // 'edit' | 'security' | null
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        async function fetchProfile() {
            if (authLoading || !isAuthenticated) {
                setLoading(false);
                return;
            }
            try {
                const data = await userService.getProfile();
                setProfile(data);
            } catch (error) {
                setProfile(user);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [authLoading, isAuthenticated, user]);

    const handleProfileUpdate = (updatedUser) => {
        setProfile(updatedUser);
        updateUser(updatedUser);
        setActiveModal(null);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) return;
        const password = window.prompt('Masukkan password:');
        if (!password) return;

        try {
            await userService.deleteAccount(password);
            toast.success('Akun dihapus');
            await logout();
            router.push('/');
        } catch (error) {
            toast.error(error.message || 'Gagal menghapus akun');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen py-8">
                <div className="w-full flex justify-center px-4">
                    <div className="w-full max-w-md space-y-4">
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-24 rounded-lg" />
                        <Skeleton className="h-48 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const stats = profile?.stats || user?.stats || {
        bookmarks_count: 0,
        comments_count: 0,
        ratings_count: 0,
    };

    return (
        <div className="min-h-screen py-6">
            <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-md">

                    {/* Profile Header */}
                    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-5 mb-4">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--bg-tertiary)] border-2 border-[var(--primary-500)]">
                                    {profile?.avatar ? (
                                        <Image
                                            src={profile.avatar}
                                            alt={profile.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[var(--primary-500)]">
                                            {profile?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg font-bold text-[var(--text-primary)] truncate">
                                    {profile?.name || 'User'}
                                </h1>
                                <p className="text-sm text-[var(--text-secondary)] truncate">{profile?.email}</p>
                                <p className="text-xs text-[var(--text-tertiary)] mt-1 flex items-center gap-1">
                                    <Calendar size={12} />
                                    Bergabung {profile?.created_at
                                        ? new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
                                        : '-'
                                    }
                                </p>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setActiveModal('edit')}
                                className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)] hover:text-[var(--primary-500)] transition-colors"
                            >
                                <Edit3 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <StatItem icon={BookMarked} value={stats.bookmarks_count} label="Bookmark" />
                        <StatItem icon={MessageSquare} value={stats.comments_count} label="Komentar" />
                        <StatItem icon={Star} value={stats.ratings_count} label="Rating" />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4 mb-4">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Akses Cepat</h2>
                        <div className="space-y-1">
                            <MenuItem icon={BookMarked} label="Bookmark" href="/bookmarks" />
                            <MenuItem icon={History} label="Riwayat Baca" href="/history" />
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] p-4">
                        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Pengaturan</h2>
                        <div className="space-y-1">
                            <MenuItem icon={User} label="Edit Profil" onClick={() => setActiveModal('edit')} />
                            <MenuItem icon={Shield} label="Ubah Password" onClick={() => setActiveModal('security')} />
                            <div className="border-t border-[var(--border-primary)] my-2" />
                            <MenuItem icon={LogOut} label="Keluar" onClick={handleLogout} />
                            <MenuItem icon={Trash2} label="Hapus Akun" onClick={handleDeleteAccount} danger />
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {activeModal === 'edit' && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
                    <div className="relative w-full max-w-sm mx-auto bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
                            <h2 className="font-semibold text-[var(--text-primary)]">Edit Profil</h2>
                            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-[var(--surface-hover)] rounded">
                                <X size={18} className="text-[var(--text-tertiary)]" />
                            </button>
                        </div>
                        <div className="p-4">
                            <ProfileEditForm user={profile} onUpdate={handleProfileUpdate} onClose={() => setActiveModal(null)} />
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Security Modal */}
            {activeModal === 'security' && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
                    <div className="relative w-full max-w-sm mx-auto bg-[var(--bg-card)] rounded-lg border border-[var(--border-primary)] shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
                            <h2 className="font-semibold text-[var(--text-primary)]">Ubah Password</h2>
                            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-[var(--surface-hover)] rounded">
                                <X size={18} className="text-[var(--text-tertiary)]" />
                            </button>
                        </div>
                        <div className="p-4">
                            <ChangePasswordForm />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
