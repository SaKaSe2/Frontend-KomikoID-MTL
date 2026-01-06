import Skeleton from '@/components/ui/Skeleton';

export default function HistoryLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-8">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* List Skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 bg-[var(--bg-secondary)] rounded-xl">
                        <div className="flex gap-4">
                            <Skeleton className="w-16 h-20 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full mt-4 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
