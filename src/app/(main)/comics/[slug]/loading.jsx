import Skeleton from '@/components/ui/Skeleton';

export default function ComicDetailLoading() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <Skeleton className="w-56 h-72 rounded-xl flex-shrink-0 mx-auto lg:mx-0" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-10 w-3/4 mx-auto lg:mx-0" />
                        <Skeleton className="h-6 w-1/2 mx-auto lg:mx-0" />
                        <div className="flex justify-center lg:justify-start gap-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-8 w-20 rounded-full" />
                            ))}
                        </div>
                        <div className="flex justify-center lg:justify-start gap-3">
                            <Skeleton className="h-12 w-32 rounded-lg" />
                            <Skeleton className="h-12 w-28 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Synopsis */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-[var(--bg-secondary)] rounded-xl p-6 mb-8">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton.Text lines={4} />
                </div>

                {/* Chapter List */}
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-12 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
