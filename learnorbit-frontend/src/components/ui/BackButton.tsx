"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton({ className = "" }: { className?: string }) {
    const router = useRouter();
    return (
        <button 
            onClick={() => router.back()}
            className={`group flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest ${className}`}
        >
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
        </button>
    );
}
