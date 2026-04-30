"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ShareButton({ title }: { title: string }) {
    return (
        <button
            onClick={async () => {
                const url = window.location.href;
                try {
                    if (navigator.share) {
                        await navigator.share({ title, url });
                    } else {
                        await navigator.clipboard.writeText(url);
                        toast.success("Link copied to clipboard!");
                    }
                } catch (err) {
                    console.error(err);
                }
            }}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold ml-auto"
        >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
        </button>
    );
}
