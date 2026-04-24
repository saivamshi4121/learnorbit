import { Feed } from "@/components/feed/Feed";
import { groupBlogs, Blog } from "@/lib/groupBlogs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BackButton } from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

async function getBlogsData(): Promise<Blog[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
            cache: "no-store"
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.blogs || [];
    } catch (e) {
        console.error("Failed to fetch blogs", e);
        return [];
    }
}

export default async function BlogsPage() {
    const blogs = await getBlogsData();
    const groups = groupBlogs(blogs);

    return (
        <div className="min-h-screen bg-gray-50 pt-16 pb-24">
            <div className="max-w-4xl mx-auto px-6 relative">
                <BackButton className="absolute -top-10 left-6" />
                
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
                        Our Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Insights</span>
                    </h1>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                        Thoughts, tutorials, and updates from the LearnOrbit team.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <span className="text-gray-500 text-xs font-medium">Want to create your own blog?</span>
                        <Link href="/login" className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-full hover:bg-blue-600 transition-all shadow-md gap-2">
                            Start Writing
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                <Feed groups={groups} />
            </div>
        </div>
    );
}
