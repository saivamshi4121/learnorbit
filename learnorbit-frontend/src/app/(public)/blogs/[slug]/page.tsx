import { notFound } from "next/navigation";
import { Calendar, Clock, Share2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { marked } from "marked";
import type { Metadata } from "next";
import ShareButton from "@/components/blog/ShareButton";

marked.setOptions({ breaks: true, gfm: true });

// ISR: revalidate each blog page every 60 seconds.
export const revalidate = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogData {
    id: string;
    title: string;
    slug: string;
    content: string;
    cover_image?: string;
    author_name?: string;
    created_at: string;
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

const backendUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:5000";

async function getBlog(slug: string): Promise<BlogData | null> {
    try {
        const res = await fetch(`${backendUrl}/api/blogs/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.blog ?? null;
    } catch {
        return null;
    }
}

// Pre-render the most recent blogs at build time; the rest are generated on demand.
export async function generateStaticParams() {
    try {
        const res = await fetch(`${backendUrl}/api/blogs`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return (data.blogs ?? []).map((b: { slug: string }) => ({ slug: b.slug }));
    } catch {
        return [];
    }
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlog(slug);
    if (!blog) return { title: "Blog Not Found" };

    const excerpt = blog.content?.replace(/[#*`>\[\]]/g, "").slice(0, 160);
    return {
        title: `${blog.title} | LearnOrbit Blog`,
        description: excerpt,
        openGraph: {
            title: blog.title,
            description: excerpt,
            images: blog.cover_image ? [blog.cover_image] : [],
        },
    };
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) notFound();

    const readingTime = Math.max(
        1,
        Math.ceil((blog.content || "").split(/\s+/).length / 200)
    );

    const htmlContent = marked(blog.content || "") as string;

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <Link
                    href="/blogs"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to all blogs
                </Link>

                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-500 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold">
                                {(blog.author_name || "A")[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">
                                {blog.author_name || "Author"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {format(new Date(blog.created_at), "MMMM d, yyyy")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{readingTime} min read</span>
                        </div>

                        {/* Share button is client-only (uses navigator API) */}
                        <ShareButton title={blog.title} />
                    </div>
                </header>

                {blog.cover_image && (
                    <div className="w-full h-64 md:h-96 mb-12 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                    </div>
                )}

                <article>
                    <div
                        className="prose prose-slate prose-lg max-w-none
                            prose-headings:font-black prose-headings:tracking-tight
                            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                            prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl
                            prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                            prose-img:rounded-xl prose-img:shadow-md"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </article>
            </div>
        </div>
    );
}
