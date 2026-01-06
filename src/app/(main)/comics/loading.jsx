export default function ComicsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 w-48 bg-[var(--bg-tertiary)] rounded-lg animate-pulse mb-2" />
                <div className="h-5 w-32 bg-[var(--bg-tertiary)] rounded animate-pulse" />
            </div>

            {/* Filters Skeleton */}
            <div className="flex gap-3 mb-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 w-32 bg-[var(--bg-tertiary)] rounded-lg animate-pulse" />
                ))}
            </div>

            {/* Grid Skeleton */}
            <div className="comic-grid">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="aspect-[3/4] bg-[var(--bg-tertiary)] rounded-lg animate-pulse" />
                        <div className="h-4 w-3/4 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                        <div className="h-3 w-1/2 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}
