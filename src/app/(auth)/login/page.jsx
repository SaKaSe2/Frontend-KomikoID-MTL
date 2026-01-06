'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
    const router = useRouter();
    const { login, loading } = useAuth();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Basic validation
        if (!email) {
            setErrors(prev => ({ ...prev, email: 'Email wajib diisi' }));
            return;
        }
        if (!password) {
            setErrors(prev => ({ ...prev, password: 'Password wajib diisi' }));
            return;
        }

        try {
            await login(email, password);
            toast.success('Berhasil masuk!');
            router.push('/');
        } catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                toast.error(err.message || 'Gagal login. Silakan coba lagi.');
            }
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Back to Home */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
            >
                <ArrowLeft size={16} />
                Kembali ke Beranda
            </Link>

            {/* Card */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-primary)] shadow-xl">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/icons/Logo.png"
                            alt="KomikoID"
                            width={48}
                            height={48}
                            className="rounded-lg"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                        <span className="text-2xl font-bold gradient-text">KomikoID</span>
                    </Link>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Selamat Datang Kembali
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Masuk untuk melanjutkan membaca
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-[var(--primary-500)] hover:text-[var(--primary-400)]"
                        >
                            Lupa password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        leftIcon={<LogIn size={18} />}
                    >
                        Masuk
                    </Button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-6 pt-6 border-t border-[var(--border-primary)]">
                    <p className="text-[var(--text-secondary)]">
                        Belum punya akun?{' '}
                        <Link
                            href="/register"
                            className="font-medium text-[var(--primary-500)] hover:text-[var(--primary-400)]"
                        >
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
