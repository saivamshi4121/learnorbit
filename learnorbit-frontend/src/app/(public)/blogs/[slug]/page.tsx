"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { get } from "@/lib/api";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!params.slug) return;
            try {
                const data = await get<any>(`/blogs/${params.slug}`);
                if (data.success && data.blog) {
                    setBlog(data.blog);
                } else {
                    router.push('/404');
                }
            } catch (error) {
                console.error("Failed to fetch blog:", error);
                router.push('/404');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [params.slug, router]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!blog) return null;

    // Simple word count for reading time (approx 200 words per min)
    const readingTime = Math.max(1, Math.ceil((blog.content || '').split(/\s+/).length / 200));

    return (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <Link href="/blogs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to all blogs
                </Link>

                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                        {blog.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-gray-500 border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold">
                                {(blog.author_name || 'A')[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">{blog.author_name || 'Author'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(blog.created_at), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{readingTime} min read</span>
                        </div>
                    </div>
                </header>

                {blog.cover_image && (
                    <div className="w-full h-64 md:h-96 mb-12 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                        <img 
                            src={blog.cover_image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <article className="prose prose-lg prose-blue max-w-none">
                    {/* Basic Markdown Rendering fallback */}
                    <div className="whitespace-pre-wrap font-serif leading-relaxed text-gray-800">
                        {blog.content}
                    </div>
                </article>
            </div>
        </div>
    );
}
