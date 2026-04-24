"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { get, del, patch } from "@/lib/api";
import { Plus, Edit2, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

export default function DashboardBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const data = await get<any>('/blogs/user/me');
            if (data.success) {
                setBlogs(data.blogs);
            }
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        try {
            await del(`/blogs/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error("Failed to delete blog:", error);
            alert("Failed to delete blog");
        }
    };

    const togglePublish = async (id: string, currentStatus: boolean) => {
        try {
            await patch(`/blogs/${id}`, { published: !currentStatus });
            fetchBlogs();
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        }
    };

    if (loading) {
        return <div className="p-8">Loading blogs...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
                    <p className="text-gray-500 mt-1">Manage your blog posts and drafts.</p>
                </div>
                <Link href="/dashboard/blogs/new">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> New Blog
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {blogs.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No blogs found. Start writing your first post!
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Created Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {blogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{blog.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{blog.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {blog.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {format(new Date(blog.created_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => togglePublish(blog.id, blog.published)}
                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                title={blog.published ? "Unpublish" : "Publish"}
                                            >
                                                {blog.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            {blog.published && (
                                                <Link href={`/blogs/${blog.slug}`} target="_blank" className="text-gray-400 hover:text-gray-900 transition-colors" title="View Public">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            )}
                                            <Link href={`/dashboard/blogs/${blog.id}/edit`} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                                                <Edit2 className="w-4 h-4" />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(blog.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
