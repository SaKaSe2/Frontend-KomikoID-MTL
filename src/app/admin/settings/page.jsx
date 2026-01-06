'use client';

import { useState } from 'react';
import {
    Settings,
    Globe,
    Palette,
    Bell,
    Shield,
    Save
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import clsx from 'clsx';

// Settings Section Component
function SettingsSection({ icon: Icon, title, description, children }) {
    return (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border-primary)]">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary-500)]/10 flex items-center justify-center text-[var(--primary-500)]">
                    <Icon size={20} />
                </div>
                <div>
                    <h2 className="font-semibold text-[var(--text-primary)]">{title}</h2>
                    <p className="text-sm text-[var(--text-tertiary)]">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

// Toggle Switch Component
function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[var(--text-secondary)]">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={clsx(
                    'relative w-11 h-6 rounded-full transition-colors',
                    checked ? 'bg-[var(--primary-500)]' : 'bg-[var(--bg-tertiary)]'
                )}
            >
                <span className={clsx(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                    checked ? 'left-[22px]' : 'left-0.5'
                )} />
            </button>
        </label>
    );
}

// Main Settings Page
export default function AdminSettingsPage() {
    const { theme, setTheme } = useTheme();
    const toast = useToast();

    const [settings, setSettings] = useState({
        siteName: 'KomikoID',
        siteDescription: 'Baca Komik dengan Terjemahan Indonesia',
        defaultLanguage: 'id',
        enableRegistration: true,
        enableComments: true,
        enableRatings: true,
        autoTranslate: true,
        maintenanceMode: false,
    });

    const handleSave = () => {
        // TODO: Save settings to API
        toast.success('Pengaturan berhasil disimpan');
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pengaturan</h1>
                <p className="text-[var(--text-secondary)]">Konfigurasi website dan preferensi</p>
            </div>

            {/* Site Settings */}
            <SettingsSection
                icon={Globe}
                title="Pengaturan Situs"
                description="Konfigurasi umum website"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Nama Situs
                        </label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Deskripsi Situs
                        </label>
                        <textarea
                            value={settings.siteDescription}
                            onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Bahasa Default
                        </label>
                        <select
                            value={settings.defaultLanguage}
                            onChange={(e) => setSettings(prev => ({ ...prev, defaultLanguage: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                        >
                            <option value="id">Indonesia</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            </SettingsSection>

            {/* Appearance */}
            <SettingsSection
                icon={Palette}
                title="Tampilan"
                description="Sesuaikan tampilan website"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Tema
                        </label>
                        <div className="flex gap-3">
                            {['light', 'dark', 'system'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={clsx(
                                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                        theme === t
                                            ? 'bg-[var(--primary-500)] text-white'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                                    )}
                                >
                                    {t === 'light' ? 'Terang' : t === 'dark' ? 'Gelap' : 'Sistem'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </SettingsSection>

            {/* Features */}
            <SettingsSection
                icon={Bell}
                title="Fitur"
                description="Aktifkan atau nonaktifkan fitur"
            >
                <div className="space-y-4">
                    <Toggle
                        checked={settings.enableRegistration}
                        onChange={(val) => setSettings(prev => ({ ...prev, enableRegistration: val }))}
                        label="Izinkan Registrasi Pengguna Baru"
                    />
                    <Toggle
                        checked={settings.enableComments}
                        onChange={(val) => setSettings(prev => ({ ...prev, enableComments: val }))}
                        label="Aktifkan Komentar"
                    />
                    <Toggle
                        checked={settings.enableRatings}
                        onChange={(val) => setSettings(prev => ({ ...prev, enableRatings: val }))}
                        label="Aktifkan Rating Komik"
                    />
                    <Toggle
                        checked={settings.autoTranslate}
                        onChange={(val) => setSettings(prev => ({ ...prev, autoTranslate: val }))}
                        label="Auto Terjemahan Chapter Baru"
                    />
                </div>
            </SettingsSection>

            {/* Security */}
            <SettingsSection
                icon={Shield}
                title="Keamanan"
                description="Pengaturan keamanan dan akses"
            >
                <div className="space-y-4">
                    <Toggle
                        checked={settings.maintenanceMode}
                        onChange={(val) => setSettings(prev => ({ ...prev, maintenanceMode: val }))}
                        label="Mode Maintenance"
                    />
                </div>
            </SettingsSection>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Save size={18} />}
                    onClick={handleSave}
                >
                    Simpan Pengaturan
                </Button>
            </div>
        </div>
    );
}
