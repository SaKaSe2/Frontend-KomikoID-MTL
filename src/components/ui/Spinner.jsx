import clsx from 'clsx';

export default function Spinner({ size = 'md', className, color = 'primary' }) {
    const sizes = {
        xs: 'w-3 h-3 border',
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-2',
        xl: 'w-12 h-12 border-3',
    };

    const colors = {
        primary: 'border-primary-500',
        white: 'border-white',
        current: 'border-current',
    };

    return (
        <div
            className={clsx(
                'animate-spin rounded-full border-t-transparent',
                sizes[size],
                colors[color],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

// Full page spinner
Spinner.FullPage = function FullPageSpinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg-primary)] z-50">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="xl" />
                <p className="text-[var(--text-secondary)] text-sm">Memuat...</p>
            </div>
        </div>
    );
};
