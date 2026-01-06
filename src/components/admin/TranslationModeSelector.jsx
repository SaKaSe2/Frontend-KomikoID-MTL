'use client';

import { useState } from 'react';
import { Zap, Edit3, Info } from 'lucide-react';
import clsx from 'clsx';

/**
 * TranslationModeSelector - Toggle between Auto and Manual translation modes
 * 
 * @param {string} mode - Current mode ('auto' or 'manual')
 * @param {function} onModeChange - Callback when mode changes
 * @param {boolean} disabled - Whether selector is disabled
 */
export default function TranslationModeSelector({ mode = 'auto', onModeChange, disabled = false }) {
    const [showInfo, setShowInfo] = useState(false);

    const modes = [
        {
            id: 'auto',
            label: 'Auto Mode',
            icon: Zap,
            description: 'One-click translation menggunakan AI Translator lokal',
            features: [
                'OCR + Translation + Inpainting otomatis',
                'Unlimited & tanpa watermark ✓',
                'Prioritas: Local → Cotrans → Legacy OCR',
                'Cocok untuk sebagian besar chapter'
            ],
            color: 'primary'
        },
        {
            id: 'manual',
            label: 'Manual Mode',
            icon: Edit3,
            description: 'Kontrol penuh dengan manual text masking',
            features: [
                'Admin menandai area text secara manual',
                'LaMa AI menghapus text yang ditandai',
                'Precision tinggi untuk kasus khusus',
                'Cocok untuk layout kompleks'
            ],
            color: 'orange'
        }
    ];

    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Translation Mode
                </h3>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-tertiary)]"
                    title={showInfo ? 'Hide info' : 'Show info'}
                >
                    <Info size={16} />
                </button>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                {modes.map((m) => {
                    const Icon = m.icon;
                    const isActive = mode === m.id;

                    return (
                        <button
                            key={m.id}
                            onClick={() => !disabled && onModeChange(m.id)}
                            disabled={disabled}
                            className={clsx(
                                'relative p-4 rounded-lg border-2 transition-all text-left',
                                isActive
                                    ? `border-[var(--${m.color}-500)] bg-[var(--${m.color}-500)]/10`
                                    : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)] bg-[var(--bg-tertiary)]',
                                disabled && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {/* Icon */}
                            <div className={clsx(
                                'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                                isActive
                                    ? `bg-[var(--${m.color}-500)] text-white`
                                    : 'bg-[var(--bg-primary)] text-[var(--text-tertiary)]'
                            )}>
                                <Icon size={20} />
                            </div>

                            {/* Label */}
                            <div className="font-medium text-[var(--text-primary)] mb-1">
                                {m.label}
                            </div>

                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute top-2 right-2">
                                    <div className={`w-2 h-2 rounded-full bg-[var(--${m.color}-500)]`} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Mode Info (collapsible) */}
            {showInfo && (
                <div className="grid grid-cols-1 gap-3 pt-3 border-t border-[var(--border-primary)]">
                    {modes.map((m) => {
                        const Icon = m.icon;

                        return (
                            <div
                                key={m.id}
                                className={clsx(
                                    'p-3 rounded-lg border',
                                    mode === m.id
                                        ? `border-[var(--${m.color}-500)]/30 bg-[var(--${m.color}-500)]/5`
                                        : 'border-[var(--border-primary)] bg-[var(--bg-tertiary)]'
                                )}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon size={16} className={mode === m.id ? `text-[var(--${m.color}-500)]` : 'text-[var(--text-tertiary)]'} />
                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                        {m.label}
                                    </span>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] mb-2">
                                    {m.description}
                                </p>
                                <ul className="space-y-1">
                                    {m.features.map((feature, idx) => (
                                        <li key={idx} className="text-xs text-[var(--text-tertiary)] flex items-start gap-2">
                                            <span className={mode === m.id ? `text-[var(--${m.color}-500)]` : 'text-[var(--text-tertiary)]'}>•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Current Mode Summary */}
            {!showInfo && (
                <div className="text-xs text-[var(--text-tertiary)]">
                    {modes.find(m => m.id === mode)?.description}
                </div>
            )}
        </div>
    );
}
