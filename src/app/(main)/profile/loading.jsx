import Skeleton from '@/components/ui/Skeleton';

export default function ProfileLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Skeleton */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-primary)] mb-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <div className="space-y-2 text-center sm:text-left flex-1">
                            <Skeleton className="h-6 w-32 mx-auto sm:mx-0" />
                            <Skeleton className="h-4 w-48 mx-auto sm:mx-0" />
                            <Skeleton className="h-3 w-40 mx-auto sm:mx-0" />
                        </div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-primary)]">
                            <Skeleton className="w-10 h-10 rounded-lg mb-3" />
                            <Skeleton className="h-8 w-12 mb-1" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>

                {/* Tabs Skeleton */}
                <div className="flex gap-2 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-lg" />
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-primary)]">
                    <Skeleton className="h-6 w-32 mb-6" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-12 w-32 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
