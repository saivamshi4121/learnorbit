import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function PrimaryButton({ className, children, ...props }: PrimaryButtonProps) {
    return (
        <button
            className={cn(
                "bg-primary text-white px-4 py-2 rounded-xl transition-all duration-150",
                "hover:opacity-90 active:scale-[0.98]",
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
