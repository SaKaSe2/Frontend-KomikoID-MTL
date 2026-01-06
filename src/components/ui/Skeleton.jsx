import clsx from 'clsx';

export default function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
    ...props
}) {
    const variants = {
        rectangular: 'rounded-lg',
        circular: 'rounded-full',
        text: 'rounded h-4',
    };

    return (
        <div
            className={clsx(
                'bg-[var(--bg-tertiary)] animate-pulse',
                variants[variant],
                className
            )}
            style={{ width, height }}
            {...props}
        />
    );
}

// Preset skeletons
Skeleton.Avatar = function SkeletonAvatar({ size = 40, className }) {
    return (
        <Skeleton
            variant="circular"
            width={size}
            height={size}
            className={className}
        />
    );
};

Skeleton.Text = function SkeletonText({ lines = 1, className }) {
    return (
        <div className={clsx('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    className="h-4"
                    style={{ width: i === lines - 1 ? '60%' : '100%' }}
                />
            ))}
        </div>
    );
};

Skeleton.Card = function SkeletonCard({ className }) {
    return (
        <div
            className={clsx(
                'bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)] p-4',
                className
            )}
        >
            <Skeleton className="aspect-[3/4] w-full mb-3" />
            <Skeleton.Text lines={2} />
        </div>
    );
};

Skeleton.ComicCard = function SkeletonComicCard({ className }) {
    return (
        <div className={clsx('space-y-2', className)}>
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
    );
};
