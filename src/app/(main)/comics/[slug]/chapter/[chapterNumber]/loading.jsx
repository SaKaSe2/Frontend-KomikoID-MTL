export default function ChapterLoading() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Toolbar Skeleton */}
            <div className="h-14 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]" />

            {/* Pages Skeleton */}
            <div className="container mx-auto px-4 py-8 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="w-full max-w-3xl mx-auto aspect-[2/3] bg-[var(--bg-tertiary)] rounded-lg animate-pulse flex items-center justify-center"
                    >
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm text-[var(--text-tertiary)]">Memuat halaman...</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Nav Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 h-14 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]" />
        </div>
    );
}
