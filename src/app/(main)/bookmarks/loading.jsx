import Skeleton from '@/components/ui/Skeleton';

export default function BookmarksLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-8">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="comic-grid">
                {[...Array(8)].map((_, i) => (
                    <Skeleton.ComicCard key={i} />
                ))}
            </div>
        </div>
    );
}
