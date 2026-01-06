'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(function Input(
    {
        label,
        error,
        hint,
        leftIcon,
        rightIcon,
        className,
        inputClassName,
        disabled = false,
        required = false,
        type = 'text',
        ...props
    },
    ref
) {
    const hasError = !!error;

    return (
        <div className={clsx('w-full', className)}>
            {label && (
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    disabled={disabled}
                    className={clsx(
                        'w-full rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)]',
                        'px-4 py-2.5 text-sm',
                        'transition-all duration-200',
                        'placeholder:text-[var(--text-muted)]',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--bg-secondary)]',
                        hasError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)]',
                        leftIcon && 'pl-10',
                        rightIcon && 'pr-10',
                        inputClassName
                    )}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        {rightIcon}
                    </div>
                )}
            </div>

            {(error || hint) && (
                <p
                    className={clsx(
                        'mt-1.5 text-xs',
                        hasError ? 'text-red-500' : 'text-[var(--text-tertiary)]'
                    )}
                >
                    {error || hint}
                </p>
            )}
        </div>
    );
});

export default Input;
