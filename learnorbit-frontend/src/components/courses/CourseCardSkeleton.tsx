export function CourseCardSkeleton() {
    return (
        <div className="bg-surface border border-borderLight rounded-xl overflow-hidden h-full flex flex-col animate-pulse">
            {/* Thumbnail Skeleton */}
            <div className="h-44 bg-muted" />

            {/* Content Skeleton */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Title Skeleton */}
                <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                <div className="h-5 bg-muted rounded w-1/2 mb-4" />

                {/* Description Skeleton */}
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-5/6 mb-4" />

                {/* Meta Skeleton */}
                <div className="flex items-center gap-4 mb-3">
                    <div className="h-3 bg-muted rounded w-16" />
                    <div className="h-3 bg-muted rounded w-12" />
                </div>

                {/* Instructor Skeleton */}
                <div className="h-3 bg-muted rounded w-24 mb-4" />

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom Section Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-borderLight">
                    <div className="h-4 bg-muted rounded w-12" />
                    <div className="h-4 bg-muted rounded w-20" />
                </div>
            </div>
        </div>
    );
}
