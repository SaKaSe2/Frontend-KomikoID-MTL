'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import authService from '@/lib/api/services/authService';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validasi email
        if (!email) {
            setErrors({ email: 'Email wajib diisi' });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrors({ email: 'Format email tidak valid' });
            return;
        }

        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSent(true);
            toast.success('Link reset password telah dikirim ke email kamu!');
        } catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                toast.error(err.message || 'Gagal mengirim link reset. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Tampilan setelah email berhasil dikirim
    if (sent) {
        return (
            <div className="animate-fade-in">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Login
                </Link>

                <div className="bg-[var(--bg-secondary)] rounded-2xl p-8 border border-[var(--border-primary)] shadow-xl">
                    {/* Ikon sukses */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Email Terkirim!
                        </h1>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            Kami telah mengirimkan link reset password ke{' '}
                            <span className="font-medium text-[var(--primary-500)]">{email}</span>.
                            Silakan cek inbox atau folder spam kamu.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => setSent(false)}
                        >
                            Kirim Ulang
                        </Button>

                        <Link href="/login" className="block">
                            <Button variant="primary" fullWidth>
                                Kembali ke Login
                            </Button>
                        </Link>
                    </div>
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
                        Lupa Password?
                    </h1>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Masukkan email yang terdaftar dan kami akan mengirimkan link untuk mereset password kamu.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input Email */}
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

                    {/* Tombol Kirim */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                        leftIcon={<Send size={18} />}
                    >
                        Kirim Link Reset
                    </Button>
                </form>

                {/* Link ke Register */}
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
