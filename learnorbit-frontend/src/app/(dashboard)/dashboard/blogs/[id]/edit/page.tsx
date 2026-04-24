"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { get, patch } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            if (!params.id) return;
            try {
                const data = await get<any>(`/blogs/id/${params.id}`);
                if (data.success && data.blog) {
                    setTitle(data.blog.title);
                    setSlug(data.blog.slug);
                    setContent(data.blog.content || "");
                    setCoverImage(data.blog.cover_image || "");
                    setPublished(data.blog.published || false);
                }
            } catch (error) {
                console.error("Failed to fetch blog:", error);
                setError("Failed to load blog details.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [params.id]);

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Only auto-update slug if it was previously matching the old title, 
        // but for edit mode, it's safer to let the user change slug manually if needed.
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSaving(true);
        try {
            const data = await patch<any>(`/blogs/${params.id}`, {
                title,
                slug,
                content,
                coverImage,
                published
            });
            if (data.success) {
                router.push('/dashboard/blogs');
            } else {
                setError(data.message || "Failed to update blog");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading blog...</div>;
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link href="/dashboard/blogs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to blogs
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (SEO-friendly URL)</label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL (Optional)</label>
                    <input
                        type="url"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={15}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                    ></textarea>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Published</span>
                    </label>

                    <div className="flex-1"></div>

                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/blogs')}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
