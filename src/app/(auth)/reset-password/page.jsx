'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import authService from '@/lib/api/services/authService';
import Button from '@/components/ui/Button';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();

    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    const [email, setEmail] = useState(emailParam || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (emailParam) setEmail(emailParam);
    }, [emailParam]);

    // Validasi kekuatan password
    const getPasswordStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strengthLabels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validasi
        const newErrors = {};
        if (!email) newErrors.email = 'Email wajib diisi';
        if (!password) newErrors.password = 'Password baru wajib diisi';
        if (password.length < 8) newErrors.password = 'Password minimal 8 karakter';
        if (password !== passwordConfirmation) {
            newErrors.password_confirmation = 'Konfirmasi password tidak cocok';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword({
                email,
                token,
                password,
                password_confirmation: passwordConfirmation,
            });
            setSuccess(true);
            toast.success('Password berhasil direset!');
        } catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                toast.error(err.message || 'Gagal reset password. Token mungkin sudah kadaluarsa.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Token tidak valid
    if (!token) {
        return (
            <div className="animate-fade-in">
                <Link
                    href="/forgot-password"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Minta Link Baru
                </Link>

                <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-primary)] shadow-xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Link Tidak Valid
                        </h1>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            Link reset password tidak valid atau sudah kadaluarsa.
                            Silakan minta link baru.
                        </p>
                    </div>

                    <Link href="/forgot-password" className="block">
                        <Button variant="primary" fullWidth>
                            Minta Link Baru
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Berhasil reset
    if (success) {
        return (
            <div className="animate-fade-in">
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-primary)] shadow-xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Password Berhasil Direset!
                        </h1>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            Password kamu telah berhasil diperbarui. Silakan login dengan password baru.
                        </p>
                    </div>

                    <Link href="/login" className="block">
                        <Button variant="primary" fullWidth>
                            Masuk Sekarang
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Navigasi kembali */}
            <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
            >
                <ArrowLeft size={16} />
                Kembali ke Login
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

                {/* Judul */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Reset Password
                    </h1>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Buat password baru untuk akun kamu.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email (bisa pre-filled dari query param) */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
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

                    {/* Password Baru */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Password Baru
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimal 8 karakter"
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

                        {/* Indikator kekuatan password */}
                        {password && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                i < passwordStrength
                                                    ? strengthColors[passwordStrength]
                                                    : 'bg-[var(--border-primary)]'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-[var(--text-tertiary)]">
                                    {strengthLabels[passwordStrength]}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Konfirmasi Password */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="Ketik ulang password baru"
                                className="w-full pl-10 pr-12 py-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Indikator cocok/tidak cocok */}
                        {passwordConfirmation && (
                            <p className={`text-sm mt-1 ${
                                password === passwordConfirmation ? 'text-green-500' : 'text-red-500'
                            }`}>
                                {password === passwordConfirmation ? 'Password cocok' : 'Password tidak cocok'}
                            </p>
                        )}
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                        )}
                    </div>

                    {/* Tombol Submit */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        leftIcon={<KeyRound size={18} />}
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}

// Wrapper dengan Suspense boundary untuk useSearchParams
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="animate-fade-in">
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-primary)] shadow-xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-full border-4 border-[var(--primary-500)] border-t-transparent animate-spin" />
                    </div>
                    <p className="text-center text-[var(--text-secondary)]">Memuat halaman reset...</p>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
