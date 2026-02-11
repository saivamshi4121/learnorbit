export function CourseDetailSkeleton() {
    return (
        <div className="min-h-screen bg-background animate-pulse">
            {/* Hero Skeleton */}
            <section className="bg-primary/[0.02] border-b border-borderLight">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="order-2 lg:order-1">
                            {/* Badge */}
                            <div className="h-8 bg-muted rounded-full w-32 mb-6" />
                            {/* Title */}
                            <div className="h-12 bg-muted rounded-lg w-3/4 mb-4" />
                            <div className="h-12 bg-muted rounded-lg w-1/2 mb-4" />
                            {/* Tagline */}
                            <div className="h-6 bg-muted rounded w-full mb-2" />
                            <div className="h-6 bg-muted rounded w-2/3 mb-8" />
                            {/* Price & CTA */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-8 bg-muted rounded w-16" />
                                <div className="h-6 bg-muted rounded w-24" />
                            </div>
                            <div className="h-12 bg-muted rounded-xl w-40" />
                        </div>

                        {/* Right: Thumbnail */}
                        <div className="order-1 lg:order-2">
                            <div className="aspect-video bg-muted rounded-xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Skeleton */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left: About */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About Section */}
                        <div>
                            <div className="h-8 bg-muted rounded w-48 mb-4" />
                            <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-full" />
                                <div className="h-4 bg-muted rounded w-full" />
                                <div className="h-4 bg-muted rounded w-3/4" />
                            </div>
                        </div>

                        {/* Outcomes */}
                        <div>
                            <div className="h-8 bg-muted rounded w-40 mb-6" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-surface border border-borderLight rounded-xl p-5">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                                                <div className="h-3 bg-muted rounded w-full" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum */}
                        <div>
                            <div className="h-8 bg-muted rounded w-48 mb-6" />
                            <div className="space-y-4 pl-12 relative">
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-borderLight" />
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-12 w-8 h-8 bg-muted rounded-full" />
                                        <div className="bg-surface border border-borderLight rounded-xl p-5">
                                            <div className="h-5 bg-muted rounded w-20 mb-3" />
                                            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                                            <div className="h-3 bg-muted rounded w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Info Card */}
                    <div>
                        <div className="bg-surface border border-borderLight rounded-xl p-6">
                            <div className="h-5 bg-muted rounded w-32 mb-6" />
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-muted rounded-lg" />
                                            <div className="h-4 bg-muted rounded w-16" />
                                        </div>
                                        <div className="h-4 bg-muted rounded w-12" />
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-borderLight my-6" />
                            <div className="h-12 bg-muted rounded-xl" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
