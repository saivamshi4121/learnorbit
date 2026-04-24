import Link from "next/link";
import { Layers, User, ArrowRight } from "lucide-react";
import { BlogGroup } from "@/lib/groupBlogs";

export function PlaylistCard({ group }: { group: BlogGroup }) {
    // Show max 3 previews
    const previews = group.blogs.slice(0, 3);
    const totalCount = group.blogs.length;

    return (
        <Link href={`/series/${group.authorId}`}>
            <article className="group bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative block">
                <div className="absolute top-6 right-6 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 z-10">
                    <Layers className="w-3.5 h-3.5" />
                    Series ({totalCount} Posts)
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{group.authorName || 'Author'}</h3>
                        <p className="text-sm text-gray-500">Curated Playlist</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    {previews.map((blog) => (
                        <div key={blog.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            {blog.cover_image ? (
                                <img src={blog.cover_image} alt={blog.title} className="w-16 h-16 rounded-xl object-cover" />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Layers className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{blog.title}</h4>
                                <p className="text-sm text-gray-500 truncate">
                                    {blog.content ? blog.content.substring(0, 50) + '...' : 'No description'}
                                </p>
                            </div>
                        </div>
                    ))}
                    {totalCount > 3 && (
                        <p className="text-sm text-center text-gray-500 font-medium">
                            + {totalCount - 3} more posts in this series
                        </p>
                    )}
                </div>

                <div className="flex items-center font-semibold text-blue-600 group-hover:gap-2 transition-all border-t border-gray-100 pt-6 mt-4">
                    View Series <ArrowRight className="w-4 h-4 ml-1" />
                </div>
            </article>
        </Link>
    );
}
