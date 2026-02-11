import { cn } from "@/lib/utils";

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function SecondaryButton({ className, children, ...props }: SecondaryButtonProps) {
    return (
        <button
            className={cn(
                "bg-surface text-primary px-4 py-2 rounded-xl transition-all duration-150",
                "border-2 border-primary",
                "hover:bg-primary hover:text-white active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "font-medium",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
