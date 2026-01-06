'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Edit,
    MoreHorizontal,
    Loader2,
    Shield,
    ShieldOff
} from 'lucide-react';
import adminService from '@/lib/api/services/adminService';
import { useToast } from '@/context/ToastContext';
import Skeleton from '@/components/ui/Skeleton';
import clsx from 'clsx';

// User Table Row
function UserRow({ user, onUpdateRole, updating }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <tr className="border-b border-[var(--border-primary)] hover:bg-[var(--surface-hover)]">
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-500)]/10 flex items-center justify-center text-[var(--primary-500)] font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-[var(--text-primary)] truncate">{user.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className={clsx(
                    'px-2 py-1 text-xs font-medium rounded',
                    user.role === 'admin' && 'bg-[var(--primary-500)]/10 text-[var(--primary-500)]',
                    user.role === 'user' && 'bg-gray-500/10 text-gray-500'
                )}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                </span>
            </td>
            <td className="py-3 px-4 text-[var(--text-secondary)]">
                {user.bookmarks_count || 0}
            </td>
            <td className="py-3 px-4 text-[var(--text-secondary)]">
                {user.comments_count || 0}
            </td>
            <td className="py-3 px-4 text-[var(--text-tertiary)] text-sm">
                {new Date(user.created_at).toLocaleDateString('id-ID')}
            </td>
            <td className="py-3 px-4">
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)]"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-20 py-1">
                                {user.role === 'user' ? (
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            onUpdateRole(user.uuid, 'admin');
                                        }}
                                        disabled={updating === user.uuid}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--surface-hover)]"
                                    >
                                        {updating === user.uuid ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Shield size={14} />
                                        )}
                                        Jadikan Admin
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            onUpdateRole(user.uuid, 'user');
                                        }}
                                        disabled={updating === user.uuid}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-yellow-500 hover:bg-yellow-500/10"
                                    >
                                        {updating === user.uuid ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <ShieldOff size={14} />
                                        )}
                                        Hapus Admin
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}

// Main Users List Page
export default function AdminUsersPage() {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Fetch users
    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const response = await adminService.getUsers({
                page,
                per_page: 20,
                search: search || undefined,
                role: roleFilter || undefined,
            });
            setUsers(response.data || []);
            setMeta(response.meta || { current_page: 1, last_page: 1, total: 0 });
        } catch (err) {
            toast.error('Gagal memuat data pengguna');
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter, toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Handle role update
    const handleUpdateRole = async (id, newRole) => {
        setUpdating(id);
        try {
            await adminService.updateUser(id, { role: newRole });
            setUsers(prev => prev.map(u =>
                u.uuid === id ? { ...u, role: newRole } : u
            ));
            toast.success(`Pengguna berhasil diubah menjadi ${newRole === 'admin' ? 'Admin' : 'User'}`);
        } catch (err) {
            toast.error(err.message || 'Gagal mengubah role pengguna');
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manajemen Pengguna</h1>
                <p className="text-[var(--text-secondary)]">{meta.total} pengguna terdaftar</p>
            </div>

            {/* Filters */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-primary)]">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau email..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                    >
                        <option value="">Semua Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--bg-tertiary)]">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Pengguna</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Role</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Bookmark</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Komentar</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Bergabung</th>
                                <th className="text-left py-3 px-4 font-medium text-[var(--text-secondary)]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-[var(--border-primary)]">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="w-10 h-10 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4"><Skeleton className="h-6 w-12" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-4 w-8" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-4 w-8" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                                        <td className="py-3 px-4"><Skeleton className="h-8 w-8" /></td>
                                    </tr>
                                ))
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <UserRow
                                        key={user.uuid}
                                        user={user}
                                        onUpdateRole={handleUpdateRole}
                                        updating={updating}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-[var(--text-tertiary)]">
                                        Tidak ada pengguna ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-primary)]">
                        <p className="text-sm text-[var(--text-tertiary)]">
                            Halaman {meta.current_page} dari {meta.last_page}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchUsers(meta.current_page - 1)}
                                disabled={meta.current_page <= 1}
                                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-tertiary)] disabled:opacity-50"
                            >
                                Sebelumnya
                            </button>
                            <button
                                onClick={() => fetchUsers(meta.current_page + 1)}
                                disabled={meta.current_page >= meta.last_page}
                                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--bg-tertiary)] disabled:opacity-50"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
