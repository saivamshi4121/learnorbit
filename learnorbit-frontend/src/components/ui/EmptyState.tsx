/**
 * EmptyState Component
 * Minimal empty state for when no courses exist
 */

import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
                <h3 className="text-lg font-medium text-textPrimary mb-2">{title}</h3>
                <p className="text-sm text-mutedText mb-6">{description}</p>
                {actionLabel && onAction && (
                    <PrimaryButton onClick={onAction}>
                        {actionLabel}
                    </PrimaryButton>
                )}
            </div>
        </div>
    );
}
