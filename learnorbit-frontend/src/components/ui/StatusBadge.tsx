/**
 * StatusBadge Component
 * Minimal badge for course status (Draft/Published)
 */

interface StatusBadgeProps {
    status: 'draft' | 'published';
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const isDraft = status === 'draft';

    return (
        <span
            className={`
                inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
                ${isDraft
                    ? 'bg-gray-100 text-gray-700 border border-gray-300'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }
            `}
        >
            {isDraft ? 'Draft' : 'Published'}
        </span>
    );
}
