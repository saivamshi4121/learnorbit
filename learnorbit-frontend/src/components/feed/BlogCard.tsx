"use client";

import Link from "next/link";
import { Calendar, User, ArrowRight, Share2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Blog } from "@/lib/groupBlogs";

export function BlogCard({ blog }: { blog: Blog }) {
    return (
        <Link href={`/blogs/${blog.slug}`}>
            <article className="group bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {blog.cover_image && (
                    <div className="relative w-full h-48 md:h-64 mb-6 rounded-2xl overflow-hidden bg-gray-100">
                        <img 
                            src={blog.cover_image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button 
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const url = `${window.location.origin}/blogs/${blog.slug}`;
                                try {
                                    if (navigator.share) {
                                        await navigator.share({ title: blog.title, url });
                                    } else {
                                        await navigator.clipboard.writeText(url);
                                        toast.success("Link copied to clipboard!");
                                    }
                                } catch (err) { console.error(err); }
                            }}
                            className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full backdrop-blur shadow-sm transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                            title="Share Article"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span className="font-medium text-gray-700">{blog.author_name || 'Author'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(blog.created_at), 'MMM d, yyyy')}</span>
                    </div>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">
                    {blog.content ? blog.content.substring(0, 200) + '...' : ''}
                </p>
                <div className="flex items-center font-semibold text-blue-600 group-hover:gap-2 transition-all">
                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                </div>
            </article>
        </Link>
    );
}
