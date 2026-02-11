import { cn } from "@/lib/utils";

interface AppCardProps {
    children: React.ReactNode;
    className?: string;
}

export function AppCard({ children, className }: AppCardProps) {
    return (
        <div
            className={cn(
                "bg-surface border border-borderLight rounded-xl p-6 shadow-sm",
                "hover:shadow-md transition-shadow duration-200",
                className
            )}
        >
            {children}
        </div>
    );
}
