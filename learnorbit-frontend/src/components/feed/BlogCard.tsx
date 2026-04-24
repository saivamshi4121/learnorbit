import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Blog } from "@/lib/groupBlogs";

export function BlogCard({ blog }: { blog: Blog }) {
    return (
        <Link href={`/blogs/${blog.slug}`}>
            <article className="group bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {blog.cover_image && (
                    <div className="w-full h-48 md:h-64 mb-6 rounded-2xl overflow-hidden bg-gray-100">
                        <img 
                            src={blog.cover_image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
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
