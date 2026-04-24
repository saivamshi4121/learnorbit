import { Feed } from "@/components/feed/Feed";
import { groupBlogs, Blog } from "@/lib/groupBlogs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        Our Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Insights</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Thoughts, tutorials, and updates from the LearnOrbit team.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <span className="text-gray-600 font-medium">Want to create your own blog?</span>
                        <Link href="/login" className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/30 gap-2">
                            Start Writing
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <Feed groups={groups} />
            </div>
        </div>
    );
}
