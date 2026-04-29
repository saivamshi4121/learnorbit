import { notFound } from "next/navigation";
import { BlogCard } from "@/components/feed/BlogCard";
import { Blog } from "@/lib/groupBlogs";

export const dynamic = "force-dynamic";

async function getSeriesData(authorId: string): Promise<Blog[]> {
    const backendUrl =
        process.env.BACKEND_URL ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:5000";

    try {
        const res = await fetch(`${backendUrl}/api/blogs`, {
            cache: "no-store",
            next: { revalidate: 0 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        const allBlogs: Blog[] = data.blogs || [];

        // Filter by authorId and sort DESC
        return allBlogs
            .filter(b => String(b.author_id) === String(authorId))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (e) {
        return [];
    }
}

export default async function SeriesPage({ params }: { params: Promise<{ authorId: string }> }) {
    const { authorId } = await params;
    const blogs = await getSeriesData(authorId);

    if (!blogs || blogs.length === 0) {
        notFound();
    }

    const authorName = blogs[0].author_name || "Author";

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{authorName}'s</span> Series
                    </h1>
                    <p className="text-xl text-gray-600">
                        A curated collection of posts from this author.
                    </p>
                </div>

                <div className="grid gap-8">
                    {blogs.map(blog => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            </div>
        </div>
    );
}
